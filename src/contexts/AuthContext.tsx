import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { useSupabase } from './SupabaseContext'
import { sendVerificationEmail, generateVerificationCode } from '../utils/emailService'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; message: string }>
  signOut: () => Promise<void>
  verifyEmail: (code: string) => Promise<{ success: boolean; message: string }>
  resendVerificationCode: () => Promise<{ success: boolean; message: string }>
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
      
      // Check if user is verified using our custom system
      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('verification_codes')
          .select('*')
          .eq('user_id', data.user.id)
          .eq('used', true)
          .single();
        
        if (userError || !userData) {
          return { success: false, message: 'Je account is nog niet geverifieerd. Controleer je email voor de verificatiecode.' }
        }
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
          },
          emailRedirectTo: undefined, // Disable Supabase email
          emailConfirm: false // Disable Supabase email confirmation
        }
      })
      
      if (error) {
        return { success: false, message: error.message }
      }
      
      if (data.user) {
        // Generate verification code
        const verificationCode = generateVerificationCode();
        
        // Set verification code in database
        const { error: codeError } = await supabase.rpc('set_verification_code', {
          user_email: email
        });
        
        if (codeError) {
          console.error('Error setting verification code:', codeError);
        }
        
        // Send verification email
        const emailSent = await sendVerificationEmail(email, verificationCode);
        
        if (emailSent) {
          return { success: true, message: 'Account created! Check your email for verification code.' }
        } else {
          return { success: false, message: 'Account created but failed to send verification email.' }
        }
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

  const verifyEmail = async (code: string) => {
    try {
      // Call the verify_user_code function in Supabase
      const { data, error } = await supabase.rpc('verify_user_code', {
        user_email: user?.email || '',
        input_code: code
      })
      
      if (error) {
        return { success: false, message: error.message }
      }
      
      if (data) {
        // Update local state
        setIsEmailConfirmed(true)
        return { success: true, message: 'Email successfully verified!' }
      } else {
        return { success: false, message: 'Ongeldige of verlopen verificatiecode' }
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'An error occurred during email verification' }
    }
  }

  const resendVerificationCode = async () => {
    try {
      // Generate new verification code
      const verificationCode = generateVerificationCode();
      
      // Set new verification code in database
      const { error: codeError } = await supabase.rpc('set_verification_code', {
        user_email: user?.email || ''
      });
      
      if (codeError) {
        return { success: false, message: codeError.message }
      }
      
      // Send new verification email
      const emailSent = await sendVerificationEmail(user?.email || '', verificationCode);
      
      if (emailSent) {
        return { success: true, message: 'Verification code resent!' }
      } else {
        return { success: false, message: 'Failed to send verification email' }
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'An error occurred while resending the code' }
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    verifyEmail,
    resendVerificationCode,
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
