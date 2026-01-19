import { supabase } from './supabase/client'
import { getValidSession } from './supabase-session'
import { Offer } from './supabase-offers'
import { Application } from './supabase-applications'
import { Collaboration } from './supabase-collaborations'

/**
 * Business-specific API utilities
 */

export interface BusinessStats {
  total_offers: number
  active_offers: number
  total_applications: number
  pending_applications: number
  accepted_applications: number
  total_collaborations: number
  upcoming_collaborations: number
  completed_collaborations: number
  total_views: number
}

export interface BusinessOffer extends Offer {
  applications?: Application[]
}

/**
 * Get business statistics
 */
export async function getBusinessStats(businessId?: string) {
  try {
    let userId = businessId
    if (!userId) {
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
      userId = session.user.id
    }

    // Verify user is a business
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', userId)
      .single()

    if (!profile || profile.user_type !== 'business') {
      throw new Error('User is not a business')
    }

    // Call the database function
    const { data, error } = await supabase.rpc('get_business_stats', {
      business_user_id: userId
    })

    if (error) throw error
    return { data: data?.[0] as BusinessStats, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Get all offers for a business
 */
export async function getBusinessOffers(businessId?: string, filters?: {
  status?: string
  limit?: number
  offset?: number
}) {
  try {
    let userId = businessId
    if (!userId) {
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
      userId = session.user.id
    }

    let query = supabase
      .from('offers')
      .select('*')
      .eq('business_id', userId)
      .order('created_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) throw error
    return { data: data as Offer[], error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Get applications for business offers
 */
export async function getBusinessApplications(businessId?: string, filters?: {
  status?: string
  offerId?: string
  limit?: number
}) {
  try {
    let userId = businessId
    if (!userId) {
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
      userId = session.user.id
    }

    // Get applications for all business offers
    let query = supabase
      .from('applications')
      .select(`
        *,
        offer:offers!applications_offer_id_fkey (
          id,
          title,
          business_id
        ),
        influencer:profiles!applications_influencer_id_fkey (
          id,
          full_name,
          username,
          avatar_url,
          followers_count,
          engagement_rate,
          niche,
          instagram_handle,
          tiktok_handle
        )
      `)
      .eq('offer.business_id', userId)
      .order('applied_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.offerId) {
      query = query.eq('offer_id', filters.offerId)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) throw error
    return { data: data as Application[], error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Accept an application
 */
export async function acceptApplication(applicationId: string) {
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

    // Verify the application belongs to a business offer
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        *,
        offer:offers!inner (
          id,
          title,
          business_id
        )
      `)
      .eq('id', applicationId)
      .single()

    if (appError) {
      console.error('Error fetching application:', appError)
      if (appError.code === 'PGRST301' || appError.message?.includes('row-level security')) {
        return { data: null, error: { message: 'Permission denied. You may not have access to this application.' } }
      }
      return { data: null, error: { message: appError.message || 'Application not found' } }
    }
    
    if (!application) {
      return { data: null, error: { message: 'Application not found' } }
    }
    
    if ((application.offer as any)?.business_id !== user.id) {
      return { data: null, error: { message: 'Not authorized to accept this application' } }
    }

    // Update application status
    const { data: updatedApp, error: updateError } = await supabase
      .from('applications')
      .update({
        status: 'accepted',
        responded_at: new Date().toISOString()
      })
      .eq('id', applicationId)
      .select()
      .single()

    if (updateError) throw updateError

    // Create collaboration
    const { data: collaboration, error: collabError } = await supabase
      .from('collaborations')
      .insert({
        application_id: applicationId,
        offer_id: application.offer_id,
        business_id: user.id,
        influencer_id: application.influencer_id,
        status: 'active',
        scheduled_date: application.scheduled_date || new Date().toISOString().split('T')[0],
        scheduled_time: application.scheduled_time || '12:00:00'
      })
      .select()
      .single()

    if (collabError) throw collabError

    // Create notification for influencer
    const offerTitle = (application.offer as any)?.title || 'the offer'
    await supabase
      .from('notifications')
      .insert({
        user_id: application.influencer_id,
        title: 'Application Accepted',
        message: `Your application for "${offerTitle}" has been accepted!`,
        type: 'application',
        related_application_id: applicationId,
        related_collaboration_id: collaboration.id
      })

    return { data: { application: updatedApp, collaboration }, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Decline an application
 */
export async function declineApplication(applicationId: string) {
  try {
    const { session, error: sessionError } = await getValidSession()
    if (sessionError || !session?.user) {
      throw new Error('Not authenticated')
    }
    const user = session.user

    // Verify the application belongs to a business offer
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        *,
        offer:offers!inner (
          business_id,
          title
        )
      `)
      .eq('id', applicationId)
      .single()

    if (appError || !application) throw new Error('Application not found')
    if ((application.offer as any).business_id !== user.id) {
      throw new Error('Not authorized to decline this application')
    }

    // Update application status
    const { data, error } = await supabase
      .from('applications')
      .update({
        status: 'declined',
        responded_at: new Date().toISOString()
      })
      .eq('id', applicationId)
      .select()
      .single()

    if (error) throw error

    // Create notification for influencer
    await supabase
      .from('notifications')
      .insert({
        user_id: application.influencer_id,
        title: 'Application Declined',
        message: `Your application for "${(application.offer as any).title}" has been declined.`,
        type: 'application',
        related_application_id: applicationId
      })

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Get business collaborations (for agenda/calendar)
 */
export async function getBusinessCollaborations(businessId?: string, filters?: {
  status?: string
  dateFrom?: string
  dateTo?: string
}) {
  try {
    let userId = businessId
    if (!userId) {
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
      userId = session.user.id
    }

    let query = supabase
      .from('collaborations')
      .select(`
        *,
        offer:offers!collaborations_offer_id_fkey (
          id,
          title,
          main_image
        ),
        influencer:profiles!collaborations_influencer_id_fkey (
          id,
          full_name,
          username,
          avatar_url,
          instagram_handle,
          tiktok_handle
        )
      `)
      .eq('business_id', userId)
      .order('scheduled_date', { ascending: true })
      .order('scheduled_time', { ascending: true })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.dateFrom) {
      query = query.gte('scheduled_date', filters.dateFrom)
    }

    if (filters?.dateTo) {
      query = query.lte('scheduled_date', filters.dateTo)
    }

    const { data, error } = await query

    if (error) throw error
    return { data: data as Collaboration[], error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Get weekly reservations statistics
 */
export async function getWeeklyReservations(businessId?: string, weekStart?: string) {
  try {
    let userId = businessId
    if (!userId) {
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
      userId = session.user.id
    }

    // Calculate week start (Monday)
    const startDate = weekStart || (() => {
      const today = new Date()
      const day = today.getDay()
      const diff = today.getDate() - day + (day === 0 ? -6 : 1)
      const monday = new Date(today.setDate(diff))
      monday.setHours(0, 0, 0, 0)
      return monday.toISOString().split('T')[0]
    })()

    // Calculate week end (Sunday)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 6)
    const endDateStr = endDate.toISOString().split('T')[0]

    // Get collaborations for the week
    const { data, error } = await supabase
      .from('collaborations')
      .select('scheduled_date, status')
      .eq('business_id', userId)
      .gte('scheduled_date', startDate)
      .lte('scheduled_date', endDateStr)

    if (error) throw error

    // Group by day of week
    const dayCounts: { [key: string]: number } = {
      'Mon': 0,
      'Tue': 0,
      'Wed': 0,
      'Thu': 0,
      'Fri': 0,
      'Sat': 0,
      'Sun': 0
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    data?.forEach((collab) => {
      const date = new Date(collab.scheduled_date)
      const dayName = dayNames[date.getDay()]
      dayCounts[dayName] = (dayCounts[dayName] || 0) + 1
    })

    return {
      data: Object.entries(dayCounts).map(([day, count]) => ({ day, count })),
      error: null
    }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Update collaboration status
 */
export async function updateCollaborationStatus(
  collaborationId: string,
  status: 'active' | 'completed' | 'cancelled' | 'expired'
) {
  try {
    const { session, error: sessionError } = await getValidSession()
    if (sessionError || !session?.user) {
      throw new Error('Not authenticated')
    }
    const user = session.user

    // Verify ownership
    const { data: collaboration } = await supabase
      .from('collaborations')
      .select('business_id')
      .eq('id', collaborationId)
      .single()

    if (!collaboration || collaboration.business_id !== user.id) {
      throw new Error('Not authorized to update this collaboration')
    }

    const updateData: any = { status }
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('collaborations')
      .update(updateData)
      .eq('id', collaborationId)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Get business establishments
 */
export async function getBusinessEstablishments(businessId?: string) {
  try {
    let userId = businessId
    if (!userId) {
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
      userId = session.user.id
    }

    const { data, error } = await supabase
      .from('business_establishments')
      .select('*')
      .eq('business_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Safely parse weekly_timings if it's a string
    const safeData = data?.map(est => {
      if (est.weekly_timings && typeof est.weekly_timings === 'string') {
        try {
          est.weekly_timings = JSON.parse(est.weekly_timings)
        } catch {
          est.weekly_timings = {}
        }
      }
      return est
    })

    return { data: safeData, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Create business establishment
 */
export async function createBusinessEstablishment(establishmentData: {
  title: string
  address: string
  city?: string
  country?: string
  postal_code?: string
  phone?: string
  email?: string
  latitude?: number
  longitude?: number
  weekly_timings?: any
}) {
  try {
    const { session, error: sessionError } = await getValidSession()
    if (sessionError || !session?.user) {
      throw new Error('Not authenticated')
    }
    const user = session.user

    const { data, error } = await supabase
      .from('business_establishments')
      .insert({
        business_id: user.id,
        ...establishmentData
      })
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Get QR codes for business
 */
export async function getBusinessQRCodes(businessId?: string, collaborationId?: string) {
  try {
    let userId = businessId
    if (!userId) {
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
      userId = session.user.id
    }

    let query = supabase
      .from('qr_codes')
      .select('*')
      .eq('business_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (collaborationId) {
      query = query.eq('collaboration_id', collaborationId)
    }

    const { data, error } = await query

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Create QR code for collaboration
 */
export async function createQRCode(collaborationId: string, qrData: string, qrImageUrl?: string) {
  try {
    const { session, error: sessionError } = await getValidSession()
    if (sessionError || !session?.user) {
      throw new Error('Not authenticated')
    }
    const user = session.user

    // Verify collaboration belongs to business
    const { data: collaboration } = await supabase
      .from('collaborations')
      .select('business_id')
      .eq('id', collaborationId)
      .single()

    if (!collaboration || collaboration.business_id !== user.id) {
      throw new Error('Not authorized to create QR code for this collaboration')
    }

    const { data, error } = await supabase
      .from('qr_codes')
      .insert({
        business_id: user.id,
        collaboration_id: collaborationId,
        qr_data: qrData,
        qr_image_url: qrImageUrl
      })
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Get business notifications
 */
export async function getBusinessNotifications(businessId?: string, unreadOnly?: boolean) {
  try {
    let userId = businessId
    if (!userId) {
      const { session, error: sessionError } = await getValidSession()
      if (sessionError || !session?.user) {
        throw new Error('Not authenticated')
      }
      userId = session.user.id
    }

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (unreadOnly) {
      query = query.eq('is_read', false)
    }

    const { data, error } = await query

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const { session, error: sessionError } = await getValidSession()
    if (sessionError || !session?.user) {
      throw new Error('Not authenticated')
    }
    const user = session.user

    const { data, error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(businessId?: string) {
  try {
    let userId = businessId
    if (!userId) {
      const { session, error: sessionError } = await getValidSession()
      if (sessionError || !session?.user) {
        throw new Error('Not authenticated')
      }
      userId = session.user.id
    }

    const { error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) throw error
    return { error: null }
  } catch (error: any) {
    return { error }
  }
}

/**
 * Update business profile with gallery, videos, and content
 */
export async function updateBusinessProfileData(updates: {
  gallery_images?: string[]
  videos?: string[]
  content_highlights?: any[]
  carousel_images?: string[]
}) {
  try {
    const { session, error: sessionError } = await getValidSession()
    if (sessionError || !session?.user) {
      throw new Error('Not authenticated')
    }
    const user = session.user

    // First, try to get current profile to check if metadata column exists
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (fetchError) {
      // If metadata column doesn't exist, try to add it via RPC or handle gracefully
      if (fetchError.code === 'PGRST204' && fetchError.message?.includes('metadata')) {
        console.warn('metadata column does not exist. Please run the migration script to add it.')
        // Try to update without metadata first, then we'll handle it differently
        throw new Error('metadata column not found. Please run: ALTER TABLE profiles ADD COLUMN metadata JSONB DEFAULT \'{}\'::jsonb;')
      }
      throw fetchError
    }

    // Safely parse metadata
    let currentMetadata: any = {}
    if (profile?.metadata) {
      if (typeof profile.metadata === 'string') {
        try {
          currentMetadata = JSON.parse(profile.metadata)
        } catch {
          currentMetadata = {}
        }
      } else {
        currentMetadata = profile.metadata || {}
      }
    }

    const newMetadata = {
      ...currentMetadata,
      ...updates
    }

    // Add timeout to prevent hanging
    const updatePromise = supabase
      .from('profiles')
      .update({
        metadata: newMetadata
      })
      .eq('id', user.id)
      .select()
      .single()

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database update timeout')), 10000)
    )

    const { data, error } = await Promise.race([
      updatePromise,
      timeoutPromise
    ]) as { data: any, error: any }

    if (error) {
      // If metadata column doesn't exist, provide helpful error
      if (error.code === 'PGRST204' || error.message?.includes('metadata')) {
        throw new Error('metadata column not found. Please run this SQL in Supabase: ALTER TABLE profiles ADD COLUMN metadata JSONB DEFAULT \'{}\'::jsonb;')
      }
      throw error
    }
    return { data, error: null }
  } catch (error: any) {
    console.error('updateBusinessProfileData error:', error)
    return { data: null, error }
  }
}

