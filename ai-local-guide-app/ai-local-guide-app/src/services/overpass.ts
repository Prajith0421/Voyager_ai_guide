import type { Coordinates, Place, PlaceCategory } from '../types'
import { fetchNearbyPlacesFromGeoapify } from './geoapify'

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

export async function fetchNearbyPlaces(lat: number, lon: number) {
  const around = `(around:5000,${lat},${lon})`
  const query = `
  [out:json][timeout:30];
  (
    node["amenity"="restaurant"]${around};
    node["amenity"="cafe"]${around};
    node["amenity"="bar"]${around};
    node["amenity"="nightclub"]${around};
    node["tourism"="attraction"]${around};
    node["tourism"="museum"]${around};
    node["tourism"="hotel"]${around};
    node["leisure"="park"]${around};
    node["shop"="mall"]${around};
    node["shop"="shopping_centre"]${around};
    way["shop"="mall"]${around};
    way["shop"="shopping_centre"]${around};
    way["amenity"="restaurant"]${around};
    way["tourism"="museum"]${around};
  );
  out center 120;
  `

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  })

  const data = await response.json()
  return data.elements
}

function guessCategory(tags: Record<string, string>): PlaceCategory {
  if (tags.amenity === 'cafe') return 'cafe'
  if (tags.amenity === 'restaurant') return 'restaurant'
  if (tags.tourism === 'museum') return 'museum'
  if (tags.tourism === 'hotel') return 'hotel'
  if (tags.tourism === 'attraction') return 'attraction'
  if (tags.leisure === 'park') return 'park'
  if (tags.shop === 'mall' || tags.shop === 'shopping_centre') return 'mall'
  if (tags.amenity === 'bar' || tags.amenity === 'nightclub') return 'nightlife'
  return 'attraction'
}

function elementToPlace(
  element: Record<string, unknown>,
  category: PlaceCategory
): Place | null {
  const tags = element.tags as Record<string, string> | undefined
  if (!tags?.name) return null

  const lat =
    (element.lat as number) ??
    (element.center as { lat: number } | undefined)?.lat
  const lng =
    (element.lon as number) ??
    (element.center as { lon: number } | undefined)?.lon
  if (lat == null || lng == null) return null

  const address = [
    tags['addr:street'],
    tags['addr:housenumber'],
    tags['addr:city'],
  ]
    .filter(Boolean)
    .join(' ')

  return {
    id: `${element.type}-${element.id}`,
    name: tags.name,
    category,
    lat,
    lng,
    address: address || undefined,
    tags,
  }
}

export function mapElementsToPlaces(
  elements: Record<string, unknown>[]
): Place[] {
  const seen = new Set<string>()
  const places: Place[] = []

  for (const element of elements) {
    const tags = element.tags as Record<string, string> | undefined
    if (!tags) continue

    const category = guessCategory(tags)
    const place = elementToPlace(element, category)
    if (!place || seen.has(place.id)) continue

    seen.add(place.id)
    places.push(place)
  }

  return places.sort((a, b) => a.name.localeCompare(b.name))
}

export async function fetchNearbyPlacesForApp(
  coords: Coordinates
): Promise<Place[]> {
  if (import.meta.env.VITE_GEOAPIFY_API_KEY) {
    try {
      const geoapifyPlaces = await fetchNearbyPlacesFromGeoapify(coords)
      if (geoapifyPlaces.length > 0) return geoapifyPlaces
    } catch (err) {
      console.warn('Geoapify places fetch failed, using Overpass:', err)
    }
  }

  const elements = await fetchNearbyPlaces(coords.lat, coords.lng)
  return mapElementsToPlaces(elements)
}
