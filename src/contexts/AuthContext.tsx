import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
type User = { id: string; email?: string | null; user_metadata?: Record<string, any> }
type Session = null


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
    // Minimal local auth: anonymous user by default
    setUser(null)
    setSession(null)
    setIsEmailConfirmed(true)
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Local stub: treat any credentials as a login
    const anonUser: User = { id: 'local-user', email }
    setUser(anonUser)
    return { success: true, message: 'Ingelogd (lokaal)' }
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    // Local stub: auto-login
    const anonUser: User = { id: 'local-user', email, user_metadata: { first_name: firstName, last_name: lastName } }
    setUser(anonUser)
    return { success: true, message: 'Account aangemaakt (lokaal)' }
  }

  const signOut = async () => {
    setUser(null)
    setSession(null)
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
