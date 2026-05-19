import L from 'leaflet'

export const userIcon = new L.DivIcon({
  className: 'user-location-marker',
  html: '<div class="user-pulse"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

const CATEGORY_COLORS: Record<string, string> = {
  cafe: '#f59e0b',
  restaurant: '#f97316',
  attraction: '#a78bfa',
  park: '#34d399',
  mall: '#60a5fa',
  museum: '#f472b6',
  nightlife: '#c084fc',
  hotel: '#22d3ee',
}

export function categoryIcon(category: string, highlighted = false): L.DivIcon {
  const color = CATEGORY_COLORS[category] ?? '#818cf8'
  const size = highlighted ? 20 : 14
  const glow = highlighted
    ? `box-shadow:0 0 0 4px ${color}55, 0 0 16px ${color}99;`
    : `box-shadow:0 2px 8px ${color}66;`
  return new L.DivIcon({
    className: highlighted ? 'place-marker-highlight' : 'place-marker',
    html: `<div class="${highlighted ? 'place-dot-highlight' : 'place-dot'}" style="background:${color};width:${size}px;height:${size}px;${glow}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}
