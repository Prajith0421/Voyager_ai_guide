import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentLocation } from '../services/location'
import { fetchNearbyPlaces } from '../services/overpass'
import { motion } from 'framer-motion'
import SearchBar from '../components/search/SearchBar'
import { TRENDING_CITIES } from '../utils/placeHelpers'
import { useLocationContext } from '../hooks/useLocationContext'
import { IconLogo, IconSparkles } from '../components/ui/Icons'

const CATEGORIES = [
  { label: 'Cafes', emoji: '☕', query: 'Best cafes nearby' },
  { label: 'Food', emoji: '🍽', query: 'Top restaurants' },
  { label: 'Sights', emoji: '📍', query: 'Tourist attractions' },
  { label: 'Nature', emoji: '🌳', query: 'Parks nearby' },
  { label: 'Nightlife', emoji: '🌙', query: 'Nightlife spots' },
  { label: 'Stay', emoji: '🏨', query: 'Hotels nearby' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { selectCity, requestGPS } = useLocationContext()

  useEffect(() => {
    async function loadLocation() {
      try {
        const position = await getCurrentLocation()

        console.log(position.coords.latitude)
        console.log(position.coords.longitude)

        const places = await fetchNearbyPlaces(
          position.coords.latitude,
          position.coords.longitude
        )

        console.log(places)
      } catch (error) {
        console.error(error)
      }
    }

    loadLocation()
  }, [])

  const goExplore = () => navigate('/explore')

  const pickCity = async (city: (typeof TRENDING_CITIES)[0]) => {
    await selectCity({
      name: city.name,
      displayName: `${city.name}, ${city.country}`,
      lat: city.lat,
      lng: city.lng,
      country: city.country,
    })
    navigate('/explore')
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <IconLogo className="w-10 h-10" />
          <span className="font-semibold text-lg text-white">LocalGuide</span>
        </div>
        <button
          type="button"
          onClick={goExplore}
          className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          Open app →
        </button>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-12 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-indigo-300 mb-8">
            <IconSparkles className="w-3.5 h-3.5" />
            AI-powered local discovery
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            Explore any city
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              like a local
            </span>
          </h1>

          <p className="mt-6 text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Real places from OpenStreetMap. Live weather. Conversational AI recommendations — never hallucinated.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-10"
        >
          <SearchBar large centered />
          <button
            type="button"
            onClick={async () => {
              await requestGPS()
              goExplore()
            }}
            className="mt-4 text-sm text-zinc-500 hover:text-indigo-400 transition-colors"
          >
            or use my current location
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-16"
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-4">
            Trending destinations
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {TRENDING_CITIES.map((city, i) => (
              <motion.button
                key={city.name}
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                onClick={() => pickCity(city)}
                className="px-4 py-2 rounded-xl glass text-sm text-zinc-300 hover:text-white hover:border-indigo-500/30 transition-all"
              >
                {city.name}
                <span className="text-zinc-600 ml-1.5 text-xs">{city.country}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-14"
        >
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-600 mb-4">
            Explore by category
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                type="button"
                onClick={goExplore}
                className="glass rounded-2xl p-4 text-left hover:border-indigo-500/25 transition-all group"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <p className="text-sm font-medium text-zinc-200 mt-2 group-hover:text-white">
                  {cat.label}
                </p>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-16"
        >
          <button
            type="button"
            onClick={goExplore}
            className="px-8 py-4 rounded-2xl gradient-accent text-white font-semibold text-sm shadow-glow hover:opacity-90 transition-opacity btn-glow"
          >
            Launch Explorer
          </button>
        </motion.div>
      </main>
    </div>
  )
}
