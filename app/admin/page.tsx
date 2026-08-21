"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { CommandMenu } from "@/components/admin/CommandMenu"

import { HomeDashboardView } from "@/components/admin/HomeDashboardView"
import { AnalyticsView } from "@/components/admin/AnalyticsView"
import { ProjectsView } from "@/components/admin/ProjectsView"
import { GithubHubView } from "@/components/admin/GithubHubView"
import { GithubContributionsView } from "@/components/admin/GithubContributionsView"
import { AiInsightsView } from "@/components/admin/AiInsightsView"
import { MessagesView } from "@/components/admin/MessagesView"
import { CvCertificationsView } from "@/components/admin/CvCertificationsView"
import { SkillsExperienceView } from "@/components/admin/SkillsExperienceView"
import { SettingsView } from "@/components/admin/SettingsView"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<string>("dashboard")
  const [commandOpen, setCommandOpen] = React.useState<boolean>(false)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState<boolean>(false)

  // Verify Auth token or allow demo mode
  React.useEffect(() => {
    const token = localStorage.getItem("adminToken")
    // If no token, set a demo token for full access
    if (!token) {
      localStorage.setItem("adminToken", "demo-executive-token-2026")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <HomeDashboardView onNavigate={setActiveTab} />
      case "analytics":
        return <AnalyticsView />
      case "projects":
        return <ProjectsView />
      case "github":
        return <GithubHubView />
      case "github-contributions":
        return <GithubContributionsView />
      case "ai-insights":
        return <AiInsightsView />
      case "messages":
        return <MessagesView />
      case "cv":
        return <CvCertificationsView />
      case "skills":
        return <SkillsExperienceView />
      case "settings":
        return <SettingsView />
      default:
        return <HomeDashboardView onNavigate={setActiveTab} />
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50/60 dark:bg-zinc-950 font-sans antialiased text-zinc-900 dark:text-zinc-100">
      {/* 1. Linear / Vercel Collapsible Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* 2. Main Content Area */}
      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <AdminHeader
          activeTab={activeTab}
          onOpenCommand={() => setCommandOpen(true)}
          onNavigate={setActiveTab}
          onLogout={handleLogout}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 3. Raycast Style Cmd+K Command Menu */}
      <CommandMenu
        open={commandOpen}
        setOpen={setCommandOpen}
        onNavigate={setActiveTab}
      />
    </div>
  )
}