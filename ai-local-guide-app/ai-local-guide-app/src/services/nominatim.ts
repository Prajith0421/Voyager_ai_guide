import type { CityResult } from '../types'

const BASE = 'https://nominatim.openstreetmap.org'

const NOMINATIM_HEADERS = {
  'Accept-Language': 'en',
  'User-Agent': 'AI-Local-Guide-App/1.0',
}

export function nominatimItemToCity(item: Record<string, unknown> | undefined): CityResult | null {
  if (!item?.lat || !item?.lon) return null

  const address = item.address as Record<string, string> | undefined
  const name =
    address?.city ||
    address?.town ||
    address?.village ||
    address?.municipality ||
    address?.state ||
    (item.display_name as string)?.split(',')[0]

  if (!name) return null

  const lat = parseFloat(item.lat as string)
  const lng = parseFloat(item.lon as string)
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null

  return {
    name,
    displayName: (item.display_name as string) ?? name,
    lat,
    lng,
    country: address?.country,
  }
}

export async function searchCity(city: string) {
  const response = await fetch(
    `${BASE}/search?q=${encodeURIComponent(city)}&format=json&limit=1&addressdetails=1`,
    { headers: NOMINATIM_HEADERS }
  )

  if (!response.ok) throw new Error('City search failed')

  const data = await response.json()

  return data[0]
}

export async function searchCities(query: string): Promise<CityResult[]> {
  if (!query.trim()) return []

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '1',
    limit: '8',
  })

  const res = await fetch(`${BASE}/search?${params}`, {
    headers: NOMINATIM_HEADERS,
  })

  if (!res.ok) throw new Error('City search failed')

  const data = await res.json()

  const seen = new Set<string>()
  const cities: CityResult[] = []

  for (const item of data as Record<string, unknown>[]) {
    const city = nominatimItemToCity(item)
    if (!city) continue
    const key = `${city.lat.toFixed(4)}-${city.lng.toFixed(4)}`
    if (seen.has(key)) continue
    seen.add(key)
    cities.push(city)
  }

  return cities
}

/** Resolve a free-text query to the best matching city. */
export async function resolveCityQuery(query: string): Promise<CityResult | null> {
  const trimmed = query.trim()
  if (!trimmed) return null

  const cities = await searchCities(trimmed)
  if (cities.length > 0) return cities[0]

  const single = await searchCity(trimmed)
  return nominatimItemToCity(single)
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'json',
    addressdetails: '1',
  })

  const res = await fetch(`${BASE}/reverse?${params}`, {
    headers: {
      'Accept-Language': 'en',
      'User-Agent': 'AI-Local-Guide-App/1.0',
    },
  })

  if (!res.ok) throw new Error('Reverse geocoding failed')

  const data = await res.json()
  const address = data.address as Record<string, string> | undefined

  const city =
    address?.city || address?.town || address?.village || address?.suburb
  const country = address?.country

  if (city && country) return `${city}, ${country}`
  return (data.display_name as string).split(',').slice(0, 2).join(', ')
}
