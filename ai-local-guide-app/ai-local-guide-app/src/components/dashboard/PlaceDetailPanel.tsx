import { motion, AnimatePresence } from 'framer-motion'
import type { Place } from '../../types'
import { CATEGORY_META, placeDescription } from '../../utils/placeHelpers'
import PlaceSaveButton from '../PlaceSaveButton'
import { useAppUI } from '../../hooks/useAppUI'

const CATEGORY_IMAGES: Record<string, string> = {
  cafe: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=480&q=80',
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=480&q=80',
  attraction: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=480&q=80',
  park: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=480&q=80',
  mall: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=480&q=80',
  museum: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=480&q=80',
  nightlife: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=480&q=80',
  hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=480&q=80',
}

interface PlaceDetailPanelProps {
  place: Place | null
}

export default function PlaceDetailPanel({ place }: PlaceDetailPanelProps) {
  const { setSelectedPlace } = useAppUI()

  return (
    <AnimatePresence>
      {place && (
        <motion.aside
          key={place.id}
          initial={{ opacity: 0, x: 24, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 24, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="place-detail-panel absolute top-4 right-4 bottom-4 z-[600] w-[min(100%,320px)] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/15"
        >
          <div className="relative h-36 shrink-0 overflow-hidden">
            <img
              src={CATEGORY_IMAGES[place.category] ?? CATEGORY_IMAGES.attraction}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/60 to-transparent" />
            <button
              type="button"
              onClick={() => setSelectedPlace(null)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 flex items-center justify-center text-sm border border-white/20"
              aria-label="Close"
            >
              ×
            </button>
            <div className="absolute bottom-3 left-3 right-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md border border-white/25 text-white">
                {CATEGORY_META[place.category].icon}{' '}
                {CATEGORY_META[place.category].label}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-[#0f1729]">
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">{place.name}</h3>
              {place.address && (
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{place.address}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/25 border border-amber-400/40">
                <span className="text-amber-300 text-sm">★</span>
                <span className="text-xs font-semibold text-amber-100">4.5</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">OpenStreetMap verified</span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">{placeDescription(place)}</p>

            <div className="place-ai-insight rounded-xl p-3.5 border border-violet-400/35 bg-[#1a1040]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-violet-200 mb-2">
                ✨ AI insight
              </p>
              <p className="text-sm text-slate-100 leading-relaxed">
                Ask the companion about{' '}
                <strong className="text-white font-semibold">{place.name}</strong> for tips, best
                times to visit, and what to explore nearby.
              </p>
            </div>

            <PlaceSaveButton place={place} variant="panel" />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
