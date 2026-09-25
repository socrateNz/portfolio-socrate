"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTranslations } from "next-intl"
import { QuickView } from "../QuickView"
import { ArrowIcon, EASE_OUT, MainButton, RollText, SplitHeading, SubtitleMarquee } from "@/components/site/primitives"

interface Project {
  _id: string
  title: string
  description: string
  image: string
  technologies: string[]
  tache: string[]
  githubUrl: string
  liveUrl: string
  private: boolean
  featured: boolean
  order: number
  category?: string
  stats?: {
    stars?: number
    forks?: number
    views?: number
  }
  date?: string
}

function CaseStudy({ project, index, onOpen, privateLabel }: { project: Project; index: number; onOpen: () => void; privateLabel: string }) {
  const detail = project.category || project.tache?.[0] || project.technologies?.[0] || "Project"

  return (
    <motion.button
      type="button"
      className="case-study-link roll-trigger"
      onClick={onOpen}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, ease: EASE_OUT, delay: (index % 2) * 0.1 }}
    >
      <div className="case-study-wrapper">
        <div className="background-glass" />
        <div className="case-study-container">
          <div className="case-study-content-grid">
            <div className="case-study-item">
              <div className="project-name">{project.title}</div>
              <div>•</div>
              <div className="project-detail-text">{detail}</div>
            </div>
            <div className="case-study-item">
              <div className="case-arrow-wrap">
                <div className="case-arrow-block">
                  <ArrowIcon className="case-arrow _01" />
                  <ArrowIcon className="case-arrow _02" />
                </div>
              </div>
            </div>
          </div>
          <div className="project-image-wrapper">
            {project.image && <img src={project.image} alt={project.title} className="project-image" loading="lazy" />}
            {project.private && <span className="case-badge">{privateLabel}</span>}
            <div className="case-logo-wrap">
              <RollText className="case-logo" wrapClassName="case-logo-block">{project.title}</RollText>
              <div className="case-study-overlay" style={{ zIndex: -1 }} />
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  )
}

// A sticky row of two case studies; it recedes as the next row slides over it
function ProjectRow({ children, isLast }: { children: ReactNode; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.9])
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, isLast ? 0 : 8])
  const dim = useTransform(scrollYProgress, [0, 1], [0, isLast ? 0 : 0.6])

  return (
    <motion.div ref={ref} className="project-wrapper" style={{ scale, rotateX }}>
      <div className="project-grid">{children}</div>
      <motion.div className="case-dim" style={{ opacity: dim }} />
    </motion.div>
  )
}

export function Projects() {
  const t = useTranslations("site.projects")
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects")
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des projets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const sorted = [...projects].sort((a, b) => a.order - b.order)
  const rows: Project[][] = []
  for (let i = 0; i < sorted.length; i += 2) rows.push(sorted.slice(i, i + 2))

  return (
    <section id="projects" className="section-dark">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-large">
            <div className="top-grid">
              <div className="max-width-large">
                <SubtitleMarquee text={t("subtitle")} muted />
                <SplitHeading
                  className="heading-style-h2"
                  segments={[
                    { text: t("title1"), className: "text-color-alternate", br: true },
                    { text: t("title2"), className: "text-color-secondary" },
                  ]}
                />
              </div>
              <h3 className="heading-style-h3 text-color-secondary">({String(projects.length).padStart(2, "0")})</h3>
            </div>

            <div className="spacer-xlarge" />

            {loading ? (
              <div className="project-grid">
                <div className="skeleton-card" />
                <div className="skeleton-card" />
              </div>
            ) : rows.length === 0 ? (
              <div className="projects-empty">{t("empty")}</div>
            ) : (
              <div className="project-component">
                {rows.map((row, r) => (
                  <ProjectRow key={r} isLast={r === rows.length - 1}>
                    {row.map((project, i) => (
                      <CaseStudy
                        key={project._id}
                        project={project}
                        index={i}
                        privateLabel={t("private")}
                        onOpen={() => {
                          setSelectedProject(project)
                          setOpen(true)
                        }}
                      />
                    ))}
                  </ProjectRow>
                ))}
              </div>
            )}

            <div className="spacer-xlarge" />
            <div className="button-wrap">
              <MainButton href="https://github.com/socrateNz" target="_blank" alternate>
                {t("all")}
              </MainButton>
            </div>
          </div>
        </div>
      </div>
      <QuickView project={selectedProject} isOpen={open} onClose={() => setOpen(false)} />
    </section>
  )
}
