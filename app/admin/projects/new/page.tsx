"use client"

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Upload, X, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export default function NewProject() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        technologies: '',
        tache: '',
        githubUrl: '',
        liveUrl: '',
        private: false,
        featured: false,
        order: 0
    })
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const { toast } = useToast()

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleImageUpload = async () => {
        if (!selectedFile) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', selectedFile)

        try {
            const token = localStorage.getItem('adminToken')
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            })

            const data = await response.json()

            if (response.ok) {
                setFormData(prev => ({ ...prev, image: data.url }))
                toast({
                    title: "Succès",
                    description: "Image uploadée avec succès.",
                })
            } else {
                toast({
                    title: "Erreur",
                    description: data.error || "Erreur lors de l'upload",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Erreur lors de l'upload de l'image",
                variant: "destructive",
            })
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation côté client
        if (!formData.image.trim()) {
            toast({
                title: "Erreur",
                description: "Une image est requise pour créer un projet.",
                variant: "destructive",
            })
            return
        }

        setLoading(true)

        try {
            const token = localStorage.getItem('adminToken')
            const projectData = {
                ...formData,
                technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
                tache: formData.tache.split(',').map(t => t.trim()).filter(t => t)
            }

            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(projectData),
            })

            if (response.ok) {
                toast({
                    title: "Succès",
                    description: "Projet créé avec succès.",
                })
                router.push('/admin')
            } else {
                const data = await response.json()
                toast({
                    title: "Erreur",
                    description: data.error || "Erreur lors de la création",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Une erreur est survenue.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-muted/30 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <h1 className="text-3xl font-bold mb-8">Nouveau Projet</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Informations du projet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Titre *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Image du projet *</Label>
                                {!formData.image && (
                                    <p className="text-sm text-red-500">Une image est requise</p>
                                )}
                                <div className="space-y-4">
                                    {/* Upload d'image */}
                                    <div className="flex items-center gap-4">
                                        <Input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="flex-1"
                                        />
                                        {selectedFile && (
                                            <Button
                                                type="button"
                                                onClick={handleImageUpload}
                                                disabled={uploading}
                                                size="sm"
                                            >
                                                {uploading ? 'Upload...' : <Upload className="h-4 w-4" />}
                                            </Button>
                                        )}
                                    </div>

                                    {/* Preview de l'image */}
                                    {(previewUrl || formData.image) && (
                                        <div className="relative w-48 h-32 rounded-lg overflow-hidden">
                                            <Image
                                                src={previewUrl || formData.image}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() => {
                                                    setSelectedFile(null)
                                                    setPreviewUrl('')
                                                    setFormData(prev => ({ ...prev, image: '' }))
                                                    if (fileInputRef.current) fileInputRef.current.value = ''
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="technologies">Technologies (séparées par des virgules)</Label>
                                <Input
                                    id="technologies"
                                    value={formData.technologies}
                                    onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tache">Tâches (séparées par des virgules)</Label>
                                <Input
                                    id="tache"
                                    value={formData.tache}
                                    onChange={(e) => setFormData(prev => ({ ...prev, tache: e.target.value }))}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="githubUrl">URL GitHub</Label>
                                    <Input
                                        id="githubUrl"
                                        type="url"
                                        value={formData.githubUrl}
                                        onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="liveUrl">URL Live</Label>
                                    <Input
                                        id="liveUrl"
                                        type="url"
                                        value={formData.liveUrl}
                                        onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="order">Ordre d'affichage</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="private"
                                        checked={formData.private}
                                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, private: checked }))}
                                    />
                                    <Label htmlFor="private">Projet privé</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="featured"
                                        checked={formData.featured}
                                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                                    />
                                    <Label htmlFor="featured">Mis en avant</Label>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Création...' : 'Créer le projet'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/admin')}
                                >
                                    Annuler
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
