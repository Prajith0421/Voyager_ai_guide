import { motion } from 'framer-motion'
import ChatPanel from '../components/chat/ChatPanel'
import DesktopTopBar from '../components/layout/DesktopTopBar'
import MapPanel from '../components/map/MapPanel'
import PlacesList from '../components/places/PlacesList'
import PlaceDetail from '../components/places/PlaceDetail'
import WeatherWidget from '../components/weather/WeatherWidget'

/** Desktop-first explorer: chat center-left, map + insights right */
export default function ExplorePage() {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <DesktopTopBar />

      {/* Desktop: side-by-side panels */}
      <div className="hidden md:flex flex-1 min-h-0 gap-5 p-5">
        <motion.section
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="w-[min(42%,520px)] min-w-[360px] flex flex-col shrink-0"
        >
          <ChatPanel />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="flex-1 flex flex-col min-w-0 gap-4 min-h-0"
        >
          <div className="flex gap-4 flex-1 min-h-0">
            <div className="flex-[1.4] min-h-[320px] min-w-0">
              <MapPanel />
            </div>
            <div className="flex-1 flex flex-col gap-4 min-w-[240px] max-w-[320px] shrink-0 overflow-y-auto scrollbar-thin">
              <WeatherWidget />
              <PlaceDetail />
            </div>
          </div>
          <PlacesList horizontal />
        </motion.section>
      </div>

      {/* Mobile / narrow: stacked */}
      <div className="md:hidden flex-1 flex flex-col gap-4 p-4 min-h-0 overflow-y-auto">
        <div className="h-[min(50vh,400px)] shrink-0">
          <MapPanel />
        </div>
        <WeatherWidget />
        <PlaceDetail />
        <PlacesList />
        <div className="h-[min(70vh,600px)] shrink-0">
          <ChatPanel />
        </div>
      </div>
    </div>
  )
}
