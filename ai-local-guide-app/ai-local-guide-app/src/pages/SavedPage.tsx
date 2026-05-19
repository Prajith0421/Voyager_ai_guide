import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useSavedPlaces } from '../hooks/useSavedPlaces'
import { useAppUI } from '../hooks/useAppUI'
import { useLocationContext } from '../hooks/useLocationContext'
import AnimatedBackground from '../components/ui/AnimatedBackground'
import InteractiveCard from '../components/ui/InteractiveCard'
import { PageTransition, PageTransitionItem } from '../components/ui/PageTransition'
import { IconBookmark } from '../components/ui/Icons'
import type { SavedPlace } from '../types'
import { CATEGORY_META, distanceMeters, savedPlaceToPlace } from '../utils/placeHelpers'

export default function SavedPage() {
  const { configured } = useAuth()
  const { savedPlaces: places, loading, removePlace } = useSavedPlaces()
  const { openPlaceOnDashboard } = useAppUI()
  const { location, selectCity } = useLocationContext()
  const navigate = useNavigate()
  const [openingId, setOpeningId] = useState<string | null>(null)

  const handleOpenPlace = async (saved: SavedPlace) => {
    const place = savedPlaceToPlace(saved)
    openPlaceOnDashboard(place)

    const farFromCurrent =
      !location || distanceMeters(location.coords, place) > 2000

    if (farFromCurrent) {
      await selectCity({
        name: saved.name,
        displayName: saved.address ?? saved.name,
        lat: saved.lat,
        lng: saved.lng,
      })
    }

    navigate('/')
  }

  const handleOpen = async (saved: SavedPlace) => {
    setOpeningId(saved.id)
    try {
      await handleOpenPlace(saved)
    } finally {
      setOpeningId(null)
    }
  }

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden bg-navy-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div className="dashboard-bg" aria-hidden />
      <AnimatedBackground />

      <motion.div
        className="relative z-10 min-h-screen overflow-y-auto p-6 max-w-5xl mx-auto scrollbar-thin"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs text-violet-300 hover:text-violet-200 mb-6 transition-colors"
        >
          ← Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <motion.div
            className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <IconBookmark className="w-5 h-5 text-white" />
          </motion.div>
          <motion.div>
            <h1 className="text-2xl font-bold text-white">Saved places</h1>
            <p className="text-sm text-slate-500">
              {places.length} in your collection
            </p>
          </motion.div>
        </div>

        <p className="text-sm text-slate-500 mb-8">
          Tap a card to open it on the map with AI insights.
        </p>

        {!configured && (
          <p className="text-sm text-zinc-400 glass-panel p-4 rounded-xl">
            Configure Supabase in .env to enable saving.
          </p>
        )}

        {configured && loading && (
          <motion.div
            className="flex items-center gap-3 text-slate-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
            Loading your collection…
          </motion.div>
        )}

        {configured && !loading && places.length === 0 && (
          <motion.div
            className="glass-panel p-10 text-center max-w-md"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.span
              className="text-5xl block mb-4"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              📍
            </motion.span>
            <p className="text-slate-300 font-medium">No saved places yet</p>
            <p className="text-sm text-slate-500 mt-2">
              Explore the map and tap &quot;Save to collection&quot; on any spot you love.
            </p>
            <Link
              to="/"
              className="inline-block mt-6 px-5 py-2.5 rounded-xl text-sm font-semibold text-violet-200 border border-violet-400/30 hover:bg-violet-500/15 transition-colors"
            >
              Explore dashboard →
            </Link>
          </motion.div>
        )}

        <PageTransition className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {places.map((place, i) => {
            const meta = CATEGORY_META[place.category as keyof typeof CATEGORY_META]
            return (
              <PageTransitionItem key={place.id}>
                <InteractiveCard
                  delay={i * 0.06}
                  disabled={openingId === place.id}
                  className="p-4"
                >
                  <button
                    type="button"
                    onClick={() => handleOpen(place)}
                    disabled={openingId === place.id}
                    className="w-full text-left"
                  >
                    <motion.span
                      className="text-3xl block"
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      {meta?.icon ?? '📍'}
                    </motion.span>
                    <h2 className="font-semibold text-white mt-3">{place.name}</h2>
                    <p className="text-xs text-violet-300 capitalize mt-1">{place.category}</p>
                    {place.address && (
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{place.address}</p>
                    )}
                    <p className="text-xs text-violet-300 mt-4 font-medium flex items-center gap-1">
                      {openingId === place.id ? (
                        <>
                          <span className="w-3 h-3 border border-violet-400 border-t-transparent rounded-full animate-spin" />
                          Opening on map…
                        </>
                      ) : (
                        <>View on map →</>
                      )}
                    </p>
                  </button>
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removePlace(place.id)
                    }}
                    whileHover={{ scale: 1.05, color: '#f87171' }}
                    className="mt-3 text-xs text-slate-500 hover:text-red-400 transition-colors"
                  >
                    Remove
                  </motion.button>
                </InteractiveCard>
              </PageTransitionItem>
            )
          })}
        </PageTransition>
      </motion.div>
    </motion.div>
  )
}
