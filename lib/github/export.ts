import type { ContributionsAnalysisResult } from "./types"

function escapeCsvValue(value: string | number): string {
  const str = String(value)
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function rowsToCsv(headers: string[], rows: (string | number)[][]): string {
  const lines = [headers.map(escapeCsvValue).join(",")]
  for (const row of rows) {
    lines.push(row.map(escapeCsvValue).join(","))
  }
  return lines.join("\n")
}

/**
 * CSV has no native multi-sheet concept, so the three logical sheets are
 * emitted as clearly delimited sections in a single file.
 */
export function buildContributionsCsv(result: ContributionsAnalysisResult): string {
  const summary = rowsToCsv(
    ["Champ", "Valeur"],
    [
      ["Période", result.period.label],
      ["Total des contributions", result.totals.total],
      ["Total des commits", result.totals.commits],
      ["Total des Pull Requests", result.totals.pullRequests],
      ["Total des reviews", result.totals.reviews],
      ["Total des issues", result.totals.issues],
      ["Total des discussions", result.totals.discussions],
      ["Repositories actifs", result.totals.activeRepositories],
    ]
  )

  const repos = rowsToCsv(
    ["Repository", "Owner/Organisation", "Commits", "Pull Requests", "Reviews", "Issues", "Discussions", "Total", "URL"],
    result.repositories.map((r) => [
      r.repository,
      r.owner,
      r.commits,
      r.pullRequests,
      r.reviews,
      r.issues,
      r.discussions,
      r.total,
      r.url ?? "",
    ])
  )

  const nonCommitRows = result.events
    .filter((e) => e.type !== "commit")
    .map((e) => ({
      date: e.date,
      repository: e.repository,
      owner: e.owner,
      type: e.type,
      message: e.title ?? "",
      url: e.url ?? e.repoUrl ?? "",
    }))
  const commitRows = result.commitDetails.map((c) => ({
    date: c.date,
    repository: c.repository,
    owner: c.owner,
    type: "commit",
    message: c.message,
    url: c.url ?? c.repoUrl ?? "",
  }))
  const contributionRows = [...nonCommitRows, ...commitRows].sort((a, b) => a.date.localeCompare(b.date))

  const contributions = rowsToCsv(
    ["Date", "Projet", "Organisation", "Type", "Message", "URL"],
    contributionRows.map((r) => [r.date, r.repository, r.owner, r.type, r.message, r.url])
  )

  return [
    "# SECTION: Résumé",
    summary,
    "",
    "# SECTION: Repositories",
    repos,
    "",
    "# SECTION: Contributions",
    contributions,
  ].join("\n")
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function downloadContributionsCsv(result: ContributionsAnalysisResult): void {
  const content = buildContributionsCsv(result)
  const blob = new Blob(["﻿" + content], { type: "text/csv;charset=utf-8;" })
  triggerBlobDownload(blob, `github-contributions_${result.period.from}_${result.period.to}.csv`)
}

export async function downloadContributionsXlsx(result: ContributionsAnalysisResult): Promise<void> {
  const res = await fetch("/api/github/contributions/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result),
  })
  if (!res.ok) {
    throw new Error("Échec de la génération du fichier Excel.")
  }
  const blob = await res.blob()
  triggerBlobDownload(blob, `github-contributions_${result.period.from}_${result.period.to}.xlsx`)
}

export async function downloadContributionsPdf(result: ContributionsAnalysisResult): Promise<void> {
  const res = await fetch("/api/github/contributions/export/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result),
  })
  if (!res.ok) {
    throw new Error("Échec de la génération du fichier PDF.")
  }
  const blob = await res.blob()
  triggerBlobDownload(blob, `github-contributions_${result.period.from}_${result.period.to}.pdf`)
}
