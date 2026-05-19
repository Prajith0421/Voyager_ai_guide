import { Navigate, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'

function AuthLoadingScreen() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-navy-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  )
}

export default function GuestRoute() {
  const { user, loading } = useAuth()

  if (loading) return <AuthLoadingScreen />

  if (user) return <Navigate to="/" replace />

  return <Outlet />
}
