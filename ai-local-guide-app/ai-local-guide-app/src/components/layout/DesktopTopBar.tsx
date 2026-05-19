import { useLocationContext } from '../../hooks/useLocationContext'
import SearchBar from '../search/SearchBar'

export default function DesktopTopBar() {
  const { location, places, loadingPlaces } = useLocationContext()

  return (
    <header className="shrink-0 flex items-center gap-6 px-6 h-14 border-b border-white/[0.06] bg-surface-1/50 backdrop-blur-xl">
      <div className="flex-1 max-w-xl">
        <SearchBar />
      </div>
      <div className="hidden xl:flex items-center gap-6 text-xs text-zinc-500 shrink-0">
        {location && (
          <>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-zinc-300 max-w-[220px] truncate">{location.label}</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <span>
              <strong className="text-indigo-400 font-semibold">{places.length}</strong> places
            </span>
            {loadingPlaces && <span className="text-indigo-400 animate-pulse">Updating…</span>}
          </>
        )}
      </div>
    </header>
  )
}
