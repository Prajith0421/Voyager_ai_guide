import { motion } from 'framer-motion'
import type { Place } from '../../types'
import { CATEGORY_META, placeDescription } from '../../utils/placeHelpers'
import { useAppUI } from '../../hooks/useAppUI'

interface PlaceCardProps {
  place: Place
  index?: number
  compact?: boolean
}

export default function PlaceCard({ place, index = 0, compact }: PlaceCardProps) {
  const { setSelectedPlace, selectedPlace } = useAppUI()
  const meta = CATEGORY_META[place.category]
  const isSelected = selectedPlace?.id === place.id

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onClick={() => setSelectedPlace(place)}
      className={`w-full text-left glass rounded-2xl overflow-hidden transition-all duration-200 hover:border-white/[0.14] hover:shadow-float group ${
        isSelected ? 'ring-2 ring-indigo-500/50 border-indigo-500/30' : ''
      }`}
    >
      <div
        className={`h-24 bg-gradient-to-br ${meta.gradient} flex items-center justify-center relative overflow-hidden`}
      >
        <span className="text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300">
          {meta.icon}
        </span>
        <span
          className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider text-white/90"
          style={{ backgroundColor: `${meta.color}99` }}
        >
          {meta.label}
        </span>
      </div>
      <div className={compact ? 'p-3' : 'p-4'}>
        <h3 className="font-semibold text-white text-sm leading-snug line-clamp-1">
          {place.name}
        </h3>
        {!compact && (
          <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed">
            {placeDescription(place)}
          </p>
        )}
        {place.tags?.opening_hours && (
          <p className="text-[10px] text-emerald-400/80 mt-2">Open now</p>
        )}
      </div>
    </motion.button>
  )
}
