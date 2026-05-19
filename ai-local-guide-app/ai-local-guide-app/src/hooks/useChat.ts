import { useCallback, useRef, useState } from 'react'
import { askGemini } from '../services/gemini'
import { matchPlacesInText } from '../utils/placeMatching'
import type { ChatMessage } from '../types'
import { useAppUI } from './useAppUI'
import { useLocationContext } from './useLocationContext'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useChat() {
  const { location, places, weather } = useLocationContext()
  const { focusPlacesOnMap } = useAppUI()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Welcome, explorer. I'm your AI travel companion — synced with live places on your map. Ask about cafés, malls, hidden gems, or let me plan your perfect day.",
      timestamp: Date.now(),
    },
  ])
  const messagesRef = useRef(messages)
  messagesRef.current = messages

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return
      if (!location) {
        setError('Please enable location or search for a city first.')
        return
      }

      const userMsg: ChatMessage = {
        id: uid(),
        role: 'user',
        content: text.trim(),
        timestamp: Date.now(),
      }

      const updated = [...messagesRef.current, userMsg]
      setMessages(updated)
      setLoading(true)
      setError(null)

      try {
        const history = updated.filter((m) => m.id !== 'welcome')
        const reply = await askGemini(text, location, places, weather, history)

        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: 'assistant',
            content: reply,
            timestamp: Date.now(),
          },
        ])

        const mentioned = matchPlacesInText(reply, places)
        if (mentioned.length > 0) {
          focusPlacesOnMap(mentioned)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'AI request failed')
      } finally {
        setLoading(false)
      }
    },
    [location, places, weather, loading, focusPlacesOnMap]
  )

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Chat cleared. What would you like to explore on the map?',
        timestamp: Date.now(),
      },
    ])
    setError(null)
    focusPlacesOnMap([])
  }, [focusPlacesOnMap])

  return { messages, loading, error, sendMessage, clearChat }
}
