"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Twitter } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function Hero() {
  const t = useTranslations("hero");

  const socialLinks = [
    {
      icon: Twitter,
      href: "https://x.com/socrateNz",
      label: "X / Twitter",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/socrate-nzogning-mbonda/?skipRedirect=true",
      label: "LinkedIn",
    },
    {
      icon: Github,
      href: "https://github.com/socrateNz",
      label: "GitHub",
    },
  ];

  return (
    <section
      id="home"
      className="max-w-[1440px] w-[calc(100%-2rem)] md:w-full mx-auto relative min-h-[620px] sm:min-h-[80vh] h-full overflow-hidden bg-[#0d0d0d] rounded-3xl mt-24 md:mt-20"
    >
      {/* Radial purple glow behind photo */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] md:w-[700px] md:h-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(120,60,200,0.35) 0%, rgba(80,30,140,0.15) 45%, transparent 72%)",
          }}
        />
      </div>

      {/* Giant name — background typographic layer */}
      <div
        className="absolute inset-0 flex mt-12 sm:mt-16 md:mt-20 justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <h1
          className="text-white font-black text-center whitespace-pre-line md:whitespace-nowrap opacity-90 tracking-tighter"
          style={{
            fontSize: "clamp(3.5rem, 14vw, 15rem)",
            lineHeight: 0.85,
            fontFamily: "'Inter', 'Arial Black', sans-serif",
          }}
        >
          Etarcos{"\n"}Dev
        </h1>
      </div>

      {/* Hero photo — middle layer */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <div
          className="relative w-[clamp(240px,75vw,900px)] h-[36vh] sm:h-[48vh] md:h-[clamp(290px,65vh,880px)]"
        >
          <Image
            src="/assets/hero.png"
            alt="Etarcos Dev - Full Stack Developer"
            fill
            style={{ objectFit: "contain", objectPosition: "bottom center" }}
            priority
          />
        </div>
      </motion.div>

      {/* UI overlay — top layer */}
      <div
        className="relative flex flex-col justify-between h-full min-h-[620px] sm:min-h-[80vh] p-5 sm:p-8 md:p-12 bg-gradient-to-t from-[#0d0d0d]/90 via-[#0d0d0d]/30 to-transparent sm:bg-none"
        style={{ zIndex: 20 }}
      >
        {/* Top spacer (fixed nav above) */}
        <div />

        {/* Bottom content row */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 pb-4 sm:pb-12 md:pb-20 pt-20 sm:pt-0">
          {/* Left — description + social icons */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="max-w-xs flex flex-col items-center sm:items-start text-center sm:text-left"
          >
            <p className="text-white text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 drop-shadow-sm">
              {t("description")}
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.93 }}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary hover:bg-primary/80 text-white transition-colors duration-200 shadow-md"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right — tagline + CTA button */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="max-w-xs flex flex-col items-center sm:items-end text-center sm:text-right"
          >
            <p className="text-white text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 drop-shadow-sm">
              {t("subtitle1")} {t("subtitle2")}
            </p>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-colors duration-200 shadow-lg"
            >
              {t("contactButton") || "Let's Talk"}
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}