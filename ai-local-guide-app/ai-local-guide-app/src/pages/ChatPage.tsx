import AIChat from '../components/AIChat'
import WeatherCard from '../components/WeatherCard'
import PageHeader from '../components/ui/PageHeader'

export default function ChatPage() {
  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Assistant"
        title="AI travel assistant"
        subtitle="Ask questions about your location. Every answer is grounded in real nearby place data."
      />
      <WeatherCard compact />
      <AIChat fullHeight />
    </div>
  )
}
