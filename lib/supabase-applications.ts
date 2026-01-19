import { supabase } from './supabase/client'
import { getValidSession } from './supabase-session'

/**
 * Applications API utilities
 */

export interface Application {
  id: string
  offer_id: string
  influencer_id: string
  status: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'expired'
  message?: string
  scheduled_date?: string
  scheduled_time?: string
  number_of_people?: number
  applied_at: string
  responded_at?: string
  offer?: any
  influencer?: any
}

/**
 * Apply to an offer
 */
export async function applyToOffer(data: {
  offerId: string
  message?: string
  scheduledDate?: string
  scheduledTime?: string
  numberOfPeople?: number
}) {
  try {
    // Retry getting session with a small delay to handle race conditions
    let retries = 3
    let session = null
    let sessionError = null
    
    while (retries > 0) {
      const result = await getValidSession()
      session = result.session
      sessionError = result.error
      
      if (session?.user) {
        break
      }
      
      if (retries > 1) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
      retries--
    }
    
    if (sessionError || !session?.user) {
      return { data: null, error: { message: 'Not authenticated' } }
    }
    const user = session.user

    // Verify user is an influencer before creating application
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return { 
        data: null, 
        error: { message: 'Profile not found. Please complete your profile first.' } 
      }
    }

    if (profile.user_type !== 'influencer') {
      return { 
        data: null, 
        error: { message: 'Only influencers can apply to offers.' } 
      }
    }

    // Verify the offer exists and is active
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('id, status, business_id')
      .eq('id', data.offerId)
      .single()

    if (offerError || !offer) {
      return { 
        data: null, 
        error: { message: 'Offer not found.' } 
      }
    }

    if (offer.status !== 'active') {
      return { 
        data: null, 
        error: { message: 'This offer is no longer active.' } 
      }
    }

    // Check if user already applied to this offer
    const { data: existingApplication } = await supabase
      .from('applications')
      .select('id, status')
      .eq('offer_id', data.offerId)
      .eq('influencer_id', user.id)
      .single()

    if (existingApplication) {
      if (existingApplication.status === 'pending' || existingApplication.status === 'accepted') {
        return { 
          data: null, 
          error: { message: 'You have already applied to this offer.' } 
        }
      }
    }

    // Create the application
    const { data: application, error } = await supabase
      .from('applications')
      .insert({
        offer_id: data.offerId,
        influencer_id: user.id,
        message: data.message,
        scheduled_date: data.scheduledDate,
        scheduled_time: data.scheduledTime,
        number_of_people: data.numberOfPeople,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      // Provide more helpful error messages
      if (error.code === '42501' || error.message?.includes('row-level security')) {
        return { 
          data: null, 
          error: { 
            message: 'Permission denied. Please ensure you are logged in as an influencer and your profile is complete.' 
          } 
        }
      }
      throw error
    }
    
    return { data: application, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Get influencer applications
 */
export async function getInfluencerApplications(influencerId?: string) {
  try {
    let userId = influencerId
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      userId = user.id
    }

    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        offer:offers (
          *,
          business:profiles!offers_business_id_fkey (
            business_name,
            business_logo
          )
        )
      `)
      .eq('influencer_id', userId)
      .order('applied_at', { ascending: false })

    if (error) throw error
    return { data: data as Application[], error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Get application status for an offer
 */
export async function getApplicationStatus(offerId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: null }

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('offer_id', offerId)
      .eq('influencer_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return { data: data || null, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}



