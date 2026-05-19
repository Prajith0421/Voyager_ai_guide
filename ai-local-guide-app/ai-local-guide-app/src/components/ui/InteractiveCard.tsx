import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface InteractiveCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  delay?: number
}

export default function InteractiveCard({
  children,
  className = '',
  onClick,
  disabled,
  delay = 0,
}: InteractiveCardProps) {
  const Component = onClick ? motion.button : motion.div

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={disabled ? undefined : { y: -4, scale: 1.01 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={`interactive-card glass rounded-2xl text-left w-full ${className} ${
        disabled ? 'opacity-60 cursor-wait' : onClick ? 'cursor-pointer' : ''
      }`}
    >
      {children}
    </Component>
  )
}
