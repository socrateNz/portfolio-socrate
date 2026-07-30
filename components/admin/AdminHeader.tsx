"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  Search,
  Sun,
  Moon,
  Clock,
  CloudSun,
  Plus,
  Download,
  ChevronRight,
  User,
  LogOut,
  Settings,
  Sparkles,
  Command,
  Laptop,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationCenter } from "./NotificationCenter"
import { useToast } from "@/hooks/use-toast"

interface AdminHeaderProps {
  activeTab: string
  onOpenCommand: () => void
  onNavigate: (tabId: string) => void
  onLogout: () => void
}

const TAB_TITLES: Record<string, { title: string; category: string }> = {
  dashboard: { title: "Command Center", category: "Vue d'ensemble" },
  analytics: { title: "Analytics & Telemetry", category: "Performances" },
  projects: { title: "Projets & Réalisations", category: "Portfolio" },
  github: { title: "Panneau GitHub Telemetry", category: "Code & Activity" },
  "ai-insights": { title: "AI Copilot & Portfolio Insights", category: "Intelligence" },
  messages: { title: "Messages Recruteurs & Contacts", category: "Communications" },
  cv: { title: "CV Executive & Certifications", category: "Compétences" },
  settings: { title: "Paramètres du Système", category: "Configuration" },
}

export function AdminHeader({ activeTab, onOpenCommand, onNavigate, onLogout }: AdminHeaderProps) {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [timeString, setTimeString] = React.useState<string>("")

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeString(
        now.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const currentTabInfo = TAB_TITLES[activeTab] || { title: "Dashboard", category: "Admin" }

  const [weatherString, setWeatherString] = React.useState<string>("Douala 28°C ☀️")

  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch("/api/weather")
        if (res.ok) {
          const data = await res.json()
          setWeatherString(`${data.city || "Douala"} ${data.tempString || "28°C"} ${data.condition ? (data.condition.includes("☀️") ? "☀️" : "🌙") : "☀️"}`)
        }
      } catch (err) {
        // Fallback
      }
    }
    fetchWeather()
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl px-4 sm:px-6 transition-colors">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="text-zinc-400 font-medium">{currentTabInfo.category}</span>
        <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
        <span className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
          {currentTabInfo.title}
        </span>
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={onOpenCommand}
          className="flex h-9 w-full items-center justify-between rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 text-xs text-zinc-400 hover:border-indigo-500/40 hover:bg-white dark:hover:bg-zinc-900 transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
            <span>Recherche globale, projets, actions...</span>
          </div>
          <div className="flex items-center gap-1 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
            <Command className="h-2.5 w-2.5" /> K
          </div>
        </button>
      </div>

      {/* Right Actions & Utilities */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Weather & Time Widget */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-300">
          <CloudSun className="h-3.5 w-3.5 text-amber-500" />
          <span>{weatherString}</span>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <Clock className="h-3.5 w-3.5 text-indigo-500" />
          <span className="font-mono">{timeString || "10:58:43"}</span>
        </div>

        {/* Notifications Center */}
        <NotificationCenter />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
          <span className="sr-only">Changer le thème</span>
        </Button>

        {/* Mobile Command Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenCommand}
          className="md:hidden rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Quick Action Button */}
        <Button
          onClick={() => {
            toast({
              title: "CV Executive PDF téléchargé",
              description: "Socrate_Portfolio_CV_2026.pdf est prêt.",
            })
          }}
          size="sm"
          className="hidden sm:flex rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs gap-1.5 shadow-md shadow-indigo-500/20"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Télécharger CV</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-xl p-0 ring-offset-background transition-opacity hover:opacity-80">
              <Avatar className="h-9 w-9 rounded-xl border border-indigo-500/30">
                <AvatarImage src="/socrate-avatar.png" alt="Socrate" />
                <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold text-xs">
                  SO
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 glass-panel rounded-xl" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-semibold text-zinc-900 dark:text-white leading-none">Socrate</p>
                <p className="text-[11px] leading-none text-zinc-500 dark:text-zinc-400">Senior Full Stack, AI & DevOps</p>
                <Badge variant="outline" className="w-fit mt-1.5 border-emerald-500/30 text-emerald-500 bg-emerald-500/10 text-[10px]">
                  🟢 Disponible pour Opportunités
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onNavigate("settings")} className="cursor-pointer text-xs gap-2">
              <Settings className="h-3.5 w-3.5 text-zinc-400" />
              <span>Paramètres du Compte</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate("ai-insights")} className="cursor-pointer text-xs gap-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>AI Insights Portfolio</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-xs gap-2 text-red-500 focus:text-red-500">
              <LogOut className="h-3.5 w-3.5" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
