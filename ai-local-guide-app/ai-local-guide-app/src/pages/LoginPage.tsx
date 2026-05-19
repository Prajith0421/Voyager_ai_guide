import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import AnimatedBackground from '../components/ui/AnimatedBackground'
import { IconLogo, IconSparkles } from '../components/ui/Icons'

const DASHBOARD_PATH = '/'

export default function LoginPage() {
  const { user, configured, signIn, signUp, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      const from = (location.state as { from?: string } | null)?.from
      const dest = from && from !== '/login' ? from : DASHBOARD_PATH
      navigate(dest, { replace: true })
    }
  }, [user, navigate, location.state])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (isSignUp) await signUp(email, password)
      else await signIn(email, password)
      const from = (location.state as { from?: string } | null)?.from
      navigate(from && from !== '/login' ? from : DASHBOARD_PATH, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-navy-950">
      <div className="dashboard-bg" aria-hidden />
      <AnimatedBackground />

      <motion.div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <IconLogo className="w-12 h-12" />
              <div className="text-left">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  Voyager
                  <IconSparkles className="w-4 h-4 text-violet-400" />
                </h1>
                <p className="text-xs text-slate-400 font-medium tracking-wide">
                  AI Travel Companion
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              {isSignUp
                ? 'Create an account to access Voyager.'
                : 'Sign in to access your AI travel companion.'}
            </p>
          </div>

          {!configured ? (
            <motion.div className="glass-panel p-6 text-center">
              <p className="text-sm text-slate-300">
                Authentication is not configured yet.
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file to enable sign in.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl bg-navy-950/80 border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-400/50 focus:ring-1 focus:ring-violet-400/30 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-slate-400 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  className="w-full px-4 py-3 rounded-xl bg-navy-950/80 border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-400/50 focus:ring-1 focus:ring-violet-400/30 transition-colors"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || loading}
                className="w-full py-3 rounded-xl gradient-accent text-white text-sm font-semibold shadow-glow hover:opacity-95 disabled:opacity-50 transition-all btn-interactive"
              >
                {submitting ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError(null)
                }}
                className="w-full text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
