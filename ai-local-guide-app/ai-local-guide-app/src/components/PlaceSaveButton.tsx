import { useState } from 'react'
import type { Place } from '../types'
import { useAuth } from '../hooks/useAuth'
import { useSavedPlaces } from '../hooks/useSavedPlaces'

interface PlaceSaveButtonProps {
  place: Place
  variant?: 'popup' | 'panel'
}

export default function PlaceSaveButton({ place, variant = 'popup' }: PlaceSaveButtonProps) {
  const { configured } = useAuth()
  const { isSaved, savePlace } = useSavedPlaces()
  const [loading, setLoading] = useState(false)

  const alreadySaved = isSaved(place)

  const panelClass =
    'w-full py-2.5 rounded-xl text-sm font-semibold transition-colors'
  const popupClass = 'mt-2 text-xs font-semibold transition-colors'

  if (!configured) {
    const className =
      variant === 'panel'
        ? `${panelClass} text-slate-400 bg-white/5 border border-white/10 cursor-default`
        : `${popupClass} text-slate-400 cursor-default`
    return (
      <p className={className}>
        {variant === 'panel' ? 'Saving unavailable — check Supabase setup' : 'Saving unavailable'}
      </p>
    )
  }

  const handleSave = async () => {
    if (alreadySaved) return
    setLoading(true)
    try {
      await savePlace(place)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const className =
    variant === 'panel'
      ? `${panelClass} text-white bg-violet-600 hover:bg-violet-500 disabled:bg-emerald-600/80 disabled:hover:bg-emerald-600/80 disabled:cursor-default`
      : `${popupClass} text-violet-300 hover:text-violet-200 disabled:text-emerald-400 disabled:cursor-default`

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={alreadySaved || loading}
      className={className}
    >
      {alreadySaved
        ? 'Saved to collection'
        : loading
          ? 'Saving…'
          : '+ Save to collection'}
    </button>
  )
}
