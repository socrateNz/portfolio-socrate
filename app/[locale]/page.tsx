import { Hero } from "@/components/sections/hero"
import { Stack } from "@/components/sections/stack"
import { Intro } from "@/components/sections/intro"
import { Projects } from "@/components/sections/projects"
import { About } from "@/components/sections/about"
import { Skills } from "@/components/sections/skills"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/sections/footer"
import { Navigation } from "@/components/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Etarcos-Dev - Développeur Web & Mobile",
  description: "Portfolio personnel de développeur web et mobile spécialisé en React, Next.js, et technologies modernes",
};

export default function Home() {
  return (
    <div className="site">
      <Navigation />
      <main>
        <Hero />
        <Stack />
        <Intro />
        <Projects />
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
