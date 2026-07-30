"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  FolderGit2,
  Activity,
  Code2,
  Briefcase,
  Users,
  UserCheck,
  Mail,
  FileText,
  Award,
  Star,
  Github,
  GitCommit,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Quote,
  CheckSquare,
  Plus,
  Trash2,
  ChevronRight,
  ArrowUpRight,
  Lightbulb,
  CheckCircle2,
  Cpu,
  Loader2,
} from "lucide-react"

import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import { KpiCard } from "./KpiCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { GithubContributionGraph } from "@/components/admin/GithubContributionGraph"

interface TodoItem {
  id: string
  text: string
  completed: boolean
  priority: "high" | "medium" | "low"
}

interface HomeDashboardViewProps {
  onNavigate: (tabId: string) => void
}

export function HomeDashboardView({ onNavigate }: HomeDashboardViewProps) {
  const { toast } = useToast()

  // Live Telemetry States
  const [ghMetrics, setGhMetrics] = React.useState<any>(null)
  const [realProjectsList, setRealProjectsList] = React.useState<any[]>([])
  const [analyticsData, setAnalyticsData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState<boolean>(true)

  // Scratchpad & Todo States (Persisted in localStorage)
  const [quickNote, setQuickNote] = React.useState<string>("")
  const [todos, setTodos] = React.useState<TodoItem[]>([])
  const [newTodoText, setNewTodoText] = React.useState("")

  React.useEffect(() => {
    // Load local storage
    if (typeof window !== "undefined") {
      const savedNote = localStorage.getItem("admin_quick_note")
      if (savedNote) setQuickNote(savedNote)

      const savedTodos = localStorage.getItem("admin_todos")
      if (savedTodos) {
        try {
          setTodos(JSON.parse(savedTodos))
        } catch (e) {}
      }
    }

    Promise.all([
      fetch("/api/github").then((res) => (res.ok ? res.json() : null)),
      fetch("/api/projects").then((res) => (res.ok ? res.json() : null)),
      fetch("/api/analytics").then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([githubRes, projectsRes, analyticsRes]) => {
        if (githubRes) setGhMetrics(githubRes)
        if (Array.isArray(projectsRes)) setRealProjectsList(projectsRes)
        if (analyticsRes) setAnalyticsData(analyticsRes)
      })
      .catch((err) => console.error("Telemetry fetch error:", err))
      .finally(() => setLoading(false))
  }, [])

  // Save quick note to localStorage
  const handleNoteChange = (val: string) => {
    setQuickNote(val)
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_quick_note", val)
    }
  }

  // Todo handlers with localStorage
  const addTodo = () => {
    if (!newTodoText.trim()) return
    const updated = [
      ...todos,
      { id: Date.now().toString(), text: newTodoText.trim(), completed: false, priority: "medium" as const },
    ]
    setTodos(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_todos", JSON.stringify(updated))
    }
    setNewTodoText("")
    toast({ title: "Tâche ajoutée", description: "Enregistrée dans la todo list." })
  }

  const toggleTodo = (id: string) => {
    const updated = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    setTodos(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_todos", JSON.stringify(updated))
    }
  }

  const deleteTodo = (id: string) => {
    const updated = todos.filter((t) => t.id !== id)
    setTodos(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_todos", JSON.stringify(updated))
    }
  }

  // Calculate Tech Distribution dynamically from real MongoDB projects
  const techDistribution = React.useMemo(() => {
    if (!realProjectsList || realProjectsList.length === 0) return []
    const counts: Record<string, number> = {}
    realProjectsList.forEach((p: any) => {
      if (Array.isArray(p.technologies)) {
        p.technologies.forEach((t: string) => {
          counts[t] = (counts[t] || 0) + 1
        })
      }
    })
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1
    const colors = ["#6366f1", "#38bdf8", "#a855f7", "#10b981", "#f59e0b", "#ec4899"]
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, val], idx) => ({
        name,
        value: Math.round((val / total) * 100),
        color: colors[idx % colors.length],
      }))
  }, [realProjectsList])

  const totalProjects = realProjectsList.length
  const activeProjects = realProjectsList.filter((p) => !p.private).length
  const displayStars = ghMetrics?.stars !== undefined ? `${ghMetrics.stars} ⭐` : "0 ⭐"
  const displayRepos = ghMetrics?.publicRepos ?? totalProjects
  const username = ghMetrics?.username || "socratenZ"
  const name = ghMetrics?.name || username

  const hourlySessions = analyticsData?.hourlySessions || []
  const summary = analyticsData?.summary || { totalSessions: 0, uniqueUsers: 0 }

  return (
    <div className="w-full space-y-8 pb-12 font-sans">
      {/* 1. Hero Greeting Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-transparent border border-indigo-500/20"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/30 font-mono text-xs">
                ⚡ EXECUTIVE COMMAND CENTER
              </Badge>
              <span className="text-xs text-zinc-400">Live Sync</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Bonjour, <span className="indigo-gradient-text">{name}</span> 👋
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed">
              Votre tableau de bord récapitule vos <span className="font-bold text-indigo-400">{totalProjects} projets</span> enregistrés et votre activité GitHub en direct.
            </p>

            <div className="pt-2 flex items-start gap-2 text-xs text-zinc-500 dark:text-zinc-400 italic">
              <Quote className="h-4 w-4 text-indigo-400 shrink-0" />
              <span>"The best way to predict the future is to invent it." — Alan Kay</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => onNavigate("projects")}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 shadow-lg shadow-indigo-600/20"
            >
              <Plus className="h-4 w-4 mr-1.5" /> Nouveau Projet
            </Button>
            <Button
              onClick={() => onNavigate("github")}
              variant="outline"
              className="rounded-xl border-zinc-300 dark:border-zinc-700 text-xs font-semibold"
            >
              <Github className="h-4 w-4 mr-1.5 text-purple-400" /> Profil GitHub
            </Button>
          </div>
        </div>
      </motion.div>

      {/* 2. Key Metrics Grid (Dynamically Calculated) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">
            Métriques Clés en Temps Réel
          </h2>
          <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
            {loading && <Loader2 className="h-3 w-3 animate-spin text-purple-500" />} Données API Live
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total Projects (MongoDB)"
            value={totalProjects}
            change={`${activeProjects} publics`}
            trend="up"
            icon={FolderGit2}
            iconColor="text-indigo-500 bg-indigo-500/10"
            description="Base de données MongoDB"
          />
          <KpiCard
            title="Dépôts Publics GitHub"
            value={displayRepos}
            change={`@${username}`}
            trend="up"
            icon={Activity}
            iconColor="text-emerald-500 bg-emerald-500/10"
            description="Synchro API GitHub"
          />
          <KpiCard
            title="GitHub Stars"
            value={displayStars}
            change="API Live"
            trend="up"
            icon={Star}
            iconColor="text-amber-500 bg-amber-500/10"
            description="Étoiles cumulées"
          />
          <KpiCard
            title="Followers GitHub"
            value={ghMetrics?.followers ?? 0}
            change="API Live"
            trend="up"
            icon={Users}
            iconColor="text-sky-500 bg-sky-500/10"
            description="Abonnés GitHub"
          />
        </div>
      </div>

      {/* 3. Recharts Section (Dynamic Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real Session Hourly Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                Télémétrie des Sessions (Temps Réel)
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Alimenté en direct par l'API de télémétrie
              </p>
            </div>
            <Badge variant="outline" className="border-indigo-500/30 text-indigo-500 bg-indigo-500/10 text-xs">
              Live API
            </Badge>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlySessions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="sessions" stroke="#6366f1" strokeWidth={3} fill="#6366f1" fillOpacity={0.2} name="Sessions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Technology Distribution Chart (Calculated from Real MongoDB Projects) */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 mb-1">
              <Cpu className="h-4 w-4 text-purple-500" />
              Stack Tech (Calculée depuis MongoDB)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Répartition basée sur les tags de vos projets
            </p>
          </div>

          {techDistribution.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-400">
              Aucun projet ou tag trouvé en base de données.
            </div>
          ) : (
            <>
              <div className="h-[180px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={techDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {techDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.9)",
                        borderRadius: "10px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                {techDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-zinc-600 dark:text-zinc-300 font-medium">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-zinc-900 dark:text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 4. GitHub Contribution Matrix (Live GitHub API) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <GitCommit className="h-4 w-4 text-purple-500" />
            Matrice des Contributions GitHub (API GitHub Live)
          </h3>
          <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10 text-xs font-mono">
            @{username}
          </Badge>
        </div>
        <GithubContributionGraph externalData={ghMetrics?.contributions} />
      </div>

      {/* 5. Interactive Widgets Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Scratchpad Notes Widget */}
        <div className="glass-panel rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-indigo-500" />
              Notes Rapides (Scratchpad)
            </h4>
            <Badge variant="outline" className="text-[10px] text-zinc-400">Enregistrement automatique</Badge>
          </div>
          <textarea
            placeholder="Écrivez vos notes ici (sauvegardées automatiquement dans le navigateur)..."
            value={quickNote}
            onChange={(e) => handleNoteChange(e.target.value)}
            className="w-full h-32 p-3 text-xs bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-800 dark:text-zinc-200"
          />
        </div>

        {/* Todo List Widget */}
        <div className="glass-panel rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-emerald-500" />
              Checklist & Tâches
            </h4>
            <span className="text-[11px] text-zinc-400">
              {todos.filter((t) => t.completed).length}/{todos.length} complétées
            </span>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Ajouter une nouvelle tâche..."
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              className="h-9 text-xs bg-zinc-50 dark:bg-zinc-900/60 rounded-lg"
            />
            <Button onClick={addTodo} size="sm" className="h-9 px-3 bg-emerald-600 hover:bg-emerald-500 text-white">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {todos.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-400">
              Aucune tâche. Saisissez une tâche ci-dessus pour l'ajouter à votre liste.
            </div>
          ) : (
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="rounded"
                    />
                    <span className={`truncate ${todo.completed ? "line-through text-zinc-400" : "text-zinc-800 dark:text-zinc-200"}`}>
                      {todo.text}
                    </span>
                  </div>
                  <button onClick={() => deleteTodo(todo.id)} className="text-zinc-400 hover:text-rose-500 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
