"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Search,
  Eye,
  EyeOff,
  Star,
  Filter,
  Grid,
  List,
  Download,
  MoreVertical,
  ChevronRight,
  ExternalLink,
  Github,
  Globe,
  Calendar,
  BarChart3,
  RefreshCw
} from 'lucide-react'
import Image from 'next/image'

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
  createdAt: string
  updatedAt?: string
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'featured' | 'private'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    private: 0,
    public: 0
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchProjects()
  }, [router])

  useEffect(() => {
    let filtered = projects
    
    if (search) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase()) ||
        project.technologies.some(tech => 
          tech.toLowerCase().includes(search.toLowerCase())
        )
      )
    }
    
    if (filter === 'featured') {
      filtered = filtered.filter(project => project.featured)
    } else if (filter === 'private') {
      filtered = filtered.filter(project => project.private)
    }
    
    setFilteredProjects(filtered)
    
    // Mettre à jour les statistiques
    setStats({
      total: projects.length,
      featured: projects.filter(p => p.featured).length,
      private: projects.filter(p => p.private).length,
      public: projects.filter(p => !p.private).length
    })
  }, [projects, search, filter])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        // Trier par ordre, puis par date de création
        const sortedProjects = data.sort((a: Project, b: Project) => {
          if (a.order !== b.order) return a.order - b.order
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
        setProjects(sortedProjects)
        setFilteredProjects(sortedProjects)
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les projets.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.')) return

    const token = localStorage.getItem('adminToken')
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Projet supprimé avec succès.",
        })
        fetchProjects()
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le projet.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès.",
    })
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-lg text-gray-700">Chargement des projets...</p>
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="h-full flex flex-col">
        {/* Header fixe */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                  <Grid className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600 text-sm">Gestion de vos projets portfolio</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={fetchProjects}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => router.push('/admin/projects/new')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau projet
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de contrôle */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              {/* Statistiques */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {stats.total} projet{stats.total > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {stats.featured} mis en avant
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
                  <EyeOff className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {stats.private} privé{stats.private > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Contrôles */}
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher un projet..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 w-full md:w-64 h-10 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                    className="h-10"
                  >
                    Tous
                  </Button>
                  <Button
                    variant={filter === 'featured' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('featured')}
                    className="h-10"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    En avant
                  </Button>
                  <Button
                    variant={filter === 'private' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('private')}
                    className="h-10"
                  >
                    <EyeOff className="mr-2 h-4 w-4" />
                    Privés
                  </Button>
                </div>

                <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal sans scroll */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full max-w-7xl mx-auto px-6 py-4">
            {projects.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-6">
                  <Plus className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun projet trouvé</h3>
                <p className="text-gray-600 mb-6 max-w-md">
                  Commencez par créer votre premier projet pour votre portfolio.
                </p>
                <Button
                  onClick={() => router.push('/admin/projects/new')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Créer le premier projet
                </Button>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun résultat</h3>
                <p className="text-gray-600 mb-6">
                  Aucun projet ne correspond à votre recherche.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch('')
                    setFilter('all')
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : viewMode === 'grid' ? (
              // Vue Grid
              <div className="h-full overflow-y-auto pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProjects.map((project) => (
                    <Card key={project._id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          {project.featured && (
                            <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600">
                              <Star className="h-3 w-3 mr-1" />
                              En avant
                            </Badge>
                          )}
                          {project.private && (
                            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Privé
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {project.title}
                          </h3>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            #{project.order}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {project.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.technologies.slice(0, 3).map((tech, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              onClick={() => router.push(`/admin/projects/${project._id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(project._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {project.liveUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8"
                                onClick={() => window.open(project.liveUrl, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                            {project.githubUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8"
                                onClick={() => window.open(project.githubUrl, '_blank')}
                              >
                                <Github className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              // Vue Liste
              <div className="h-full overflow-y-auto">
                <div className="space-y-3">
                  {filteredProjects.map((project) => (
                    <Card key={project._id} className="border-0 shadow-sm hover:shadow transition-shadow">
                      <div className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Image */}
                          <div className="flex-shrink-0 w-24 h-24 relative rounded-lg overflow-hidden">
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          
                          {/* Contenu */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                  {project.title}
                                  <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Ordre: #{project.order}
                                  </span>
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                  {project.featured && (
                                    <Badge variant="secondary" className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs">
                                      <Star className="h-3 w-3 mr-1" />
                                      En avant
                                    </Badge>
                                  )}
                                  {project.private && (
                                    <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                                      <EyeOff className="h-3 w-3 mr-1" />
                                      Privé
                                    </Badge>
                                  )}
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(project.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8"
                                  onClick={() => router.push(`/admin/projects/${project._id}/edit`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDelete(project._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {project.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {project.technologies.slice(0, 5).map((tech, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                              {project.technologies.length > 5 && (
                                <span className="text-xs text-gray-500">
                                  +{project.technologies.length - 5} autres
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <div className="text-xs text-gray-500">
                                    Tâches: {project.tache.length}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {project.liveUrl && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 text-xs"
                                      onClick={() => window.open(project.liveUrl, '_blank')}
                                    >
                                      <Globe className="h-3 w-3 mr-1" />
                                      Voir en ligne
                                    </Button>
                                  )}
                                  {project.githubUrl && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 text-xs"
                                      onClick={() => window.open(project.githubUrl, '_blank')}
                                    >
                                      <Github className="h-3 w-3 mr-1" />
                                      Code source
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-3">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>{filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''} affiché{filteredProjects.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Haut de page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}