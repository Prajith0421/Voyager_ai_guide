import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import type { Place } from '../types'
import { categoryIcon, userIcon } from '../utils/leafletIcons'
import { useLocationContext } from '../hooks/useLocationContext'
import { MapSkeleton } from './LoadingSkeleton'
import PlaceSaveButton from './PlaceSaveButton'
import MapLegend from './ui/MapLegend'
import 'leaflet/dist/leaflet.css'

function MapController({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.2 })
  }, [lat, lng, zoom, map])
  return null
}

function PlaceMarkers({ places }: { places: Place[] }) {
  const limited = useMemo(() => places.slice(0, 80), [places])

  return (
    <>
      {limited.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={categoryIcon(place.category)}
        >
          <Popup>
            <div className="text-gray-900 min-w-[180px]">
              <p className="font-semibold text-[15px]">{place.name}</p>
              <p className="text-xs capitalize text-indigo-600 font-medium mt-0.5">{place.category}</p>
              {place.address && (
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{place.address}</p>
              )}
              <PlaceSaveButton place={place} />
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}

interface TravelMapProps {
  height?: string
  zoom?: number
  showHeader?: boolean
}

export default function TravelMap({
  height = '500px',
  zoom = 14,
  showHeader = true,
}: TravelMapProps) {
  const { location, places, loadingLocation, loadingPlaces } = useLocationContext()

  if (loadingLocation && !location) {
    return (
      <div style={{ height }} className="panel overflow-hidden">
        <MapSkeleton />
      </div>
    )
  }

  if (!location) {
    return (
      <div
        style={{ height }}
        className="panel flex flex-col items-center justify-center gap-3 text-center px-6"
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <p className="text-sm text-zinc-400 max-w-xs">
          Enable location or search a city to explore the interactive map
        </p>
      </div>
    )
  }

  const { lat, lng } = location.coords

  return (
    <div className="panel overflow-hidden flex flex-col" style={{ height }}>
      {showHeader && (
        <div className="panel-header !py-3 flex-wrap gap-2">
          <div>
            <p className="text-sm font-medium text-white">Live map</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {places.length} places · OpenStreetMap
            </p>
          </div>
          {loadingPlaces && (
            <span className="flex items-center gap-1.5 text-xs text-indigo-400">
              <span className="h-3 w-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
              Updating
            </span>
          )}
        </div>
      )}
      <div className="relative flex-1 min-h-0">
        <MapContainer
          center={[lat, lng]}
          zoom={zoom}
          className="h-full w-full z-0"
          zoomControl
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController lat={lat} lng={lng} zoom={zoom} />
          <Marker position={[lat, lng]} icon={userIcon}>
            <Popup>
              <div className="text-gray-900">
                <p className="font-semibold">Your location</p>
                <p className="text-xs text-gray-500 mt-0.5">{location.label}</p>
              </div>
            </Popup>
          </Marker>
          <PlaceMarkers places={places} />
        </MapContainer>
      </div>
      {showHeader && (
        <div className="px-4 py-3 border-t border-white/[0.06] bg-zinc-900/50">
          <MapLegend />
        </div>
      )}
    </div>
  )
}

