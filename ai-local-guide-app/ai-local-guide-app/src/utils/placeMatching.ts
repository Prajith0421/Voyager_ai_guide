import type { Place } from '../types'

/** Match place names mentioned in AI text to real Place records */
export function matchPlacesInText(text: string, places: Place[]): Place[] {
  const lower = text.toLowerCase()
  const matched: Place[] = []
  const seen = new Set<string>()

  const sorted = [...places].sort((a, b) => b.name.length - a.name.length)

  for (const place of sorted) {
    const name = place.name.toLowerCase()
    if (name.length < 3) continue
    if (lower.includes(name) && !seen.has(place.id)) {
      seen.add(place.id)
      matched.push(place)
    }
  }

  return matched
}
