"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  FileBadge,
  Download,
  Award,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  Eye,
  FileText,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

const CERTIFICATIONS = [
  { name: "AWS Certified Solutions Architect – Professional", issuer: "Amazon Web Services", date: "2026", valid: "Vérifié", badgeColor: "border-amber-500/30 text-amber-500 bg-amber-500/10" },
  { name: "Certified Kubernetes Administrator (CKA)", issuer: "Cloud Native Computing Foundation (CNCF)", date: "2025", valid: "Vérifié", badgeColor: "border-sky-500/30 text-sky-500 bg-sky-500/10" },
  { name: "OpenAI Certified Generative AI & RAG Engineer", issuer: "OpenAI Academy", date: "2025", valid: "Vérifié", badgeColor: "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" },
  { name: "Meta Professional Senior React & Next.js Developer", issuer: "Meta Coursera", date: "2024", valid: "Vérifié", badgeColor: "border-indigo-500/30 text-indigo-500 bg-indigo-500/10" },
]

export function CvCertificationsView() {
  const { toast } = useToast()

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <FileBadge className="h-6 w-6 text-blue-500" />
            CV Executive & Badges de Certification (12)
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Aperçu interactif du résumé professionnel et crédentiels vérifiés
          </p>
        </div>

        <Button
          onClick={() => {
            toast({
              title: "Téléchargement CV démarré",
              description: "Socrate_Executive_CV_2026.pdf est téléchargé.",
            })
          }}
          className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs gap-1.5 shadow-md"
        >
          <Download className="h-4 w-4" /> Télécharger CV Executive PDF
        </Button>
      </div>

      {/* CV Preview & Badges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: CV Live Interactive Card */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black text-lg">
                SO
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">SOCRATE</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Senior Full Stack, AI & DevOps Architect
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-xs">
              🟢 Verification OK (2026)
            </Badge>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Résumé Exécutif</h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Plus de 6 ans d'expérience dans la conception d'architectures SaaS résilientes, la construction d'applications web Next.js 16 ultra-rapides, et le déploiement d'agents IA autonomes (RAG / LLMs). Expert certifié Cloud (AWS, Kubernetes) passionné par le Product Design et la performance applicative.
            </p>
          </div>

          {/* Core Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 text-xs">
              <span className="text-zinc-400 font-medium">Expérience</span>
              <p className="font-extrabold text-zinc-900 dark:text-white text-base">6+ Ans Senior</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 text-xs">
              <span className="text-zinc-400 font-medium">Spécialité IA</span>
              <p className="font-extrabold text-indigo-500 text-base">RAG & Multi-Agents</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 text-xs">
              <span className="text-zinc-400 font-medium">Langues</span>
              <p className="font-extrabold text-zinc-900 dark:text-white text-base">Français & Anglais</p>
            </div>
          </div>
        </div>

        {/* Right: Badges List */}
        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500" />
            Certifications Officiellement Vérifiées
          </h3>

          <div className="space-y-3">
            {CERTIFICATIONS.map((cert, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-zinc-900 dark:text-white">{cert.name}</span>
                  <Badge variant="outline" className={`text-[10px] ${cert.badgeColor}`}>
                    <ShieldCheck className="h-3 w-3 mr-1" /> {cert.valid}
                  </Badge>
                </div>
                <p className="text-[11px] text-zinc-500">{cert.issuer} • {cert.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
