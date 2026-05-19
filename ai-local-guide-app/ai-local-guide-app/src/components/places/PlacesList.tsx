import { useMemo } from 'react'
import { useLocationContext } from '../../hooks/useLocationContext'
import PlaceCard from './PlaceCard'

interface PlacesListProps {
  horizontal?: boolean
}

export default function PlacesList({ horizontal }: PlacesListProps) {
  const { places, loadingPlaces } = useLocationContext()

  const top = useMemo(() => places.slice(0, horizontal ? 16 : 12), [places, horizontal])

  if (loadingPlaces) {
    return (
      <div
        className={
          horizontal
            ? 'flex gap-3 overflow-hidden'
            : 'grid sm:grid-cols-2 gap-3'
        }
      >
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`skeleton ${horizontal ? 'h-28 w-48 shrink-0' : 'h-28'}`} />
        ))}
      </div>
    )
  }

  if (places.length === 0) {
    return (
      <div className="glass rounded-2xl p-5 text-center">
        <p className="text-sm text-zinc-500">No places loaded yet</p>
      </div>
    )
  }

  if (horizontal) {
    return (
      <div className="shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-3 px-1">
          Nearby places · {places.length}
        </p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {top.map((place, i) => (
            <div key={place.id} className="w-[200px] shrink-0">
              <PlaceCard place={place} index={i} compact />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 px-1">
        Nearby · {places.length}
      </p>
      <div className="grid gap-3 max-h-[420px] overflow-y-auto scrollbar-thin sm:grid-cols-2">
        {top.map((place, i) => (
          <PlaceCard key={place.id} place={place} index={i} compact />
        ))}
      </div>
    </div>
  )
}
