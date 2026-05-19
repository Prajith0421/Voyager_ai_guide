import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { getCurrentPosition } from '../services/location'
import { reverseGeocode } from '../services/nominatim'
import { fetchNearbyPlacesForApp } from '../services/overpass'
import { fetchWeather } from '../services/weather'
import type { AppLocation, CityResult, Place, WeatherData } from '../types'

const FALLBACK_CITY: CityResult = {
  name: 'London',
  displayName: 'London, United Kingdom',
  lat: 51.5074,
  lng: -0.1278,
  country: 'United Kingdom',
}

interface LocationContextValue {
  location: AppLocation | null
  places: Place[]
  weather: WeatherData | null
  loadingLocation: boolean
  loadingPlaces: boolean
  loadingWeather: boolean
  error: string | null
  requestGPS: () => Promise<void>
  selectCity: (city: CityResult) => Promise<void>
  refreshPlaces: () => Promise<void>
  clearError: () => void
}

const LocationContext = createContext<LocationContextValue | null>(null)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<AppLocation | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(true)
  const [loadingPlaces, setLoadingPlaces] = useState(false)
  const [loadingWeather, setLoadingWeather] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const initialized = useRef(false)

  const loadDataForCoords = useCallback(
    async (coords: { lat: number; lng: number }, label: string, source: 'gps' | 'search') => {
      setLocation({ coords, label, source })
      setLoadingPlaces(true)
      setLoadingWeather(true)
      setError(null)

      const [placesResult, weatherResult] = await Promise.allSettled([
        fetchNearbyPlacesForApp(coords),
        fetchWeather(coords),
      ])

      if (placesResult.status === 'fulfilled') {
        setPlaces(placesResult.value)
      } else {
        setPlaces([])
        setError('Could not load nearby places. Try searching another city.')
      }

      if (weatherResult.status === 'fulfilled') {
        setWeather(weatherResult.value)
      } else {
        setWeather(null)
      }

      setLoadingPlaces(false)
      setLoadingWeather(false)
    },
    []
  )

  const selectCity = useCallback(
    async (city: CityResult) => {
      setError(null)
      // Update map position immediately; load places/weather in background
      setLocation({
        coords: { lat: city.lat, lng: city.lng },
        label: city.displayName,
        source: 'search',
      })
      try {
        await loadDataForCoords(
          { lat: city.lat, lng: city.lng },
          city.displayName,
          'search'
        )
      } catch {
        setError('Failed to load city data.')
      }
    },
    [loadDataForCoords]
  )

  const requestGPS = useCallback(async () => {
    setLoadingLocation(true)
    setError(null)
    try {
      const coords = await getCurrentPosition()
      const label = await reverseGeocode(coords.lat, coords.lng)
      await loadDataForCoords(coords, label, 'gps')
    } catch {
      await selectCity(FALLBACK_CITY)
    } finally {
      setLoadingLocation(false)
    }
  }, [loadDataForCoords, selectCity])

  const refreshPlaces = useCallback(async () => {
    if (!location) return
    setLoadingPlaces(true)
    try {
      const data = await fetchNearbyPlacesForApp(location.coords)
      setPlaces(data)
    } catch {
      setError('Failed to refresh places.')
    } finally {
      setLoadingPlaces(false)
    }
  }, [location])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    requestGPS()
  }, [requestGPS])

  const value = useMemo(
    () => ({
      location,
      places,
      weather,
      loadingLocation,
      loadingPlaces,
      loadingWeather,
      error,
      requestGPS,
      selectCity,
      refreshPlaces,
      clearError: () => setError(null),
    }),
    [
      location,
      places,
      weather,
      loadingLocation,
      loadingPlaces,
      loadingWeather,
      error,
      requestGPS,
      selectCity,
      refreshPlaces,
    ]
  )

  return (
    <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
  )
}

export function useLocationContext() {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useLocationContext must be used within LocationProvider')
  return ctx
}
