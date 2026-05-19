const WMO_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail',
}

export function weatherDescription(code: number): string {
  return WMO_CODES[code] ?? 'Unknown'
}

export function weatherEmoji(code: number): string {
  if (code === 0 || code === 1) return 'â˜€ï¸'
  if (code === 2) return 'â›…'
  if (code === 3) return 'â˜ï¸'
  if (code >= 45 && code <= 48) return 'ðŸŒ«ï¸'
  if (code >= 51 && code <= 67) return 'ðŸŒ§ï¸'
  if (code >= 71 && code <= 77) return 'â„ï¸'
  if (code >= 80 && code <= 82) return 'ðŸŒ¦ï¸'
  if (code >= 95) return 'â›ˆï¸'
  return 'ðŸŒ¡ï¸'
}
