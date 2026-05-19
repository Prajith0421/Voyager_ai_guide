import { weatherEmoji } from '../utils/weatherCodes'
import { useLocationContext } from '../hooks/useLocationContext'
import { WeatherSkeleton } from './LoadingSkeleton'

export default function WeatherCard({ compact = false }: { compact?: boolean }) {
  const { weather, loadingWeather, location } = useLocationContext()

  if (loadingWeather) return <WeatherSkeleton />
  if (!weather || !location) return null

  const city = location.label.split(',')[0]

  return (
    <div className={`panel ${compact ? '' : 'overflow-hidden'}`}>
      <div className={compact ? 'p-4' : 'p-5'}>
        <p className="eyebrow mb-3">Weather</p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-4xl font-semibold tracking-tight text-white tabular-nums">
              {weather.temperature}°
            </p>
            <p className="text-sm text-zinc-400 mt-1">{weather.description}</p>
            <p className="text-xs text-zinc-600 mt-2">{city}</p>
          </div>
          <span className="text-5xl leading-none opacity-90" aria-hidden>
            {weatherEmoji(weather.weatherCode)}
          </span>
        </div>

        {!compact && (
          <div className="mt-5 pt-4 border-t border-white/[0.06] grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-zinc-800/50 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Humidity</p>
              <p className="text-sm font-medium text-zinc-200 mt-0.5">{weather.humidity}%</p>
            </div>
            <div className="rounded-xl bg-zinc-800/50 px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Wind</p>
              <p className="text-sm font-medium text-zinc-200 mt-0.5">{weather.windSpeed} km/h</p>
            </div>
          </div>
        )}
      </div>

      {!compact && weather.forecast.length > 0 && (
        <div className="px-5 pb-5 flex gap-2 overflow-x-auto scrollbar-thin">
          {weather.forecast.slice(0, 5).map((day) => (
            <div
              key={day.date}
              className="flex-shrink-0 flex flex-col items-center gap-1 min-w-[64px] px-3 py-2.5 rounded-xl bg-zinc-800/40 border border-white/[0.04]"
            >
              <p className="text-[10px] font-medium text-zinc-500">
                {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
              </p>
              <span className="text-xl">{weatherEmoji(day.weatherCode)}</span>
              <p className="text-xs font-medium text-zinc-300 tabular-nums">
                {day.maxTemp}° <span className="text-zinc-600">{day.minTemp}°</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

