// Public URL of the site, used for absolute links in metadata, sitemap and share previews.
// Set NEXT_PUBLIC_SITE_URL for a custom domain; otherwise Vercel's production URL is used.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "")

export const SITE_NAME = "Etarcos Dev"

export const SOCIAL_LINKS = [
  "https://github.com/socrateNz",
  "https://www.linkedin.com/in/socrate-nzogning-mbonda",
  "https://x.com/NzogningS",
]
