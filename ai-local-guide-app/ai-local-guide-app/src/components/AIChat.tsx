import { useEffect, useRef, useState } from 'react'
import { useChat } from '../hooks/useChat'
import { useLocationContext } from '../hooks/useLocationContext'
import SuggestionCards from './SuggestionCards'
import { IconSend, IconSparkles } from './ui/Icons'

interface AIChatProps {
  fullHeight?: boolean
}

export default function AIChat({ fullHeight = false }: AIChatProps) {
  const { messages, loading, error, sendMessage, clearChat } = useChat()
  const { location, places, loadingPlaces } = useLocationContext()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const text = input
    setInput('')
    await sendMessage(text)
  }

  return (
    <div
      className={`panel flex flex-col overflow-hidden ${
        fullHeight ? 'h-[calc(100vh-10rem)]' : 'h-[min(680px,70vh)]'
      }`}
    >
      <div className="panel-header">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
            <IconSparkles className="w-[18px] h-[18px]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">AI Assistant</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {location
                ? `${places.length} verified places`
                : 'Awaiting location'}
              {loadingPlaces && ' · syncing'}
            </p>
          </div>
        </div>
        <button type="button" onClick={clearChat} className="btn-ghost text-xs">
          Clear chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 animate-fade-in ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400 mt-0.5">
                <IconSparkles className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-md'
                  : 'bg-zinc-800/80 text-zinc-200 border border-white/[0.06] rounded-bl-md'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15">
              <IconSparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            </div>
            <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-zinc-800/80 border border-white/[0.06]">
              <div className="flex gap-1">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="mx-4 mb-2 px-3 py-2 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg">
          {error}
        </p>
      )}

      <div className="p-4 border-t border-white/[0.06] bg-zinc-900/30 space-y-3">
        <SuggestionCards onSelect={sendMessage} disabled={loading || !location} />
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || !location}
            placeholder={
              location
                ? 'Ask about places, itineraries, recommendations...'
                : 'Set a location to start chatting'
            }
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || !location}
            className="btn-primary !px-3.5"
            aria-label="Send message"
          >
            <IconSend className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}

