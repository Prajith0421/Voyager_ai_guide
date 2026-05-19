import type { AppLocation, ChatMessage, Place, WeatherData } from '../types'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const DEFAULT_MODEL = 'google/gemini-2.0-flash-001'

function buildSystemPrompt(
  location: AppLocation,
  places: Place[],
  weather: WeatherData | null
): string {
  const categoryCounts = places.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1
    return acc
  }, {})

  const placesSummary = places.slice(0, 100).map((p) => ({
    name: p.name,
    category: p.category,
    address: p.address,
    coordinates: { lat: p.lat, lng: p.lng },
  }))

  return `You are an expert AI local travel guide assistant. You help users explore and understand places conversationally.

CRITICAL RULES:
- ONLY recommend places from the REAL PLACES DATA provided below. Never invent or hallucinate place names.
- Categories in the data include: cafe, restaurant, mall, attraction, park, museum, hotel, nightlife. Check category counts before saying data is missing.
- If the user asks for malls, filter places where category is "mall" and recommend those by name.
- If a category has zero results in the counts below, say so honestly and suggest another category that exists in the data.
- Be conversational, warm, and helpful like a knowledgeable local friend.
- Provide practical tips: best times to visit, what to order, photography angles, etc. when relevant.
- You can create itineraries using ONLY the places in the data.
- Keep responses concise but informative. Use bullet points for lists.

CURRENT LOCATION: ${location.label} (${location.coords.lat}, ${location.coords.lng})
LOCATION SOURCE: ${location.source === 'gps' ? 'User GPS' : 'City search'}

${weather ? `CURRENT WEATHER: ${weather.temperature}°C, ${weather.description}, humidity ${weather.humidity}%, wind ${weather.windSpeed} km/h` : ''}

PLACES BY CATEGORY: ${JSON.stringify(categoryCounts)}

REAL NEARBY PLACES DATA (${places.length} total, showing up to 100):
${JSON.stringify(placesSummary, null, 2)}`
}

export async function askGemini(
  userMessage: string,
  location: AppLocation,
  places: Place[],
  weather: WeatherData | null,
  history: ChatMessage[]
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error(
      'OpenRouter API key not configured. Add VITE_OPENROUTER_API_KEY to your .env file.'
    )
  }

  const model =
    import.meta.env.VITE_OPENROUTER_MODEL?.trim() || DEFAULT_MODEL
  const systemPrompt = buildSystemPrompt(location, places, weather)

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...history.slice(-10).map((m) => ({
      role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: userMessage },
  ]

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AI Local Guide',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      (err as { error?: { message?: string } })?.error?.message ||
        `OpenRouter API error: ${res.status}`
    )
  }

  const data = await res.json()
  const text = data.choices?.[0]?.message?.content

  if (!text) throw new Error('Empty response from AI')
  return text
}
