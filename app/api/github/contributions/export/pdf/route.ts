import { NextResponse } from "next/server"
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib"

import type { ContributionsAnalysisResult } from "@/lib/github/types"

const MARGIN = 40
const PAGE_SIZE: [number, number] = [841.89, 595.28] // A4 landscape, points
const ROW_HEIGHT = 20

type Align = "left" | "right"
interface ColumnDef {
  key: string
  label: string
  width: number
  align: Align
}

const REPO_COLUMNS: ColumnDef[] = [
  { key: "repository", label: "Repository", width: 250, align: "left" },
  { key: "owner", label: "Organisation", width: 100, align: "left" },
  { key: "commits", label: "Commits", width: 65, align: "right" },
  { key: "pullRequests", label: "PR", width: 55, align: "right" },
  { key: "reviews", label: "Reviews", width: 65, align: "right" },
  { key: "issues", label: "Issues", width: 55, align: "right" },
  { key: "discussions", label: "Discussions", width: 80, align: "right" },
  { key: "total", label: "Total", width: 55, align: "right" },
]

const CONTRIB_COLUMNS: ColumnDef[] = [
  { key: "date", label: "Date", width: 65, align: "left" },
  { key: "repository", label: "Projet", width: 200, align: "left" },
  { key: "owner", label: "Organisation", width: 90, align: "left" },
  { key: "type", label: "Type", width: 55, align: "left" },
  { key: "message", label: "Message", width: 350, align: "left" },
]

const TYPE_LABELS: Record<string, string> = {
  commit: "Commit",
  pr: "Pull Request",
  review: "Review",
  issue: "Issue",
  discussion: "Discussion",
}

function truncate(font: PDFFont, text: string, maxWidth: number, size: number): string {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text
  let result = text
  while (result.length > 1 && font.widthOfTextAtSize(result + "…", size) > maxWidth) {
    result = result.slice(0, -1)
  }
  return result + "…"
}

function hardBreak(font: PDFFont, word: string, maxWidth: number, size: number): string[] {
  const parts: string[] = []
  let remaining = word
  while (font.widthOfTextAtSize(remaining, size) > maxWidth && remaining.length > 1) {
    let cut = remaining.length
    while (cut > 1 && font.widthOfTextAtSize(remaining.slice(0, cut), size) > maxWidth) cut--
    parts.push(remaining.slice(0, cut))
    remaining = remaining.slice(cut)
  }
  parts.push(remaining)
  return parts
}

function wrapText(font: PDFFont, text: string, maxWidth: number, size: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  if (words.length === 0) return [""]

  const lines: string[] = []
  let current = ""

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate
      continue
    }
    if (current) lines.push(current)
    if (font.widthOfTextAtSize(word, size) > maxWidth) {
      const broken = hardBreak(font, word, maxWidth, size)
      for (let i = 0; i < broken.length - 1; i++) lines.push(broken[i])
      current = broken[broken.length - 1]
    } else {
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

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

  const pdfDoc = await PDFDocument.create()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  let page = pdfDoc.addPage(PAGE_SIZE)
  const { width: pageWidth, height: pageHeight } = page.getSize()
  const usableWidth = pageWidth - MARGIN * 2
  let y = pageHeight - MARGIN
  let pageNumber = 1

  const drawFooter = (p: PDFPage, num: number) => {
    p.drawText(
      `Généré le ${new Date(body.generatedAt).toLocaleString("fr-FR")} — page ${num}`,
      { x: MARGIN, y: MARGIN / 2, size: 8, font, color: rgb(0.5, 0.5, 0.5) }
    )
  }

  const drawTableHeader = (columns: ColumnDef[]) => {
    let x = MARGIN
    page.drawRectangle({
      x: MARGIN,
      y: y - 6,
      width: usableWidth,
      height: ROW_HEIGHT,
      color: rgb(0.94, 0.94, 0.96),
    })
    for (const col of columns) {
      const text = col.label
      const tx = col.align === "right" ? x + col.width - bold.widthOfTextAtSize(text, 9) - 6 : x + 6
      page.drawText(text, { x: tx, y, size: 9, font: bold, color: rgb(0.25, 0.25, 0.3) })
      x += col.width
    }
    y -= ROW_HEIGHT
  }

  const newPage = (columns: ColumnDef[]) => {
    drawFooter(page, pageNumber)
    page = pdfDoc.addPage(PAGE_SIZE)
    pageNumber += 1
    y = pageHeight - MARGIN
    drawTableHeader(columns)
  }

  const drawRow = (columns: ColumnDef[], rowValues: Record<string, string>, boldKey?: string) => {
    let x = MARGIN
    for (const col of columns) {
      const rowFont = col.key === boldKey ? bold : font
      const text = truncate(rowFont, rowValues[col.key] ?? "", col.width - 12, 9)
      const tx = col.align === "right" ? x + col.width - rowFont.widthOfTextAtSize(text, 9) - 6 : x + 6
      page.drawText(text, { x: tx, y, size: 9, font: rowFont })
      x += col.width
    }
    y -= ROW_HEIGHT
  }

  // Title
  page.drawText("Rapport d'Activité GitHub", { x: MARGIN, y, size: 20, font: bold })
  y -= 24
  const pdfSafePeriodLabel = `${body.period.from} - ${body.period.to}`
  page.drawText(`@${body.username} — ${pdfSafePeriodLabel}`, {
    x: MARGIN,
    y,
    size: 11,
    font,
    color: rgb(0.35, 0.35, 0.35),
  })
  y -= 28

  // Summary strip
  const summaryItems: [string, number][] = [
    ["Total contributions", body.totals.total],
    ["Commits", body.totals.commits],
    ["Pull Requests", body.totals.pullRequests],
    ["Reviews", body.totals.reviews],
    ["Issues", body.totals.issues],
    ["Discussions", body.totals.discussions],
    ["Repos actifs", body.totals.activeRepositories],
  ]
  const summaryColWidth = usableWidth / summaryItems.length
  summaryItems.forEach(([label, value], idx) => {
    const x = MARGIN + idx * summaryColWidth
    page.drawText(String(value), { x, y, size: 16, font: bold })
    page.drawText(label, { x, y: y - 14, size: 8, font, color: rgb(0.45, 0.45, 0.45) })
  })
  y -= 40

  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: pageWidth - MARGIN, y },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  })
  y -= 24

  // --- Section 1: Repositories ---
  page.drawText("Repositories", { x: MARGIN, y, size: 12, font: bold, color: rgb(0.2, 0.2, 0.25) })
  y -= 18
  drawTableHeader(REPO_COLUMNS)

  if (body.repositories.length === 0) {
    page.drawText("Aucune contribution sur cette période.", {
      x: MARGIN + 6,
      y,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    })
    y -= ROW_HEIGHT
  }

  for (const repo of body.repositories) {
    if (y < MARGIN + ROW_HEIGHT) newPage(REPO_COLUMNS)
    drawRow(
      REPO_COLUMNS,
      {
        repository: repo.repository,
        owner: repo.owner,
        commits: String(repo.commits),
        pullRequests: String(repo.pullRequests),
        reviews: String(repo.reviews),
        issues: String(repo.issues),
        discussions: String(repo.discussions),
        total: String(repo.total),
      },
      "total"
    )
  }

  // --- Section 2: Contributions (one row per commit / PR / review / issue / discussion) ---
  const nonCommitRows = body.events
    .filter((e) => e.type !== "commit")
    .map((e) => ({
      date: e.date,
      repository: e.repository,
      owner: e.owner,
      type: e.type,
      message: e.title ?? "",
    }))
  const commitRows = body.commitDetails.map((c) => ({
    date: c.date,
    repository: c.repository,
    owner: c.owner,
    type: "commit",
    message: c.message,
  }))
  const contributionRows = [...nonCommitRows, ...commitRows].sort((a, b) => a.date.localeCompare(b.date))

  drawFooter(page, pageNumber)
  page = pdfDoc.addPage(PAGE_SIZE)
  pageNumber += 1
  y = pageHeight - MARGIN
  page.drawText("Contributions (détail par commit / PR / review / issue / discussion)", {
    x: MARGIN,
    y,
    size: 12,
    font: bold,
    color: rgb(0.2, 0.2, 0.25),
  })
  y -= 18
  drawTableHeader(CONTRIB_COLUMNS)

  if (contributionRows.length === 0) {
    page.drawText("Aucune contribution détaillée sur cette période.", {
      x: MARGIN + 6,
      y,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    })
    y -= ROW_HEIGHT
  }

  const LINE_HEIGHT = 11
  const messageColIndex = CONTRIB_COLUMNS.findIndex((c) => c.key === "message")
  const messageCol = CONTRIB_COLUMNS[messageColIndex]
  const messageColX = MARGIN + CONTRIB_COLUMNS.slice(0, messageColIndex).reduce((sum, c) => sum + c.width, 0)
  const messageMaxWidth = messageCol.width - 12

  for (const row of contributionRows) {
    const messageLines = wrapText(font, row.message || "", messageMaxWidth, 9)
    const rowHeight = Math.max(ROW_HEIGHT, messageLines.length * LINE_HEIGHT + 8)

    if (y - rowHeight < MARGIN) newPage(CONTRIB_COLUMNS)

    const rowValues: Record<string, string> = {
      date: row.date,
      repository: row.repository,
      owner: row.owner,
      type: TYPE_LABELS[row.type] ?? row.type,
    }

    let x = MARGIN
    for (const col of CONTRIB_COLUMNS) {
      if (col.key === "message") {
        x += col.width
        continue
      }
      const text = truncate(font, rowValues[col.key] ?? "", col.width - 12, 9)
      const tx = col.align === "right" ? x + col.width - font.widthOfTextAtSize(text, 9) - 6 : x + 6
      page.drawText(text, { x: tx, y, size: 9, font })
      x += col.width
    }

    let lineY = y
    for (const line of messageLines) {
      page.drawText(line, { x: messageColX + 6, y: lineY, size: 9, font })
      lineY -= LINE_HEIGHT
    }

    y -= rowHeight
  }

  drawFooter(page, pageNumber)

  const pdfBytes = await pdfDoc.save()
  const filename = `github-contributions_${body.period?.from ?? "export"}_${body.period?.to ?? ""}.pdf`

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}
