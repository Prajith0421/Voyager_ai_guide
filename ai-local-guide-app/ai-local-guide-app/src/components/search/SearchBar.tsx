import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { resolveCityQuery, searchCities } from '../../services/nominatim'
import type { CityResult } from '../../types'
import { useLocationContext } from '../../hooks/useLocationContext'
import { useAppUI } from '../../hooks/useAppUI'
import { TRENDING_CITIES } from '../../utils/placeHelpers'
import { IconLocation, IconSearch } from '../ui/Icons'

interface SearchBarProps {
  large?: boolean
  centered?: boolean
}

export default function SearchBar({ large, centered }: SearchBarProps) {
  const { selectCity, requestGPS, loadingLocation, location } = useLocationContext()
  const { recentSearches, addRecentSearch } = useAppUI()
  const [city, setCity] = useState('')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CityResult[]>([])
  const [searching, setSearching] = useState(false)
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const cities = await searchCities(query)
        setResults(cities)
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 350)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = async (cityResult: CityResult) => {
    setQuery(cityResult.name)
    setCity(cityResult.name)
    setOpen(false)
    addRecentSearch(cityResult.name)
    await selectCity(cityResult)
  }

  async function handleSearch() {
    if (!city.trim()) return
    setSearching(true)
    setSearchError(null)
    try {
      const cityResult = await resolveCityQuery(city)
      if (!cityResult) {
        setSearchError('City not found. Try a different spelling.')
        return
      }
      await handleSelect(cityResult)
    } catch {
      setSearchError('Search failed. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  const showDropdown =
    open && (results.length > 0 || (query && !searching) || recentSearches.length > 0 || !query)

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full ${centered ? 'max-w-2xl mx-auto' : ''}`}
    >
      <motion.div
        className={`search-glow glass-strong rounded-2xl flex gap-2 p-2 transition-shadow duration-300 ${
          focused ? 'border-violet-400/30' : ''
        }`}
        animate={focused ? { scale: 1.01 } : { scale: 1 }}
      >
        <div className="relative flex-1">
          <IconSearch
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
              focused ? 'text-violet-400' : 'text-slate-500'
            }`}
          />
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value)
              setQuery(e.target.value)
            }}
            onFocus={() => {
              setOpen(true)
              setFocused(true)
            }}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Where do you want to explore?"
            className={`w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none font-medium ${
              large ? 'pl-12 pr-10 py-3.5 text-base' : 'pl-11 pr-10 py-3 text-sm'
            }`}
          />
          {query && !searching && (
            <button
              type="button"
              onClick={() => {
                setCity('')
                setQuery('')
                setResults([])
                setOpen(false)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/10 text-slate-400 hover:text-white hover:bg-white/15 flex items-center justify-center text-sm transition-colors"
              aria-label="Clear"
            >
              ×
            </button>
          )}
          {searching && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        <motion.button
          type="button"
          onClick={handleSearch}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`shrink-0 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors ${
            large ? 'px-5 py-3.5 text-sm' : 'px-4 py-2.5 text-sm'
          }`}
        >
          Search
        </motion.button>
        <motion.button
          type="button"
          onClick={requestGPS}
          disabled={loadingLocation}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`shrink-0 flex items-center gap-2 rounded-xl font-semibold text-white gradient-accent shadow-glow hover:opacity-95 disabled:opacity-50 transition-opacity ${
            large ? 'px-5 py-3.5 text-sm' : 'px-4 py-2.5 text-sm'
          }`}
        >
          <IconLocation className="w-4 h-4" />
          <span className="hidden sm:inline">
            {loadingLocation ? 'Locating…' : 'Near me'}
          </span>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full glass-strong rounded-2xl overflow-hidden shadow-float max-h-80 overflow-y-auto scrollbar-thin"
          >
            {!query && (
              <motion.div className="p-3 border-b border-white/[0.06]">
                <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Trending destinations
                </p>
                <div className="flex flex-wrap gap-2 mt-2 px-1">
                  {TRENDING_CITIES.slice(0, 6).map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() =>
                        handleSelect({
                          name: c.name,
                          displayName: `${c.name}, ${c.country}`,
                          lat: c.lat,
                          lng: c.lng,
                          country: c.country,
                        })
                      }
                      className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 bg-white/[0.05] border border-white/10 hover:border-violet-400/30 hover:text-white hover:bg-violet-500/10 transition-all"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {results.length > 0 ? (
              <ul>
                {results.map((c) => (
                  <li key={`${c.lat}-${c.lng}`}>
                    <button
                      type="button"
                      onClick={() => handleSelect(c)}
                      className="w-full text-left px-4 py-3 hover:bg-violet-500/10 transition-colors border-b border-white/[0.04] last:border-0 group"
                    >
                      <p className="font-semibold text-white text-sm group-hover:text-violet-200">
                        {c.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{c.displayName}</p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : query && !searching ? (
              <p className="px-4 py-6 text-sm text-slate-500 text-center">No cities found</p>
            ) : null}

            {!query && recentSearches.length > 0 && (
              <div className="p-3">
                <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Recent
                </p>
                {recentSearches.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={async () => {
                      setCity(s)
                      setQuery(s)
                      const resolved = await resolveCityQuery(s)
                      if (resolved) await handleSelect(resolved)
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {searchError && (
        <p className="mt-2 text-xs text-rose-400 text-center font-medium">{searchError}</p>
      )}

      {location && !large && !centered && (
        <p className="mt-2 text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
          {location.label}
        </p>
      )}
    </div>
  )
}
