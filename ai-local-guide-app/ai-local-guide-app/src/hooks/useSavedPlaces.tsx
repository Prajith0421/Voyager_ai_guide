import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Place, SavedPlace } from '../types'
import {
  fetchSavedPlaces,
  removeSavedPlace as removeSavedPlaceFromDb,
  savePlace as savePlaceToDb,
} from '../services/supabase'
import { placesMatch, savedPlaceToPlace } from '../utils/placeHelpers'
import { useAuth } from './useAuth'

interface SavedPlacesContextValue {
  savedPlaces: SavedPlace[]
  loading: boolean
  isSaved: (place: Place) => boolean
  savePlace: (place: Place) => Promise<boolean>
  removePlace: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

const SavedPlacesContext = createContext<SavedPlacesContextValue | null>(null)

export function SavedPlacesProvider({ children }: { children: ReactNode }) {
  const { user, configured } = useAuth()
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!user || !configured) {
      setSavedPlaces([])
      return
    }
    setLoading(true)
    try {
      setSavedPlaces(await fetchSavedPlaces(user.id))
    } finally {
      setLoading(false)
    }
  }, [user, configured])

  useEffect(() => {
    refresh()
  }, [refresh])

  const isSaved = useCallback(
    (place: Place) =>
      savedPlaces.some((saved) => placesMatch(savedPlaceToPlace(saved), place)),
    [savedPlaces]
  )

  const savePlace = useCallback(
    async (place: Place) => {
      if (!user || isSaved(place)) return false

      await savePlaceToDb(user.id, {
        place_id: place.id,
        name: place.name,
        category: place.category,
        lat: place.lat,
        lng: place.lng,
        address: place.address,
      })

      await refresh()
      return true
    },
    [user, isSaved, refresh]
  )

  const removePlace = useCallback(
    async (id: string) => {
      await removeSavedPlaceFromDb(id)
      setSavedPlaces((prev) => prev.filter((p) => p.id !== id))
    },
    []
  )

  const value = useMemo(
    () => ({ savedPlaces, loading, isSaved, savePlace, removePlace, refresh }),
    [savedPlaces, loading, isSaved, savePlace, removePlace, refresh]
  )

  return (
    <SavedPlacesContext.Provider value={value}>{children}</SavedPlacesContext.Provider>
  )
}

export function useSavedPlaces() {
  const ctx = useContext(SavedPlacesContext)
  if (!ctx) throw new Error('useSavedPlaces must be used within SavedPlacesProvider')
  return ctx
}
