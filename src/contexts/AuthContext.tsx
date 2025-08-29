import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { db, ensureUserExists } from '../lib/db'

type User = { id: string; email?: string | null; user_metadata?: Record<string, any>; email_confirmed_at?: string | null }
type Session = any


interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; message: string }>
  signOut: () => Promise<void>
  isEmailConfirmed: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false)

  useEffect(() => {
    // Get initial session
    db.auth.getSession().then(({ data, error }) => {
      if (error) console.error('getSession error:', error)
      setSession(data?.session ?? null)
      setUser((data?.session?.user as any) ?? null)
      setIsEmailConfirmed(!!(data?.session?.user as any)?.email_confirmed_at)
      // Ensure user row exists with a readable display name
      const u: any = data?.session?.user
      if (u?.id) {
        const dn = u.user_metadata?.full_name ||
                   (u.user_metadata?.first_name && u.user_metadata?.last_name
                    ? `${u.user_metadata.first_name} ${u.user_metadata.last_name}`
                    : (u.user_metadata?.first_name || null)) ||
                   (u.email ? u.email.split('@')[0] : null)
        ensureUserExists(u.id, u.email || null, dn).catch(() => {})
      }
      setLoading(false)
    })

    const { data: subscription } = db.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser((s?.user as any) ?? null)
      setIsEmailConfirmed(!!(s?.user as any)?.email_confirmed_at)
      const u: any = s?.user
      if (u?.id) {
        const dn = u.user_metadata?.full_name ||
                   (u.user_metadata?.first_name && u.user_metadata?.last_name
                    ? `${u.user_metadata.first_name} ${u.user_metadata.last_name}`
                    : (u.user_metadata?.first_name || null)) ||
                   (u.email ? u.email.split('@')[0] : null)
        ensureUserExists(u.id, u.email || null, dn).catch(() => {})
      }
      setLoading(false)
    })

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await db.auth.signInWithPassword({ email, password })
    if (error) return { success: false, message: error.message }
    if (data.user && !(data.user as any).email_confirmed_at) {
      return { success: false, message: 'Bevestig eerst je e‑mail.' }
    }
    return { success: true, message: 'Succesvol ingelogd!' }
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    const { data, error } = await db.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName } },
    })
    if (error) return { success: false, message: error.message }
    if (data.user) return { success: true, message: 'Account aangemaakt. Check je e‑mail om te bevestigen.' }
    return { success: true, message: 'Account aangemaakt.' }
  }

  const signOut = async () => {
    const { error } = await db.auth.signOut()
    if (error) throw error
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isEmailConfirmed,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
