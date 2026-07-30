import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import PageVisit from "@/models/PageVisit"

export async function POST(request: Request) {
  try {
    await dbConnect()

    const body = await request.json().catch(() => ({}))
    const path = body.path || "/"
    const userAgent = request.headers.get("user-agent") || ""
    const referrer = request.headers.get("referer") || ""
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1"

    await PageVisit.create({
      path,
      userAgent,
      ip,
      referrer,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
