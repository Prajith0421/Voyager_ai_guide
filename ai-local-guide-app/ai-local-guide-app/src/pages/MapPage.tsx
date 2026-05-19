import SearchBar from '../components/SearchBar'
import TravelMap from '../components/TravelMap'
import WeatherCard from '../components/WeatherCard'
import PageHeader from '../components/ui/PageHeader'
import { useLocationContext } from '../hooks/useLocationContext'

export default function MapPage() {
  const { places } = useLocationContext()

  return (
    <div className="p-5 md:p-8 h-[calc(100vh-72px)] lg:h-screen flex flex-col gap-6 animate-fade-in">
      <PageHeader
        eyebrow="Explore"
        title="Map explorer"
        subtitle={`${places.length} verified places from OpenStreetMap in your area.`}
        action={<div className="w-full sm:w-80"><SearchBar /></div>}
      />

      <div className="flex-1 grid lg:grid-cols-4 gap-5 min-h-0">
        <div className="lg:col-span-3 min-h-[360px]">
          <TravelMap height="100%" zoom={15} showHeader={false} />
        </div>
        <WeatherCard compact />
      </div>
    </div>
  )
}
