"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  Github,
  Code2,
  Terminal,
  Cpu,
  Sparkles,
  Calendar
} from "lucide-react";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("hero");

  const techStack = [
    { name: "React", icon: "⚛️", color: "from-cyan-500 to-blue-500" },
    { name: "Node.js", icon: "🟢", color: "from-green-500 to-emerald-500" },
    { name: "TypeScript", icon: "📘", color: "from-blue-500 to-indigo-500" },
    { name: "Python", icon: "🐍", color: "from-yellow-500 to-amber-500" },
  ];

  const stats = [
    { value: "5+", label: t("year"), icon: <Code2 className="h-4 w-4" /> },
    { value: "30+", label: t("project"), icon: <Cpu className="h-4 w-4" /> },
    { value: "∞", label: t("debug"), icon: <Terminal className="h-4 w-4" /> },
  ];

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pt-5"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background/50 backdrop-blur-sm mb-8"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{t("available")}</span>
          </motion.div>

          {/* Main title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                {t("title")}
              </span>
              <br />
              <span className="text-foreground">{t("subtitle1")}</span>
              <br />
              <span className="relative">
                {t("subtitle2")}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute -right-4 bottom-0 text-primary"
                >
                  _
                </motion.span>
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            {t("description") || "Full-stack developer crafting robust web applications with clean code and exceptional user experiences."}
          </motion.p>

          {/* Tech stack pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3 justify-center mb-10"
          >
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${tech.color} rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity`}></div>
                <div className="relative px-4 py-2 rounded-full border bg-background/80 backdrop-blur-sm hover:border-primary transition-colors flex items-center gap-2">
                  <span>{tech.icon}</span>
                  <span className="text-sm font-medium">{tech.name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button size="lg" className="group relative overflow-hidden" asChild>
              <a href="#projects">
                <span className="relative z-10 flex items-center">
                  <Code2 className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  {t("seeButton")}
                </span>
                <motion.div
                  className="absolute inset-0 bg-primary"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </a>
            </Button>

            <Button variant="outline" size="lg" className="group" asChild>
              <a href="https://github.com/socrateNz" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                GitHub
              </a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="p-4 rounded-xl border bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-center gap-2 text-primary mb-2">
                  {stat.icon}
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Availability and location */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border bg-background/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span>{t("availability")}</span>
            </div>

            <div className="hidden sm:block">•</div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{t("starting")}</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="cursor-pointer"
            onClick={() => {
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="p-2 rounded-full border bg-background/50 backdrop-blur-sm hover:border-primary transition-colors">
              <ArrowDown className="h-5 w-5 text-muted-foreground" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}