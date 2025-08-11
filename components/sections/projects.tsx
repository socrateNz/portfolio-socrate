"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Project {
  _id: string
  title: string
  description: string
  image: string
  technologies: string[]
  tache: string[]
  githubUrl: string
  liveUrl: string
  private: boolean
  featured: boolean
  order: number
}

export function Projects() {
  const t = useTranslations("projects")
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Fallback aux projets statiques si pas de données
  // const fallbackProjects = [
  //   {
  //     title: "Tyju InfoSport",
  //     tache: ["Analyse", "Frontend", "Intégration", "Refonte"],
  //     description: t("project1Desc"),
  //     image: "/placeholder.svg?height=200&width=300",
  //     technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Shadcn"],
  //     githubUrl: "https://github.com",
  //     liveUrl: "https://www.tyjuinfosport.com/",
  //     private: true
  //   },
  //   {
  //     title: "Krestdev",
  //     tache: ["Frontend", "Backend", "Intégration", "Refonte"],
  //     description: t("project2Desc"),
  //     image: "/placeholder.svg?height=200&width=300",
  //     technologies: ["NextJs", "Tailwind CSS", "Nodemail"],
  //     githubUrl: "https://github.com",
  //     liveUrl: "https://www.krestdev.com/",
  //     private: true
  //   },
  //   {
  //     title: "Fondation Jeanne Caroline Mfege",
  //     tache: ["Frontend", "Refonte"],
  //     description: t("project3Desc"),
  //     image: "/placeholder.svg?height=200&width=300",
  //     technologies: ["React", "Tailwind CSS"],
  //     githubUrl: "https://github.com",
  //     liveUrl: "https://www.fondationjeannecarolinemfege.org/fr/",
  //     private: true
  //   },
  //   {
  //     title: "CVGen Pro",
  //     tache: ["Design", "Frontend", "Intégration", "Backend", "Refonte"],
  //     description: t("project3Desc"),
  //     image: "/placeholder.svg?height=200&width=300",
  //     technologies: ["NextJs", "NodeJs", "NodeMail", "Tailwind CSS"],
  //     githubUrl: "https://github.com",
  //     liveUrl: "",
  //     private: true
  //   },
  //   {
  //     title: "Saga Africa",
  //     tache: ["Frontend", "Refonte"],
  //     description: t("project3Desc"),
  //     image: "/placeholder.svg?height=200&width=300",
  //     technologies: ["NextJs", "Tailwind CSS"],
  //     githubUrl: "https://github.com",
  //     liveUrl: "https://www.saga-africa.com/",
  //     private: true
  //   },
  //   {
  //     title: "Le Carino Pizzeria",
  //     tache: ["Frontend", "Refonte"],
  //     description: t("project3Desc"),
  //     image: "/placeholder.svg?height=200&width=300",
  //     technologies: ["NextJs", "Tailwind CSS"],
  //     githubUrl: "https://github.com",
  //     liveUrl: "https://www.le-carino.com/",
  //     private: true
  //   },
  //   {
  //     title: "Crea Consult",
  //     tache: ["Frontend", "Refonte"],
  //     description: t("project3Desc"),
  //     image: "/placeholder.svg?height=200&width=300",
  //     technologies: ["NextJs", "Tailwind CSS"],
  //     githubUrl: "https://github.com",
  //     liveUrl: "https://betcreaconsult.com/fr",
  //     private: true
  //   },
  //   {
  //     title: "Loumo Shop",
  //     tache: ["Frontend", "Intégration", "Refonte",],
  //     description: t("project3Desc"),
  //     image: "/placeholder.svg?height=200&width=300",
  //     technologies: ["NextJs", "Tailwind CSS"],
  //     githubUrl: "https://github.com",
  //     liveUrl: "https://home.loumoshop.com/",
  //     private: true
  //   },
  //   {
  //     title: "Krest Holding",
  //     tache: ["Frontend", "Refonte",],
  //     description: t("project3Desc"),
  //     image: "/placeholder.svg?height=200&width=300",
  //     technologies: ["NextJs", "Tailwind CSS"],
  //     githubUrl: "https://github.com",
  //     liveUrl: "https://www.krestholding.com/",
  //     private: true
  //   },

  // ]

  const router = useRouter()

  // Utiliser les projets de la base de données ou les projets de fallback
  const displayProjects = projects.length > 0
   ? projects :  []
  //  fallbackProjects

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="text-lg">Chargement des projets...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow group">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <div className="flex flex-row gap-2">
                    {project.tache.map((tache, tacheIndex) => (
                      <p key={tacheIndex} className="text-xs underline text-muted-foreground">
                        {tache}
                      </p>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex gap-2">
                  <Button onClick={() => router.push(project.githubUrl)} className={`${project.private && "cursor-not-allowed"}`} disabled={project.private} variant="outline" size="sm">
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </Button>
                  <Button size="sm" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {t("liveDemo")}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
