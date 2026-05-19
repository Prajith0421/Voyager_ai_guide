import type { Coordinates } from '../types'

export function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

export function getCurrentPosition(): Promise<Coordinates> {
  return getCurrentLocation().then((pos) => ({
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
  }))
}
