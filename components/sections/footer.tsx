"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Github, Linkedin, Mail, Twitter } from "lucide-react"
import { EASE_OUT, UnderlineLink } from "@/components/site/primitives"

const socialLinks = [
  { icon: Github, href: "https://github.com/socrateNz", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/socrate-nzogning-mbonda?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/NzogningS", label: "Twitter" },
  { icon: Mail, href: "mailto:snzogning0@gmail.com", label: "Email" },
]

export function Footer() {
  const t = useTranslations("site.footer")
  const nav = useTranslations("site.nav")

  const navLinks = [
    { href: "#home", label: nav("home") },
    { href: "#about", label: nav("about") },
    { href: "#projects", label: nav("projects") },
    { href: "#skills", label: nav("skills") },
    { href: "#contact", label: nav("contact") },
  ]

  return (
    <footer className="footer">
      <div className="padding-global">
        <div className="container-large">
          <div className="footer-padding">
            <div className="footer-top-content">
              <h2 className="footer-logo" aria-label="Etarcos">
                {"Etarcos".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    aria-hidden="true"
                    style={{ display: "inline-block" }}
                    initial={{ y: "100%" }}
                    whileInView={{ y: "0%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: EASE_OUT, delay: i * 0.05 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </h2>
            </div>

            <div className="footer-component-grid">
              <div className="footer-list">
                <div className="social-media-wrapper">
                  {socialLinks.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="social-link is-dark roll-trigger">
                      <span className="roll social-icon-wrap">
                        <s.icon className="social-icon" />
                        <s.icon className="social-icon" aria-hidden="true" />
                      </span>
                    </a>
                  ))}
                </div>
                <div className="spacer-small" />
                <div className="text-size-small">Douala, Cameroun</div>
              </div>

              <div className="footer-list is-center">
                <UnderlineLink href="tel:+237656954474">+237 6 56 95 44 74</UnderlineLink>
                <UnderlineLink href="mailto:snzogning0@gmail.com">snzogning0@gmail.com</UnderlineLink>
              </div>

              <div className="footer-list is-right">
                <div className="text-size-regular text-color-secondary">{t("navigation")}</div>
                {navLinks.map((link) => (
                  <UnderlineLink key={link.href} href={link.href} arrow={false}>{link.label}</UnderlineLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="padding-global">
          <div className="container-large">
            <div className="footer-bottom-grid">
              <div className="footer-block">
                <div className="footer-text">Etarcos Dev© {new Date().getFullYear()}</div>
                <div className="footer-text">│</div>
                <div className="footer-text">{t("rights")}</div>
              </div>
              <div className="footer-block">
                <div className="footer-text">{t("builtWith")}</div>
                <div className="footer-text">│</div>
                <UnderlineLink href="#home" alternate>{t("top")}</UnderlineLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
