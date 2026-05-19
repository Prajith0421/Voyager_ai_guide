import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Place } from '../types'

const RECENT_KEY = 'localguide_recent_searches'

interface AppUIContextValue {
  selectedPlace: Place | null
  setSelectedPlace: (place: Place | null) => void
  highlightedPlaces: Place[]
  setHighlightedPlaces: (places: Place[]) => void
  focusPlacesOnMap: (places: Place[]) => void
  recentSearches: string[]
  addRecentSearch: (query: string) => void
}

const AppUIContext = createContext<AppUIContextValue | null>(null)

export function AppUIProvider({ children }: { children: ReactNode }) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [highlightedPlaces, setHighlightedPlaces] = useState<Place[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY)
      if (stored) setRecentSearches(JSON.parse(stored))
    } catch {
      /* ignore */
    }
  }, [])

  const addRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return
    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((s) => s !== trimmed)].slice(0, 8)
      localStorage.setItem(RECENT_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const focusPlacesOnMap = useCallback((places: Place[]) => {
    setHighlightedPlaces(places)
    if (places.length >= 1) {
      setSelectedPlace(places[0])
    } else {
      setSelectedPlace(null)
    }
  }, [])

  const value = useMemo(
    () => ({
      selectedPlace,
      setSelectedPlace,
      highlightedPlaces,
      setHighlightedPlaces,
      focusPlacesOnMap,
      recentSearches,
      addRecentSearch,
    }),
    [selectedPlace, highlightedPlaces, focusPlacesOnMap, recentSearches, addRecentSearch]
  )

  return <AppUIContext.Provider value={value}>{children}</AppUIContext.Provider>
}

export function useAppUI() {
  const ctx = useContext(AppUIContext)
  if (!ctx) throw new Error('useAppUI must be used within AppUIProvider')
  return ctx
}
