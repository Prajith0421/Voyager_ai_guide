import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useChat } from '../../hooks/useChat'
import { useLocationContext } from '../../hooks/useLocationContext'
import { IconSend, IconSparkles } from '../ui/Icons'
import ChatMessage from './ChatMessage'
import SuggestionChips from './SuggestionChips'

export default function ChatPanel() {
  const { messages, loading, error, sendMessage, clearChat } = useChat()
  const { location, places, loadingPlaces } = useLocationContext()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const text = input
    setInput('')
    await sendMessage(text)
  }

  return (
    <div className="flex flex-col h-full min-h-0 glass rounded-2xl overflow-hidden">
      <header className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow">
            <IconSparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white">AI Assistant</h1>
            <p className="text-xs text-zinc-500">
              {location
                ? `${places.length} places · ${location.label.split(',')[0]}`
                : 'Set a location to begin'}
              {loadingPlaces && ' · syncing'}
            </p>
          </div>
        </div>
        <button type="button" onClick={clearChat} className="text-xs text-zinc-500 hover:text-zinc-300 px-2 py-1">
          Clear
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-5 scrollbar-thin">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-xl gradient-accent flex items-center justify-center shrink-0">
              <IconSparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="glass rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5 items-center">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full bg-zinc-500"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {error && (
        <p className="mx-4 mb-2 px-3 py-2 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl">
          {error}
        </p>
      )}

      <footer className="shrink-0 p-4 border-t border-white/[0.06] bg-surface-1/50 space-y-3">
        <SuggestionChips onSelect={sendMessage} disabled={loading || !location} />
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || !location}
            placeholder={
              location ? 'Ask about places, itineraries, recommendations...' : 'Search a city or use GPS first'
            }
            className="flex-1 px-4 py-3.5 rounded-xl bg-zinc-950/80 border border-white/[0.08] text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/15 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || !location}
            className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-white disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0"
          >
            <IconSend className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  )
}
