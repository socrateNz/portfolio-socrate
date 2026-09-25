"use client"

import { useEffect, useRef, useState, type MouseEvent } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Github, Linkedin, Twitter } from "lucide-react"
import { useTranslations } from "next-intl"
import { EASE_OUT } from "@/components/site/primitives"

const TRAIL_IMAGES = ["/carino.webp", "/uijp2.webp", "/pipeline.webp", "/code.webp", "/etarcosold.webp"]
const TITLE = "Etarcos"

const socialLinks = [
  { icon: Github, href: "https://github.com/socrateNz", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/socrate-nzogning-mbonda/?skipRedirect=true", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/socrateNz", label: "X / Twitter" },
]

type TrailItem = { id: number; x: number; y: number; src: string }

export function Hero() {
  const t = useTranslations("site.hero")
  const services = t.raw("services") as string[]
  const [serviceIndex, setServiceIndex] = useState(0)
  const [trail, setTrail] = useState<TrailItem[]>([])
  const last = useRef({ x: 0, y: 0, img: 0, id: 0 })

  useEffect(() => {
    const id = setInterval(() => setServiceIndex((i) => (i + 1) % services.length), 2200)
    return () => clearInterval(id)
  }, [services.length])

  // Image trail: drop a new image every 100px of mouse travel (same rule as the reference GSAP script)
  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (window.matchMedia("(hover: none)").matches) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    if (Math.abs(x - last.current.x) < 100 && Math.abs(y - last.current.y) < 100) return
    last.current.x = x
    last.current.y = y
    last.current.img = (last.current.img + 1) % TRAIL_IMAGES.length
    const item = { id: ++last.current.id, x, y, src: TRAIL_IMAGES[last.current.img] }
    setTrail((items) => [...items.slice(-7), item])
    setTimeout(() => setTrail((items) => items.filter((i) => i.id !== item.id)), 1300)
  }

  return (
    <header id="home" className="section-home-header" onMouseMove={onMouseMove}>
      <div className="header-component-grid">
        <div className="background-video-wrap">
          <motion.img
            src="/profil.webp"
            alt=""
            className="background-media"
            initial={{ scale: 1.25 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 2.4, ease: EASE_OUT }}
          />
          <div className="video-overlay" />
        </div>

        <div className="trail-layer" aria-hidden="true">
          <AnimatePresence>
            {trail.map((item) => (
              <motion.div key={item.id} className="trail-item" style={{ x: item.x, y: item.y }}>
                <motion.img
                  src={item.src}
                  alt=""
                  initial={{ opacity: 0, scale: 0.5, y: 0 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 1], y: ["0rem", "0rem", "0rem", "8rem"] }}
                  transition={{ duration: 1.3, times: [0, 0.4, 0.62, 1], ease: "easeOut" }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="header-content-wrap">
          <div className="header-title-wrap">
            <motion.div
              className="copyright-symbol"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              ®
            </motion.div>
            <h1 className="header-title" aria-label={TITLE}>
              {TITLE.split("").map((char, i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.3 + i * 0.06 }}
                >
                  {char}
                </motion.span>
              ))}
            </h1>
          </div>
          <motion.div
            className="header-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.9 }}
          >
            {t("description")}
          </motion.div>
        </div>

        <div className="padding-global header-bottom-slot">
          <div className="container-large">
            <motion.div
              className="header-bottom-wrap"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: EASE_OUT, delay: 1.1 }}
            >
              <div className="header-inner-grid">
                <div className="social-list">
                  {socialLinks.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="social-link roll-trigger">
                      <span className="roll social-icon-wrap">
                        <s.icon className="social-icon" />
                        <s.icon className="social-icon" aria-hidden="true" />
                      </span>
                    </a>
                  ))}
                </div>

                <div className="service-marquee-component" aria-live="polite">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={serviceIndex}
                      className="marquee-service-text"
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: "-100%", opacity: 0 }}
                      transition={{ duration: 0.8, ease: EASE_OUT }}
                    >
                      {services[serviceIndex]}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="header-scroll-hint">(Scroll ↓)</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  )
}
