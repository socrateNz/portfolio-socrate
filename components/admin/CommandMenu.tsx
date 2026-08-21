"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  LayoutDashboard,
  BarChart3,
  FolderGit2,
  Github,
  Activity,
  Sparkles,
  Mail,
  FileBadge,
  Download,
  Sun,
  Moon,
  Laptop,
  Terminal,
  Zap,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useToast } from "@/hooks/use-toast"

interface CommandMenuProps {
  open: boolean
  setOpen: (open: boolean) => void
  onNavigate: (tabId: string) => void
}

export function CommandMenu({ open, setOpen, onNavigate }: CommandMenuProps) {
  const { setTheme } = useTheme()
  const { toast } = useToast()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, setOpen])

  const runCommand = React.useCallback(
    (command: () => void) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Tapez une commande ou recherchez... (ex: Projets, Analytics, Thème)" />
      <CommandList className="max-h-[380px] p-2">
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
        
        <CommandGroup heading="Navigation Rapide">
          <CommandItem
            onSelect={() => runCommand(() => onNavigate("dashboard"))}
            className="flex items-center gap-2 cursor-pointer rounded-lg p-2 text-sm"
          >
            <LayoutDashboard className="h-4 w-4 text-indigo-500" />
            <span>Dashboard Principal (Command Center)</span>
            <CommandShortcut>⌘H</CommandShortcut>
          </CommandItem>
          
          <CommandItem
            onSelect={() => runCommand(() => onNavigate("analytics"))}
            className="flex items-center gap-2 cursor-pointer rounded-lg p-2 text-sm"
          >
            <BarChart3 className="h-4 w-4 text-sky-500" />
            <span>Analytics & Métriques de Trafic</span>
            <CommandShortcut>⌘A</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => onNavigate("projects"))}
            className="flex items-center gap-2 cursor-pointer rounded-lg p-2 text-sm"
          >
            <FolderGit2 className="h-4 w-4 text-emerald-500" />
            <span>Projets & Réalisations SaaS</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => onNavigate("github"))}
            className="flex items-center gap-2 cursor-pointer rounded-lg p-2 text-sm"
          >
            <Github className="h-4 w-4 text-purple-500" />
            <span>Panneau GitHub Telemetry</span>
            <CommandShortcut>⌘G</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => onNavigate("github-contributions"))}
            className="flex items-center gap-2 cursor-pointer rounded-lg p-2 text-sm"
          >
            <Activity className="h-4 w-4 text-fuchsia-500" />
            <span>Rapport d'Activité GitHub (Contributions)</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => onNavigate("ai-insights"))}
            className="flex items-center gap-2 cursor-pointer rounded-lg p-2 text-sm"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>AI Copilot & Portfolio Diagnostics</span>
            <CommandShortcut>⌘I</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => onNavigate("messages"))}
            className="flex items-center gap-2 cursor-pointer rounded-lg p-2 text-sm"
          >
            <Mail className="h-4 w-4 text-pink-500" />
            <span>Boîte de Réception Recruteurs</span>
            <CommandShortcut>⌘M</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => onNavigate("cv"))}
            className="flex items-center gap-2 cursor-pointer rounded-lg p-2 text-sm"
          >
            <FileBadge className="h-4 w-4 text-blue-500" />
            <span>CV Executive & Certifications</span>
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator className="my-1" />

        <CommandGroup heading="Actions Rapides & Productivité">
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                toast({
                  title: "Téléchargement du CV démarré",
                  description: "Le CV Executive PDF de Socrate a été généré.",
                })
              })
            }
            className="flex items-center gap-2 cursor-pointer rounded-lg p-2 text-sm"
          >
            <Download className="h-4 w-4 text-indigo-400" />
            <span>Télécharger le CV Executive PDF</span>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(() => {
                navigator.clipboard.writeText("contact@socrate-dev.com")
                toast({
                  title: "Email copié !",
                  description: "contact@socrate-dev.com a été copié dans le presse-papier.",
                })
              })
            }
            className="flex items-center gap-2 cursor-pointer rounded-lg p-2 text-sm"
          >
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Copier l'email direct (contact@socrate-dev.com)</span>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(() => {
                toast({
                  title: "Audit IA lancé 🚀",
                  description: "L'analyse complète du portfolio a été mise à jour avec succès.",
                })
                onNavigate("ai-insights")
              })
            }
            className="flex items-center gap-2 cursor-pointer rounded-lg p-2 text-sm"
          >
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span>Exécuter l'audit SEO & IA du Portfolio</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator className="my-1" />

        <CommandGroup heading="Apparence & Thème">
          <CommandItem
            onSelect={() => runCommand(() => setTheme("light"))}
            className="flex items-center gap-2 cursor-pointer rounded-lg p-2 text-sm"
          >
            <Sun className="h-4 w-4 text-amber-500" />
            <span>Activer le Mode Clair (Light)</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => setTheme("dark"))}
            className="flex items-center gap-2 cursor-pointer rounded-lg p-2 text-sm"
          >
            <Moon className="h-4 w-4 text-indigo-400" />
            <span>Activer le Mode Sombre (Dark)</span>
          </CommandItem>

          <CommandItem
            onSelect={() => runCommand(() => setTheme("system"))}
            className="flex items-center gap-2 cursor-pointer rounded-lg p-2 text-sm"
          >
            <Laptop className="h-4 w-4 text-zinc-400" />
            <span>Thème Système Automatique</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
