import { NextResponse } from "next/server"

import { analyzeContributions } from "@/lib/github/contributions"
import { GithubContributionsError } from "@/lib/github/types"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fromParam = searchParams.get("from")
  const toParam = searchParams.get("to")

  if (!fromParam || !toParam) {
    return NextResponse.json(
      { error: "Paramètres 'from' et 'to' requis (format YYYY-MM-DD)." },
      { status: 400 }
    )
  }

  const from = new Date(`${fromParam}T00:00:00.000Z`)
  const to = new Date(`${toParam}T23:59:59.999Z`)

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return NextResponse.json({ error: "Dates invalides." }, { status: 400 })
  }

  const now = new Date()
  const clampedTo = to > now ? now : to

  const username = process.env.GITHUB_USERNAME || "socrate-dev"
  const token = process.env.GITHUB_TOKEN || ""

  try {
    const result = await analyzeContributions({ username, token, from, to: clampedTo })
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof GithubContributionsError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("GitHub contributions analysis failed:", error)
    return NextResponse.json(
      { error: "Erreur inattendue lors de l'analyse des contributions GitHub." },
      { status: 502 }
    )
  }
}
