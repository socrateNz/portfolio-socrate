import { NextResponse } from "next/server"
import ExcelJS from "exceljs"

import type { ContributionsAnalysisResult } from "@/lib/github/types"

export async function POST(request: Request) {
  let body: ContributionsAnalysisResult

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 })
  }

  if (
    !body?.totals ||
    !Array.isArray(body.repositories) ||
    !Array.isArray(body.events) ||
    !Array.isArray(body.commitDetails)
  ) {
    return NextResponse.json({ error: "Données d'analyse invalides." }, { status: 400 })
  }

  const workbook = new ExcelJS.Workbook()
  workbook.creator = "Portfolio Dashboard"
  workbook.created = new Date()

  const summarySheet = workbook.addWorksheet("Résumé")
  summarySheet.columns = [
    { header: "Champ", key: "field", width: 30 },
    { header: "Valeur", key: "value", width: 30 },
  ]
  summarySheet.addRows([
    { field: "Période", value: body.period?.label ?? "" },
    { field: "Total des contributions", value: body.totals.total },
    { field: "Total des commits", value: body.totals.commits },
    { field: "Total des Pull Requests", value: body.totals.pullRequests },
    { field: "Total des reviews", value: body.totals.reviews },
    { field: "Total des issues", value: body.totals.issues },
    { field: "Total des discussions", value: body.totals.discussions },
    { field: "Repositories actifs", value: body.totals.activeRepositories },
  ])
  summarySheet.getRow(1).font = { bold: true }

  const reposSheet = workbook.addWorksheet("Repositories")
  reposSheet.columns = [
    { header: "Repository", key: "repository", width: 35 },
    { header: "Owner/Organisation", key: "owner", width: 20 },
    { header: "Commits", key: "commits", width: 12 },
    { header: "Pull Requests", key: "pullRequests", width: 14 },
    { header: "Reviews", key: "reviews", width: 12 },
    { header: "Issues", key: "issues", width: 12 },
    { header: "Discussions", key: "discussions", width: 14 },
    { header: "Total", key: "total", width: 12 },
    { header: "URL", key: "url", width: 40 },
  ]
  reposSheet.addRows(
    body.repositories.map((r) => ({
      repository: r.repository,
      owner: r.owner,
      commits: r.commits,
      pullRequests: r.pullRequests,
      reviews: r.reviews,
      issues: r.issues,
      discussions: r.discussions,
      total: r.total,
      url: r.url ?? "",
    }))
  )
  reposSheet.getRow(1).font = { bold: true }

  const eventsSheet = workbook.addWorksheet("Contributions")
  eventsSheet.columns = [
    { header: "Date", key: "date", width: 14 },
    { header: "Projet", key: "repository", width: 35 },
    { header: "Organisation", key: "owner", width: 20 },
    { header: "Type", key: "type", width: 14 },
    { header: "Message", key: "message", width: 50 },
    { header: "URL", key: "url", width: 45 },
  ]
  const nonCommitRows = body.events
    .filter((e) => e.type !== "commit")
    .map((e) => ({
      date: e.date,
      repository: e.repository,
      owner: e.owner,
      type: e.type,
      message: e.title ?? "",
      url: e.url ?? e.repoUrl ?? "",
    }))
  const commitRows = body.commitDetails.map((c) => ({
    date: c.date,
    repository: c.repository,
    owner: c.owner,
    type: "commit",
    message: c.message,
    url: c.url ?? c.repoUrl ?? "",
  }))
  eventsSheet.addRows([...nonCommitRows, ...commitRows].sort((a, b) => a.date.localeCompare(b.date)))
  eventsSheet.getRow(1).font = { bold: true }

  const buffer = await workbook.xlsx.writeBuffer()
  const filename = `github-contributions_${body.period?.from ?? "export"}_${body.period?.to ?? ""}.xlsx`

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
