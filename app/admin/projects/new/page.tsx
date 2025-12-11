"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  X,
  ArrowLeft,
  Image as ImageIcon,
  Globe,
  Github,
  ListChecks,
  Cpu,
  Star,
  Lock,
  LayoutGrid,
  Loader2,
} from "lucide-react";
import Image from "next/image";

export default function NewProject() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    technologies: "",
    tache: "",
    githubUrl: "",
    liveUrl: "",
    private: false,
    featured: false,
    order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 5MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData((prev) => ({ ...prev, image: data.url }));
        toast({
          title: "Succès",
          description: "Image uploadée avec succès.",
        });
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de l'upload",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'upload de l'image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image.trim()) {
      toast({
        title: "Erreur",
        description: "Une image est requise pour créer un projet.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const projectData = {
        ...formData,
        technologies: formData.technologies
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        tache: formData.tache
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
      };

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Projet créé avec succès.",
        });
        router.push("/admin");
      } else {
        const data = await response.json();
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de la création",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="h-full flex flex-col">
        {/* Header fixe */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => router.push("/admin")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
                <div className="h-8 w-px bg-gray-300" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Nouveau Projet
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Créez un nouveau projet pour votre portfolio
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">
                  <LayoutGrid className="h-4 w-4" />
                  <span className="text-sm font-medium">Édition</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal sans scroll */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full max-w-6xl mx-auto px-6 py-4">
            <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne gauche - Formulaire compact */}
              <div className="lg:col-span-2 h-full overflow-hidden">
                <Card className="h-full border-0 shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <div className="bg-white/20 p-1.5 rounded-lg">
                        <LayoutGrid className="h-5 w-5" />
                      </div>
                      Informations du projet
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-4 h-[calc(100%-73px)] overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Section compacte */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="title"
                            className="text-sm font-medium flex items-center gap-1"
                          >
                            Titre *
                          </Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            required
                            className="h-10 text-sm"
                            placeholder="Titre du projet"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="order"
                            className="text-sm font-medium flex items-center gap-1"
                          >
                            <LayoutGrid className="h-3.5 w-3.5" />
                            Ordre
                          </Label>
                          <Input
                            id="order"
                            type="number"
                            value={formData.order}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                order: parseInt(e.target.value) || 0,
                              }))
                            }
                            className="h-10 text-sm"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium"
                        >
                          Description *
                        </Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          rows={3}
                          required
                          className="text-sm resize-none"
                          placeholder="Décrivez votre projet..."
                        />
                      </div>

                      {/* Image upload compacte */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Image du projet *
                        </Label>
                        <div className="space-y-2">
                          <div className="border border-dashed border-gray-300 rounded-lg p-3 bg-gray-50/50">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <ImageIcon className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm text-gray-700 truncate">
                                    {selectedFile
                                      ? selectedFile.name
                                      : "Sélectionnez une image"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    PNG, JPG, WebP • Max 5MB
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-8 text-xs"
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  Choisir
                                </Button>
                                {selectedFile && (
                                  <Button
                                    type="button"
                                    onClick={handleImageUpload}
                                    disabled={uploading}
                                    size="sm"
                                    className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                                  >
                                    {uploading ? "..." : "Upload"}
                                  </Button>
                                )}
                              </div>
                            </div>
                            <Input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="hidden"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="technologies"
                            className="text-sm font-medium flex items-center gap-1"
                          >
                            <Cpu className="h-3.5 w-3.5" />
                            Technologies
                          </Label>
                          <Input
                            id="technologies"
                            value={formData.technologies}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                technologies: e.target.value,
                              }))
                            }
                            className="h-10 text-sm"
                            placeholder="React, Node.js, ..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="tache"
                            className="text-sm font-medium flex items-center gap-1"
                          >
                            <ListChecks className="h-3.5 w-3.5" />
                            Tâches
                          </Label>
                          <Input
                            id="tache"
                            value={formData.tache}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                tache: e.target.value,
                              }))
                            }
                            className="h-10 text-sm"
                            placeholder="Design, Dev, ..."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="githubUrl"
                            className="text-sm font-medium flex items-center gap-1"
                          >
                            <Github className="h-3.5 w-3.5" />
                            GitHub
                          </Label>
                          <Input
                            id="githubUrl"
                            type="url"
                            value={formData.githubUrl}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                githubUrl: e.target.value,
                              }))
                            }
                            className="h-10 text-sm"
                            placeholder="https://github.com/..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="liveUrl"
                            className="text-sm font-medium flex items-center gap-1"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            Live URL
                          </Label>
                          <Input
                            id="liveUrl"
                            type="url"
                            value={formData.liveUrl}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                liveUrl: e.target.value,
                              }))
                            }
                            className="h-10 text-sm"
                            placeholder="https://..."
                          />
                        </div>
                      </div>

                      {/* Options compactes */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Options</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4 text-gray-600" />
                              <span className="text-sm">Privé</span>
                            </div>
                            <Switch
                              id="private"
                              checked={formData.private}
                              onCheckedChange={(checked) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  private: checked,
                                }))
                              }
                              className="h-4 w-8"
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-gray-600" />
                              <span className="text-sm">En avant</span>
                            </div>
                            <Switch
                              id="featured"
                              checked={formData.featured}
                              onCheckedChange={(checked) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  featured: checked,
                                }))
                              }
                              className="h-4 w-8"
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Colonne droite - Preview et Actions */}
              <div className="h-full flex flex-col gap-6">
                {/* Preview de l'image */}
                <Card className="flex-1 border-0 shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Aperçu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 h-[calc(100%-73px)] flex flex-col">
                    {previewUrl || formData.image ? (
                      <>
                        <div className="flex-1 relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                          <Image
                            src={previewUrl || formData.image}
                            alt="Preview"
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                        <div className="pt-4 mt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              {selectedFile ? (
                                <>
                                  <span className="font-medium">
                                    {selectedFile.name}
                                  </span>
                                  <span className="text-gray-500 ml-2">
                                    (
                                    {(selectedFile.size / 1024 / 1024).toFixed(
                                      2
                                    )}{" "}
                                    MB)
                                  </span>
                                </>
                              ) : formData.image ? (
                                <span className="font-medium">
                                  Image uploadée
                                </span>
                              ) : null}
                            </span>
                            {(previewUrl || formData.image) && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                  setSelectedFile(null);
                                  setPreviewUrl("");
                                  setFormData((prev) => ({
                                    ...prev,
                                    image: "",
                                  }));
                                  if (fileInputRef.current)
                                    fileInputRef.current.value = "";
                                }}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Supprimer
                              </Button>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <ImageIcon className="h-12 w-12" />
                        </div>
                        <p className="text-center font-medium text-gray-600 mb-1">
                          Aucune image sélectionnée
                        </p>
                        <p className="text-center text-sm text-gray-500">
                          Une image est requise pour publier
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Actions fixes */}
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            Créer le projet
                          </p>
                          <p className="text-xs text-gray-500">
                            Tous les champs * sont requis
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            formData.image
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {formData.image ? "Prêt" : "Image manquante"}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => router.push("/admin")}
                          className="flex-1 h-11"
                        >
                          Annuler
                        </Button>
                        <Button
                          type="submit"
                          onClick={handleSubmit}
                          disabled={loading || !formData.image}
                          className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Création...
                            </>
                          ) : (
                            "Créer le projet"
                          )}
                        </Button>
                      </div>

                      <div className="text-center">
                        <p className="text-xs text-gray-500">
                          Le projet sera visible après validation
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
