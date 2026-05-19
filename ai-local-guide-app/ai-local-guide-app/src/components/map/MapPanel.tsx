import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { motion } from 'framer-motion'
import type { Place } from '../../types'
import { categoryIcon, userIcon } from '../../utils/leafletIcons'
import { useLocationContext } from '../../hooks/useLocationContext'
import { useAppUI } from '../../hooks/useAppUI'
import PlaceSaveButton from '../PlaceSaveButton'
import 'leaflet/dist/leaflet.css'

function MapFly({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.1 })
  }, [lat, lng, zoom, map])
  return null
}

function Markers({ places }: { places: Place[] }) {
  const { setSelectedPlace } = useAppUI()
  const limited = useMemo(() => places.slice(0, 80), [places])

  return (
    <>
      {limited.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={categoryIcon(place.category)}
          eventHandlers={{
            click: () => setSelectedPlace(place),
          }}
        >
          <Popup>
            <div className="text-gray-900 min-w-[160px]">
              <p className="font-semibold text-sm">{place.name}</p>
              <p className="text-xs capitalize text-indigo-600 mt-0.5">{place.category}</p>
              <PlaceSaveButton place={place} />
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}

export default function MapPanel() {
  const { location, places, loadingLocation, loadingPlaces } = useLocationContext()

  if (loadingLocation && !location) {
    return (
      <div className="glass rounded-2xl h-full min-h-[280px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!location) {
    return (
      <div className="glass rounded-2xl h-full min-h-[280px] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-zinc-500">Enable location or search a city</p>
      </div>
    )
  }

  const { lat, lng } = location.coords

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass rounded-2xl overflow-hidden flex flex-col h-full min-h-[280px]"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0">
        <div>
          <p className="text-sm font-medium text-white">Live Map</p>
          <p className="text-[10px] text-zinc-500">{places.length} places nearby</p>
        </div>
        {loadingPlaces && (
          <span className="text-[10px] text-indigo-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Updating
          </span>
        )}
      </div>
      <div className="flex-1 min-h-[240px] relative">
        <MapContainer center={[lat, lng]} zoom={14} className="absolute inset-0 z-0" zoomControl scrollWheelZoom>
          <TileLayer
            attribution='&copy; OSM'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapFly lat={lat} lng={lng} zoom={14} />
          <Marker position={[lat, lng]} icon={userIcon}>
            <Popup>
              <p className="text-gray-900 text-sm font-medium">You are here</p>
            </Popup>
          </Marker>
          <Markers places={places} />
        </MapContainer>
      </div>
    </motion.div>
  )
}
