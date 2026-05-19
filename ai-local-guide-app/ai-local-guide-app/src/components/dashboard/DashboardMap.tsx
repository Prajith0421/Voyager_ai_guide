import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Place } from '../../types'
import { categoryIcon, userIcon } from '../../utils/leafletIcons'
import { useLocationContext } from '../../hooks/useLocationContext'
import { useAppUI } from '../../hooks/useAppUI'
import PlaceSaveButton from '../PlaceSaveButton'
import { CATEGORY_META, placesMatch } from '../../utils/placeHelpers'
import 'leaflet/dist/leaflet.css'

const MAP_TILES =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'

function MapResize() {
  const map = useMap()
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 200)
    const t2 = setTimeout(() => map.invalidateSize(), 600)
    return () => {
      clearTimeout(t)
      clearTimeout(t2)
    }
  }, [map])
  return null
}

function MapFlyToPlace({ place }: { place: Place | null }) {
  const map = useMap()
  useEffect(() => {
    if (!place) return
    map.flyTo([place.lat, place.lng], 16, { duration: 1.2, easeLinearity: 0.25 })
  }, [place?.id, place?.lat, place?.lng, map])
  return null
}

function MapFlyToCity({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.4, easeLinearity: 0.25 })
  }, [lat, lng, zoom, map])
  return null
}

function MapFitHighlights({ places }: { places: Place[] }) {
  const map = useMap()
  useEffect(() => {
    if (places.length > 1) {
      const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]))
      map.flyToBounds(bounds, { padding: [56, 56], duration: 1.2, maxZoom: 16 })
    } else if (places.length === 1) {
      map.flyTo([places[0].lat, places[0].lng], 16, { duration: 0.9 })
    }
  }, [places, map])
  return null
}

function Markers({
  places,
  highlightedPlaces,
}: {
  places: Place[]
  highlightedPlaces: Place[]
}) {
  const { setSelectedPlace } = useAppUI()
  const list = useMemo(() => places.slice(0, 150), [places])

  return (
    <>
      {list.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={categoryIcon(
            place.category,
            highlightedPlaces.some((hp) => placesMatch(hp, place))
          )}
          zIndexOffset={
            highlightedPlaces.some((hp) => placesMatch(hp, place)) ? 1000 : 0
          }
          eventHandlers={{ click: () => setSelectedPlace(place) }}
        >
          <Popup className="map-place-popup">
            <div className="map-popup-inner min-w-[180px]">
              <p className="font-bold text-sm !text-white">{place.name}</p>
              <p className="text-xs !text-violet-200 capitalize mt-1 flex items-center gap-1">
                {CATEGORY_META[place.category]?.icon} {place.category}
              </p>
              <PlaceSaveButton place={place} variant="popup" />
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}

export default function DashboardMap() {
  const { location, places, loadingLocation, loadingPlaces } = useLocationContext()
  const {
    highlightedPlaces,
    selectedPlace,
    setSelectedPlace,
    setHighlightedPlaces,
    pendingOpenPlace,
  } = useAppUI()
  const [mapReady, setMapReady] = useState(false)
  const prevCoordKey = useRef('')

  useEffect(() => {
    setMapReady(true)
  }, [])

  const coordKey = location
    ? `${location.coords.lat.toFixed(5)}-${location.coords.lng.toFixed(5)}`
    : ''

  useEffect(() => {
    if (!coordKey || coordKey === prevCoordKey.current) return

    const openingSavedPlace = pendingOpenPlace !== null
    prevCoordKey.current = coordKey

    if (openingSavedPlace) return

    setSelectedPlace(null)
    setHighlightedPlaces([])
  }, [coordKey, pendingOpenPlace, setSelectedPlace, setHighlightedPlaces])

  const orphanSelectedPlace = useMemo(() => {
    if (!selectedPlace) return null
    const inList = places.some((p) => placesMatch(p, selectedPlace))
    return inList ? null : selectedPlace
  }, [places, selectedPlace])

  if (loadingLocation && !location) {
    return (
      <section className="flex-1 flex items-center justify-center min-h-[360px] rounded-2xl bg-navy-800/50">
        <motion.div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading your map…</p>
        </motion.div>
      </section>
    )
  }

  if (!location) {
    return (
      <section className="flex-1 flex flex-col items-center justify-center min-h-[360px] rounded-2xl bg-navy-800/30 border border-dashed border-white/10">
        <p className="text-4xl mb-3">🌍</p>
        <p className="text-sm font-medium text-slate-300">Search a city to explore the map</p>
        <p className="text-xs text-slate-500 mt-1">Your AI guide syncs with live place data</p>
      </section>
    )
  }

  const { lat, lng } = location.coords

  return (
    <section className="relative flex-1 min-h-[360px] h-full">
      <motion.div
        className="absolute top-4 left-4 z-[500] flex flex-wrap gap-2"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="map-badge">
          <strong className="text-violet-300">{places.length}</strong> places discovered
        </span>
        {loadingPlaces && (
          <span className="map-badge animate-pulse-soft">Syncing…</span>
        )}
        {highlightedPlaces.length > 0 && (
          <span className="map-badge map-badge-highlight">
            ✨ {highlightedPlaces.length} AI picks
          </span>
        )}
      </motion.div>

      {!mapReady ? (
        <div className="w-full h-full min-h-[360px] flex items-center justify-center bg-navy-800/40 rounded-2xl">
          <motion.div className="w-10 h-10 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          className="w-full h-full rounded-2xl"
          zoomControl
          scrollWheelZoom
          style={{ height: '100%', width: '100%', minHeight: 360 }}
        >
          <TileLayer
            url={MAP_TILES}
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OSM'
          />
          <MapResize />
          <MapFlyToCity lat={lat} lng={lng} zoom={13} />
          <MapFlyToPlace place={selectedPlace} />
          {highlightedPlaces.length > 0 && (
            <MapFitHighlights places={highlightedPlaces} />
          )}
          <Marker position={[lat, lng]} icon={userIcon} zIndexOffset={2000}>
            <Popup>
              <p className="text-sm font-semibold text-white">Exploring</p>
              <p className="text-xs text-slate-400">{location.label}</p>
            </Popup>
          </Marker>
          <Markers places={places} highlightedPlaces={highlightedPlaces} />
          {orphanSelectedPlace && (
            <Marker
              position={[orphanSelectedPlace.lat, orphanSelectedPlace.lng]}
              icon={categoryIcon(orphanSelectedPlace.category, true)}
              zIndexOffset={1500}
              eventHandlers={{ click: () => setSelectedPlace(orphanSelectedPlace) }}
            />
          )}
        </MapContainer>
      )}
    </section>
  )
}
