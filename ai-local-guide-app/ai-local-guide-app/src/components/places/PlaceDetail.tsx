import { motion, AnimatePresence } from 'framer-motion'
import { useAppUI } from '../../hooks/useAppUI'
import { CATEGORY_META, placeDescription } from '../../utils/placeHelpers'
import PlaceSaveButton from '../PlaceSaveButton'

export default function PlaceDetail() {
  const { selectedPlace, setSelectedPlace } = useAppUI()

  return (
    <AnimatePresence mode="wait">
      {selectedPlace ? (
        <motion.div
          key={selectedPlace.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div
            className={`h-32 bg-gradient-to-br ${CATEGORY_META[selectedPlace.category].gradient} flex items-center justify-center relative`}
          >
            <span className="text-5xl">{CATEGORY_META[selectedPlace.category].icon}</span>
            <button
              type="button"
              onClick={() => setSelectedPlace(null)}
              className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/30 text-white/80 hover:text-white flex items-center justify-center"
            >
              ×
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-400">
                {CATEGORY_META[selectedPlace.category].label}
              </p>
              <h3 className="text-lg font-semibold text-white mt-1">{selectedPlace.name}</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {placeDescription(selectedPlace)}
            </p>
            <PlaceSaveButton place={selectedPlace} />
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-6 text-center"
        >
          <p className="text-sm text-zinc-500">Select a place to view details</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
