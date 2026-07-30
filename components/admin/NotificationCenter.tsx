"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  Mail,
  FolderPlus,
  Award,
  Sparkles,
  X,
  Trash2,
  CheckCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  category: "visitor" | "message" | "cv" | "project" | "certificate" | "server" | "deploy"
  read: boolean
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Nouveau message d'un Recruteur",
    description: "Marc Durand (Engineering Director @ Meta) vous a envoyé une proposition de rôle Lead Architect.",
    time: "Il y a 5 min",
    category: "message",
    read: false,
  },
  {
    id: "2",
    title: "Déploiement Vercel réussi",
    description: "Production Build #482 deployé avec succès sur socrate.dev (Next.js 16.1 App Router).",
    time: "Il y a 18 min",
    category: "deploy",
    read: false,
  },
  {
    id: "3",
    title: "Téléchargement CV Executive",
    description: "Un recruteur localisé à San Francisco (IP: 192.0.2.45) a téléchargé votre CV en version PDF.",
    time: "Il y a 42 min",
    category: "cv",
    read: false,
  },
  {
    id: "4",
    title: "Nouveau Visiteur Détecté",
    description: "Session active en provenance de Seattle, USA (Origine: LinkedIn Referral).",
    time: "Il y a 1h",
    category: "visitor",
    read: true,
  },
  {
    id: "5",
    title: "Nouveau Projet Publié",
    description: "Le projet 'Multi-Agent RAG Orchestrator' a été rendu public avec documentation.",
    time: "Il y a 3h",
    category: "project",
    read: true,
  },
  {
    id: "6",
    title: "Alerte Serveur Auto-résolue",
    description: "Spike de latence sur l'API MongoDB (350ms). Les métriques sont revenues sous les 40ms.",
    time: "Il y a 5h",
    category: "server",
    read: true,
  },
  {
    id: "7",
    title: "Certificat Validé",
    description: "AWS Certified Solutions Architect Professional ajouté aux badges vérifiés du portfolio.",
    time: "Hier 16:30",
    category: "certificate",
    read: true,
  },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const [filter, setFilter] = React.useState<string>("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read
    if (filter === "messages") return n.category === "message"
    if (filter === "system") return n.category === "server" || n.category === "deploy"
    return true
  })

  const getCategoryIcon = (category: NotificationItem["category"]) => {
    switch (category) {
      case "message":
        return <Mail className="h-4 w-4 text-pink-500" />
      case "deploy":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case "cv":
        return <FileText className="h-4 w-4 text-sky-500" />
      case "visitor":
        return <UserCheck className="h-4 w-4 text-indigo-500" />
      case "project":
        return <FolderPlus className="h-4 w-4 text-purple-500" />
      case "certificate":
        return <Award className="h-4 w-4 text-amber-500" />
      case "server":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <Bell className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 glass-panel border-l border-zinc-200/80 dark:border-zinc-800/80">
        <SheetHeader className="p-4 border-b border-zinc-200/60 dark:border-zinc-800/60 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-base font-semibold">Centre de Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">
                {unreadCount} non lues
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-8 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              >
                <CheckCheck className="h-3.5 w-3.5 mr-1" />
                Tout lire
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="p-3 border-b border-zinc-200/40 dark:border-zinc-800/40">
          <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
            <TabsList className="grid grid-cols-4 w-full h-8 p-0.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
              <TabsTrigger value="all" className="text-xs rounded-md">
                Toutes
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs rounded-md">
                Non lues
              </TabsTrigger>
              <TabsTrigger value="messages" className="text-xs rounded-md">
                Messages
              </TabsTrigger>
              <TabsTrigger value="system" className="text-xs rounded-md">
                Système
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="h-[calc(100vh-140px)] p-4">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-400">
              <Sparkles className="h-8 w-8 mb-2 stroke-1 opacity-50" />
              <p className="text-sm font-medium">Aucune notification dans cette catégorie</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`relative group p-3.5 rounded-xl border transition-all ${
                      notification.read
                        ? "bg-white/40 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 text-zinc-500"
                        : "bg-white dark:bg-zinc-900 border-indigo-500/30 dark:border-indigo-500/30 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 shrink-0">
                        {getCategoryIcon(notification.category)}
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <h4 className={`text-xs font-semibold truncate ${!notification.read ? "text-zinc-900 dark:text-white" : ""}`}>
                            {notification.title}
                          </h4>
                          <span className="text-[10px] text-zinc-400 shrink-0">{notification.time}</span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                          {notification.description}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-400 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {!notification.read && (
                      <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-indigo-500" />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
