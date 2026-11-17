"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Code2, Briefcase, Layers } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { EVENODD_LOGOS, TECH_LOGOS } from "@/components/site/tech-logos"
import { STACK_CATEGORIES, STACK_ITEMS } from "@/lib/stack"

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

// Normalise tags like "Next.js 16" or "React 19" to the stack names
const matchTech = (tag: string) => STACK_ITEMS.find((name) => tag.toLowerCase().startsWith(name.toLowerCase()))

export function SkillsExperienceView() {
  // How many saved projects use each technology of the public stack
  const [usage, setUsage] = React.useState<Record<string, number> | null>(null)

  React.useEffect(() => {
    fetch("/api/projects")
      .then((res) => (res.ok ? res.json() : []))
      .then((projects: { technologies?: string[] }[]) => {
        const counts: Record<string, number> = {}
        if (Array.isArray(projects)) {
          projects.forEach((p) => {
            const seen = new Set((p.technologies ?? []).map(matchTech).filter(Boolean) as string[])
            seen.forEach((name) => (counts[name] = (counts[name] || 0) + 1))
          })
        }
        setUsage(counts)
      })
      .catch(() => setUsage({}))
  }, [])

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Code2 className="h-6 w-6 text-zinc-400" />
            Compétences & Parcours
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Stack affichée sur le site public et parcours professionnel
          </p>
        </div>
        <Badge variant="outline" className="w-fit border-zinc-500/20 text-zinc-600 dark:text-zinc-300 bg-zinc-500/10 text-xs">
          Développeur Web & Mobile
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: stack shown on the public site (lib/stack.ts) */}
        <div className="glass-panel rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-zinc-400" />
              Stack technique
            </h2>
            <span className="text-[10px] font-mono uppercase text-zinc-400">{STACK_ITEMS.length} technos · site public</span>
          </div>

          <div className="space-y-5">
            {STACK_CATEGORIES.map((cat) => (
              <div key={cat.name} className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">{cat.name}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cat.items.map((name) => {
                    const count = usage?.[name] ?? 0
                    return (
                      <div
                        key={name}
                        className="flex items-center gap-3 rounded-xl border border-zinc-200/60 dark:border-white/[0.07] bg-zinc-50 dark:bg-white/[0.03] px-3 py-2.5"
                      >
                        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-zinc-800 dark:text-white" fill="currentColor" aria-hidden="true">
                          <path d={TECH_LOGOS[name]} fillRule={EVENODD_LOGOS.has(name) ? "evenodd" : undefined} />
                        </svg>
                        <span className="flex-1 text-xs font-semibold text-zinc-900 dark:text-white truncate">{name}</span>
                        <span className={`text-[10px] font-mono ${count ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-400/60"}`}>
                          {usage === null ? "…" : `${count} projet${count > 1 ? "s" : ""}`}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Pour modifier la stack du site, éditez <code className="font-mono text-zinc-600 dark:text-zinc-300">lib/stack.ts</code> (le logo doit exister dans <code className="font-mono text-zinc-600 dark:text-zinc-300">tech-logos.ts</code>).
          </p>
        </div>

        {/* Right: Career Experience Timeline */}
        <div className="glass-panel rounded-3xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-zinc-400" />
            Expériences & Rôles Occupés
          </h2>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-500/30">
            {EXPERIENCES.map((exp, idx) => (
              <div key={idx} className="relative space-y-1">
                <div className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-[#0e0e0e] ring-4 ring-white dark:ring-[#141414] text-[10px] font-bold">
                  {idx + 1}
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{exp.role}</h3>
                  <Badge variant="outline" className="text-[10px] text-zinc-400">{exp.period}</Badge>
                </div>
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{exp.company}</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1">{exp.desc}</p>
                <div className="flex flex-wrap gap-1 pt-2">
                  {exp.techs.map((t, tIdx) => (
                    <Badge key={tIdx} className="border-zinc-500/20 text-zinc-600 dark:text-zinc-300 bg-zinc-500/10 text-[9px]">
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
