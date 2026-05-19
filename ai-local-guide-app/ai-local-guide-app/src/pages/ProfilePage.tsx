import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useLocationContext } from '../hooks/useLocationContext'

export default function ProfilePage() {
  const { user, configured, signIn, signUp, logout, loading } = useAuth()
  const { location, places } = useLocationContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (isSignUp) await signUp(email, password)
      else await signIn(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Auth failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="h-screen overflow-y-auto bg-zinc-950 p-6 max-w-md mx-auto scrollbar-thin">
      <Link to="/" className="text-xs text-indigo-400 hover:text-indigo-300 mb-6 inline-block">
        ← Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-white mb-6">Account</h1>

      {user ? (
        <div className="glass rounded-xl p-5 space-y-4">
          <p className="text-white font-medium">{user.email}</p>
          {location && (
            <p className="text-xs text-zinc-500">
              Area: {location.label} · {places.length} places
            </p>
          )}
          <button
            type="button"
            onClick={logout}
            className="w-full py-2 rounded-lg border border-red-500/30 text-red-400 text-sm"
          >
            Sign out
          </button>
        </div>
      ) : configured ? (
        <form onSubmit={handleSubmit} className="glass rounded-xl p-5 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-sm text-white"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
            className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-sm text-white"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full py-2 rounded-lg gradient-accent text-white text-sm font-medium disabled:opacity-50"
          >
            {isSignUp ? 'Sign up' : 'Sign in'}
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-xs text-zinc-500"
          >
            {isSignUp ? 'Have an account? Sign in' : 'Create account'}
          </button>
        </form>
      ) : (
        <p className="text-sm text-zinc-400">
          Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env
        </p>
      )}
    </div>
  )
}
