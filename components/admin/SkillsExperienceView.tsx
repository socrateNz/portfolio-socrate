"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Code2, Briefcase, CheckCircle2, Star, Sparkles, Layers } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const EXPERIENCES = [
  {
    role: "Lead Full Stack & AI Architect",
    company: "TechScale Solutions",
    period: "2024 - Présent",
    desc: "Architecture et lead technique d'une plateforme SaaS multi-tenant traitant +1M requêtes/jour. Intégration de pipelines RAG autonomes avec Vector Databases.",
    techs: ["Next.js 16", "TypeScript", "LangChain", "Python", "Kubernetes", "AWS"],
  },
  {
    role: "Senior Cloud & DevOps Engineer",
    company: "CloudVanguard Inc.",
    period: "2022 - 2024",
    desc: "Conception de pipelines CI/CD GitOps, création d'opérateurs Kubernetes personnalisés et automatisation d'infrastructures Terraform / Helm.",
    techs: ["Go", "Kubernetes", "Docker", "Terraform", "Prometheus", "GitLab CI"],
  },
  {
    role: "Full Stack Engineer",
    company: "DigitalCraft Studio",
    period: "2020 - 2022",
    desc: "Développement d'applications web réactives complexes en React, Node.js et PostgreSQL pour des clients grands comptes.",
    techs: ["React", "Node.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
  },
]

const SKILLS_CATEGORIES = [
  { name: "Frontend & Design", level: 98, items: ["Next.js 16 App Router", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "Shadcn/ui"] },
  { name: "Backend & Systems", level: 94, items: ["Node.js / Express", "Python (FastAPI)", "Go", "PostgreSQL", "MongoDB", "Redis"] },
  { name: "AI & Data Engineering", level: 95, items: ["RAG Architecture", "LangChain / LlamaIndex", "Vector DBs (Pinecone/PGVector)", "OpenAI / Claude APIs"] },
  { name: "DevOps & Cloud Native", level: 90, items: ["Docker & Kubernetes", "AWS (EKS, Lambda, S3)", "CI/CD GitOps", "Vercel Edge Platform"] },
]

export function SkillsExperienceView() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Code2 className="h-6 w-6 text-cyan-500" />
            Matrice des Compétences & Parcours Professionnel
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Timeline de carrière et niveau d'expertise technique
          </p>
        </div>
        <Badge variant="outline" className="w-fit border-cyan-500/30 text-cyan-500 bg-cyan-500/10 text-xs">
          ⚡ Senior Full Stack, AI & Cloud Architect
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Skills Matrix */}
        <div className="glass-panel rounded-3xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Matrice de Maîtrise Technique
          </h2>

          <div className="space-y-6">
            {SKILLS_CATEGORIES.map((cat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-zinc-900 dark:text-white">{cat.name}</span>
                  <span className="text-indigo-500 font-mono">{cat.level}%</span>
                </div>
                <Progress value={cat.level} className="h-2 bg-zinc-200 dark:bg-zinc-800" />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cat.items.map((item, itemIdx) => (
                    <Badge key={itemIdx} variant="secondary" className="text-[10px] bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Career Experience Timeline */}
        <div className="glass-panel rounded-3xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-500" />
            Expériences & Rôles Occupés
          </h2>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-500/30">
            {EXPERIENCES.map((exp, idx) => (
              <div key={idx} className="relative space-y-1">
                <div className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center text-white ring-4 ring-white dark:ring-zinc-950 text-[10px] font-bold">
                  {idx + 1}
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{exp.role}</h3>
                  <Badge variant="outline" className="text-[10px] text-zinc-400">{exp.period}</Badge>
                </div>
                <p className="text-xs font-semibold text-indigo-500">{exp.company}</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1">{exp.desc}</p>
                <div className="flex flex-wrap gap-1 pt-2">
                  {exp.techs.map((t, tIdx) => (
                    <Badge key={tIdx} className="text-[9px] bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
