const SUGGESTIONS = [
  { id: 'cafes', label: 'Best cafes', query: 'What are the best cafes nearby? Recommend from the real data.' },
  { id: 'restaurants', label: 'Top restaurants', query: 'Recommend the best restaurants near me from the fetched data.' },
  { id: 'nightlife', label: 'Nightlife', query: 'What are good nightlife spots nearby for tonight?' },
  { id: 'parks', label: 'Parks & nature', query: 'Which parks and green spaces are nearby worth visiting?' },
  { id: 'hidden', label: 'Hidden gems', query: 'What hidden gems or lesser-known spots are in this area?' },
  { id: 'tourist', label: 'Photo spots', query: 'What are the top tourist attractions and photography spots nearby?' },
  { id: 'itinerary', label: 'Day itinerary', query: 'Plan a one-day itinerary using only the real nearby places data.' },
  { id: 'tonight', label: 'Tonight', query: 'What should I do tonight based on nearby places and weather?' },
]

interface SuggestionCardsProps {
  onSelect: (query: string) => void
  disabled?: boolean
}

export default function SuggestionCards({ onSelect, disabled }: SuggestionCardsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {SUGGESTIONS.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onSelect(s.query)}
          disabled={disabled}
          className="chip disabled:cursor-not-allowed"
        >
          {s.label}
        </button>
      ))}
    </div>
  )
}
