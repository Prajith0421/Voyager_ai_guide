import { motion } from 'framer-motion'
import { weatherEmoji } from '../../utils/weatherCodes'
import { useLocationContext } from '../../hooks/useLocationContext'

export default function WeatherWidget() {
  const { weather, loadingWeather, location } = useLocationContext()

  if (loadingWeather) {
    return (
      <div className="glass rounded-2xl p-4 space-y-3">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-10 w-24" />
      </div>
    )
  }

  if (!weather || !location) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4"
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-3">
        Weather
      </p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-semibold text-white tabular-nums">
            {weather.temperature}°
          </p>
          <p className="text-xs text-zinc-400 mt-0.5">{weather.description}</p>
          <p className="text-[10px] text-zinc-600 mt-1 truncate max-w-[140px]">
            {location.label.split(',')[0]}
          </p>
        </div>
        <span className="text-4xl">{weatherEmoji(weather.weatherCode)}</span>
      </div>
      <div className="mt-3 pt-3 border-t border-white/[0.06] flex gap-4 text-[11px] text-zinc-500">
        <span>{weather.humidity}% humidity</span>
        <span>{weather.windSpeed} km/h wind</span>
      </div>
    </motion.div>
  )
}
