import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { fetchSavedPlaces, removeSavedPlace } from '../services/supabase'
import type { SavedPlace } from '../types'
import { CATEGORY_META } from '../utils/placeHelpers'

export default function SavedPage() {
  const { user, configured } = useAuth()
  const [places, setPlaces] = useState<SavedPlace[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    fetchSavedPlaces(user.id).then(setPlaces).finally(() => setLoading(false))
  }, [user])

  return (
    <div className="h-screen overflow-y-auto bg-zinc-950 p-6 max-w-5xl mx-auto scrollbar-thin">
      <Link to="/" className="text-xs text-indigo-400 hover:text-indigo-300 mb-6 inline-block">
        ← Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-white mb-2">Saved places</h1>
      <p className="text-sm text-zinc-500 mb-8">
        {user ? `${places.length} saved` : 'Sign in to sync favorites'}
      </p>

      {!configured && (
        <p className="text-sm text-zinc-400">Configure Supabase in .env to enable saving.</p>
      )}

      {user && loading && <p className="text-zinc-500 text-sm">Loading…</p>}

      {user && !loading && places.length === 0 && (
        <p className="text-zinc-500 text-sm">No saved places yet. Save from map popups.</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {places.map((place) => {
          const meta = CATEGORY_META[place.category as keyof typeof CATEGORY_META]
          return (
            <article key={place.id} className="glass rounded-xl p-4">
              <span className="text-2xl">{meta?.icon ?? '📍'}</span>
              <h2 className="font-medium text-white mt-2">{place.name}</h2>
              <p className="text-xs text-indigo-400 capitalize">{place.category}</p>
              <button
                type="button"
                onClick={() =>
                  removeSavedPlace(place.id).then(() =>
                    setPlaces((p) => p.filter((x) => x.id !== place.id))
                  )
                }
                className="mt-3 text-xs text-zinc-500 hover:text-red-400"
              >
                Remove
              </button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
