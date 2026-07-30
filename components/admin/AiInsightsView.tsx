"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Sparkles,
  Zap,
  TrendingUp,
  Lightbulb,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  ShieldCheck,
  Brain,
  Rocket,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

export function AiInsightsView() {
  const { toast } = useToast()
  const [analyzing, setAnalyzing] = React.useState(false)

  const triggerAudit = () => {
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      toast({
        title: "Audit IA Complété ✨",
        description: "Portfolio à jour: Score de visibilité Recruteurs à 96/100.",
      })
    }, 1500)
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            AI Portfolio Diagnostics & Copilot
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Analyse automatisée de performance, SEO, et adéquation avec les rôles Senior Tech
          </p>
        </div>

        <Button
          onClick={triggerAudit}
          disabled={analyzing}
          className="rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs gap-1.5 shadow-md shadow-amber-500/20"
        >
          <RefreshCw className={`h-4 w-4 ${analyzing ? "animate-spin" : ""}`} />
          {analyzing ? "Analyse en cours..." : "Re-scanner le Portfolio"}
        </Button>
      </div>

      {/* Health Score Overview */}
      <div className="glass-panel rounded-3xl p-6 border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-transparent to-purple-500/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/40 text-xs font-mono">
              EXECUTIVE QUALITY SCORE
            </Badge>
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
              Score Global Portfolio: <span className="indigo-gradient-text">96 / 100</span>
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-xl">
              Votre portfolio répond aux standards d'embauche des géants de la Tech (Google, Meta, OpenAI). Les cas d'études RAG et System Architecture maximisent le taux de réponse des recruteurs.
            </p>
          </div>

          <div className="w-full md:w-64 space-y-2 shrink-0">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-zinc-600 dark:text-zinc-400">Impression Recruteur</span>
              <span className="text-emerald-500 font-mono">98%</span>
            </div>
            <Progress value={98} className="h-2 bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-zinc-600 dark:text-zinc-400">SEO & Visibilité Google</span>
              <span className="text-amber-500 font-mono">94%</span>
            </div>
            <Progress value={94} className="h-2 bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>

      {/* AI Recommendations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Rocket className="h-4 w-4 text-emerald-500" />
            Projets & Technologies les Plus Vues
          </h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 text-xs space-y-1">
              <span className="font-bold text-indigo-500">1. Multi-Agent RAG Orchestrator</span>
              <p className="text-zinc-500">Représente 45% des visites qualifiées des recruteurs AI.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 text-xs space-y-1">
              <span className="font-bold text-sky-500">2. Kubernetes Custom Operator</span>
              <p className="text-zinc-500">Très consulté par les Engineering Directors de profil Cloud Native.</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            Recommandations d'Amélioration Continu
          </h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
              <span className="font-bold text-amber-500">1. Publier un cas d'étude "Kafka & WebSocket"</span>
              <p className="text-zinc-600 dark:text-zinc-400">
                Ajouter des métriques de benchmark (ex: latence p99 &lt; 5ms) sur le projet FinTech.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
              <span className="font-bold text-amber-500">2. Intégrer un schéma OpenGraph dynamique</span>
              <p className="text-zinc-600 dark:text-zinc-400">
                Booster la lisibilité des cartes de partage lorsqu'un lien est envoyé sur LinkedIn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
