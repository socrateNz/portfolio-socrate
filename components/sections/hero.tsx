"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Mail, MapPin, Briefcase, Star } from "lucide-react";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("hero");
  const images = [
    {
      label: "Le carino",
      img: "/carino.webp",
    },
    {
      label: "VSCode",
      img: "/code.webp",
    },
    {
      label: "pipeline",
      img: "/pipeline.webp",
    },
    {
      label: "uijp2",
      img: "/uijp2.webp",
    },
  ];

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden"
    >
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Nom et titre */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-2xl! md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent w-fit">
                {t("title")}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mt-2 w-full">
                {t("subtitle")}
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-muted-foreground max-w-2xl w-full"
            >
              {t("description")}
            </motion.p>

            {/* Boutons d'action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="group" asChild>
                <a href="#projects">
                  <Star className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  {t("projects")}
                </a>
              </Button>
              <Button variant="outline" size="lg" className="group" asChild>
                <a href="#contact">
                  <Mail className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  {t("contactButton")}
                </a>
              </Button>
            </motion.div>

            {/* Informations de localisation et disponibilité */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col md:flex-row gap-6 items-center text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{t("base")}</span>
              </div>
              <div className="hidden md:block">•</div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>{t("availability")}</span>
              </div>
            </motion.div>

            {/* Spécialisations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex flex-col md:flex-row gap-6 items-center"
            >
              <div className="text-center">
                <p className="text-lg font-semibold">
                  Product Design + Frontend
                </p>
                <p className="text-sm text-muted-foreground">
                  Design systems, web apps
                </p>
              </div>
              <div className="hidden md:block">•</div>
              <div className="text-center">
                <p className="text-lg font-semibold">Currently available</p>
                <p className="text-sm text-muted-foreground">
                  Starting mid-September
                </p>
              </div>
            </motion.div>

            {/* Statistiques */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md"
            >
              <div className="text-center p-4 rounded-lg border border-border bg-card/50">
                <p className="text-4xl font-bold text-primary">20+</p>
                <p className="text-sm text-muted-foreground mt-2">Projects</p>
              </div>
              <div className="text-center p-4 rounded-lg border border-border bg-card/50">
                <p className="text-4xl font-bold text-primary">3 yrs</p>
                <p className="text-sm text-muted-foreground mt-2">Experience</p>
              </div>
              {/* <div className="text-center p-4 rounded-lg border border-border bg-card/50">
              <p className="text-4xl font-bold text-primary">20</p>
              <p className="text-sm text-muted-foreground mt-2">Startups</p>
            </div> */}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            >
              <ArrowDown className="h-6 w-6 text-muted-foreground" />
            </motion.div>
          </motion.div>
        </div>

        {/* Photo de profil - Arrondie de 20px */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative grid grid-cols-2 gap-5 items-center justify-center flex-shrink-0 w-fit"
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={`${image.img}?height=300&width=300`}
              alt={image.label}
              className="max-w-[300px] h-auto aspect-square rounded-[20px] border-4 border-primary/20 shadow-xl object-cover hover:scale-110 transition-transform duration-300 ease-in-out"
            />
          ))}
          {/* <div className="absolute inset-0 rounded-[20px] bg-gradient-to-tr from-primary/20 to-transparent"></div> */}
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}
