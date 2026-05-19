import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useChat } from '../../hooks/useChat'
import { useLocationContext } from '../../hooks/useLocationContext'
import { useAppUI } from '../../hooks/useAppUI'
import { IconSend, IconSparkles } from '../ui/Icons'
import ChatMessage from '../chat/ChatMessage'
import SuggestionChips from '../chat/SuggestionChips'
import CategoryChips from '../chat/CategoryChips'

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-center px-1">
      <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center shrink-0 shadow-glow">
        <IconSparkles className="w-4 h-4 text-white animate-pulse" />
      </div>
      <motion.div className="glass-panel px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5">
        <span className="typing-dot w-2 h-2 rounded-full bg-violet-400" />
        <span className="typing-dot w-2 h-2 rounded-full bg-violet-400" />
        <span className="typing-dot w-2 h-2 rounded-full bg-violet-400" />
      </motion.div>
    </div>
  )
}

export default function DashboardChat() {
  const { messages, loading, error, sendMessage, clearChat } = useChat()
  const { location, places, loadingPlaces } = useLocationContext()
  const { highlightedPlaces } = useAppUI()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const text = input
    setInput('')
    await sendMessage(text)
  }

  return (
    <section className="relative flex flex-col min-h-[300px] h-full glass-panel overflow-hidden">
      <div className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-white/[0.08] bg-gradient-to-r from-violet-500/10 via-transparent to-teal-500/5">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-glow"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <IconSparkles className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h2 className="text-sm font-bold text-white">Travel Companion</h2>
            <p className="text-[11px] text-slate-400 font-medium">
              {highlightedPlaces.length > 0
                ? `${highlightedPlaces.length} places highlighted on map`
                : location
                  ? `${places.length} verified places · ${location.label.split(',')[0]}`
                  : 'Search a destination to begin'}
              {loadingPlaces ? ' · syncing' : ''}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={clearChat}
          className="text-[11px] font-medium text-slate-500 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          Clear
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin min-h-0"
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {loading && <TypingIndicator />}
      </div>

      {error && (
        <p className="mx-4 mb-2 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <div className="shrink-0 p-4 border-t border-white/[0.08] space-y-3 bg-navy-900/40">
        <CategoryChips onSelect={sendMessage} disabled={loading || !location} />
        <SuggestionChips onSelect={sendMessage} disabled={loading || !location} />
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || !location}
            placeholder={location ? 'Ask about cafés, malls, hidden gems…' : 'Search a city to unlock AI guide'}
            className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-400/50 focus:shadow-glow disabled:opacity-50 transition-all"
          />
          <motion.button
            type="submit"
            disabled={loading || !input.trim() || !location}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 rounded-xl gradient-accent text-white disabled:opacity-40 shadow-glow"
          >
            <IconSend className="w-4 h-4" />
          </motion.button>
        </form>
      </div>
    </section>
  )
}
