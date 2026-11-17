// Single source of truth for the tech stack shown on the public site (marquee)
// and in the admin "Compétences" view. Every name must have a logo in
// components/site/tech-logos.ts.
export const STACK_CATEGORIES: { name: string; items: string[] }[] = [
  { name: "Front-end", items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS"] },
  { name: "Mobile", items: ["React Native", "Expo", "Flutter"] },
  { name: "Back-end & données", items: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Prisma", "Supabase"] },
  { name: "Outils", items: ["Docker", "Figma"] },
]

export const STACK_ITEMS = STACK_CATEGORIES.flatMap((c) => c.items)
