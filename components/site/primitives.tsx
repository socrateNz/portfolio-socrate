"use client"

import { motion, useInView, useScroll, useTransform, type MotionValue } from "framer-motion"
import { Fragment, useRef, type ReactNode, type ButtonHTMLAttributes, type MouseEventHandler } from "react"

export const EASE_OUT = [0.19, 1, 0.22, 1] as const

/* ---------- Icons ---------- */

export function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  )
}

export function AsteriskIcon({ className, color = "#0e0e0e" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? "asterisk"} aria-hidden="true" stroke={color} strokeWidth="2.4" strokeLinecap="round">
      <path d="M12 2v20M3.34 7l17.32 10M3.34 17 20.66 7" />
    </svg>
  )
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true" stroke="currentColor" strokeWidth="1.6">
      <path d="M3.5 12.5 12.5 3.5M5 3.5h7.5V11" />
    </svg>
  )
}

/* ---------- Rolling text: two stacked copies, slides up on hover of a .roll-trigger ancestor ---------- */

export function RollText({ children, className, wrapClassName }: { children: ReactNode; className: string; wrapClassName?: string }) {
  return (
    <span className={`roll ${wrapClassName ?? ""}`}>
      <span className={className}>{children}</span>
      <span className={className} aria-hidden="true">{children}</span>
    </span>
  )
}

/* ---------- Buttons & links ---------- */

type MainButtonProps = {
  children: ReactNode
  href?: string
  alternate?: boolean
  target?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">

export function MainButton({ children, href, alternate, target, className, ...rest }: MainButtonProps) {
  const cls = `main-button roll-trigger ${alternate ? "alternate-button" : ""} ${className ?? ""}`
  const inner = (
    <>
      <RollText className="button-text" wrapClassName="main-button-block">{children}</RollText>
      <StarIcon className="button-icon" />
    </>
  )
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        onClick={rest.onClick as unknown as MouseEventHandler<HTMLAnchorElement>}
      >
        {inner}
      </a>
    )
  }
  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  )
}

export function UnderlineLink({
  children,
  href,
  alternate,
  arrow = true,
  target,
}: {
  children: ReactNode
  href: string
  alternate?: boolean
  arrow?: boolean
  target?: string
}) {
  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className={`underline-link roll-trigger ${alternate ? "is-alternate" : ""}`}
    >
      <span className="link-wrapper">
        <RollText className="link-text" wrapClassName="link-text-wrap">{children}</RollText>
        {arrow && (
          <span className="arrow-link-wrap" style={{ color: alternate ? "#fff" : "#0e0e0e" }}>
            <ArrowIcon className="arrow-link _01" />
            <ArrowIcon className="arrow-link _02" />
          </span>
        )}
      </span>
      <span className="underline-wrap">
        <span className="underline-item" />
      </span>
    </a>
  )
}

/* ---------- Subtitle marquee ("Driven by design — ") ---------- */

export function SubtitleMarquee({ text, muted }: { text: string; muted?: boolean }) {
  const row = (hidden: boolean) => (
    <div className="subtitle-row" aria-hidden={hidden || undefined}>
      {[0, 1, 2].map((i) => (
        <div key={i} className={`subtitle ${muted ? "text-color-secondary" : ""}`}>{text}</div>
      ))}
    </div>
  )
  return (
    <div className="subtitle-component">
      <AsteriskIcon color={muted ? "#8d8d8d" : "#0e0e0e"} />
      <div className="subtitle-block">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

/* ---------- Heading reveal: words slide up from a mask when scrolled into view ---------- */

type Segment = { text: string; className?: string; br?: boolean }

export function SplitHeading({
  segments,
  className,
  as: Tag = "h2",
  delay = 0,
}: {
  segments: Segment[]
  className: string
  as?: "h1" | "h2" | "p"
  delay?: number
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" })
  let index = 0

  return (
    <Tag ref={ref} className={className}>
      {segments.map((seg, s) => (
        <span key={s} className={seg.className}>
          {seg.text.split(" ").filter(Boolean).map((word, w) => {
            const i = index++
            return (
              <Fragment key={w}>
                <span className="split-word">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={inView ? { y: "0%" } : undefined}
                    transition={{ duration: 1.1, ease: EASE_OUT, delay: delay + i * 0.06 }}
                  >
                    {word}
                  </motion.span>
                </span>{" "}
              </Fragment>
            )
          })}
          {seg.br && <br />}
        </span>
      ))}
    </Tag>
  )
}

/* ---------- Paragraph reveal: each word brightens with scroll progress ---------- */

function ScrollWord({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1])
  return (
    <motion.span style={{ opacity }}>
      {word}{" "}
    </motion.span>
  )
}

export function ScrollRevealText({ segments, className }: { segments: Segment[]; className: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] })
  const words = segments.flatMap((seg) =>
    seg.text.split(" ").filter(Boolean).map((word) => ({ word, className: seg.className }))
  )

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => {
        const start = i / words.length
        return (
          <span key={i} className={w.className}>
            <ScrollWord word={w.word} progress={scrollYProgress} range={[start, start + 1 / words.length]} />
          </span>
        )
      })}
    </p>
  )
}

/* ---------- Fade-up on view ---------- */

export function FadeUp({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Rolling number (odometer) ---------- */

export function RollNumber({ value, prefix, suffix }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" })
  const digits = String(value).padStart(2, "0").split("").map(Number)

  return (
    <div ref={ref} className="roll-number-component" aria-label={`${prefix ?? ""}${value}${suffix ?? ""}`}>
      {prefix && <div className="stats-number alternate">{prefix}</div>}
      {digits.map((d, i) => (
        <motion.div
          key={i}
          className="roll-number-wrap"
          aria-hidden="true"
          initial={{ y: "0%" }}
          animate={inView ? { y: `-${d * 10}%` } : undefined}
          transition={{ duration: 2.2, ease: EASE_OUT, delay: 0.15 * i }}
        >
          {Array.from({ length: 10 }, (_, n) => (
            <div key={n} className="stats-number">{n}</div>
          ))}
        </motion.div>
      ))}
      {suffix && <div className="stats-number alternate">{suffix}</div>}
    </div>
  )
}
