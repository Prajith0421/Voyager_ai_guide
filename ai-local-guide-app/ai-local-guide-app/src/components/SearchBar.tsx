import { useEffect, useRef, useState } from 'react'
import { resolveCityQuery, searchCities } from '../services/nominatim'
import type { CityResult } from '../types'
import { useLocationContext } from '../hooks/useLocationContext'
import { IconLocation, IconSearch } from './ui/Icons'

export default function SearchBar() {
  const { selectCity, requestGPS, loadingLocation, location } = useLocationContext()
  const [city, setCity] = useState('')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CityResult[]>([])
  const [searching, setSearching] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setOpen(false)
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const cities = await searchCities(query)
        setResults(cities)
        setOpen(cities.length > 0)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 400)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = async (cityResult: CityResult) => {
    setQuery(cityResult.name)
    setCity(cityResult.name)
    setOpen(false)
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

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="panel p-2 flex gap-2">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-zinc-500" />
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value)
              setQuery(e.target.value)
            }}
            onFocus={() => results.length > 0 && setOpen(true)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search any city worldwide..."
            className="input-field !pl-10 !py-3.5"
          />
          {searching && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-indigo-400">
              <span className="h-3 w-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
            </span>
          )}
        </div>
        <button type="button" onClick={handleSearch} className="btn-primary !px-4 shrink-0">
          Search
        </button>
        <button
          onClick={requestGPS}
          disabled={loadingLocation}
          className="btn-primary !px-4 shrink-0"
          title="Use my location"
        >
          <IconLocation className="w-4 h-4" />
          <span className="hidden sm:inline">{loadingLocation ? 'Locating' : 'My location'}</span>
        </button>
      </div>

      {open && (
        <ul className="absolute z-50 mt-2 w-full panel overflow-hidden max-h-72 overflow-y-auto shadow-glow animate-fade-in">
          {results.map((city) => (
            <li key={`${city.lat}-${city.lng}`}>
              <button
                onClick={() => handleSelect(city)}
                className="w-full text-left px-4 py-3 hover:bg-indigo-500/10 transition-colors border-b border-white/[0.04] last:border-0"
              >
                <p className="font-medium text-white text-sm">{city.name}</p>
                <p className="text-xs text-zinc-500 truncate mt-0.5">{city.displayName}</p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {searchError && (
        <p className="mt-2 text-xs text-red-400 px-1">{searchError}</p>
      )}

      {location && (
        <p className="mt-2.5 text-xs text-zinc-500 flex items-center gap-1.5 px-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>
            Exploring <span className="text-zinc-300">{location.label}</span>
            {location.source === 'gps' && (
              <span className="text-zinc-600"> · GPS</span>
            )}
          </span>
        </p>
      )}
    </div>
  )
}
