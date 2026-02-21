"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"

export function Footer() {
  const t = useTranslations("footer")

  const socialLinks = [
    {
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com/socrateNz",
      label: "GitHub",
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://www.linkedin.com/in/socrate-nzogning-mbonda?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
      label: "LinkedIn",
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      href: "https://x.com/NzogningS",
      label: "Twitter",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      href: "mailto:snzogning0@gmail.com",
      label: "Email",
    },
  ]

  return (
    <footer className="bg-muted/50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {t("title")}
              </span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">{t("description")}</p>
          </div>

          <div className="flex justify-center space-x-4">
            {socialLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Button variant="outline" size="icon" asChild>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                    {link.icon}
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="border-t pt-8">
            <p className="text-muted-foreground text-sm">© 2025 Nzogning Mbonda Socrate. {t("rights")}</p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
