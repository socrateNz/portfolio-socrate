import type { ReactNode } from "react"
import { DM_Mono, Mona_Sans } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

// Same typefaces as the public site
const monaSans = Mona_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--font-mona" })
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-dm-mono" })

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    // Dark (site black) by default; the header toggle can still switch to light.
    // Separate storage key so the admin choice never leaks into the public site.
    <ThemeProvider attribute="class" defaultTheme="dark" storageKey="admin-theme" disableTransitionOnChange>
      <div className={`${monaSans.variable} ${dmMono.variable} font-sans`}>
        {children}
        <Toaster />
      </div>
    </ThemeProvider>
  )
}
