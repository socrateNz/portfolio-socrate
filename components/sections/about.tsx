"use client"

import { useTranslations } from "next-intl"
import { AsteriskIcon, FadeUp, MainButton, RollNumber, SplitHeading, SubtitleMarquee } from "@/components/site/primitives"

const CUBE_FACES = [
  { face: "front", src: "/carino.webp" },
  { face: "right", src: "/uijp2.webp" },
  { face: "back", src: "/pipeline.webp" },
  { face: "left", src: "/etarcosold.webp" },
  { face: "top", src: "/code.webp" },
  { face: "bottom", src: "/carino.webp" },
]

function StatCard({ value, prefix, suffix, label, text, muted }: { value: number; prefix?: string; suffix?: string; label: string; text: string; muted: string }) {
  return (
    <div className="card-block">
      <div className="stats-grid">
        <div className="stat-number-slot">
          <RollNumber value={value} prefix={prefix} suffix={suffix} />
        </div>
        <div className="stat-label-slot">
          <div className="stat-subtitle">{label}</div>
        </div>
        <div className="stat-line-slot">
          <div className="card-line" />
        </div>
        <div className="stat-text-slot max-width-medium">
          <p className="text-size-regular" style={{ margin: 0 }}>
            {text} <span className="text-color-secondary">{muted}</span>
          </p>
        </div>
        <div className="stat-icon-slot">
          <AsteriskIcon color="#8d8d8d" />
        </div>
      </div>
    </div>
  )
}

export function About() {
  const t = useTranslations("site.about")
  const years = Math.max(1, new Date().getFullYear() - 2022)

  return (
    <section id="about" className="section-home-why-us">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-large">
            <div className="top-grid">
              <div className="max-width-xlarge">
                <SubtitleMarquee text={t("subtitle")} />
                <SplitHeading
                  className="heading-style-h2"
                  segments={[
                    { text: t("title1") },
                    { text: t("title2"), className: "text-color-secondary" },
                  ]}
                />
              </div>
              <FadeUp>
                <MainButton href="#contact">{t("cta")}</MainButton>
              </FadeUp>
            </div>

            <div className="spacer-xlarge" />

            <div className="why-us-component-grid">
              <FadeUp className="why-us-wrap">
                <img src="/code.webp" alt="" className="background-media" />
                <div className="video-overlay" />
                <div className="why-us-grid">
                  <div className="why-us-top-content">
                    <span className="logo-word">Etarcos</span>
                  </div>
                  <div className="_3d-component">
                    <div className="_3d-cube-wrapper">
                      <div className="_3d-cube-box">
                        {CUBE_FACES.map((f) => (
                          <div key={f.face} className={`cube-face ${f.face}`}>
                            <img src={f.src} alt="" loading="lazy" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-align-center">
                    <div className="text-size-regular text-color-alternate">{t("since")}</div>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.1}>
                <StatCard value={30} prefix="+" label={t("stat1Label")} text={t("stat1Text")} muted={t("stat1Muted")} />
              </FadeUp>
              <FadeUp delay={0.2}>
                <StatCard value={years} suffix="+" label={t("stat2Label")} text={t("stat2Text")} muted={t("stat2Muted")} />
              </FadeUp>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
