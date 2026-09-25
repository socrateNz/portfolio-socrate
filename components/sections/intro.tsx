"use client"

import { useTranslations } from "next-intl"
import { FadeUp, MainButton, ScrollRevealText, SubtitleMarquee, UnderlineLink } from "@/components/site/primitives"

export function Intro() {
  const t = useTranslations("site.intro")

  return (
    <section className="section-home-intro">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-large">
            <div className="intro-component-grid">
              <div>
                <SubtitleMarquee text={t("subtitle")} />
              </div>
              <div className="intro-content">
                <ScrollRevealText
                  className="intro-text"
                  segments={[
                    { text: t("textStrong") },
                    { text: t("textMuted"), className: "text-color-secondary" },
                  ]}
                />
                <div className="spacer-large" />
                <FadeUp className="intro-description-wrap">
                  <div className="max-width-large">
                    <p className="text-size-medium">{t("description")}</p>
                  </div>
                  <div className="spacer-xlarge" />
                  <div className="button-group-wrap">
                    <MainButton href="#about">{t("primary")}</MainButton>
                    <UnderlineLink href="#contact">{t("secondary")}</UnderlineLink>
                  </div>
                </FadeUp>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
