import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useLocationContext } from '../hooks/useLocationContext'
import AnimatedBackground from '../components/ui/AnimatedBackground'
import { IconLogo } from '../components/ui/Icons'

export default function ProfilePage() {
  const { user, configured, logout } = useAuth()
  const { location, places } = useLocationContext()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden bg-navy-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="dashboard-bg" aria-hidden />
      <AnimatedBackground />

      <motion.div
        className="relative z-10 h-screen overflow-y-auto p-6 max-w-md mx-auto scrollbar-thin"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs text-violet-300 hover:text-violet-200 mb-6 transition-colors"
        >
          ← Dashboard
        </Link>

        <motion.div
          className="flex items-center gap-3 mb-6"
          whileHover={{ x: -2 }}
        >
          <IconLogo className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-white">Account</h1>
        </motion.div>

        <motion.div
          className="glass-panel p-5 space-y-4"
          whileHover={{ borderColor: 'rgba(139, 92, 246, 0.3)' }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-lg font-bold text-white shadow-glow"
              animate={{ boxShadow: ['0 0 20px rgba(139,92,246,0.3)', '0 0 32px rgba(99,102,241,0.4)', '0 0 20px rgba(139,92,246,0.3)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {user.email?.[0]?.toUpperCase()}
            </motion.div>
            <motion.div>
              <p className="text-white font-medium">{user.email}</p>
              <p className="text-xs text-slate-500">Voyager member</p>
            </motion.div>
          </div>

          {location && (
            <motion.p
              className="text-xs text-slate-400 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Exploring {location.label} · {places.length} places nearby
            </motion.p>
          )}

          {!configured && (
            <p className="text-xs text-slate-400">
              Supabase is not configured in .env
            </p>
          )}

          <motion.button
            type="button"
            onClick={handleLogout}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium transition-colors"
          >
            Sign out
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
