"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Settings, User, Bell, Key, Shield, Sun, Moon, Laptop, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function SettingsView() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const [emailNotifs, setEmailNotifs] = React.useState(true)
  const [githubSync, setGithubSync] = React.useState(true)
  const [aiAutopilot, setAiAutopilot] = React.useState(true)

  const handleSave = () => {
    toast({
      title: "Paramètres Sauvegardés ⚙️",
      description: "Les modifications ont été enregistrées dans votre profil.",
    })
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-zinc-400" />
          Paramètres du Système Dashboard
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Configuration des intégrations, thèmes et préférences de notification
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Appearance Settings */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 uppercase tracking-wider text-xs">
            <Sun className="h-4 w-4 text-amber-500" /> Apparence & Mode d'Affichage
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold ${
                theme === "light" ? "border-indigo-500 bg-indigo-500/10 text-indigo-500" : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
              }`}
            >
              <Sun className="h-5 w-5 text-amber-500" /> Mode Clair
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold ${
                theme === "dark" ? "border-indigo-500 bg-indigo-500/10 text-indigo-500" : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
              }`}
            >
              <Moon className="h-5 w-5 text-indigo-400" /> Mode Sombre
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold ${
                theme === "system" ? "border-indigo-500 bg-indigo-500/10 text-indigo-500" : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
              }`}
            >
              <Laptop className="h-5 w-5 text-zinc-400" /> Système
            </button>
          </div>
        </div>

        {/* Notifications & Télémétrie */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 uppercase tracking-wider text-xs">
            <Bell className="h-4 w-4 text-pink-500" /> Notifications & Synchronisation
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-semibold">Alertes Recruteurs par Email</Label>
                <p className="text-[11px] text-zinc-500">Recevoir un email immédiat quand un recruteur envoie un message.</p>
              </div>
              <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-semibold">Synchronisation GitHub Automatique</Label>
                <p className="text-[11px] text-zinc-500">Synchroniser la grille de contributions et les stars chaque heure.</p>
              </div>
              <Switch checked={githubSync} onCheckedChange={setGithubSync} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-semibold">AI Copilot Autopilot</Label>
                <p className="text-[11px] text-zinc-500">Générer automatiquement des suggestions d'amélioration SEO.</p>
              </div>
              <Switch checked={aiAutopilot} onCheckedChange={setAiAutopilot} />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs gap-1.5 rounded-xl">
          <Save className="h-4 w-4" /> Enregistrer les Modifications
        </Button>
      </div>
    </div>
  )
}
