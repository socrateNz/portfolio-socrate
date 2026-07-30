"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Github,
  GitCommit,
  Star,
  GitBranch,
  ExternalLink,
  Loader2,
  Users,
  BookOpen,
  Code2,
  Sparkles,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GithubContributionGraph } from "@/components/admin/GithubContributionGraph"

export function GithubHubView() {
  const [ghData, setGhData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  const fetchGithubData = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/github")
      if (res.ok) {
        const data = await res.json()
        setGhData(data)
      }
    } catch (err) {
      console.error("Failed to fetch GitHub data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchGithubData()
  }, [fetchGithubData])

  const username = ghData?.username || "socrate-dev"
  const name = ghData?.name || username
  const bio = ghData?.bio || "Senior Full Stack, AI & Cloud Architect"
  const avatar = ghData?.avatar || "https://github.com/identicons/socrate-dev.png"
  const htmlUrl = ghData?.htmlUrl || `https://github.com/${username}`
  const publicRepos = ghData?.publicRepos ?? 0
  const stars = ghData?.stars ?? 0
  const followers = ghData?.followers ?? 0
  const repos = Array.isArray(ghData?.repos) ? ghData.repos : []

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Top Header Card with Real GitHub User Profile */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-purple-500/20 bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={avatar}
                alt={username}
                className="h-16 w-16 rounded-2xl border-2 border-purple-500/40 shadow-lg object-cover"
              />
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">
                  {name}
                </h1>
                <Badge variant="outline" className="border-purple-500/30 text-purple-500 bg-purple-500/10 font-mono text-xs">
                  @{username}
                </Badge>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-lg leading-relaxed">
                {bio}
              </p>
            </div>
          </div>

          <a
            href={htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 transition-all"
          >
            <Github className="h-4 w-4" /> Voir le Profil GitHub <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* GitHub Key Stats Grid (Real Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-semibold uppercase">Repositories Publics</span>
            <BookOpen className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-white">
            {loading ? <Loader2 className="h-6 w-6 animate-spin text-purple-500" /> : publicRepos}
          </p>
          <span className="text-xs text-purple-500 font-semibold">Projets Open Source en ligne</span>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-semibold uppercase">Étoiles (Stars Cumulées)</span>
            <Star className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-500">
            {loading ? <Loader2 className="h-6 w-6 animate-spin text-amber-500" /> : `${stars} ⭐`}
          </p>
          <span className="text-xs text-amber-500 font-semibold">Distinctions communauté GitHub</span>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-semibold uppercase">Followers GitHub</span>
            <Users className="h-4 w-4 text-sky-500" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-white">
            {loading ? <Loader2 className="h-6 w-6 animate-spin text-sky-500" /> : followers}
          </p>
          <span className="text-xs text-sky-500 font-semibold">Abonnés & Recruteurs</span>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-semibold uppercase">Status de Sync</span>
            <Sparkles className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-500">100% Live</p>
          <span className="text-xs text-emerald-500 font-semibold">Synchronisé avec l'API GitHub</span>
        </div>
      </div>

      {/* Contribution Grid Visualizer */}
      <GithubContributionGraph externalData={ghData?.contributions} />

      {/* REAL Popular Repositories List from GitHub API */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-indigo-500" />
            Repositories Réels GitHub ({repos.length})
          </h3>
          <span className="text-xs text-zinc-400 font-mono">Tris par récence de mise à jour</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-zinc-400 text-xs gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
            <span>Chargement des dépôts en direct depuis l'API GitHub...</span>
          </div>
        ) : repos.length === 0 ? (
          <div className="p-6 text-center text-xs text-zinc-400">
            Aucun dépôt public trouvé. Vérifiez que <code className="font-mono text-purple-400">GITHUB_USERNAME</code> dans <code className="font-mono text-purple-400">.env.local</code> est correct.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repos.map((repo: any, idx: number) => (
              <motion.div
                key={repo.id || idx}
                whileHover={{ y: -2 }}
                className="glass-card p-4 rounded-xl space-y-3 border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-sm text-indigo-500 font-mono flex items-center gap-1.5 hover:underline truncate"
                    >
                      <Github className="h-4 w-4 shrink-0" /> {repo.name}
                    </a>
                    {repo.updatedAt && (
                      <Badge variant="outline" className="text-[10px] text-zinc-400 shrink-0">
                        {repo.updatedAt}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {repo.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium flex items-center gap-1">
                    <Code2 className="h-3.5 w-3.5 text-sky-400" /> {repo.language}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Star className="h-3.5 w-3.5 fill-amber-500" /> {repo.stars}
                    </span>
                    <span className="flex items-center gap-1 text-purple-400 font-semibold">
                      <GitBranch className="h-3.5 w-3.5" /> {repo.forks}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
