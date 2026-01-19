import { supabase } from './supabase/client'
import { getValidSession } from './supabase-session'

/**
 * Profile API utilities
 */

export interface Profile {
  id: string
  user_type: 'influencer' | 'business'
  full_name?: string
  username?: string
  avatar_url?: string
  bio?: string
  phone?: string
  location?: string
  website_url?: string
  followers_count?: number
  engagement_rate?: number
  niche?: string
  instagram_handle?: string
  tiktok_handle?: string
  // Business fields
  business_name?: string
  business_category?: string
  business_description?: string
  business_location?: string
  business_address?: string
  business_phone?: string
  business_email?: string
  business_website?: string
  business_instagram?: string
  business_tiktok?: string
  business_logo?: string
  metadata?: any // JSONB field for storing gallery images, videos, content highlights, etc.
  created_at: string
  updated_at: string
}

/**
 * Get current user profile
 */
export async function getCurrentUserProfile(retries = 2) {
  try {
    // Ensure session is ready before querying
    const { session, error: sessionError } = await getValidSession()
    if (sessionError || !session?.user) {
      return { data: null, error: { message: 'Not authenticated' } }
    }

    let lastError = null;
    
    // Retry logic in case profile is still being created by trigger
    for (let i = 0; i <= retries; i++) {
      if (i > 0) {
        // Wait a bit before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 500 * i));
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (!error && data) {
        // Safely parse metadata if it's a string
        if (data.metadata && typeof data.metadata === 'string') {
          try {
            data.metadata = JSON.parse(data.metadata)
          } catch {
            data.metadata = {}
          }
        }
        return { data: data as Profile, error: null }
      }

      lastError = error;

      // If profile doesn't exist and we have retries left, try again
      if (error?.code === 'PGRST116' && i < retries) {
        continue;
      }

      // If it's a different error or no retries left, break
      if (error?.code !== 'PGRST116') {
        break;
      }
    }

    // If profile still doesn't exist after retries, return error
    if (lastError?.code === 'PGRST116') {
      console.warn('Profile not found for user after retries:', session.user.id)
      return { data: null, error: { message: 'Profile not found' } }
    }

    throw lastError;
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Get profile by user ID
 */
export async function getProfileByUserId(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return { data: data as Profile, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Update profile
 */
export async function updateProfile(updates: Partial<Profile>) {
  try {
    // Ensure session is ready before updating
    const { session, error: sessionError } = await getValidSession()
    if (sessionError || !session?.user) {
      return { data: null, error: { message: 'Not authenticated' } }
    }

    // Remove fields that shouldn't be updated
    const { id, email, created_at, user_type, ...safeUpdates } = updates as any

    // Filter out undefined values but keep null (to allow clearing fields)
    const cleanUpdates: any = {}
    Object.keys(safeUpdates).forEach(key => {
      if (safeUpdates[key] !== undefined) {
        // Allow null values to clear fields, but filter out undefined
        // Convert empty strings to null for consistency, but preserve non-empty strings
        const value = safeUpdates[key]
        if (value === null) {
          cleanUpdates[key] = null
        } else if (typeof value === 'string') {
          // Trim and convert empty strings to null, but keep non-empty strings
          cleanUpdates[key] = value.trim() === '' ? null : value.trim()
        } else {
          cleanUpdates[key] = value
        }
      }
    })

    // Ensure numeric fields are properly typed
    if (cleanUpdates.followers_count !== undefined && cleanUpdates.followers_count !== null) {
      cleanUpdates.followers_count = parseInt(cleanUpdates.followers_count) || 0;
    }
    if (cleanUpdates.engagement_rate !== undefined && cleanUpdates.engagement_rate !== null) {
      cleanUpdates.engagement_rate = parseFloat(cleanUpdates.engagement_rate) || 0;
    }

    // Don't override updated_at if it's already set
    if (!cleanUpdates.updated_at) {
      cleanUpdates.updated_at = new Date().toISOString()
    }
    
    console.log('Cleaned updates for database:', cleanUpdates)
    console.log('Updating user ID:', session.user.id)

    // Update profile (Supabase has built-in timeout handling)
    const { data, error } = await supabase
      .from('profiles')
      .update(cleanUpdates)
      .eq('id', session.user.id)
      .select()
      .single()

    if (error) {
      console.error('Profile update error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      throw error
    }
    
    console.log('Update successful, returned data:', data)
    return { data: data as Profile, error: null }
  } catch (error: any) {
    // Handle AbortError gracefully
    if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
      console.warn('Profile update was aborted')
      return { data: null, error: { message: 'Request was cancelled' } }
    }
    console.error('Update profile error:', error)
    return { data: null, error }
  }
}

