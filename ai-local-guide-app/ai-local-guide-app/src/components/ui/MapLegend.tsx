const LEGEND = [
  { category: 'cafe', label: 'Cafes', color: '#f59e0b' },
  { category: 'restaurant', label: 'Restaurants', color: '#ef4444' },
  { category: 'attraction', label: 'Attractions', color: '#8b5cf6' },
  { category: 'park', label: 'Parks', color: '#22c55e' },
  { category: 'museum', label: 'Museums', color: '#ec4899' },
  { category: 'nightlife', label: 'Nightlife', color: '#a855f7' },
  { category: 'hotel', label: 'Hotels', color: '#06b6d4' },
]

export default function MapLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      <span className="flex items-center gap-1.5 text-xs text-zinc-500">
        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-white/80" />
        You
      </span>
      {LEGEND.map((item) => (
        <span key={item.category} className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span
            className="w-2.5 h-2.5 rounded-full ring-2 ring-white/60"
            style={{ background: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  )
}
