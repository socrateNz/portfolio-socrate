"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { EASE_OUT, MainButton, RollText, SplitHeading, SubtitleMarquee } from "@/components/site/primitives"

const SKILL_META = [
  { image: "/uijp2.webp", tags: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"] },
  { image: "/pipeline.webp", tags: ["Node.js", "Express", "MongoDB", "PostgreSQL", "API REST"] },
  { image: "/carino.webp", tags: ["React Native", "Expo", "NativeWind", "Flutter"] },
  { image: "/code.webp", tags: ["Git", "GitHub", "VS Code", "Figma", "Docker"] },
]

export function Skills() {
  const t = useTranslations("site.skills")
  const items = t.raw("items") as { title: string; text: string }[]
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section id="skills" className="section-dark">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-large">
            <div className="top-grid">
              <div className="max-width-large">
                <SubtitleMarquee text={t("subtitle")} muted />
                <SplitHeading
                  className="heading-style-h2 text-color-alternate"
                  segments={[
                    { text: t("title1") },
                    { text: t("title2"), className: "text-color-secondary" },
                  ]}
                />
              </div>
              <MainButton href="#projects" alternate>{t("cta")}</MainButton>
            </div>

            <div className="spacer-xlarge" />
            <div className="dark-line" />

            <div>
              {items.map((item, i) => (
                <motion.div
                  key={item.title}
                  className="service-content-grid"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 1, ease: EASE_OUT }}
                >
                  <div className="service-content-item">
                    <div className="service-text">({String(i + 1).padStart(2, "0")})</div>
                  </div>
                  <div className="service-content-item">
                    <RollText className="service-title" wrapClassName="service-title-wrap">{item.title}</RollText>
                    <AnimatePresence>
                      {hovered === i && (
                        <motion.div
                          className="service-image-wrap"
                          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                          animate={{ opacity: 1, scale: 1, rotate: 4 }}
                          exit={{ opacity: 0, scale: 0.6, rotate: -8 }}
                          transition={{ duration: 0.6, ease: EASE_OUT }}
                        >
                          <img src={SKILL_META[i]?.image} alt="" className="service-image" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="service-content-item service-content">
                    <p className="service-text">{item.text}</p>
                    <div className="service-tags">
                      {SKILL_META[i]?.tags.map((tag) => (
                        <span key={tag} className="service-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
