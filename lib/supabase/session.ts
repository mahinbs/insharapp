import { supabase } from './client'

export const forceSessionRefresh = async () => {
  try {
    console.log('Forcing session refresh...')
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Error getting session:', sessionError)
      return null
    }

    if (!session) {
      console.log('No session found')
      return null
    }

    // Refresh the session
    const { data: { session: refreshedSession }, error: refreshError } = 
      await supabase.auth.refreshSession()

    if (refreshError) {
      console.error('Error refreshing session:', refreshError)
      return null
    }

    console.log('Session refreshed successfully')
    return refreshedSession
  } catch (error) {
    console.error('Force refresh error:', error)
    return null
  }
}

// Use this before critical operations
export const ensureValidSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session) {
    return await forceSessionRefresh()
  }
  
  // Check if token is about to expire (within 5 minutes)
  const expiresAt = session.expires_at ? session.expires_at * 1000 : null
  if (expiresAt && Date.now() > expiresAt - 5 * 60 * 1000) {
    return await forceSessionRefresh()
  }
  
  return session
}

