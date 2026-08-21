import {
  CommitDetail,
  ContributionEvent,
  ContributionsAnalysisResult,
  GithubContributionsError,
  Granularity,
  RepoSummary,
} from "./types"

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"
const GITHUB_REST_URL = "https://api.github.com"
const MAX_WINDOW_DAYS = 365
const MAX_REPOSITORIES = 100
const MAX_CONTRIBUTIONS_PER_REPO = 100
const MAX_DISCUSSION_PAGES = 4
const MAX_TOTAL_RANGE_DAYS = 1825 // ~5 years: generous, but bounds sequential chunk count
const MAX_COMMIT_DETAIL_REPOS = 60
const MAX_COMMITS_PER_REPO_HISTORY = 100
const CACHE_TTL_MS = 5 * 60 * 1000

const cache = new Map<string, { expiresAt: number; data: ContributionsAnalysisResult }>()

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function dayKey(dateStr: string): string {
  return dateStr.slice(0, 10)
}

function chunkDateRange(from: Date, to: Date): { from: Date; to: Date }[] {
  const chunks: { from: Date; to: Date }[] = []
  let cursor = new Date(from)
  while (cursor <= to) {
    const chunkEnd = new Date(cursor)
    chunkEnd.setUTCDate(chunkEnd.getUTCDate() + MAX_WINDOW_DAYS - 1)
    const end = chunkEnd > to ? to : chunkEnd
    chunks.push({ from: new Date(cursor), to: end })
    cursor = new Date(end)
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return chunks
}

interface GraphqlResponse {
  data?: any
  errors?: Array<{ type?: string; message?: string }>
}

async function graphqlRequest(
  token: string,
  query: string,
  variables: Record<string, unknown>
): Promise<GraphqlResponse> {
  const res = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "Portfolio-App",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  })

  if (res.status === 401) {
    throw new GithubContributionsError("Token GitHub invalide ou expiré.", 401)
  }
  if (res.status === 403) {
    const retryAfter = res.headers.get("retry-after")
    throw new GithubContributionsError(
      retryAfter
        ? `Limite de requêtes GitHub atteinte. Réessayez dans ${retryAfter}s.`
        : "Limite de requêtes GitHub atteinte (secondaire).",
      429
    )
  }
  if (!res.ok) {
    throw new GithubContributionsError(`API GitHub indisponible (HTTP ${res.status}).`, 502)
  }

  const json = (await res.json()) as GraphqlResponse

  if (Array.isArray(json.errors) && json.errors.length > 0) {
    const rateLimited = json.errors.some((e) => e?.type === "RATE_LIMITED")
    if (rateLimited) {
      throw new GithubContributionsError("Limite de requêtes GitHub (GraphQL) atteinte.", 429)
    }
    const badCredentials = json.errors.some(
      (e) => typeof e?.message === "string" && e.message.toLowerCase().includes("bad credentials")
    )
    if (badCredentials) {
      throw new GithubContributionsError("Token GitHub invalide ou expiré.", 401)
    }
    if (!json.data) {
      throw new GithubContributionsError(json.errors[0]?.message || "Erreur GitHub GraphQL inconnue.", 502)
    }
    // Partial response: some data usable, errors recorded as warnings by the caller.
  }

  return json
}

const CONTRIBUTIONS_QUERY = `
query ContributionsWindow($login: String!, $from: DateTime!, $to: DateTime!) {
  rateLimit { limit cost remaining resetAt }
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalIssueContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
      commitContributionsByRepository(maxRepositories: ${MAX_REPOSITORIES}) {
        repository { name nameWithOwner url owner { login } }
        contributions(first: ${MAX_CONTRIBUTIONS_PER_REPO}) {
          totalCount
          nodes { occurredAt commitCount }
        }
      }
      issueContributionsByRepository(maxRepositories: ${MAX_REPOSITORIES}) {
        repository { name nameWithOwner url owner { login } }
        contributions(first: ${MAX_CONTRIBUTIONS_PER_REPO}) {
          totalCount
          nodes { occurredAt issue { title url number } }
        }
      }
      pullRequestContributionsByRepository(maxRepositories: ${MAX_REPOSITORIES}) {
        repository { name nameWithOwner url owner { login } }
        contributions(first: ${MAX_CONTRIBUTIONS_PER_REPO}) {
          totalCount
          nodes { occurredAt pullRequest { title url number } }
        }
      }
      pullRequestReviewContributionsByRepository(maxRepositories: ${MAX_REPOSITORIES}) {
        repository { name nameWithOwner url owner { login } }
        contributions(first: ${MAX_CONTRIBUTIONS_PER_REPO}) {
          totalCount
          nodes { occurredAt pullRequest { title url } pullRequestReview { url } }
        }
      }
    }
  }
}
`

const DISCUSSIONS_QUERY = `
query DiscussionsSearch($q: String!, $after: String) {
  rateLimit { remaining resetAt }
  search(query: $q, type: DISCUSSION, first: 50, after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes {
      ... on Discussion {
        title
        url
        createdAt
        repository { name nameWithOwner owner { login } url }
      }
    }
  }
}
`

interface RepoBucketAccumulator {
  repository: string
  owner: string
  url: string | null
  commits: number
  pullRequests: number
  reviews: number
  issues: number
  discussions: number
}

function ensureBucket(
  map: Map<string, RepoBucketAccumulator>,
  repository: string,
  owner: string,
  url: string | null
): RepoBucketAccumulator {
  let bucket = map.get(repository)
  if (!bucket) {
    bucket = { repository, owner, url, commits: 0, pullRequests: 0, reviews: 0, issues: 0, discussions: 0 }
    map.set(repository, bucket)
  }
  return bucket
}

let eventCounter = 0
function nextEventId(prefix: string): string {
  eventCounter += 1
  return `${prefix}_${eventCounter}`
}

async function fetchContributionsWindow(
  username: string,
  token: string,
  from: Date,
  to: Date,
  repoMap: Map<string, RepoBucketAccumulator>,
  events: ContributionEvent[],
  warnings: string[]
): Promise<{ remaining: number; limit: number; resetAt: string } | null> {
  const json = await graphqlRequest(token, CONTRIBUTIONS_QUERY, {
    login: username,
    from: from.toISOString(),
    to: to.toISOString(),
  })

  const collection = json.data?.user?.contributionsCollection
  if (!collection) {
    warnings.push(
      `Aucune donnée renvoyée par GitHub pour la fenêtre ${toISODate(from)} → ${toISODate(to)}.`
    )
    return json.data?.rateLimit ?? null
  }

  const processBucket = (
    buckets: any[] | undefined,
    type: "commit" | "issue" | "pr" | "review",
    totalContributionsField: number | undefined
  ) => {
    if (!Array.isArray(buckets)) return
    let summedTotal = 0

    for (const b of buckets) {
      const repo = b?.repository
      if (!repo) continue
      const repository: string = repo.nameWithOwner || `${repo.owner?.login ?? "?"}/${repo.name ?? "?"}`
      const owner: string = repo.owner?.login || repository.split("/")[0]
      const url: string | null = repo.url ?? null
      const bucket = ensureBucket(repoMap, repository, owner, url)

      const nodes: any[] = Array.isArray(b.contributions?.nodes) ? b.contributions.nodes : []
      const totalCount: number = b.contributions?.totalCount ?? nodes.length
      summedTotal += totalCount
      if (nodes.length < totalCount) {
        warnings.push(
          `Données partielles pour ${repository} (${type}) : ${nodes.length}/${totalCount} événements récupérés sur cette fenêtre.`
        )
      }

      for (const node of nodes) {
        const occurredAt: string | undefined = node?.occurredAt
        if (!occurredAt) continue
        const date = dayKey(occurredAt)

        if (type === "commit") {
          const count: number = node?.commitCount ?? 1
          bucket.commits += count
          events.push({
            id: nextEventId("commit"),
            date,
            type: "commit",
            repository,
            owner,
            repoUrl: url,
            title: null,
            url: null,
            count,
          })
        } else if (type === "issue") {
          bucket.issues += 1
          events.push({
            id: nextEventId("issue"),
            date,
            type: "issue",
            repository,
            owner,
            repoUrl: url,
            title: node?.issue?.title ?? null,
            url: node?.issue?.url ?? null,
            count: 1,
          })
        } else if (type === "pr") {
          bucket.pullRequests += 1
          events.push({
            id: nextEventId("pr"),
            date,
            type: "pr",
            repository,
            owner,
            repoUrl: url,
            title: node?.pullRequest?.title ?? null,
            url: node?.pullRequest?.url ?? null,
            count: 1,
          })
        } else if (type === "review") {
          bucket.reviews += 1
          events.push({
            id: nextEventId("review"),
            date,
            type: "review",
            repository,
            owner,
            repoUrl: url,
            title: node?.pullRequest?.title ?? null,
            url: node?.pullRequestReview?.url ?? node?.pullRequest?.url ?? null,
            count: 1,
          })
        }
      }
    }

    if (typeof totalContributionsField === "number" && summedTotal < totalContributionsField) {
      warnings.push(
        `Certains dépôts moins actifs peuvent manquer pour les contributions de type "${type}" (limite de ${MAX_REPOSITORIES} dépôts par requête atteinte sur cette fenêtre).`
      )
    }
  }

  processBucket(collection.commitContributionsByRepository, "commit", collection.totalCommitContributions)
  processBucket(collection.issueContributionsByRepository, "issue", collection.totalIssueContributions)
  processBucket(
    collection.pullRequestContributionsByRepository,
    "pr",
    collection.totalPullRequestContributions
  )
  processBucket(
    collection.pullRequestReviewContributionsByRepository,
    "review",
    collection.totalPullRequestReviewContributions
  )

  return json.data?.rateLimit ?? null
}

async function fetchDiscussions(
  username: string,
  token: string,
  fromYMD: string,
  toYMD: string,
  repoMap: Map<string, RepoBucketAccumulator>,
  events: ContributionEvent[],
  warnings: string[]
): Promise<void> {
  const q = `author:${username} created:${fromYMD}..${toYMD}`
  let after: string | null = null
  let page = 0

  while (page < MAX_DISCUSSION_PAGES) {
    let json: GraphqlResponse
    try {
      json = await graphqlRequest(token, DISCUSSIONS_QUERY, { q, after })
    } catch (err) {
      warnings.push("Impossible de récupérer les discussions GitHub (recherche indisponible).")
      return
    }

    const search = json.data?.search
    if (!search) break
    const nodes: any[] = Array.isArray(search.nodes) ? search.nodes : []

    for (const node of nodes) {
      if (!node) continue
      const repo = node.repository
      const repository: string = repo?.nameWithOwner || (repo ? `${repo.owner?.login}/${repo.name}` : "Dépôt inconnu")
      const owner: string = repo?.owner?.login || repository.split("/")[0]
      const url: string | null = repo?.url ?? null
      const bucket = ensureBucket(repoMap, repository, owner, url)
      bucket.discussions += 1
      const date = node.createdAt ? dayKey(node.createdAt) : fromYMD
      events.push({
        id: nextEventId("discussion"),
        date,
        type: "discussion",
        repository,
        owner,
        repoUrl: url,
        title: node.title ?? null,
        url: node.url ?? null,
        count: 1,
      })
    }

    page += 1
    if (!search.pageInfo?.hasNextPage) break
    after = search.pageInfo.endCursor
  }

  if (page >= MAX_DISCUSSION_PAGES) {
    warnings.push(
      `Le nombre de discussions dépasse la limite analysée (${MAX_DISCUSSION_PAGES * 50}) ; certaines peuvent manquer.`
    )
  }
}

/**
 * commitContributionsByRepository only exposes a per-day aggregate count, never
 * individual commit messages. This enriches the export with one row per real
 * commit (message, sha, url) via the REST commits endpoint, per active repo.
 * Purely additive: never touches `events`/totals, so a failure here can't
 * desync the KPI/chart numbers from the export.
 */
async function fetchCommitDetailsForRepo(
  token: string,
  username: string,
  owner: string,
  name: string,
  repository: string,
  repoUrl: string | null,
  from: Date,
  to: Date,
  commitDetails: CommitDetail[],
  warnings: string[]
): Promise<{ rateLimitRemaining: number | null; hardStop: boolean }> {
  const url = `${GITHUB_REST_URL}/repos/${owner}/${name}/commits?author=${encodeURIComponent(
    username
  )}&since=${encodeURIComponent(from.toISOString())}&until=${encodeURIComponent(
    to.toISOString()
  )}&per_page=${MAX_COMMITS_PER_REPO_HISTORY}`

  let res: Response
  try {
    res = await fetch(url, {
      headers: {
        Authorization: `bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Portfolio-App",
      },
      cache: "no-store",
    })
  } catch {
    warnings.push(`Impossible de contacter GitHub pour lister les commits de ${repository}.`)
    return { rateLimitRemaining: null, hardStop: false }
  }

  const rateLimitRemaining = res.headers.has("x-ratelimit-remaining")
    ? Number(res.headers.get("x-ratelimit-remaining"))
    : null

  if (res.status === 409 || res.status === 404) {
    // 409: empty repository (no commits at all). 404: renamed/deleted, or a
    // fine-grained token without access to this specific repo — soft warning.
    if (res.status === 404) {
      warnings.push(`Dépôt ${repository} introuvable ou inaccessible avec ce token (commits non détaillés).`)
    }
    return { rateLimitRemaining, hardStop: false }
  }
  if (res.status === 401) {
    throw new GithubContributionsError("Token GitHub invalide ou expiré.", 401)
  }
  if (res.status === 403) {
    if (rateLimitRemaining === 0 || res.headers.get("retry-after")) {
      throw new GithubContributionsError("Limite de requêtes GitHub atteinte.", 429)
    }
    warnings.push(`Accès refusé au dépôt ${repository} pour ce token (commits non détaillés).`)
    return { rateLimitRemaining, hardStop: false }
  }
  if (!res.ok) {
    warnings.push(`Impossible de lister les commits de ${repository} (HTTP ${res.status}).`)
    return { rateLimitRemaining, hardStop: false }
  }

  const commits = await res.json()
  if (!Array.isArray(commits)) return { rateLimitRemaining, hardStop: false }

  for (const c of commits) {
    const message: string = c?.commit?.message ?? ""
    const isoDate: string | undefined = c?.commit?.author?.date
    if (!isoDate) continue
    commitDetails.push({
      id: nextEventId("commitdetail"),
      date: dayKey(isoDate),
      repository,
      owner,
      repoUrl,
      message: message.split("\n")[0] || "(message vide)",
      url: c?.html_url ?? null,
      sha: c?.sha ?? null,
    })
  }

  if (commits.length >= MAX_COMMITS_PER_REPO_HISTORY) {
    warnings.push(
      `Plus de ${MAX_COMMITS_PER_REPO_HISTORY} commits pour ${repository} sur la période : liste détaillée tronquée (le total agrégé reste correct).`
    )
  }

  return { rateLimitRemaining, hardStop: false }
}

async function fetchCommitDetails(
  token: string,
  username: string,
  repos: RepoBucketAccumulator[],
  from: Date,
  to: Date,
  commitDetails: CommitDetail[],
  warnings: string[]
): Promise<void> {
  const active = repos.filter((r) => r.commits > 0)
  const toProcess = active.slice(0, MAX_COMMIT_DETAIL_REPOS)
  if (active.length > toProcess.length) {
    warnings.push(
      `Détail des commits limité aux ${MAX_COMMIT_DETAIL_REPOS} dépôts les plus actifs (${active.length} au total) ; les totaux affichés restent exacts.`
    )
  }

  for (const repo of toProcess) {
    const [owner, name] = repo.repository.split("/")
    if (!owner || !name) continue

    const { rateLimitRemaining } = await fetchCommitDetailsForRepo(
      token,
      username,
      owner,
      name,
      repo.repository,
      repo.url,
      from,
      to,
      commitDetails,
      warnings
    )

    if (rateLimitRemaining !== null && rateLimitRemaining < 50) {
      warnings.push(
        "Limite de requêtes GitHub bientôt atteinte : le détail des commits a été interrompu avant la fin de la liste (les totaux restent exacts)."
      )
      break
    }
  }
}

function pickGranularity(from: Date, to: Date): Granularity {
  const days = Math.round((to.getTime() - from.getTime()) / 86400000) + 1
  if (days <= 31) return "day"
  if (days <= 186) return "week"
  return "month"
}

export async function analyzeContributions(params: {
  username: string
  token: string
  from: Date
  to: Date
}): Promise<ContributionsAnalysisResult> {
  const { username, token, from, to } = params

  if (!token) {
    throw new GithubContributionsError(
      "GITHUB_TOKEN manquant. Ajoutez un token GitHub (scopes repo, read:user) dans .env.local pour activer ce module.",
      503
    )
  }
  if (from > to) {
    throw new GithubContributionsError("La date de début doit précéder la date de fin.", 400)
  }
  const totalDays = Math.round((to.getTime() - from.getTime()) / 86400000) + 1
  if (totalDays > MAX_TOTAL_RANGE_DAYS) {
    throw new GithubContributionsError(
      `Période trop large (max ${MAX_TOTAL_RANGE_DAYS} jours, ~5 ans).`,
      400
    )
  }

  const cacheKey = `${username}:${toISODate(from)}:${toISODate(to)}`
  const cached = cache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data
  }

  const repoMap = new Map<string, RepoBucketAccumulator>()
  const events: ContributionEvent[] = []
  const warnings: string[] = []
  let lastRateLimit: { remaining: number; limit: number; resetAt: string } | null = null

  const windows = chunkDateRange(from, to)
  for (const window of windows) {
    const rateLimit = await fetchContributionsWindow(
      username,
      token,
      window.from,
      window.to,
      repoMap,
      events,
      warnings
    )
    if (rateLimit) lastRateLimit = rateLimit
    if (lastRateLimit && lastRateLimit.remaining < 50) {
      warnings.push(
        "Limite de requêtes GitHub bientôt atteinte : l'analyse a été interrompue avant la fin de la période sélectionnée."
      )
      break
    }
  }

  await fetchDiscussions(username, token, toISODate(from), toISODate(to), repoMap, events, warnings)

  const commitDetails: CommitDetail[] = []
  try {
    await fetchCommitDetails(token, username, Array.from(repoMap.values()), from, to, commitDetails, warnings)
  } catch (err) {
    if (err instanceof GithubContributionsError) throw err
    warnings.push("Impossible de récupérer le détail des commits (messages individuels indisponibles).")
  }

  const repositories: RepoSummary[] = Array.from(repoMap.values())
    .map((b) => ({
      repository: b.repository,
      owner: b.owner,
      url: b.url,
      commits: b.commits,
      pullRequests: b.pullRequests,
      reviews: b.reviews,
      issues: b.issues,
      discussions: b.discussions,
      total: b.commits + b.pullRequests + b.reviews + b.issues + b.discussions,
    }))
    .sort((a, b) => b.total - a.total)

  const totals = repositories.reduce(
    (acc, r) => ({
      commits: acc.commits + r.commits,
      pullRequests: acc.pullRequests + r.pullRequests,
      reviews: acc.reviews + r.reviews,
      issues: acc.issues + r.issues,
      discussions: acc.discussions + r.discussions,
      total: acc.total + r.total,
      activeRepositories: acc.activeRepositories + (r.total > 0 ? 1 : 0),
    }),
    { commits: 0, pullRequests: 0, reviews: 0, issues: 0, discussions: 0, total: 0, activeRepositories: 0 }
  )

  const result: ContributionsAnalysisResult = {
    username,
    period: {
      from: toISODate(from),
      to: toISODate(to),
      label: `${toISODate(from)} → ${toISODate(to)}`,
    },
    totals,
    repositories,
    events,
    commitDetails,
    recommendedGranularity: pickGranularity(from, to),
    warnings,
    rateLimit: lastRateLimit,
    generatedAt: new Date().toISOString(),
  }

  cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, data: result })
  return result
}
