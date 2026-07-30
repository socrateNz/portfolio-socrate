import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = process.env.GITHUB_USERNAME || "socrate-dev"
  const token = process.env.GITHUB_TOKEN
  const yearParam = searchParams.get("year") || "2026"

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Portfolio-App",
    }
    if (token) {
      headers.Authorization = `bearer ${token}`
    }

    // 1. Fetch User Profile and Repositories from GitHub API
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers,
        next: { revalidate: 900 },
      }),
      fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
        {
          headers,
          next: { revalidate: 900 },
        }
      ),
    ])

    const userData = userRes.ok ? await userRes.json() : null
    const reposData = reposRes.ok ? await reposRes.json() : []

    const formattedRepos = Array.isArray(reposData)
      ? reposData.map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description || "Aucune description disponible",
          language: repo.language || "TypeScript",
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          url: repo.html_url,
          updatedAt: repo.updated_at
            ? new Date(repo.updated_at).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "",
        }))
      : []

    const totalStars = formattedRepos.reduce(
      (acc, repo) => acc + repo.stars,
      0
    )

    // 2. Fetch REAL Contribution History from GitHub
    let contributionsMap: Record<string, number> = {}

    // Method A: GraphQL (if Token available)
    if (token) {
      try {
        const fromDate = `${yearParam}-01-01T00:00:00Z`
        const toDate = `${yearParam}-12-31T23:59:59Z`
        const gqlQuery = {
          query: `
            query($username: String!, $from: DateTime!, $to: DateTime!) {
              user(login: $username) {
                contributionsCollection(from: $from, to: $to) {
                  contributionCalendar {
                    weeks {
                      contributionDays {
                        contributionCount
                        date
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: { username, from: fromDate, to: toDate },
        }

        const gqlRes = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gqlQuery),
          next: { revalidate: 900 },
        })

        if (gqlRes.ok) {
          const gqlData = await gqlRes.json()
          const weeks =
            gqlData?.data?.user?.contributionsCollection?.contributionCalendar
              ?.weeks
          if (Array.isArray(weeks)) {
            for (const week of weeks) {
              if (Array.isArray(week.contributionDays)) {
                for (const day of week.contributionDays) {
                  contributionsMap[day.date] = day.contributionCount
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn("GraphQL API fetch failed, falling back to public API", err)
      }
    }

    // Method B: Public GitHub Contributions API (if GraphQL map is empty)
    if (Object.keys(contributionsMap).length === 0) {
      try {
        const externalContribRes = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=${yearParam}`,
          { next: { revalidate: 900 } }
        )
        if (externalContribRes.ok) {
          const contribData = await externalContribRes.json()
          if (Array.isArray(contribData?.contributions)) {
            for (const item of contribData.contributions) {
              contributionsMap[item.date] = item.count
            }
          }
        }
      } catch (e) {
        console.warn("Public contribution API failed:", e)
      }
    }

    return NextResponse.json({
      username: userData?.login || username,
      name: userData?.name || userData?.login || username,
      avatar:
        userData?.avatar_url ||
        `https://github.com/identicons/${username}.png`,
      bio: userData?.bio || "Architecte Cloud & AI",
      htmlUrl: userData?.html_url || `https://github.com/${username}`,
      publicRepos: userData?.public_repos ?? formattedRepos.length,
      followers: userData?.followers ?? 0,
      following: userData?.following ?? 0,
      stars: totalStars,
      repos: formattedRepos,
      contributions: contributionsMap,
      year: yearParam,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch GitHub data" },
      { status: 500 }
    )
  }
}
