"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import {
  Code,
  Smartphone,
  Globe,
  Coffee,
  Github,
  ExternalLink,
  Award,
  Zap,
  BookOpen
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export function About() {
  const t = useTranslations("about")

  const features = [
    {
      icon: <Code className="h-6 w-6" />,
      title: t("webDev"),
      description: t("webDevDesc"),
      color: "from-blue-500 to-cyan-500",
      tech: ["React", "Next.js", "Tailwind"]
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: t("mobileDev"),
      description: t("mobileDevDesc"),
      color: "from-green-500 to-emerald-500",
      tech: ["React Native", "Flutter", "Swift"]
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: t("fullStack"),
      description: t("fullStackDesc"),
      color: "from-purple-500 to-pink-500",
      tech: ["Node.js", "PostgreSQL", "GraphQL"]
    },
  ]

  const achievements = [
    {
      icon: <Coffee className="h-4 w-4" />,
      labelKey: "achievements.coffee",
      valueKey: "achievements.coffeeValue"
    },
    {
      icon: <BookOpen className="h-4 w-4" />,
      labelKey: "achievements.articles",
      valueKey: "achievements.articlesValue"
    },
    {
      icon: <Award className="h-4 w-4" />,
      labelKey: "achievements.projects",
      valueKey: "achievements.projectsValue"
    },
  ]

  const timeline = [
    { year: "2023", titleKey: "journey.timeline.2023.title", companyKey: "journey.timeline.2023.company" },
    { year: "2021", titleKey: "journey.timeline.2021.title", companyKey: "journey.timeline.2021.company" },
    { year: "2019", titleKey: "journey.timeline.2019.title", companyKey: "journey.timeline.2019.company" },
  ]

  const focusAreas = [
    { key: "journey.focus.ai" },
    { key: "journey.focus.performance" },
    { key: "journey.focus.accessibility" },
    { key: "journey.focus.web3" },
  ]

  const skills = [
    { nameKey: "skills.react", level: 90 },
    { nameKey: "skills.typescript", level: 85 },
    { nameKey: "skills.node", level: 80 },
    { nameKey: "skills.python", level: 75 },
  ]

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Zap className="h-4 w-4 mr-2 text-primary" />
            {t("badge")}
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t("title")}
            </span>
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column - Bio */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-24 bg-gradient-to-br from-card to-card/50 border-primary/10">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{t("profileName")}</h3>
                  <p className="text-muted-foreground mb-4">{t("profileHandle")}</p>

                  <div className="flex gap-2">
                    <Link href={"https://github.com/socrateNz"}>
                      <Badge variant="secondary" className="gap-1">
                        <Github className="h-3 w-3" /> {t("githubLink")}
                      </Badge>
                    </Link>
                    <Link href={"https://www.linkedin.com/in/socrate-nzogning-mbonda?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"}>
                      <Badge variant="secondary" className="gap-1">
                        <ExternalLink className="h-3 w-3" /> {t("linkedinLink")}
                      </Badge>
                    </Link>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm leading-relaxed">
                    {t("description1")}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("description2")}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("description3")}
                  </p>

                  {/* Quick stats */}
                  <div className="grid grid-cols-3 gap-2 pt-4">
                    {achievements.map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="text-primary mb-1 flex justify-center">
                          {item.icon}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t(item.labelKey)}
                        </p>
                        <p className="font-bold text-sm">
                          {t(item.valueKey)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Middle column - Features */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                          {feature.icon}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3">
                            {feature.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {feature.tech.map((tech, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right column - Journey */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Card className="bg-gradient-to-br from-card to-card/50 border-primary/10">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  {t("journey.title")}
                </h3>

                <div className="space-y-6">
                  {timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-4 before:h-4 before:rounded-full before:bg-primary/30 before:border-2 before:border-primary"
                    >
                      {index < timeline.length - 1 && (
                        <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-gradient-to-b from-primary to-transparent"></div>
                      )}

                      <div className="mb-1 text-sm text-primary font-medium">
                        {item.year}
                      </div>
                      <div className="font-semibold">{t(item.titleKey)}</div>
                      <div className="text-sm text-muted-foreground">{t(item.companyKey)}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Current focus */}
                <div className="mt-8 pt-6 border-t">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    {t("journey.currentFocus")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {focusAreas.map((area, index) => (
                      <Badge key={index}>{t(area.key)}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Skills visualization */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/10">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6 text-center">{t("techStack.title")}</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t(skill.nameKey)}</span>
                      <span className="text-primary">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                        viewport={{ once: true }}
                        className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}