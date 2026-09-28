"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { AsteriskIcon, EASE_OUT, MainButton } from "@/components/site/primitives"

export interface DialogProject {
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
  longDescription?: string
  challenges?: string[]
  solutions?: string[]
  screenshots?: string[]
}

type Props = {
  project: DialogProject | null
  index: number
  isOpen: boolean
  onClose: () => void
}

// Content blocks fade up in sequence on open and drop out together, before the panel closes
const item = {
  hidden: { opacity: 0, y: 24, transition: { duration: 0.2, ease: "easeIn" } },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
} as const

export function ProjectDialog({ project, index, isOpen, onClose }: Props) {
  const t = useTranslations("site.quickview")
  const closeRef = useRef<HTMLButtonElement>(null)
  const [active, setActive] = useState(0)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => setActive(0), [project?._id])

  useEffect(() => {
    if (!isOpen) return
    const previous = document.activeElement as HTMLElement | null
    document.documentElement.style.overflow = "hidden"
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCloseRef.current()
    window.addEventListener("keydown", onKey)
    return () => {
      document.documentElement.style.overflow = ""
      window.removeEventListener("keydown", onKey)
      previous?.focus?.({ preventScroll: true })
    }
  }, [isOpen])

  const images = project ? [project.image, ...(project.screenshots ?? [])].filter(Boolean) : []
  const showCode = project && !project.private && project.githubUrl

  return (
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          className="pd-root"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pd-title"
          initial="closed"
          animate="open"
          exit="closed"
        >
          <motion.div
            className="pd-overlay"
            onClick={onClose}
            variants={{
              open: { opacity: 1, transition: { duration: 0.4 } },
              closed: { opacity: 0, transition: { duration: 0.3, delay: 0.55 } },
            }}
          />

          <motion.div
            className="pd-panel"
            variants={{
              open: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE_OUT } },
              closed: { opacity: 0, y: 40, scale: 0.97, transition: { when: "afterChildren", duration: 0.35, ease: "easeIn" } },
            }}
          >
            <button ref={closeRef} type="button" className="pd-close" onClick={onClose} aria-label={t("close")}>
              <span className="pd-close-line" />
              <span className="pd-close-line" />
            </button>

            <div className="pd-media">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={images[active]}
                  src={images[active]}
                  alt={project.title}
                  className="pd-image"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                />
              </AnimatePresence>
              {images.length > 1 && (
                <div className="pd-dots">
                  {images.map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      className={`pd-dot ${i === active ? "is-active" : ""}`}
                      onClick={() => setActive(i)}
                      aria-label={`${i + 1} / ${images.length}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <motion.div
              className="pd-content"
              variants={{
                open: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
                closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
              }}
            >
              <motion.div className="pd-meta" variants={item}>
                <span>({String(index + 1).padStart(2, "0")}) — {t("label")}</span>
                <span className="pd-badges">
                  {project.featured && <span className="pd-badge is-dark">{t("featured")}</span>}
                  {project.private && <span className="pd-badge">{t("private")}</span>}
                </span>
              </motion.div>

              <motion.h2 id="pd-title" className="pd-title" variants={item}>
                {project.title}
              </motion.h2>

              <motion.p className="pd-description" variants={item}>
                {project.description}
              </motion.p>
              {project.longDescription && (
                <motion.p className="pd-text" variants={item}>{project.longDescription}</motion.p>
              )}

              {project.tache?.length > 0 && (
                <motion.div className="pd-block" variants={item}>
                  <div className="pd-label">{t("missions")}</div>
                  <ul className="pd-list">
                    {project.tache.map((task) => (
                      <li key={task}>
                        <AsteriskIcon className="pd-list-icon" color="#0e0e0e" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {project.challenges && project.challenges.length > 0 && (
                <motion.div className="pd-block" variants={item}>
                  <div className="pd-label">{t("challenges")}</div>
                  <ul className="pd-list">
                    {project.challenges.map((c) => (
                      <li key={c}><AsteriskIcon className="pd-list-icon" color="#8d8d8d" />{c}</li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {project.solutions && project.solutions.length > 0 && (
                <motion.div className="pd-block" variants={item}>
                  <div className="pd-label">{t("solutions")}</div>
                  <ul className="pd-list">
                    {project.solutions.map((s) => (
                      <li key={s}><AsteriskIcon className="pd-list-icon" color="#8d8d8d" />{s}</li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {project.technologies?.length > 0 && (
                <motion.div className="pd-block" variants={item}>
                  <div className="pd-label">{t("technologies")}</div>
                  <div className="pd-tags">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="pd-tag">{tech}</span>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div className="pd-actions" variants={item}>
                {project.liveUrl && (
                  <MainButton href={project.liveUrl} target="_blank">{t("live")}</MainButton>
                )}
                {showCode ? (
                  <MainButton href={project.githubUrl} target="_blank" alternate className="is-outlined">{t("code")}</MainButton>
                ) : project.private ? (
                  <span className="pd-note">{t("privateCode")}</span>
                ) : null}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
