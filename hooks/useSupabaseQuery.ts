import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export const useSupabaseQuery = <T = any>(
  table: string,
  queryFn: (supabaseClient: typeof supabase) => Promise<{ data: T | null; error: any }>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { session, isInitialized } = useAuth()

  const executeQuery = useCallback(async () => {
    if (!session || !isInitialized) {
      console.log('Query skipped: No session or not initialized')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      // Add a small delay to ensure token is ready
      await new Promise(resolve => setTimeout(resolve, 50))
      
      const result = await queryFn(supabase)
      
      if (result.error) {
        // Check for specific auth errors
        if (result.error.message?.includes('JWT') || result.error.message?.includes('token')) {
          console.error('Auth token error, attempting refresh...')
          // Try to refresh session
          const { data: { session: newSession }, error: refreshError } = 
            await supabase.auth.refreshSession()
          
          if (refreshError) {
            throw new Error('Session refresh failed')
          }
          
          // Retry query with new session
          const retryResult = await queryFn(supabase)
          if (retryResult.error) throw retryResult.error
          
          setData(retryResult.data)
        } else {
          throw result.error
        }
      } else {
        setData(result.data)
      }
    } catch (err: any) {
      console.error(`Error fetching from ${table}:`, err)
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [session, isInitialized, table, ...dependencies])

  useEffect(() => {
    executeQuery()
  }, [executeQuery])

  const refetch = () => {
    executeQuery()
  }

  return { data, error, isLoading, refetch }
}

