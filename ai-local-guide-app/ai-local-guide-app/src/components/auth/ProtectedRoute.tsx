import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { IconLogo, IconSparkles } from '../ui/Icons'

function AuthLoadingScreen() {
  return (
    <motion.div
      className="relative min-h-screen flex flex-col items-center justify-center bg-navy-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="dashboard-bg" aria-hidden />
      <motion.div
        className="relative z-10 flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <IconLogo className="w-10 h-10" />
          <span className="text-lg font-bold text-white flex items-center gap-1.5">
            Voyager
            <IconSparkles className="w-4 h-4 text-violet-400" />
          </span>
        </div>
        <motion.div
          className="w-8 h-8 border-2 border-violet-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-sm text-slate-500">Checking session…</p>
      </motion.div>
    </motion.div>
  )
}

export default function ProtectedRoute() {
  const { user, loading, configured } = useAuth()
  const location = useLocation()

  if (loading) return <AuthLoadingScreen />

  if (!configured || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
