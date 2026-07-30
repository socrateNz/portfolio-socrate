"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  BarChart3,
  FolderGit2,
  Github,
  Sparkles,
  Mail,
  FileBadge,
  Briefcase,
  Code2,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Activity,
  Layers,
  Terminal,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  badge?: string
  color?: string
}

const NAV_GROUPS: { groupName: string; items: NavItem[] }[] = [
  {
    groupName: "VUES PRINCIPALES",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-indigo-500" },
      { id: "analytics", label: "Analytics", icon: BarChart3, color: "text-sky-500" },
      { id: "projects", label: "Projets", icon: FolderGit2, color: "text-emerald-500", badge: "28" },
      { id: "github", label: "GitHub Hub", icon: Github, color: "text-purple-500" },
      { id: "ai-insights", label: "AI Insights", icon: Sparkles, color: "text-amber-500", badge: "AI" },
    ],
  },
  {
    groupName: "COMMUNICATION & ASSETS",
    items: [
      { id: "messages", label: "Messages", icon: Mail, color: "text-pink-500", badge: "3" },
      { id: "cv", label: "CV & Certifs", icon: FileBadge, color: "text-blue-500" },
      { id: "skills", label: "Compétences", icon: Code2, color: "text-cyan-500" },
      { id: "settings", label: "Paramètres", icon: Settings, color: "text-zinc-400" },
    ],
  },
]

export function AdminSidebar({ activeTab, setActiveTab, collapsed, setCollapsed }: AdminSidebarProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="relative z-40 flex flex-col h-screen sticky top-0 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl shrink-0 select-none"
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white font-black text-sm shadow-md shadow-indigo-500/20 shrink-0">
              S
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col min-w-0"
              >
                <span className="text-sm font-bold text-zinc-900 dark:text-white leading-none truncate">
                  Socrate OS
                </span>
                <span className="text-[10px] text-zinc-400 font-mono mt-0.5">
                  Executive v2026.4
                </span>
              </motion.div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-7 w-7 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Status Indicator */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-indigo-50/30 dark:bg-indigo-950/20">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 truncate">
                Available for Senior Roles
              </span>
            </div>
          </div>
        )}

        {/* Navigation Item Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV_GROUPS.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {!collapsed && (
                <p className="px-2 mb-2 text-[10px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
                  {group.groupName}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id

                const navButton = (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? "text-white" : item.color || "text-zinc-400"
                      }`}
                    />
                    {!collapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                          isActive
                            ? "bg-white/20 text-white border-transparent"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                )

                if (collapsed) {
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                      <TooltipContent side="right" className="font-medium text-xs">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  )
                }

                return navButton
              })}
            </div>
          ))}
        </div>

        {/* Footer telemetry */}
        <div className="p-3 border-t border-zinc-200/80 dark:border-zinc-800/80">
          {!collapsed ? (
            <div className="flex items-center justify-between rounded-xl bg-zinc-50 dark:bg-zinc-900/60 p-2.5 border border-zinc-200/60 dark:border-zinc-800/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">System Healthy</span>
                  <span className="text-[10px] text-zinc-400 font-mono">99.98% Uptime</span>
                </div>
              </div>
              <Activity className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
            </div>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                System Status: 99.98% Operational
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}
