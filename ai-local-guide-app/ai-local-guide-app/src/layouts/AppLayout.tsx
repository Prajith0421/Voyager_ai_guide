import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useLocationContext } from '../hooks/useLocationContext'

export default function AppLayout() {
  const { error, clearError, loadingLocation } = useLocationContext()

  return (
    <div className="app-shell min-h-screen pb-[72px] lg:pb-0 lg:pl-[240px]">
      <Navbar />

      {error && (
        <div
          role="alert"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] max-w-md w-[calc(100%-2rem)] lg:left-[calc(240px+(100%-240px)/2)] panel border-red-500/25 p-4 flex items-start gap-3 animate-fade-in"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15 text-red-400 text-sm shrink-0">
            !
          </span>
          <p className="flex-1 text-sm text-red-200/90 leading-relaxed pt-0.5">{error}</p>
          <button
            onClick={clearError}
            className="btn-ghost !p-1.5 text-zinc-500 hover:text-white shrink-0"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {loadingLocation && !error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 lg:left-[calc(240px+(100%-240px)/2)]">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/90 border border-white/[0.08] text-sm text-zinc-300 backdrop-blur-xl shadow-card">
            <span className="h-3.5 w-3.5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
            Detecting location...
          </div>
        </div>
      )}

      <main className="max-w-[1400px] mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
