"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ExternalLink,
  Github,
  Lock,
  Sparkles,
  FolderGit2,
  Star,
  GitFork,
  Eye,
  Calendar,
  ArrowRight
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { QuickView } from "../QuickView"

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
  category?: string
  stats?: {
    stars?: number
    forks?: number
    views?: number
  }
  date?: string
}

export function Projects() {
  const t = useTranslations("projects")
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [open, setOpen] = useState(false)

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

  const router = useRouter()

  const handleSelected = (project: Project) => {
    setSelectedProject(project)
    setOpen(true)
  }

  // Extraire toutes les technologies uniques
  const allTechnologies = Array.from(
    new Set(projects.flatMap(p => p.technologies))
  ).sort()

  // Filtrer les projets
  const filteredProjects = projects.filter(project => {
    if (filter === "featured" && !project.featured) return false
    if (selectedTech && !project.technologies.includes(selectedTech)) return false
    return true
  })

  // Trier par ordre d'affichage
  const sortedProjects = [...filteredProjects].sort((a, b) => a.order - b.order)

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-full">
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-40 left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <FolderGit2 className="h-4 w-4 mr-2 text-primary" />
            {t("badge") || "Portfolio"}
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t("title")}
            </span>
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            {t("subtitle")}
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{projects.length}</div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {projects.filter(p => p.featured).length}
              </div>
              <div className="text-sm text-muted-foreground">Featured</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {allTechnologies.length}
              </div>
              <div className="text-sm text-muted-foreground">Technologies</div>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <Tabs defaultValue="all" className="w-full max-w-md mx-auto" onValueChange={setFilter}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Tech filters */}
            <div className="flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
              <Badge
                variant={selectedTech === null ? "default" : "outline"}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedTech(null)}
              >
                All
              </Badge>
              {allTechnologies.slice(0, 8).map((tech) => (
                <Badge
                  key={tech}
                  variant={selectedTech === tech ? "default" : "outline"}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                >
                  {tech}
                </Badge>
              ))}
              {allTechnologies.length > 8 && (
                <Badge variant="outline" className="cursor-pointer">
                  +{allTechnologies.length - 8}
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        {/* Projects grid */}
        {sortedProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FolderGit2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or check back later.
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                  {/* Image with overlay */}
                  <CardHeader className="p-0 relative">
                    <div className="relative overflow-hidden aspect-video">
                      <Image
                        src={project.image || "/placeholder-project.jpg"}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Featured badge */}
                      {project.featured && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-primary/90 backdrop-blur-sm gap-1">
                            <Sparkles className="h-3 w-3" />
                            Featured
                          </Badge>
                        </div>
                      )}

                      {/* Private badge */}
                      {project.private && (
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className="gap-1">
                            <Lock className="h-3 w-3" />
                            Private
                          </Badge>
                        </div>
                      )}

                      {/* Quick view overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="backdrop-blur-sm"
                          onClick={() => handleSelected(project)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Quick View
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* Title and tasks */}
                    <div className="mb-3">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      {project.tache && project.tache.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {project.tache.map((tache, i) => (
                            <span key={i} className="text-xs text-muted-foreground">
                              {tache}{i < project.tache.length - 1 ? " • " : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies.slice(0, 4).map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 4}
                        </Badge>
                      )}
                    </div>

                    {/* Project stats (optional) */}
                    {project.stats && (
                      <div className="flex gap-3 text-xs text-muted-foreground mb-4">
                        {project.stats.stars && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {project.stats.stars}
                          </div>
                        )}
                        {project.stats.forks && (
                          <div className="flex items-center gap-1">
                            <GitFork className="h-3 w-3" />
                            {project.stats.forks}
                          </div>
                        )}
                        {project.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {project.date}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-6 pt-0 flex gap-2">
                    <Button
                      onClick={() => router.push(project.githubUrl)}
                      disabled={project.private}
                      variant="outline"
                      size="sm"
                      className="flex-1 group/btn"
                    >
                      <Github className="mr-2 h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                      {t("code") || "Code"}
                    </Button>

                    {project.liveUrl && (
                      <Button
                        size="sm"
                        className="flex-1 group/btn"
                        asChild
                      >
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                          {t("liveDemo")}
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* View all link */}
        {/* {sortedProjects.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button variant="outline" size="lg" className="group">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        )} */}
      </div>
      <QuickView project={selectedProject} isOpen={open} onClose={() => setOpen(false)} />
    </section>
  )
}