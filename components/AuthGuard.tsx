'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export default function AuthGuard({ 
  children, 
  requireAuth = true,
  redirectTo = '/auth'
}: AuthGuardProps) {
  const { user, loading, isInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isInitialized) {
      if (requireAuth && !user) {
        router.push(redirectTo)
      } else if (!requireAuth && user) {
        router.push('/business/home')
      }
    }
  }, [user, loading, isInitialized, requireAuth, redirectTo, router])

  // Show loading while checking auth
  if (loading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  // Check if auth requirements are met
  if ((requireAuth && !user) || (!requireAuth && user)) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}

