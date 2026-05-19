import { useState } from 'react'
import type { Place } from '../types'
import { useAuth } from '../hooks/useAuth'
import { savePlace } from '../services/supabase'

interface PlaceSaveButtonProps {
  place: Place
  variant?: 'popup' | 'panel'
}

export default function PlaceSaveButton({ place, variant = 'popup' }: PlaceSaveButtonProps) {
  const { user, configured } = useAuth()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!configured || !user) return null

  const handleSave = async () => {
    setLoading(true)
    try {
      await savePlace(user.id, {
        place_id: place.id,
        name: place.name,
        category: place.category,
        lat: place.lat,
        lng: place.lng,
        address: place.address,
      })
      setSaved(true)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const className =
    variant === 'panel'
      ? 'w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:bg-emerald-600/80 disabled:hover:bg-emerald-600/80 transition-colors'
      : 'mt-2 text-xs font-semibold text-violet-300 hover:text-violet-200 disabled:text-emerald-400 transition-colors'

  return (
    <button type="button" onClick={handleSave} disabled={saved || loading} className={className}>
      {saved ? 'Saved to collection' : loading ? 'Saving…' : '+ Save to collection'}
    </button>
  )
}
