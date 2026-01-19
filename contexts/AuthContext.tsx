'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { getCurrentUserProfile, type Profile } from '@/lib/supabase-profile'
import type { User, Session } from '@supabase/supabase-js'

// Extend Profile to include email (which comes from user object)
type ProfileWithEmail = Profile & {
  email?: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: ProfileWithEmail | null
  loading: boolean
  isInitialized: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  isInitialized: false,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<ProfileWithEmail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        setLoading(true)
        
        // Get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setUser(null)
          setSession(null)
          setProfile(null)
          setIsInitialized(true) // Still mark as initialized even on error
          setLoading(false)
          return
        }
        
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
        
        // Set initialized immediately - don't wait for profile
        setIsInitialized(true)
        setLoading(false)
        
        // Load profile in background (don't block on it)
        if (currentSession?.user) {
          loadProfile(currentSession.user.id, currentSession.user.email).catch(err => {
            console.error('Background profile load error:', err)
            // Don't set loading to false here - it's already false
          })
        }
        
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log('🔐 Auth Event:', event, {
              hasSession: !!newSession,
              userId: newSession?.user?.id,
              expiresAt: newSession?.expires_at,
              expiresIn: newSession?.expires_in
            })
            
            setSession(newSession)
            setUser(newSession?.user ?? null)
            
            // Handle specific auth events
            if (event === 'SIGNED_IN') {
              // Force a small delay to ensure token is ready
              await new Promise(resolve => setTimeout(resolve, 200))
              if (newSession?.user) {
                // Load profile in background
                loadProfile(newSession.user.id, newSession.user.email).catch(err => {
                  console.error('Profile load error after sign in:', err)
                })
              }
              router.refresh()
            } else if (event === 'SIGNED_OUT') {
              setProfile(null)
              setLoading(false)
              router.push('/auth')
            } else if (event === 'TOKEN_REFRESHED') {
              console.log('Token refreshed successfully')
              if (newSession?.user) {
                loadProfile(newSession.user.id, newSession.user.email).catch(err => {
                  console.error('Profile load error after token refresh:', err)
                })
              }
            } else if (newSession?.user) {
              // For other events, load profile if we have a user
              loadProfile(newSession.user.id, newSession.user.email).catch(err => {
                console.error('Profile load error:', err)
              })
            } else {
              setProfile(null)
              setLoading(false)
            }
          }
        )
        
        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setUser(null)
        setSession(null)
        setProfile(null)
        setIsInitialized(true) // Still mark as initialized
        setLoading(false)
      }
    }

    initializeAuth()
  }, [router])

  async function loadProfile(userId: string, userEmail?: string) {
    try {
      console.log('Loading profile for user:', userId)
      
      // Add timeout to prevent hanging
      const profilePromise = (async () => {
        // Retry logic in case profile is still being created
        let retries = 0
        const maxRetries = 2
        let profileData: Profile | null = null

        while (retries < maxRetries && !profileData) {
          const { data, error } = await getCurrentUserProfile()
          
          if (!error && data) {
            profileData = data
            break
          }

          // If profile doesn't exist yet, wait and retry
          if (error && retries < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, 300 * (retries + 1)))
            retries++
          } else {
            console.warn('Error loading profile:', error)
            break
          }
        }

        return profileData
      })()

      // Increased timeout to 10 seconds to handle slower connections
      const timeoutPromise = new Promise<null>((resolve) => {
        const timeoutId = setTimeout(() => {
          // Don't log as warning - it's expected in some cases
          resolve(null)
        }, 10000)
        
        // Clear timeout if profile loads successfully
        profilePromise.then(() => {
          clearTimeout(timeoutId)
        }).catch(() => {
          clearTimeout(timeoutId)
        })
      })

      const profileData = await Promise.race([profilePromise, timeoutPromise])

      if (profileData) {
        // Get email from parameter, or fallback to current state
        const emailToUse = userEmail || user?.email || session?.user?.email || undefined
        // Create profile with email - properly typed
        const profileWithEmail: ProfileWithEmail = {
          ...profileData,
          email: emailToUse
        }
        setProfile(profileWithEmail)
        console.log('Profile loaded successfully')
      } else {
        console.warn('No profile data loaded')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      // Don't set loading to false here - it's managed elsewhere
    }
  }

  async function signOut() {
    setLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
    setLoading(false)
    router.push('/auth')
  }

  const value = {
    user,
    session,
    profile,
    loading,
    isInitialized,
    signOut: async () => {
      setLoading(true)
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      setProfile(null)
      setLoading(false)
      router.push('/auth')
    },
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

/**
 * Hook to ensure session is ready before making queries
 * Returns true when session is ready, false otherwise
 */
export function useSessionReady() {
  const { session, loading } = useAuth()
  return !loading && !!session
}



