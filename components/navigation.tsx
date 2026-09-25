"use client"

import { useEffect, useState, useTransition } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { EASE_OUT, MainButton, RollText } from "@/components/site/primitives"

export function Navigation() {
  const t = useTranslations("site.nav")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : ""
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => {
      document.documentElement.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const quickLinks = [
    { href: "#home", label: t("home") },
    { href: "#about", label: t("about") },
    { href: "#projects", label: t("projects") },
    { href: "#contact", label: t("contact") },
  ]

  const menuLinks = [
    { href: "#home", label: t("home") },
    { href: "#about", label: t("about") },
    { href: "#projects", label: t("projects") },
    { href: "#skills", label: t("skills") },
    { href: "#contact", label: t("contact") },
  ]

  const switchLocale = (next: string) => {
    if (next === locale) return
    startTransition(() => router.replace(pathname, { locale: next as (typeof routing.locales)[number] }))
  }

  return (
    <>
      <div className="navbar" role="banner">
        <div className="padding-global">
          <div className="container-large">
            <div className="nav-content-wrapper">
              <motion.div
                className="nav-background"
                initial={false}
                animate={{ opacity: scrolled || open ? 1 : 0, scaleX: scrolled || open ? 1 : 0.96 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
              />

              <div className="logo-wrapper">
                <a href="#home" className="roll-trigger" aria-label="Etarcos Dev" onClick={() => setOpen(false)}>
                  <RollText className="logo-word" wrapClassName="logo-wrap">Etarcos</RollText>
                </a>
                <div className="logo-line" />
                <div className="logo-text">{t("tagline")}</div>
              </div>

              <div className="nav-wrapper">
                <div className="nav-link-block">
                  {quickLinks.map((link) => (
                    <a key={link.href} href={link.href} className="nav-link roll-trigger">
                      <RollText className="nav-text" wrapClassName="nav-text-wrap">{link.label}</RollText>
                    </a>
                  ))}
                  <button
                    type="button"
                    className="nav-link roll-trigger"
                    disabled={isPending}
                    onClick={() => switchLocale(locale === "fr" ? "en" : "fr")}
                    aria-label={locale === "fr" ? "Switch to English" : "Passer en français"}
                  >
                    <RollText className="nav-text" wrapClassName="nav-text-wrap">{locale === "fr" ? "EN" : "FR"}</RollText>
                  </button>
                </div>

                <button
                  type="button"
                  className={`menu-button ${open ? "is-open" : ""}`}
                  aria-label="Menu"
                  aria-expanded={open}
                  onClick={() => setOpen((v) => !v)}
                >
                  <div className="menu-button-container">
                    <div className="menu-button-wrap">
                      <div className="menu-line top" />
                      <div className="menu-line bottom" />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav className="navigation" role="navigation" initial="closed" animate="open" exit="closed">
            <motion.div
              className="navigation-opacity"
              onClick={() => setOpen(false)}
              variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
              transition={{ duration: 0.5 }}
            />
            <div className="navigation-container" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
              <div className="navigation-content-wrap">
                <div className="navigation-content-block">
                  <motion.div
                    className="navigation-background"
                    variants={{ open: { scaleY: 1, scaleX: 1 }, closed: { scaleY: 0, scaleX: 0.6 } }}
                    transition={{ duration: 0.8, ease: EASE_OUT }}
                  />
                  <div className="navigation-content">
                    <div className="navigation-content-list">
                      {menuLinks.map((link, i) => (
                        <div key={link.href} className="navigation-link-block">
                          <motion.a
                            href={link.href}
                            className="navigation-link roll-trigger"
                            onClick={() => setOpen(false)}
                            variants={{ open: { y: "0%" }, closed: { y: "110%" } }}
                            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.15 + i * 0.06 }}
                          >
                            <RollText className="navigation-link-text" wrapClassName="navigation-link-wrap">{link.label}</RollText>
                            <span className="navigation-number">({String(i + 1).padStart(2, "0")})</span>
                          </motion.a>
                        </div>
                      ))}
                    </div>

                    <motion.div
                      className="navigation-footer"
                      variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: 20 } }}
                      transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.45 }}
                    >
                      <MainButton href="#contact" onClick={() => setOpen(false)}>{t("menuCta")}</MainButton>
                      <div className="locale-switch">
                        {routing.locales.map((l) => (
                          <button key={l} type="button" className={l === locale ? "is-active" : ""} onClick={() => switchLocale(l)} disabled={isPending}>
                            {l}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
