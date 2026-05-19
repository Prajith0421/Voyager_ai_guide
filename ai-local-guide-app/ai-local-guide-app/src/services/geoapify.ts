import type { Coordinates, Place, PlaceCategory } from '../types'

const BASE = 'https://api.geoapify.com/v2/places'
const RADIUS_M = 5000
const LIMIT_PER_REQUEST = 80

/** Valid Geoapify category groups (invalid cats cause 400 → silent Overpass fallback). */
const CATEGORY_BATCHES = [
  'commercial.shopping_mall,commercial.department_store,commercial.marketplace',
  'commercial.supermarket,catering.cafe,catering.restaurant,catering.bar,catering.fast_food',
  'tourism.attraction,tourism.sights,leisure.park',
  'accommodation.hotel,entertainment,healthcare.hospital,public_transport',
]

function mapGeoapifyCategory(categories: string): PlaceCategory {
  const c = categories.toLowerCase()
  if (c.includes('cafe') || c.includes('coffee')) return 'cafe'
  if (c.includes('restaurant') || c.includes('fast_food')) return 'restaurant'
  if (
    c.includes('shopping_mall') ||
    c.includes('department_store') ||
    c.includes('marketplace')
  ) {
    return 'mall'
  }
  if (c.includes('supermarket') || c.includes('convenience')) return 'mall'
  if (c.includes('museum') || c.includes('gallery')) return 'museum'
  if (c.includes('park') || c.includes('garden') || c.includes('nature_reserve')) {
    return 'park'
  }
  if (c.includes('hotel') || c.includes('hostel') || c.includes('motel')) return 'hotel'
  if (c.includes('bar') || c.includes('pub') || c.includes('nightclub')) return 'nightlife'
  return 'attraction'
}

function featureToPlace(feature: {
  properties?: Record<string, string>
  geometry?: { coordinates?: [number, number] }
}): Place | null {
  const props = feature.properties
  const name = props?.name
  if (!name) return null

  const [lng, lat] = feature.geometry?.coordinates ?? []
  if (lat == null || lng == null) return null

  const categories = props.categories ?? props.category ?? ''
  const category = mapGeoapifyCategory(categories)
  const id = `geoapify-${props.place_id ?? `${lat.toFixed(5)}-${lng.toFixed(5)}-${name}`}`

  const address =
    props.formatted ??
    [props.address_line1, props.address_line2, props.city]
      .filter(Boolean)
      .join(', ')

  return {
    id,
    name,
    category,
    lat,
    lng,
    address: address || undefined,
    tags: { geoapify_categories: categories },
  }
}

async function fetchGeoapifyBatch(
  coords: Coordinates,
  categories: string,
  apiKey: string
): Promise<Place[]> {
  const params = new URLSearchParams({
    categories,
    filter: `circle:${coords.lng},${coords.lat},${RADIUS_M}`,
    limit: String(LIMIT_PER_REQUEST),
    apiKey,
  })

  const res = await fetch(`${BASE}?${params}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg =
      (err as { message?: string })?.message ?? `Geoapify error: ${res.status}`
    throw new Error(msg)
  }

  const data = await res.json()
  const features = (data.features ?? []) as Array<{
    properties?: Record<string, string>
    geometry?: { coordinates?: [number, number] }
  }>

  return features
    .map(featureToPlace)
    .filter((p): p is Place => p != null)
}

export async function fetchNearbyPlacesFromGeoapify(
  coords: Coordinates
): Promise<Place[]> {
  const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY
  if (!apiKey) {
    throw new Error('Geoapify API key not configured.')
  }

  const results = await Promise.allSettled(
    CATEGORY_BATCHES.map((batch) => fetchGeoapifyBatch(coords, batch, apiKey))
  )

  const seen = new Set<string>()
  const places: Place[] = []
  let anySuccess = false

  for (const result of results) {
    if (result.status !== 'fulfilled') continue
    anySuccess = true
    for (const place of result.value) {
      if (seen.has(place.id)) continue
      seen.add(place.id)
      places.push(place)
    }
  }

  if (!anySuccess) {
    const firstError = results.find((r) => r.status === 'rejected') as
      | PromiseRejectedResult
      | undefined
    throw firstError?.reason ?? new Error('Geoapify returned no places')
  }

  return places.sort((a, b) => a.name.localeCompare(b.name))
}
