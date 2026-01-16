'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function DebugAuth() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Log all auth events
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log('🔐 Auth Event:', event, {
            hasSession: !!session,
            userId: session?.user?.id,
            expiresAt: session?.expires_at,
            expiresIn: session?.expires_in
          })
        }
      )

      // Check storage
      const checkStorage = () => {
        const token = localStorage.getItem('sb-auth-token')
        console.log('🗄️ Storage check:', {
          hasToken: !!token,
          tokenLength: token?.length
        })
      }

      checkStorage()
      
      return () => {
        subscription.unsubscribe()
      }
    }
  }, [])

  return null
}

