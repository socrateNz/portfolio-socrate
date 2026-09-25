"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { EASE_OUT } from "@/components/site/primitives"
import { TECH_LOGOS } from "@/components/site/tech-logos"

function TechLogo({ name }: { name: string }) {
  return (
    <span className="partner-lockup">
      <svg viewBox="0 0 24 24" className="partner-logo" fill="currentColor" aria-hidden="true">
        <path d={TECH_LOGOS[name]} />
      </svg>
      <span className="partner-name">{name}</span>
    </span>
  )
}

// Front / back pairs, like the reference partner logos that flip in sequence
const PAIRS: [string, string][] = [
  ["React", "Next.js"],
  ["TypeScript", "JavaScript"],
  ["Node.js", "Express"],
  ["MongoDB", "PostgreSQL"],
  ["React Native", "Expo"],
  ["Tailwind CSS", "Figma"],
  ["Flutter", "Docker"],
  ["Git", "GitHub"],
]

export function Stack() {
  const t = useTranslations("site.stack")
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setFlipped((f) => !f), 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="section-home-partner">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-large" style={{ paddingBottom: 0 }}>
            <div className="detail-text-wrap">
              <div className="detail-text">{t("label")}</div>
            </div>
            <div className="partner-grid">
              {PAIRS.map(([front, back], i) => (
                <motion.div
                  key={front}
                  className="card-container"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 1, ease: EASE_OUT, delay: i * 0.05 }}
                >
                  <motion.div
                    className="card-wrapper"
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1], delay: i * 0.12 }}
                  >
                    <div className="card-side">
                      <TechLogo name={front} />
                    </div>
                    <div className="card-side is-back">
                      <TechLogo name={back} />
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
            <div className="dividing-line" />
          </div>
        </div>
      </div>
    </section>
  )
}
