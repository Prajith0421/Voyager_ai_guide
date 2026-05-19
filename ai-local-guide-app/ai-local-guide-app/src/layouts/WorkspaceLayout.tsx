import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import MobileNav from '../components/layout/MobileNav'
import { useLocationContext } from '../hooks/useLocationContext'

export default function WorkspaceLayout() {
  const { error, clearError } = useLocationContext()

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        {error && (
          <div className="shrink-0 px-4 pt-3 z-50">
            <div
              role="alert"
              className="glass rounded-xl px-4 py-3 flex items-center gap-3 text-sm text-red-300 max-w-lg"
            >
              <span className="flex-1">{error}</span>
              <button type="button" onClick={clearError} className="text-zinc-500 hover:text-white">
                ×
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 min-h-0 overflow-hidden">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
