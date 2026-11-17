"use client"

import { useTranslations } from "next-intl"
import { FadeUp } from "@/components/site/primitives"
import { EVENODD_LOGOS, TECH_LOGOS } from "@/components/site/tech-logos"
import { STACK_ITEMS } from "@/lib/stack"

// Two rows scrolling in opposite directions, built from the shared stack list
const half = Math.ceil(STACK_ITEMS.length / 2)
const ROWS: { items: string[]; reverse?: boolean }[] = [
  { items: STACK_ITEMS.slice(0, half) },
  { items: STACK_ITEMS.slice(half), reverse: true },
]

function TechPill({ name }: { name: string }) {
  return (
    <span className="stack-pill">
      <svg viewBox="0 0 24 24" className="partner-logo" fill="currentColor" aria-hidden="true">
        <path d={TECH_LOGOS[name]} fillRule={EVENODD_LOGOS.has(name) ? "evenodd" : undefined} />
      </svg>
      <span className="partner-name">{name}</span>
    </span>
  )
}

export function Stack() {
  const t = useTranslations("site.stack")

  return (
    <section className="section-home-partner">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-large" style={{ paddingBottom: 0 }}>
            <div className="detail-text-wrap">
              <div className="detail-text">{t("label")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width marquee; screen readers get the plain list instead */}
      <ul className="sr-only">
        {STACK_ITEMS.map((name) => <li key={name}>{name}</li>)}
      </ul>
      <FadeUp className="stack-marquee">
        {ROWS.map((row, r) => (
          <div key={r} className="stack-row" aria-hidden="true">
            <div className={`stack-track ${row.reverse ? "is-reverse" : ""}`}>
              {/* Content duplicated so translating by -50% loops seamlessly */}
              {[0, 1].map((copy) => (
                <div key={copy} className="stack-group">
                  {row.items.map((name) => <TechPill key={name} name={name} />)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </FadeUp>

      <div className="padding-global">
        <div className="container-large">
          <div className="dividing-line" />
        </div>
      </div>
    </section>
  )
}
