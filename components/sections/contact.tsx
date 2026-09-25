"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import { useTranslations } from "next-intl"
import { FadeUp, MainButton, SplitHeading, SubtitleMarquee, UnderlineLink } from "@/components/site/primitives"

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6 38V26.5C6 16.4 11.2 10.3 21.6 8l1.8 4.1c-5.6 1.7-8.6 5-9 9.9H21V38H6Zm21 0V26.5C27 16.4 32.2 10.3 42.6 8l1.8 4.1c-5.6 1.7-8.6 5-9 9.9H42V38H27Z" />
    </svg>
  )
}

export function Contact() {
  const t = useTranslations("site.contact")
  const legacy = useTranslations("contact")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus("idle")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error("Erreur d'envoi")
      setStatus("success")
      setFormData({ name: "", email: "", message: "" })
    } catch {
      setStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <section id="contact" className="section-home-testimonial">
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-section-large">
            <div className="top-grid">
              <div className="max-width-xlarge">
                <SubtitleMarquee text={t("subtitle")} />
                <SplitHeading
                  className="heading-style-h2"
                  segments={[
                    { text: t("title1"), br: true },
                    { text: t("title2"), className: "text-color-secondary" },
                  ]}
                />
              </div>
            </div>

            <div className="spacer-xlarge" />

            <div className="testimonial-component-grid">
              <FadeUp className="testimonial-video-wrap">
                <div className="testimonial-media">
                  <img src="/moi.jpg" alt="Nzogning Mbonda Socrate" loading="lazy" />
                </div>
                <div className="client-block">
                  <div className="client-content-wrap">
                    <div className="client-info-block">
                      <div className="text-size-small text-weight-semibold">Nzogning Mbonda Socrate</div>
                      <div className="text-size-small">
                        <span className="status-dot" />
                        {t("role")} — {t("location")}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.1} className="testimonial-content-item">
                <div className="testimonial-content-block">
                  <div>
                    <QuoteIcon className="quote-icon" />
                    <h3 className="testimonial-title">{t("cardTitle")}</h3>
                    <p className="testimonial-text">{t("cardText")}</p>
                    <div className="contact-list">
                      <UnderlineLink href="mailto:snzogning0@gmail.com">snzogning0@gmail.com</UnderlineLink>
                      <UnderlineLink href="tel:+237656954474">+237 6 56 95 44 74</UnderlineLink>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="contact-form">
                    <label className="form-field">
                      <span className="form-label">{t("name")}</span>
                      <input className="form-input" name="name" value={formData.name} onChange={handleChange} placeholder={legacy("namePlaceholder")} required />
                    </label>
                    <label className="form-field">
                      <span className="form-label">{t("email")}</span>
                      <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder={legacy("emailPlaceholder")} required />
                    </label>
                    <label className="form-field">
                      <span className="form-label">{t("message")}</span>
                      <textarea className="form-input" name="message" rows={4} value={formData.message} onChange={handleChange} placeholder={legacy("messagePlaceholder")} required />
                    </label>
                    <div>
                      <MainButton type="submit" disabled={isLoading}>{isLoading ? t("sending") : t("send")}</MainButton>
                    </div>
                    {status !== "idle" && (
                      <p className={`form-status ${status === "success" ? "is-success" : "is-error"}`} role="status">
                        {status === "success" ? legacy("successMessage") : legacy("errorMessage")}
                      </p>
                    )}
                  </form>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
