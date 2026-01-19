import { supabase } from './supabase/client'

/**
 * Ensure session is ready before making queries
 * This prevents queries from hanging when session is not yet available
 */
export async function ensureSessionReady(maxWaitMs = 5000): Promise<{ session: any; error: any }> {
  try {
    // First, try to get session immediately
    let { data: { session }, error } = await supabase.auth.getSession()
    
    if (session && !error) {
      return { session, error: null }
    }

    // If no session, wait a bit and try again (in case it's still being established)
    const startTime = Date.now()
    while (Date.now() - startTime < maxWaitMs) {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const result = await supabase.auth.getSession()
      session = result.data.session
      error = result.error
      
      if (session && !error) {
        return { session, error: null }
      }
      
      // If we get an error that's not "no session", return it
      if (error && error.message !== 'No session found') {
        return { session: null, error }
      }
    }

    // If we still don't have a session after waiting, return error
    return { session: null, error: { message: 'Session not available' } }
  } catch (error: any) {
    return { session: null, error }
  }
}

/**
 * Get current session with automatic refresh if needed
 */
export async function getValidSession(): Promise<{ session: any; error: any }> {
  try {
    // Try getUser first (this auto-refreshes if needed)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      // If getUser fails, try getSession
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        return { session: null, error: { message: 'Not authenticated' } }
      }
      
      // Try to refresh if session exists but user is null
      if (session.refresh_token) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
        if (!refreshError && refreshData.session) {
          return { session: refreshData.session, error: null }
        }
      }
      
      return { session, error: null }
    }
    
    // If we have a user, get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return { session: null, error: { message: 'Session not found' } }
    }
    
    return { session, error: null }
  } catch (error: any) {
    return { session: null, error }
  }
}

