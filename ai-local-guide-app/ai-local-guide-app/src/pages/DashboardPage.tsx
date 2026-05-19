import { lazy, Suspense, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardSearch from '../components/dashboard/DashboardSearch'
import DashboardChat from '../components/dashboard/DashboardChat'
import PlaceDetailPanel from '../components/dashboard/PlaceDetailPanel'
import AnimatedBackground from '../components/ui/AnimatedBackground'
import { PageTransition, PageTransitionItem } from '../components/ui/PageTransition'
import { useAppUI } from '../hooks/useAppUI'
import { useLocationContext } from '../hooks/useLocationContext'
import { placesMatch } from '../utils/placeHelpers'

const DashboardMap = lazy(() => import('../components/dashboard/DashboardMap'))

function MapLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex items-center justify-center min-h-[360px] rounded-2xl bg-navy-800/40 border border-white/10"
    >
      <motion.div
        className="flex flex-col items-center gap-3"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="w-10 h-10 border-2 border-violet-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-sm text-slate-400">Loading map…</p>
      </motion.div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { selectedPlace, pendingOpenPlace, setSelectedPlace, setHighlightedPlaces, clearPendingOpenPlace } =
    useAppUI()
  const { places, loadingPlaces } = useLocationContext()

  useEffect(() => {
    if (!pendingOpenPlace || loadingPlaces) return

    const match =
      places.find((p) => p.id === pendingOpenPlace.id) ??
      places.find((p) => placesMatch(p, pendingOpenPlace)) ??
      pendingOpenPlace

    setSelectedPlace(match)
    setHighlightedPlaces([match])
    clearPendingOpenPlace()
  }, [
    pendingOpenPlace,
    loadingPlaces,
    places,
    setSelectedPlace,
    setHighlightedPlaces,
    clearPendingOpenPlace,
  ])

  return (
    <motion.div
      className="dashboard-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="dashboard-bg" aria-hidden />
      <AnimatedBackground />

      <PageTransition className="contents">
        <PageTransitionItem>
          <DashboardHeader />
        </PageTransitionItem>
        <PageTransitionItem>
          <DashboardSearch />
        </PageTransitionItem>
        <PageTransitionItem className="dashboard-main">
          <motion.div
            className="dashboard-chat-col"
            whileHover={{ scale: 1.002 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <DashboardChat />
          </motion.div>

          <motion.div
            className="dashboard-map-col relative"
            whileHover={{ scale: 1.002 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <Suspense fallback={<MapLoading />}>
              <DashboardMap />
            </Suspense>
            <PlaceDetailPanel place={selectedPlace} />
          </motion.div>
        </PageTransitionItem>
      </PageTransition>
    </motion.div>
  )
}
