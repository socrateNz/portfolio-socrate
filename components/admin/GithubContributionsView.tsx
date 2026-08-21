"use client"

import * as React from "react"
import {
  Activity,
  BookOpen,
  CalendarRange,
  CircleDot,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  FileText,
  FileType,
  GitCommit,
  GitPullRequest,
  Loader2,
  MessageSquare,
  ShieldAlert,
  Zap,
} from "lucide-react"
import type { DateRange } from "react-day-picker"
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { KpiCard } from "@/components/admin/KpiCard"
import { useToast } from "@/hooks/use-toast"
import type {
  ContributionEvent,
  ContributionsAnalysisResult,
  ContributionType,
  Granularity,
  RepoSummary,
  TimeBucketPoint,
} from "@/lib/github/types"
import { downloadContributionsCsv, downloadContributionsPdf, downloadContributionsXlsx } from "@/lib/github/export"

const TYPE_META: Record<ContributionType, { label: string; color: string }> = {
  commit: { label: "Commits", color: "#6366f1" },
  pr: { label: "Pull Requests", color: "#0ea5e9" },
  review: { label: "Reviews", color: "#10b981" },
  issue: { label: "Issues", color: "#f59e0b" },
  discussion: { label: "Discussions", color: "#8b5cf6" },
}

function bucketize(
  events: ContributionEvent[],
  from: string,
  to: string,
  granularity: Granularity
): TimeBucketPoint[] {
  const fromDate = parseISO(from)
  const toDate = parseISO(to)
  if (fromDate > toDate) return []

  const emptyPoint = (bucketStart: string, label: string): TimeBucketPoint => ({
    bucketStart,
    label,
    commits: 0,
    pullRequests: 0,
    reviews: 0,
    issues: 0,
    discussions: 0,
    total: 0,
  })

  const bucketMap = new Map<string, TimeBucketPoint>()

  if (granularity === "day") {
    for (const d of eachDayOfInterval({ start: fromDate, end: toDate })) {
      const key = format(d, "yyyy-MM-dd")
      bucketMap.set(key, emptyPoint(key, format(d, "dd MMM")))
    }
  } else if (granularity === "week") {
    for (const d of eachWeekOfInterval({ start: fromDate, end: toDate }, { weekStartsOn: 1 })) {
      const weekStart = startOfWeek(d, { weekStartsOn: 1 })
      const key = format(weekStart, "yyyy-MM-dd")
      bucketMap.set(key, emptyPoint(key, `Sem. ${format(weekStart, "dd MMM")}`))
    }
  } else {
    for (const d of eachMonthOfInterval({ start: fromDate, end: toDate })) {
      const monthStart = startOfMonth(d)
      const key = format(monthStart, "yyyy-MM")
      bucketMap.set(key, emptyPoint(key, format(monthStart, "MMM yyyy")))
    }
  }

  for (const e of events) {
    const eventDate = parseISO(e.date)
    let key: string
    if (granularity === "day") key = format(eventDate, "yyyy-MM-dd")
    else if (granularity === "week") key = format(startOfWeek(eventDate, { weekStartsOn: 1 }), "yyyy-MM-dd")
    else key = format(startOfMonth(eventDate), "yyyy-MM")

    let bucket = bucketMap.get(key)
    if (!bucket) {
      bucket = emptyPoint(key, key)
      bucketMap.set(key, bucket)
    }

    if (e.type === "commit") bucket.commits += e.count
    else if (e.type === "pr") bucket.pullRequests += e.count
    else if (e.type === "review") bucket.reviews += e.count
    else if (e.type === "issue") bucket.issues += e.count
    else bucket.discussions += e.count
    bucket.total += e.count
  }

  return Array.from(bucketMap.values()).sort((a, b) => a.bucketStart.localeCompare(b.bucketStart))
}

export function GithubContributionsView() {
  const { toast } = useToast()
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [result, setResult] = React.useState<ContributionsAnalysisResult | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [exporting, setExporting] = React.useState<"csv" | "xlsx" | "pdf" | null>(null)
  const [errorInfo, setErrorInfo] = React.useState<{ status: number; message: string } | null>(null)

  const [repoFilter, setRepoFilter] = React.useState<string>("all")
  const [ownerFilter, setOwnerFilter] = React.useState<string>("all")
  const [typeFilter, setTypeFilter] = React.useState<ContributionType | "all">("all")
  const [granularity, setGranularity] = React.useState<Granularity>("day")

  const analyze = React.useCallback(async () => {
    if (!range?.from || !range?.to) return
    setLoading(true)
    setErrorInfo(null)
    try {
      const from = format(range.from, "yyyy-MM-dd")
      const to = format(range.to, "yyyy-MM-dd")
      const res = await fetch(`/api/github/contributions?from=${from}&to=${to}`)
      const data = await res.json()

      if (!res.ok) {
        setErrorInfo({ status: res.status, message: data?.error || "Erreur inconnue." })
        setResult(null)
        return
      }

      setResult(data as ContributionsAnalysisResult)
      setGranularity((data as ContributionsAnalysisResult).recommendedGranularity)
      setRepoFilter("all")
      setOwnerFilter("all")
      setTypeFilter("all")

      const warnings: string[] = (data as ContributionsAnalysisResult).warnings || []
      if (warnings.length > 0) {
        toast({
          title: "Analyse partielle",
          description: warnings[0] + (warnings.length > 1 ? ` (+${warnings.length - 1} autre(s))` : ""),
          variant: "destructive",
        })
      }
    } catch (err) {
      setErrorInfo({ status: 502, message: "Impossible de contacter le serveur." })
      setResult(null)
    } finally {
      setLoading(false)
    }
  }, [range, toast])

  const repoOptions = React.useMemo(() => {
    if (!result) return []
    const set = new Set(result.repositories.map((r) => r.repository))
    return Array.from(set).sort()
  }, [result])

  const ownerOptions = React.useMemo(() => {
    if (!result) return []
    const set = new Set(result.repositories.map((r) => r.owner))
    return Array.from(set).sort()
  }, [result])

  const filteredEvents = React.useMemo(() => {
    if (!result) return []
    return result.events.filter(
      (e) =>
        (repoFilter === "all" || e.repository === repoFilter) &&
        (ownerFilter === "all" || e.owner === ownerFilter) &&
        (typeFilter === "all" || e.type === typeFilter)
    )
  }, [result, repoFilter, ownerFilter, typeFilter])

  const filteredRepositories: RepoSummary[] = React.useMemo(() => {
    const map = new Map<string, RepoSummary>()
    for (const e of filteredEvents) {
      let bucket = map.get(e.repository)
      if (!bucket) {
        bucket = {
          repository: e.repository,
          owner: e.owner,
          url: e.repoUrl,
          commits: 0,
          pullRequests: 0,
          reviews: 0,
          issues: 0,
          discussions: 0,
          total: 0,
        }
        map.set(e.repository, bucket)
      }
      if (e.type === "commit") bucket.commits += e.count
      else if (e.type === "pr") bucket.pullRequests += e.count
      else if (e.type === "review") bucket.reviews += e.count
      else if (e.type === "issue") bucket.issues += e.count
      else bucket.discussions += e.count
      bucket.total += e.count
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total)
  }, [filteredEvents])

  const filteredTotals = React.useMemo(() => {
    return filteredRepositories.reduce(
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
  }, [filteredRepositories])

  const chartData = React.useMemo(() => {
    if (!result) return []
    return bucketize(filteredEvents, result.period.from, result.period.to, granularity)
  }, [filteredEvents, result, granularity])

  const filteredCommitDetails = React.useMemo(() => {
    if (!result) return []
    if (typeFilter !== "all" && typeFilter !== "commit") return []
    return result.commitDetails.filter(
      (c) =>
        (repoFilter === "all" || c.repository === repoFilter) &&
        (ownerFilter === "all" || c.owner === ownerFilter)
    )
  }, [result, repoFilter, ownerFilter, typeFilter])

  const exportPayload = React.useMemo((): ContributionsAnalysisResult | null => {
    if (!result) return null
    return {
      ...result,
      totals: filteredTotals,
      repositories: filteredRepositories,
      events: filteredEvents,
      commitDetails: filteredCommitDetails,
    }
  }, [result, filteredTotals, filteredRepositories, filteredEvents, filteredCommitDetails])

  const handleExportCsv = () => {
    if (!exportPayload) return
    setExporting("csv")
    try {
      downloadContributionsCsv(exportPayload)
    } finally {
      setExporting(null)
    }
  }

  const handleExportXlsx = async () => {
    if (!exportPayload) return
    setExporting("xlsx")
    try {
      await downloadContributionsXlsx(exportPayload)
    } catch (err) {
      toast({ title: "Export échoué", description: "Impossible de générer le fichier Excel.", variant: "destructive" })
    } finally {
      setExporting(null)
    }
  }

  const handleExportPdf = async () => {
    if (!exportPayload) return
    setExporting("pdf")
    try {
      await downloadContributionsPdf(exportPayload)
    } catch (err) {
      toast({ title: "Export échoué", description: "Impossible de générer le fichier PDF.", variant: "destructive" })
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Activity className="h-6 w-6 text-fuchsia-500" />
            Rapport d'Activité GitHub
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Analyse détaillée des contributions par type et par repository sur une période personnalisée
          </p>
        </div>
      </div>

      {/* Period selector + Analyze button */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal text-xs sm:text-sm gap-2 h-10"
            >
              <CalendarRange className="h-4 w-4 text-fuchsia-500 shrink-0" />
              {range?.from && range?.to
                ? `${format(range.from, "dd MMM yyyy")} → ${format(range.to, "dd MMM yyyy")}`
                : "Sélectionner une période"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex items-center gap-2 p-2 border-b border-zinc-200 dark:border-zinc-800">
              {[
                { label: "30 jours", days: 30 },
                { label: "90 jours", days: 90 },
                { label: "365 jours", days: 365 },
              ].map((preset) => (
                <button
                  key={preset.days}
                  onClick={() => setRange({ from: subDays(new Date(), preset.days), to: new Date() })}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={2}
              defaultMonth={range?.from}
              disabled={{ after: new Date() }}
            />
          </PopoverContent>
        </Popover>

        <Button
          onClick={analyze}
          disabled={loading || !range?.from || !range?.to}
          className="rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs sm:text-sm gap-2 shadow-md shadow-fuchsia-600/20 h-10"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          {loading ? "Analyse en cours..." : "Analyser"}
        </Button>

        {result && (
          <div className="sm:ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-xl text-xs sm:text-sm gap-2 h-10"
                  disabled={exporting !== null}
                >
                  {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Exporter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportCsv} className="cursor-pointer text-xs gap-2">
                  <FileText className="h-3.5 w-3.5 text-zinc-400" /> Exporter CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportXlsx} className="cursor-pointer text-xs gap-2">
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" /> Exporter Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPdf} className="cursor-pointer text-xs gap-2">
                  <FileType className="h-3.5 w-3.5 text-rose-500" /> Exporter PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="w-full flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-fuchsia-500" />
          <p className="text-xs text-zinc-400 font-mono">Analyse des contributions GitHub en cours...</p>
        </div>
      )}

      {/* Hard error state */}
      {!loading && errorInfo && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 bg-amber-500/5 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                Analyse impossible ({errorInfo.status})
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
                {errorInfo.message}
              </p>
              {errorInfo.status === 503 && (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-emerald-400 space-y-1">
                  <p># Dans .env.local</p>
                  <p>GITHUB_TOKEN=ghp_votre_token_ici</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && !errorInfo && result && (
        <>
          {result.totals.total === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center text-sm text-zinc-400">
              Aucune contribution trouvée sur la période {result.period.label}.
            </div>
          ) : (
            <>
              {/* KPI grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                  title="Total Contributions"
                  value={filteredTotals.total}
                  icon={Activity}
                  iconColor="text-fuchsia-500 bg-fuchsia-500/10"
                  description={result.period.label}
                />
                <KpiCard
                  title="Commits"
                  value={filteredTotals.commits}
                  icon={GitCommit}
                  iconColor="text-indigo-500 bg-indigo-500/10"
                  description="Commits poussés"
                />
                <KpiCard
                  title="Pull Requests"
                  value={filteredTotals.pullRequests}
                  icon={GitPullRequest}
                  iconColor="text-sky-500 bg-sky-500/10"
                  description="PR ouvertes"
                />
                <KpiCard
                  title="Reviews"
                  value={filteredTotals.reviews}
                  icon={Eye}
                  iconColor="text-emerald-500 bg-emerald-500/10"
                  description="Revues de code"
                />
                <KpiCard
                  title="Issues"
                  value={filteredTotals.issues}
                  icon={CircleDot}
                  iconColor="text-amber-500 bg-amber-500/10"
                  description="Issues créées"
                />
                <KpiCard
                  title="Discussions"
                  value={filteredTotals.discussions}
                  icon={MessageSquare}
                  iconColor="text-purple-500 bg-purple-500/10"
                  description="Discussions démarrées"
                />
                <KpiCard
                  title="Repos Actifs"
                  value={filteredTotals.activeRepositories}
                  icon={BookOpen}
                  iconColor="text-zinc-500 bg-zinc-500/10"
                  description="Sur la période"
                />
              </div>

              {/* Temporal chart */}
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Activity className="h-4 w-4 text-fuchsia-500" />
                    Évolution de l'Activité
                  </h3>
                  <Tabs value={granularity} onValueChange={(v) => setGranularity(v as Granularity)}>
                    <TabsList className="grid grid-cols-3 h-8 p-0.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                      <TabsTrigger value="day" className="text-xs rounded-md">Jour</TabsTrigger>
                      <TabsTrigger value="week" className="text-xs rounded-md">Semaine</TabsTrigger>
                      <TabsTrigger value="month" className="text-xs rounded-md">Mois</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                      <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "rgba(15, 23, 42, 0.9)",
                          borderRadius: "10px",
                          color: "#fff",
                          fontSize: "12px",
                          border: "none",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Bar dataKey="commits" stackId="a" name="Commits" fill={TYPE_META.commit.color} />
                      <Bar dataKey="pullRequests" stackId="a" name="Pull Requests" fill={TYPE_META.pr.color} />
                      <Bar dataKey="reviews" stackId="a" name="Reviews" fill={TYPE_META.review.color} />
                      <Bar dataKey="issues" stackId="a" name="Issues" fill={TYPE_META.issue.color} />
                      <Bar
                        dataKey="discussions"
                        stackId="a"
                        name="Discussions"
                        fill={TYPE_META.discussion.color}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Filters */}
              <div className="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                <Select value={repoFilter} onValueChange={setRepoFilter}>
                  <SelectTrigger className="w-full sm:w-[220px] text-xs h-9">
                    <SelectValue placeholder="Repository" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les repositories</SelectItem>
                    {repoOptions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] text-xs h-9">
                    <SelectValue placeholder="Owner / Organisation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les owners</SelectItem>
                    {ownerOptions.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as ContributionType | "all")}>
                  <SelectTrigger className="w-full sm:w-[180px] text-xs h-9">
                    <SelectValue placeholder="Type de contribution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {(Object.keys(TYPE_META) as ContributionType[]).map((t) => (
                      <SelectItem key={t} value={t}>
                        {TYPE_META[t].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(repoFilter !== "all" || ownerFilter !== "all" || typeFilter !== "all") && (
                  <Button
                    variant="ghost"
                    className="text-xs h-9 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    onClick={() => {
                      setRepoFilter("all")
                      setOwnerFilter("all")
                      setTypeFilter("all")
                    }}
                  >
                    Réinitialiser
                  </Button>
                )}
              </div>

              {/* Repository table */}
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-fuchsia-500" />
                    Activité par Repository ({filteredRepositories.length})
                  </h3>
                  <Badge variant="outline" className="border-fuchsia-500/30 text-fuchsia-500 bg-fuchsia-500/10 text-xs">
                    Triés par total décroissant
                  </Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase">
                        <th className="py-2.5 font-semibold">Repository</th>
                        <th className="py-2.5 font-semibold text-right">Commits</th>
                        <th className="py-2.5 font-semibold text-right">PR</th>
                        <th className="py-2.5 font-semibold text-right">Reviews</th>
                        <th className="py-2.5 font-semibold text-right">Issues</th>
                        <th className="py-2.5 font-semibold text-right">Discussions</th>
                        <th className="py-2.5 font-semibold text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                      {filteredRepositories.map((repo) => (
                        <tr key={repo.repository} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              {repo.url ? (
                                <a
                                  href={repo.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="font-mono font-semibold text-indigo-500 hover:underline flex items-center gap-1.5"
                                >
                                  {repo.repository} <ExternalLink className="h-3 w-3 shrink-0" />
                                </a>
                              ) : (
                                <span className="font-mono font-semibold text-zinc-500">{repo.repository}</span>
                              )}
                              <Badge variant="outline" className="text-[10px] text-zinc-400 shrink-0">
                                {repo.owner}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-3 text-right text-zinc-700 dark:text-zinc-300">{repo.commits}</td>
                          <td className="py-3 text-right text-zinc-700 dark:text-zinc-300">{repo.pullRequests}</td>
                          <td className="py-3 text-right text-zinc-700 dark:text-zinc-300">{repo.reviews}</td>
                          <td className="py-3 text-right text-zinc-700 dark:text-zinc-300">{repo.issues}</td>
                          <td className="py-3 text-right text-zinc-700 dark:text-zinc-300">{repo.discussions}</td>
                          <td className="py-3 text-right font-bold text-zinc-900 dark:text-white">{repo.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
