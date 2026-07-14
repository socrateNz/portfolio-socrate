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
      className="max-w-[1440px] w-[calc(100%-2rem)] md:w-full mx-auto relative min-h-[85vh] md:min-h-[80vh] h-full overflow-hidden bg-[#0d0d0d] rounded-3xl mt-24 md:mt-20"
    >
      {/* Radial purple glow behind photo */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div
          style={{
            width: "700px",
            height: "700px",
            background:
              "radial-gradient(circle, rgba(120,60,200,0.35) 0%, rgba(80,30,140,0.15) 45%, transparent 72%)",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Giant name — background typographic layer */}
      <div
        className="absolute inset-0 flex mt-24 md:mt-20 justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <h1
          className="text-white font-black text-center whitespace-pre-line md:whitespace-nowrap"
          style={{
            fontSize: "clamp(4.5rem, 15vw, 15rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
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
          className="relative w-[clamp(260px,60vw,900px)] h-[40vh] sm:h-[50vh] md:h-[clamp(290px,65vh,880px)]"
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
        className="relative flex flex-col justify-between h-full min-h-[85vh] md:min-h-[80vh] p-6 sm:p-8 md:p-12"
        style={{ zIndex: 20 }}
      >
        {/* Top spacer (fixed nav above) */}
        <div />

        {/* Bottom content row */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 sm:gap-6 pb-6 sm:pb-20">
          {/* Left — description + social icons */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="max-w-xs flex flex-col items-center sm:items-start text-center sm:text-left"
          >
            <p className="text-white text-sm leading-relaxed mb-6">
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
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary hover:bg-primary/80 text-white transition-colors duration-200"
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
            <p className="text-white text-sm leading-relaxed mb-5">
              {t("subtitle1")} {t("subtitle2")}
              {/* <span className="text-white/90">{t("subtitle2")}</span> */}
            </p>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary hover:bg-primary/80 text-white text-sm font-semibold transition-colors duration-200"
            >
              {t("contactButton") || "Let's Talk"}
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}