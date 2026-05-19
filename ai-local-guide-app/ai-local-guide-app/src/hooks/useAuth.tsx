import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import {
  getSession,
  getSupabase,
  isSupabaseConfigured,
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from '../services/supabase'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  configured: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const configured = isSupabaseConfigured()

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }

    getSession().then((s) => {
      setSession(s)
      setUser(s?.user ?? null)
      setLoading(false)
    })

    const sb = getSupabase()
    if (!sb) return

    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [configured])

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await signInWithEmail(email, password)
    if (error) throw error
    if (data.session) {
      setSession(data.session)
      setUser(data.session.user)
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    const { data, error } = await signUpWithEmail(email, password)
    if (error) throw error
    if (data.session) {
      setSession(data.session)
      setUser(data.session.user)
      return
    }
    if (data.user) {
      throw new Error('Account created. Check your email to confirm, then sign in.')
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut()
    setUser(null)
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({ user, session, loading, configured, signIn, signUp, logout }),
    [user, session, loading, configured, signIn, signUp, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
