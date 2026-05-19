import { motion } from 'framer-motion'

const PROMPTS = [
  { label: 'Day trip', query: 'Plan a one-day itinerary using only real nearby places.' },
  { label: 'Tonight', query: 'What should I do tonight based on weather and nearby places?' },
  { label: 'Local tips', query: 'Give me insider tips for exploring this area.' },
]

interface SuggestionChipsProps {
  onSelect: (q: string) => void
  disabled?: boolean
}

export default function SuggestionChips({ onSelect, disabled }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PROMPTS.map((p, i) => (
        <motion.button
          key={p.label}
          type="button"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.03 }}
          onClick={() => onSelect(p.query)}
          disabled={disabled}
          className="px-3 py-1.5 rounded-full text-[11px] font-semibold text-violet-200 bg-violet-500/15 border border-violet-400/25 hover:bg-violet-500/25 hover:shadow-glow disabled:opacity-40 transition-all"
        >
          ✨ {p.label}
        </motion.button>
      ))}
    </div>
  )
}
