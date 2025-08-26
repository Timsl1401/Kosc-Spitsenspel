import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { useSupabase } from './SupabaseContext'


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
  const { supabase } = useSupabase()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error)
      }
      setSession(session)
      setUser(session?.user ?? null)
      setIsEmailConfirmed(session?.user?.email_confirmed_at ? true : false)
      setLoading(false)
    }).catch((error) => {
      console.error('Error in getSession:', error)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsEmailConfirmed(session?.user?.email_confirmed_at ? true : false)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        return { success: false, message: error.message }
      }
      
      if (data.user && !data.user.email_confirmed_at) {
        return { success: false, message: 'Je account is nog niet bevestigd. Controleer je email (inclusief reclame/spam mappen) en klik op de bevestigingslink voordat je inlogt.' }
      }
      
      return { success: true, message: 'Succesvol ingelogd!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Er is een fout opgetreden bij het inloggen' }
    }
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      })
      
      if (error) {
        return { success: false, message: error.message }
      }
      
      if (data.user) {
        return { success: true, message: 'Account aangemaakt! Controleer je email (inclusief reclame/spam mappen) om je account te bevestigen voordat je inlogt.' }
      }
      
      return { success: true, message: 'Account succesvol aangemaakt!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'Er is een fout opgetreden bij het aanmaken van je account' }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
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
