export type ContributionType = "commit" | "pr" | "review" | "issue" | "discussion"

export type Granularity = "day" | "week" | "month"

export interface ContributionEvent {
  id: string
  date: string // ISO yyyy-mm-dd
  type: ContributionType
  repository: string // "owner/name"
  owner: string
  repoUrl: string | null
  title?: string | null
  url?: string | null
  count: number
}

export interface CommitDetail {
  id: string
  date: string // ISO yyyy-mm-dd
  repository: string // "owner/name"
  owner: string
  repoUrl: string | null
  message: string
  url: string | null
  sha: string | null
}

export interface RepoSummary {
  repository: string
  owner: string
  url: string | null
  commits: number
  pullRequests: number
  reviews: number
  issues: number
  discussions: number
  total: number
}

export interface TimeBucketPoint {
  bucketStart: string
  label: string
  commits: number
  pullRequests: number
  reviews: number
  issues: number
  discussions: number
  total: number
}

export interface ContributionsTotals {
  commits: number
  pullRequests: number
  reviews: number
  issues: number
  discussions: number
  total: number
  activeRepositories: number
}

export interface ContributionsAnalysisResult {
  username: string
  period: { from: string; to: string; label: string }
  totals: ContributionsTotals
  repositories: RepoSummary[]
  events: ContributionEvent[]
  commitDetails: CommitDetail[]
  recommendedGranularity: Granularity
  warnings: string[]
  rateLimit: { remaining: number; limit: number; resetAt: string } | null
  generatedAt: string
}

export interface ContributionsFilterState {
  repository: string | "all"
  owner: string | "all"
  type: ContributionType | "all"
  granularity: Granularity
}

export class GithubContributionsError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
    this.name = "GithubContributionsError"
  }
}
