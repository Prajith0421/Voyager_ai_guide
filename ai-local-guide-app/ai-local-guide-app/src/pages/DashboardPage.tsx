import { lazy, Suspense } from 'react'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardSearch from '../components/dashboard/DashboardSearch'
import DashboardChat from '../components/dashboard/DashboardChat'

const DashboardMap = lazy(() => import('../components/dashboard/DashboardMap'))

function MapLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[360px] rounded-2xl bg-navy-800/40 border border-white/10">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading map…</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="dashboard-root">
      <div className="dashboard-bg" aria-hidden />

      <DashboardHeader />
      <DashboardSearch />

      <div className="dashboard-main">
        <div className="dashboard-chat-col">
          <DashboardChat />
        </div>

        <div className="dashboard-map-col">
          <Suspense fallback={<MapLoading />}>
            <DashboardMap />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
