import { Hero } from "@/components/sections/hero"
import { Stack } from "@/components/sections/stack"
import { Intro } from "@/components/sections/intro"
import { Projects } from "@/components/sections/projects"
import { About } from "@/components/sections/about"
import { Skills } from "@/components/sections/skills"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/sections/footer"
import { Navigation } from "@/components/navigation"

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
