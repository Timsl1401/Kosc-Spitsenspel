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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsEmailConfirmed(session?.user?.email_confirmed_at ? true : false)
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
        return { success: false, message: 'Please check your email and confirm your account before logging in.' }
      }
      
      return { success: true, message: 'Successfully logged in!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'An error occurred during sign in' }
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
      
      if (data.user && !data.user.email_confirmed_at) {
        return { success: true, message: 'Account created! Please check your email to confirm your account before logging in.' }
      }
      
      return { success: true, message: 'Account created successfully!' }
    } catch (error: any) {
      return { success: false, message: error.message || 'An error occurred during sign up' }
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
