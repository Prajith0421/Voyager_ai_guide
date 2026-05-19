import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-600/20 blur-[100px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-teal-500/15 blur-[90px]"
        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-indigo-500/15 blur-[80px]"
        animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}
