"use client"

import * as React from "react"
import {
  BarChart3,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
  Monitor,
  Eye,
  GitCommit,
  Loader2,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  Zap,
} from "lucide-react"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { GithubContributionGraph } from "@/components/admin/GithubContributionGraph"

export function AnalyticsView() {
  const [ghData, setGhData] = React.useState<any>(null)
  const [analyticsData, setAnalyticsData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    Promise.all([
      fetch("/api/github").then((res) => (res.ok ? res.json() : null)),
      fetch("/api/analytics").then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([githubRes, analyticsRes]) => {
        if (githubRes) setGhData(githubRes)
        if (analyticsRes) setAnalyticsData(analyticsRes)
      })
      .catch((err) => console.error("Telemetry fetch error:", err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        <p className="text-xs text-zinc-400 font-mono">
          Connexion à l'API @vercel/analytics...
        </p>
      </div>
    )
  }

  const isConfigured = analyticsData?.configured === true
  const summary = analyticsData?.summary || {
    totalSessions: 0,
    uniqueUsers: 0,
    bounceRate: "0%",
    avgDuration: "0s",
  }
  const deviceBreakdown = analyticsData?.deviceBreakdown || []
  const popularPages = analyticsData?.popularPages || []
  const hourlySessions = analyticsData?.hourlySessions || []

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-sky-500" />
            Analytics & Télémétrie @vercel/analytics
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Intégration directe du package officiel @vercel/analytics
          </p>
        </div>
        <Badge
          variant="outline"
          className={`w-fit text-xs flex items-center gap-1.5 ${
            isConfigured
              ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
              : "border-amber-500/30 text-amber-500 bg-amber-500/10"
          }`}
        >
          {isConfigured ? "🟢 @vercel/analytics Connecté" : "⚠️ Clés Vercel Non Configuées"}
        </Badge>
      </div>

      {/* If Vercel API Token is not added to .env.local yet */}
      {!isConfigured && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 bg-amber-500/5 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-white">
                Configuration de l'API @vercel/analytics requis
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
                Pour afficher les analyses en direct provenant de Vercel Web Analytics sur cet écran, ajoutez vos identifiants Vercel dans <code className="text-purple-400 font-mono font-bold">.env.local</code> :
              </p>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-emerald-400 space-y-1">
                <p># Dans .env.local</p>
                <p>VERCEL_API_TOKEN=vkt_votre_token_ici</p>
                <p>VERCEL_PROJECT_ID=prj_votre_project_id_ici</p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://vercel.com/account/tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all"
                >
                  <Zap className="h-3.5 w-3.5" /> Générer un Token API Vercel <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards (Live from @vercel/analytics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 space-y-1">
          <span className="text-xs font-semibold text-zinc-400 uppercase">Pages Vues (@vercel/analytics)</span>
          <p className="text-2xl font-black text-zinc-900 dark:text-white">
            {summary.totalSessions.toLocaleString()}
          </p>
          <span className="text-xs font-semibold text-sky-500">Flux Vercel Live</span>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <span className="text-xs font-semibold text-zinc-400 uppercase">Visiteurs Uniques</span>
          <p className="text-2xl font-black text-zinc-900 dark:text-white">
            {summary.uniqueUsers.toLocaleString()}
          </p>
          <span className="text-xs font-semibold text-sky-500">Trafic réel Vercel</span>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <span className="text-xs font-semibold text-zinc-400 uppercase">Taux de Rebond</span>
          <p className="text-2xl font-black text-zinc-900 dark:text-white">
            {summary.bounceRate}
          </p>
          <span className="text-xs font-semibold text-purple-400">Vercel Insights</span>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <span className="text-xs font-semibold text-zinc-400 uppercase">Temps Moyen / Session</span>
          <p className="text-2xl font-black text-zinc-900 dark:text-white">
            {summary.avgDuration}
          </p>
          <span className="text-xs font-semibold text-purple-400">Durée de consultation</span>
        </div>
      </div>

      {/* GitHub Contributions & Activity Heatmap */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-emerald-500" />
            Télémétrie d'Activité Code & Contributions GitHub
          </h3>
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10 text-xs">
            🟢 GitHub API Live Sync
          </Badge>
        </div>
        <GithubContributionGraph externalData={ghData?.contributions} />
      </div>

      {/* Device Breakdown & Popular Pages */}
      {isConfigured && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Device Breakdown Donut */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Monitor className="h-4 w-4 text-purple-500" />
              Appareils & Navigateurs (Vercel Data)
            </h3>

            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deviceBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                    {deviceBreakdown.map((entry: any, idx: number) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Pages Visited Table */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Eye className="h-4 w-4 text-emerald-500" />
              Pages les Plus Consultées (@vercel/analytics)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase">
                    <th className="py-2.5 font-semibold">Page Path</th>
                    <th className="py-2.5 font-semibold">Vues Vercel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {popularPages.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40">
                      <td className="py-3 font-mono font-semibold text-indigo-500">{row.page}</td>
                      <td className="py-3 font-bold text-zinc-900 dark:text-white">{row.views ? row.views.toLocaleString() : 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
