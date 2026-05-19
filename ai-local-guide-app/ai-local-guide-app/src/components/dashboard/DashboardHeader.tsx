import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLocationContext } from '../../hooks/useLocationContext'
import { weatherEmoji } from '../../utils/weatherCodes'
import { IconLogo, IconSparkles } from '../ui/Icons'

export default function DashboardHeader() {
  const { location, weather, loadingLocation, places } = useLocationContext()
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="relative z-20 mx-4 mt-3 mb-1 flex items-center justify-between gap-4 px-5 py-2.5 rounded-2xl glass border border-white/[0.12] shadow-glass">
      <motion.div className="flex items-center gap-3 min-w-0" whileHover={{ scale: 1.01 }}>
        <div className="relative">
          <IconLogo className="w-9 h-9 shrink-0" />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-teal-400 border-2 border-navy-900" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            Voyager
            <IconSparkles className="w-3.5 h-3.5 text-violet-400" />
          </h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide">
            AI Travel Companion
          </p>
        </div>
      </motion.div>

      <div className="hidden md:flex items-center gap-2 min-w-0 flex-1 justify-center max-w-lg">
        {loadingLocation ? (
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-xs text-slate-400 font-medium"
          >
            Discovering your city…
          </motion.span>
        ) : location ? (
          <motion.span
            key={location.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-200 truncate px-3 py-1.5 rounded-full bg-gradient-to-r from-violet-500/15 to-blue-500/10 border border-violet-400/25 shadow-glow"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
            </span>
            <span className="truncate">{location.label}</span>
            <span className="text-slate-500 shrink-0">· {places.length} spots</span>
          </motion.span>
        ) : (
          <span className="text-xs text-slate-500">Where will you explore today?</span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {weather && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm"
          >
            <span className="text-lg">{weatherEmoji(weather.weatherCode)}</span>
            <div>
              <p className="text-sm font-bold text-white leading-none">{weather.temperature}°</p>
              <p className="text-[10px] text-slate-400 capitalize">{weather.description}</p>
            </div>
          </motion.div>
        )}
        <button
          type="button"
          onClick={() => navigate('/saved')}
          className="hidden lg:block text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          Saved
        </button>
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="w-9 h-9 rounded-xl gradient-accent text-sm font-bold text-white flex items-center justify-center shadow-glow hover:scale-105 transition-transform"
        >
          {user?.email?.[0]?.toUpperCase() ?? '?'}
        </button>
      </div>
    </header>
  )
}
