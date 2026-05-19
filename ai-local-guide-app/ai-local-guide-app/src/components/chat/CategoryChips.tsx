import { motion } from 'framer-motion'

const CATEGORIES = [
  { label: 'Cafés', emoji: '☕', query: 'Best cafes nearby from real data' },
  { label: 'Food', emoji: '🍜', query: 'Top restaurants nearby from real data' },
  { label: 'Attractions', emoji: '🌇', query: 'Best tourist attractions nearby' },
  { label: 'Photography', emoji: '📸', query: 'Best photography and viewpoint spots' },
  { label: 'Nightlife', emoji: '🌃', query: 'Nightlife and bars nearby' },
  { label: 'Nature', emoji: '🌲', query: 'Parks and nature spots nearby' },
  { label: 'Malls', emoji: '🛍', query: 'List shopping malls from real data' },
  { label: 'Hidden Gems', emoji: '💎', query: 'Hidden gems and unique places nearby' },
]

interface CategoryChipsProps {
  onSelect: (q: string) => void
  disabled?: boolean
  activeLabel?: string | null
}

export default function CategoryChips({ onSelect, disabled, activeLabel }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat, i) => {
        const active = activeLabel === cat.label
        return (
          <motion.button
            key={cat.label}
            type="button"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(cat.query)}
            disabled={disabled}
            className={`chip-pill ${active ? 'chip-pill-active' : ''} disabled:opacity-40`}
          >
            <span className="mr-1">{cat.emoji}</span>
            {cat.label}
          </motion.button>
        )
      })}
    </div>
  )
}
