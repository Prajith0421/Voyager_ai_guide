import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import type { ChatMessage as ChatMessageType } from '../../types'
import { IconSparkles } from '../ui/Icons'

interface ChatMessageProps {
  message: ChatMessageType
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {!isUser && (
        <motion.div
          className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center shrink-0 mt-0.5 shadow-glow"
          animate={{ boxShadow: ['0 0 20px rgba(139,92,246,0.3)', '0 0 28px rgba(59,130,246,0.35)', '0 0 20px rgba(139,92,246,0.3)'] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <IconSparkles className="w-4 h-4 text-white" />
        </motion.div>
      )}
      <div
        className={`max-w-[min(88%,480px)] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-md shadow-glow'
            : 'glass-panel rounded-bl-md border border-white/[0.08]'
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
        ) : (
          <div className="prose-chat">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  )
}
