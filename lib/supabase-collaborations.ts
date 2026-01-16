import { supabase } from './supabase'

/**
 * Collaborations API utilities
 */

export interface Collaboration {
  id: string
  application_id: string
  offer_id: string
  business_id: string
  influencer_id: string
  status: 'active' | 'completed' | 'cancelled' | 'expired'
  scheduled_date: string
  scheduled_time: string
  checked_in_at?: string
  is_on_time?: boolean
  qr_code_scanned: boolean
  content_video_url?: string
  content_video_filename?: string
  social_media_post_url?: string
  has_tagged_business: boolean
  has_sent_collab_request: boolean
  proof_image_url?: string
  content_submitted_at?: string
  completed_at?: string
  business_verified: boolean
  created_at: string
  updated_at: string
  offer?: any
  business?: {
    business_name: string
    business_logo: string
  }
}

/**
 * Get influencer collaborations
 */
export async function getInfluencerCollaborations(influencerId?: string) {
  try {
    let userId = influencerId
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      userId = user.id
    }

    const { data, error } = await supabase
      .from('collaborations')
      .select(`
        *,
        offer:offers (*),
        business:profiles!collaborations_business_id_fkey (
          business_name,
          business_logo
        )
      `)
      .eq('influencer_id', userId)
      .order('scheduled_date', { ascending: false })

    if (error) throw error
    return { data: data as Collaboration[], error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Submit content proof
 */
export async function submitContentProof(collaborationId: string, proofData: {
  videoUrl?: string
  videoFilename?: string
  socialMediaPostUrl: string
  hasTaggedBusiness: boolean
  hasSentCollabRequest: boolean
  proofImageUrl?: string
}) {
  try {
    const { data, error } = await supabase
      .from('collaborations')
      .update({
        content_video_url: proofData.videoUrl,
        content_video_filename: proofData.videoFilename,
        social_media_post_url: proofData.socialMediaPostUrl,
        has_tagged_business: proofData.hasTaggedBusiness,
        has_sent_collab_request: proofData.hasSentCollabRequest,
        proof_image_url: proofData.proofImageUrl,
        content_submitted_at: new Date().toISOString()
      })
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
 * Check in with QR code
 */
export async function checkInWithQR(collaborationId: string, qrData: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Verify QR code
    const { data: qrCode, error: qrError } = await supabase
      .from('qr_codes')
      .select('*, collaboration:collaborations(*)')
      .eq('qr_data', qrData)
      .eq('is_active', true)
      .single()

    if (qrError || !qrCode) throw new Error('Invalid QR code')

    const collaboration = (qrCode as any).collaboration
    if (!collaboration || collaboration.id !== collaborationId) {
      throw new Error('QR code does not match collaboration')
    }

    // Check if on time
    const scheduledDateTime = new Date(
      `${collaboration.scheduled_date}T${collaboration.scheduled_time}`
    )
    const now = new Date()
    const isOnTime = now <= new Date(scheduledDateTime.getTime() + 15 * 60000) // 15 min grace

    // Update collaboration
    const { data, error } = await supabase
      .from('collaborations')
      .update({
        checked_in_at: now.toISOString(),
        is_on_time: isOnTime,
        qr_code_scanned: true
      })
      .eq('id', collaborationId)
      .select()
      .single()

    if (error) throw error

    // Update QR code scan count
    await supabase
      .from('qr_codes')
      .update({
        scan_count: (qrCode.scan_count || 0) + 1,
        last_scanned_at: now.toISOString()
      })
      .eq('id', qrCode.id)

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}



