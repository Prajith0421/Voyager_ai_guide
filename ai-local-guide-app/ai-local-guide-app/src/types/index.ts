export interface Coordinates {
  lat: number
  lng: number
}

export type PlaceCategory =
  | 'cafe'
  | 'restaurant'
  | 'attraction'
  | 'park'
  | 'mall'
  | 'museum'
  | 'nightlife'
  | 'hotel'

export interface Place {
  id: string
  name: string
  category: PlaceCategory
  lat: number
  lng: number
  address?: string
  tags?: Record<string, string>
}

export interface CityResult {
  name: string
  displayName: string
  lat: number
  lng: number
  country?: string
}

export interface WeatherData {
  temperature: number
  weatherCode: number
  description: string
  humidity: number
  windSpeed: number
  forecast: ForecastDay[]
}

export interface ForecastDay {
  date: string
  maxTemp: number
  minTemp: number
  weatherCode: number
  description: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface SavedPlace {
  id: string
  user_id: string
  place_id: string
  name: string
  category: string
  lat: number
  lng: number
  address?: string
  created_at: string
}

export interface SavedChat {
  id: string
  user_id: string
  title: string
  messages: ChatMessage[]
  location_label: string
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  display_name?: string
  avatar_url?: string
}

export type LocationSource = 'gps' | 'search'

export interface AppLocation {
  coords: Coordinates
  label: string
  source: LocationSource
}
