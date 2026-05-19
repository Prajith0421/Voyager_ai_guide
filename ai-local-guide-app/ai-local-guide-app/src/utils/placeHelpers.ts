import type { Place, PlaceCategory } from '../types'

export const CATEGORY_META: Record<
  PlaceCategory,
  { label: string; color: string; gradient: string; icon: string }
> = {
  cafe: {
    label: 'Cafe',
    color: '#f59e0b',
    gradient: 'from-amber-500/20 to-orange-600/10',
    icon: '☕',
  },
  restaurant: {
    label: 'Restaurant',
    color: '#ef4444',
    gradient: 'from-red-500/20 to-rose-600/10',
    icon: '🍽',
  },
  attraction: {
    label: 'Attraction',
    color: '#8b5cf6',
    gradient: 'from-violet-500/20 to-purple-600/10',
    icon: '📍',
  },
  park: {
    label: 'Park',
    color: '#22c55e',
    gradient: 'from-emerald-500/20 to-green-600/10',
    icon: '🌳',
  },
  mall: {
    label: 'Mall',
    color: '#3b82f6',
    gradient: 'from-blue-500/20 to-indigo-600/10',
    icon: '🛍',
  },
  museum: {
    label: 'Museum',
    color: '#ec4899',
    gradient: 'from-pink-500/20 to-fuchsia-600/10',
    icon: '🏛',
  },
  nightlife: {
    label: 'Nightlife',
    color: '#a855f7',
    gradient: 'from-purple-500/20 to-violet-600/10',
    icon: '🌙',
  },
  hotel: {
    label: 'Hotel',
    color: '#06b6d4',
    gradient: 'from-cyan-500/20 to-teal-600/10',
    icon: '🏨',
  },
}

export function placeDescription(place: Place): string {
  const tags = place.tags ?? {}
  const cuisine = tags.cuisine
  const opening = tags.opening_hours
  const parts = [place.address, cuisine, opening].filter(Boolean)
  return parts[0] ?? `A ${CATEGORY_META[place.category].label.toLowerCase()} in your area`
}

export const TRENDING_CITIES = [
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.006 },
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Barcelona', country: 'Spain', lat: 41.3874, lng: 2.1686 },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
]
