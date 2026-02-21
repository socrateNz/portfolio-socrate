"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useTranslations } from "next-intl"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ExternalLink,
    Github,
    Lock,
    X,
    Calendar,
    User,
    Layers,
    CheckCircle2,
    ArrowRight,
    Star,
    GitFork,
    Eye
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
    longDescription?: string
    challenges?: string[]
    solutions?: string[]
    screenshots?: string[]
    date?: string
    role?: string
    team?: string[]
    stats?: {
        stars?: number
        forks?: number
        views?: number
    }
}

interface QuickViewProps {
    project: Project | null
    isOpen: boolean
    onClose: () => void
}

export function QuickView({ project, isOpen, onClose }: QuickViewProps) {
    const t = useTranslations("projects")
    const router = useRouter()
    const [activeImage, setActiveImage] = useState(0)
    const [isImageLoading, setIsImageLoading] = useState(true)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // Reset active image when project changes
    useEffect(() => {
        setActiveImage(0)
        setIsImageLoading(true)
    }, [project])

    if (!project) return null

    const images = [project.image, ...(project.screenshots || [])]

    const handleImageLoad = () => {
        setIsImageLoading(false)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={onClose}>
                    <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden bg-background/95 backdrop-blur-xl">
                        <DialogHeader className="sr-only">
                            <DialogTitle>{project.title}</DialogTitle>
                            <DialogDescription>{project.description}</DialogDescription>
                        </DialogHeader>

                        {/* Close button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-4 z-50 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </Button>

                        <div className="flex flex-col h-full">
                            {/* Image gallery */}
                            <div className="relative h-[300px] md:h-[400px] bg-muted/30">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeImage}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative w-full h-full"
                                    >
                                        {isImageLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                                                <div className="animate-pulse text-muted-foreground">Loading...</div>
                                            </div>
                                        )}
                                        <Image
                                            src={images[activeImage] || "/placeholder-project.jpg"}
                                            alt={project.title}
                                            fill
                                            className={`object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'
                                                }`}
                                            onLoad={handleImageLoad}
                                            priority
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Image navigation dots */}
                                {images.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                        {images.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveImage(index)}
                                                className={`w-2 h-2 rounded-full transition-all ${activeImage === index
                                                    ? 'w-6 bg-primary'
                                                    : 'bg-white/50 hover:bg-white/80'
                                                    }`}
                                                aria-label={`View image ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Featured badge */}
                                {project.featured && (
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-primary/90 backdrop-blur-sm gap-1">
                                            <Star className="h-3 w-3 fill-current" />
                                            Featured Project
                                        </Badge>
                                    </div>
                                )}

                                {/* Private badge */}
                                {project.private && (
                                    <div className="absolute top-4 right-16">
                                        <Badge variant="secondary" className="gap-1">
                                            <Lock className="h-3 w-3" />
                                            Private Repository
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <ScrollArea className="flex-1 p-6">
                                <div className="space-y-6">
                                    {/* Header */}
                                    <div>
                                        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                            {project.title}
                                        </h2>

                                        {/* Meta info */}
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            {project.date && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>{project.date}</span>
                                                </div>
                                            )}
                                            {project.role && (
                                                <div className="flex items-center gap-1">
                                                    <User className="h-4 w-4" />
                                                    <span>{project.role}</span>
                                                </div>
                                            )}
                                            {project.team && project.team.length > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Layers className="h-4 w-4" />
                                                    <span>Team of {project.team.length}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick stats */}
                                    {project.stats && (
                                        <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                                            {project.stats.stars !== undefined && (
                                                <div className="flex items-center gap-2">
                                                    <Star className="h-4 w-4 text-yellow-500" />
                                                    <span className="font-semibold">{project.stats.stars}</span>
                                                    <span className="text-sm text-muted-foreground">stars</span>
                                                </div>
                                            )}
                                            {project.stats.forks !== undefined && (
                                                <div className="flex items-center gap-2">
                                                    <GitFork className="h-4 w-4 text-blue-500" />
                                                    <span className="font-semibold">{project.stats.forks}</span>
                                                    <span className="text-sm text-muted-foreground">forks</span>
                                                </div>
                                            )}
                                            {project.stats.views !== undefined && (
                                                <div className="flex items-center gap-2">
                                                    <Eye className="h-4 w-4 text-green-500" />
                                                    <span className="font-semibold">{project.stats.views}</span>
                                                    <span className="text-sm text-muted-foreground">views</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Tabs for details */}
                                    <Tabs defaultValue="overview" className="w-full">
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="overview">Overview</TabsTrigger>
                                            <TabsTrigger value="challenges">Challenges</TabsTrigger>
                                            <TabsTrigger value="tech">Technologies</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="overview" className="pt-4">
                                            <div className="space-y-4">
                                                <p className="text-lg leading-relaxed">
                                                    {project.description}
                                                </p>
                                                {project.longDescription && (
                                                    <p className="text-muted-foreground leading-relaxed">
                                                        {project.longDescription}
                                                    </p>
                                                )}

                                                {/* Tasks / Responsibilities */}
                                                {project.tache && project.tache.length > 0 && (
                                                    <div className="mt-4">
                                                        <h4 className="font-semibold mb-3">Key Responsibilities</h4>
                                                        <div className="grid gap-2">
                                                            {project.tache.map((task, index) => (
                                                                <div key={index} className="flex items-start gap-2">
                                                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                                    <span>{task}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="challenges" className="pt-4">
                                            <div className="space-y-6">
                                                {project.challenges && project.challenges.length > 0 && (
                                                    <div>
                                                        <h4 className="font-semibold mb-3">Challenges Faced</h4>
                                                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                                            {project.challenges.map((challenge, index) => (
                                                                <li key={index}>{challenge}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {project.solutions && project.solutions.length > 0 && (
                                                    <div>
                                                        <h4 className="font-semibold mb-3">Solutions Implemented</h4>
                                                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                                            {project.solutions.map((solution, index) => (
                                                                <li key={index}>{solution}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="tech" className="pt-4">
                                            <div className="space-y-4">
                                                <h4 className="font-semibold mb-3">Technologies Used</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.technologies.map((tech, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="outline"
                                                            className="px-3 py-1 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
                                                        >
                                                            {tech}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                {/* Team members if any */}
                                                {project.team && project.team.length > 0 && (
                                                    <>
                                                        <Separator className="my-4" />
                                                        <h4 className="font-semibold mb-3">Team Members</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {project.team.map((member, index) => (
                                                                <Badge key={index} variant="secondary">
                                                                    {member}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </TabsContent>
                                    </Tabs>

                                    {/* Links */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <Button
                                            className="flex-1 group"
                                            disabled={project.private}
                                            onClick={() => window.open(project.githubUrl, '_blank')}
                                        >
                                            <Github className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                                            View Source Code
                                            {project.private && <Lock className="ml-2 h-4 w-4" />}
                                        </Button>

                                        {project.liveUrl && (
                                            <Button
                                                variant="default"
                                                className="flex-1 group"
                                                onClick={() => window.open(project.liveUrl, '_blank')}
                                            >
                                                <ExternalLink className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                                Live Demo
                                            </Button>
                                        )}
                                    </div>

                                    {/* View full details link */}
                                    <div className="text-center pt-2">
                                        <Button
                                            variant="link"
                                            className="group"
                                            onClick={() => {
                                                onClose()
                                                router.push(`/projects/${project._id}`)
                                            }}
                                        >
                                            View Full Project Details
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    )
}