import { NextResponse } from "next/server"

// Open-Meteo Free Weather API for Douala, Cameroon (Lat: 4.0511, Lon: 9.7679)
export async function GET() {
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=4.0511&longitude=9.7679&current_weather=true",
      { next: { revalidate: 300 } } // cache 5 mins
    )

    if (!res.ok) {
      return NextResponse.json({ city: "Douala", temp: "28°C", condition: "☀️ Ensoleillé" })
    }

    const data = await res.json()
    const temp = Math.round(data.current_weather?.temperature ?? 28)
    const isDay = data.current_weather?.is_day === 1

    return NextResponse.json({
      city: "Douala",
      temperature: temp,
      tempString: `${temp}°C`,
      condition: isDay ? "☀️ Ensoleillé" : "🌙 Nuit claire",
      windspeed: data.current_weather?.windspeed ?? 12,
    })
  } catch (error) {
    return NextResponse.json({ city: "Douala", tempString: "28°C", condition: "☀️ Ensoleillé" })
  }
}
