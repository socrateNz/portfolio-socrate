import { NextResponse } from "next/server"

export async function GET() {
  const token = process.env.VERCEL_API_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID || process.env.VERCEL_ANALYTICS_ID
  const teamId = process.env.VERCEL_TEAM_ID

  // If Vercel Analytics API Token is missing in .env.local
  if (!token || !projectId) {
    return NextResponse.json({
      configured: false,
      provider: "@vercel/analytics",
      message: "Vercel Analytics non lié : définissez VERCEL_API_TOKEN et VERCEL_PROJECT_ID dans .env.local",
      instructions: [
        "1. Générez un token API sur Vercel : https://vercel.com/account/tokens",
        "2. Récupérez le Project ID de votre application dans Vercel Dashboard > Settings > General",
        "3. Ajoutez VERCEL_API_TOKEN=... et VERCEL_PROJECT_ID=... dans .env.local",
      ],
    })
  }

  try {
    const teamParam = teamId ? `&teamId=${teamId}` : ""

    const [statsRes, devicesRes, pagesRes] = await Promise.all([
      fetch(
        `https://api.vercel.com/v1/web/insights/stats?projectId=${projectId}${teamParam}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          next: { revalidate: 300 },
        }
      ),
      fetch(
        `https://api.vercel.com/v1/web/insights/stats/device?projectId=${projectId}${teamParam}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          next: { revalidate: 300 },
        }
      ),
      fetch(
        `https://api.vercel.com/v1/web/insights/stats/path?projectId=${projectId}${teamParam}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          next: { revalidate: 300 },
        }
      ),
    ])

    const statsData = statsRes.ok ? await statsRes.json() : null
    const devicesData = devicesRes.ok ? await devicesRes.json() : null
    const pagesData = pagesRes.ok ? await pagesRes.json() : null

    return NextResponse.json({
      configured: true,
      provider: "@vercel/analytics",
      summary: {
        totalSessions: statsData?.pageviews?.value ?? 0,
        uniqueUsers: statsData?.visitors?.value ?? 0,
        bounceRate: statsData?.bounceRate?.value
          ? `${(statsData.bounceRate.value * 100).toFixed(1)}%`
          : "0%",
        avgDuration: statsData?.duration?.value
          ? `${Math.floor(statsData.duration.value / 60)}m ${Math.round(statsData.duration.value % 60)}s`
          : "0s",
      },
      deviceBreakdown: Array.isArray(devicesData?.data)
        ? devicesData.data.map((d: any) => ({
            name: d.key,
            value: d.value,
            color: "#6366f1",
          }))
        : [],
      popularPages: Array.isArray(pagesData?.data)
        ? pagesData.data.slice(0, 5).map((p: any) => ({
            page: p.key,
            views: p.value,
            duration: "--",
            bounce: "--",
          }))
        : [],
    })
  } catch (error) {
    console.error("Vercel Analytics Fetch Error:", error)
    return NextResponse.json({
      configured: false,
      provider: "@vercel/analytics",
      error: "Impossible d'interroger l'API Vercel Analytics.",
    })
  }
}
