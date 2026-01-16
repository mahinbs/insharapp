/**
 * SUPABASE INTEGRATION EXAMPLES
 * 
 * This file contains practical examples of how to use Supabase
 * in your Inshaar application components.
 * 
 * Copy and adapt these functions for your use cases.
 */

import { supabase } from './supabase'

// ============================================
// AUTHENTICATION EXAMPLES
// ============================================

/**
 * Sign up as Influencer
 */
export async function signUpInfluencer(
  email: string,
  password: string,
  fullName: string,
  username?: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_type: 'influencer',
        full_name: fullName,
        username: username
      }
    }
  })

  if (error) throw error

  // Profile is auto-created by trigger, but we can update it
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        username: username,
        full_name: fullName
      })
      .eq('id', data.user.id)

    if (profileError) throw profileError
  }

  return data
}

/**
 * Sign up as Business
 */
export async function signUpBusiness(
  email: string,
  password: string,
  businessName: string,
  businessCategory: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_type: 'business',
        business_name: businessName
      }
    }
  })

  if (error) throw error

  // Update profile with business details
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        business_name: businessName,
        business_category: businessCategory
      })
      .eq('id', data.user.id)

    if (profileError) throw profileError
  }

  return data
}

/**
 * Sign in
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

/**
 * Sign out
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

/**
 * Get current user profile
 */
export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

/**
 * OAuth Sign in
 */
export async function signInWithOAuth(provider: string) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as any,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })

  if (error) throw error
  return data
}

// ============================================
// OFFERS EXAMPLES
// ============================================

/**
 * Create a new offer (Business)
 */
export async function createOffer(offerData: {
  title: string
  description: string
  category: string
  location: string
  serviceOffered?: string
  requirements: string[]
  images?: string[]
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get business profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('business_name, business_logo')
    .eq('id', user.id)
    .single()

  const { data, error } = await supabase
    .from('offers')
    .insert({
      business_id: user.id,
      title: offerData.title,
      description: offerData.description,
      category: offerData.category,
      location: offerData.location,
      service_offered: offerData.serviceOffered,
      requirements: offerData.requirements,
      images: offerData.images || [],
      main_image: offerData.images?.[0],
      business_name: profile?.business_name,
      business_logo: profile?.business_logo,
      status: 'active'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get all active offers
 */
export async function getOffers(filters?: {
  category?: string
  location?: string
  limit?: number
  offset?: number
}) {
  let query = supabase
    .from('offers')
    .select(`
      *,
      business:profiles!offers_business_id_fkey (
        business_name,
        business_logo,
        rating,
        total_collaborations
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }

  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

/**
 * Get offer by ID
 */
export async function getOfferById(offerId: string) {
  const { data, error } = await supabase
    .from('offers')
    .select(`
      *,
      business:profiles!offers_business_id_fkey (
        *,
        establishments:business_establishments (*)
      )
    `)
    .eq('id', offerId)
    .single()

  if (error) throw error
  return data
}

/**
 * Get business offers
 */
export async function getBusinessOffers(businessId: string) {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// ============================================
// APPLICATIONS EXAMPLES
// ============================================

/**
 * Apply to an offer (Influencer)
 */
export async function applyToOffer(
  offerId: string,
  message?: string,
  scheduledDate?: string,
  scheduledTime?: string,
  numberOfPeople?: number
) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('applications')
    .insert({
      offer_id: offerId,
      influencer_id: user.id,
      message,
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
      number_of_people: numberOfPeople,
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get influencer applications
 */
export async function getInfluencerApplications(influencerId: string) {
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
    .eq('influencer_id', influencerId)
    .order('applied_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Get applications for a business offer
 */
export async function getOfferApplications(offerId: string) {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      influencer:profiles!applications_influencer_id_fkey (
        full_name,
        username,
        avatar_url,
        followers_count,
        engagement_rate,
        niche
      )
    `)
    .eq('offer_id', offerId)
    .order('applied_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Accept/Decline application (Business)
 */
export async function updateApplicationStatus(
  applicationId: string,
  status: 'accepted' | 'declined'
) {
  const { data, error } = await supabase
    .from('applications')
    .update({
      status,
      responded_at: new Date().toISOString()
    })
    .eq('id', applicationId)
    .select()
    .single()

  if (error) throw error

  // If accepted, create collaboration
  if (status === 'accepted' && data) {
    await createCollaboration(data.id)
  }

  return data
}

// ============================================
// COLLABORATIONS EXAMPLES
// ============================================

/**
 * Create collaboration from accepted application
 */
async function createCollaboration(applicationId: string) {
  const { data: application } = await supabase
    .from('applications')
    .select('*, offer:offers(*)')
    .eq('id', applicationId)
    .single()

  if (!application) throw new Error('Application not found')

  const { data, error } = await supabase
    .from('collaborations')
    .insert({
      application_id: applicationId,
      offer_id: application.offer_id,
      business_id: (application.offer as any).business_id,
      influencer_id: application.influencer_id,
      scheduled_date: application.scheduled_date,
      scheduled_time: application.scheduled_time,
      status: 'active'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get influencer collaborations
 */
export async function getInfluencerCollaborations(influencerId: string) {
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
    .eq('influencer_id', influencerId)
    .order('scheduled_date', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Check in with QR code
 */
export async function checkInWithQR(
  collaborationId: string,
  qrData: string
) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Verify QR code
  const { data: qrCode } = await supabase
    .from('qr_codes')
    .select('*, collaboration:collaborations(*)')
    .eq('qr_data', qrData)
    .eq('is_active', true)
    .single()

  if (!qrCode) throw new Error('Invalid QR code')

  const collaboration = qrCode.collaboration as any
  if (collaboration.id !== collaborationId) {
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
      scan_count: qrCode.scan_count + 1,
      last_scanned_at: now.toISOString()
    })
    .eq('id', qrCode.id)

  return data
}

/**
 * Submit content proof
 */
export async function submitContentProof(
  collaborationId: string,
  proofData: {
    videoUrl?: string
    videoFilename?: string
    socialMediaPostUrl: string
    hasTaggedBusiness: boolean
    hasSentCollabRequest: boolean
    proofImageUrl?: string
  }
) {
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
  return data
}

// ============================================
// MESSAGES EXAMPLES
// ============================================

/**
 * Get or create conversation
 */
export async function getOrCreateConversation(
  participant1Id: string,
  participant2Id: string
) {
  // Try to find existing conversation
  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .or(`and(participant_1_id.eq.${participant1Id},participant_2_id.eq.${participant2Id}),and(participant_1_id.eq.${participant2Id},participant_2_id.eq.${participant1Id})`)
    .single()

  if (existing) return existing

  // Create new conversation
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      participant_1_id: participant1Id,
      participant_2_id: participant2Id
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Send message
 */
export async function sendMessage(
  conversationId: string,
  receiverId: string,
  content: string,
  messageType: 'text' | 'image' | 'file' = 'text'
) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      receiver_id: receiverId,
      content,
      message_type: messageType
    })
    .select()
    .single()

  if (error) throw error

  // Update conversation - increment unread count using SQL
  const { data: convData } = await supabase
    .from('conversations')
    .select('participant_2_unread_count')
    .eq('id', conversationId)
    .single()

  const newUnreadCount = (convData?.participant_2_unread_count || 0) + 1

  await supabase
    .from('conversations')
    .update({
      last_message_id: data.id,
      last_message_at: data.created_at,
      last_message_preview: content.substring(0, 100),
      participant_2_unread_count: newUnreadCount
    })
    .eq('id', conversationId)

  return data
}

/**
 * Get messages for conversation
 */
export async function getConversationMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey (
        full_name,
        username,
        avatar_url,
        business_name,
        business_logo
      )
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

// ============================================
// STORAGE EXAMPLES
// ============================================

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(file: File, bucket: string): Promise<{ publicUrl: string }> {
  try {
    console.log(`Uploading image: ${file.name} (${Math.round(file.size / 1024)}KB)`);
    
    // Check authentication first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated. Please log in to upload images.');
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    if (!fileExt) {
      throw new Error('Invalid file format');
    }
    
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `offer-images/${fileName}`;

    console.log(`Uploading to: ${bucket}/${filePath}`);

    // Upload with timeout
    const uploadPromise = supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    // Add timeout wrapper
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Image upload timeout after 30 seconds')), 30000)
    );

    const { error: uploadError } = await Promise.race([uploadPromise, timeoutPromise]) as any;

    if (uploadError) {
      console.error('Upload error:', uploadError);
      
      // Handle specific storage errors
      if (uploadError.message?.includes('bucket')) {
        throw new Error('Storage bucket not found. Please check your storage configuration.');
      }
      throw uploadError;
    }

    console.log('Image uploaded successfully, getting public URL...');

    // Get public URL
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error('Failed to get public URL for uploaded image');
    }

    console.log('Image URL generated:', data.publicUrl.substring(0, 100) + '...');
    return { publicUrl: data.publicUrl };
  } catch (error: any) {
    console.error('Upload image error:', error);
    throw error;
  }
}

// Batch upload images with progress
export async function uploadImages(files: File[], bucket: string = 'images'): Promise<string[]> {
  const urls: string[] = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      const file = files[i];
      console.log(`Uploading ${i + 1}/${files.length}: ${file.name}`);
      
      const result = await uploadImage(file, bucket);
      urls.push(result.publicUrl);
    } catch (error: any) {
      console.warn(`Failed to upload image ${i + 1}:`, error.message);
      // Continue with other images
    }
  }
  
  return urls;
}

/**
 * Upload video to Supabase Storage
 */
export async function uploadVideo(file: File) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${Date.now()}.${fileExt}`
  const filePath = `videos/${fileName}`

  const { data, error } = await supabase.storage
    .from('videos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('videos')
    .getPublicUrl(filePath)

  return { ...data, publicUrl }
}

// ============================================
// NOTIFICATIONS EXAMPLES
// ============================================

/**
 * Get user notifications
 */
export async function getUserNotifications(userId: string, unreadOnly = false) {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (unreadOnly) {
    query = query.eq('is_read', false)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .update({
      is_read: true,
      read_at: new Date().toISOString()
    })
    .eq('id', notificationId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================
// REAL-TIME SUBSCRIPTIONS
// ============================================

/**
 * Subscribe to new messages
 */
export function subscribeToMessages(
  conversationId: string,
  callback: (message: any) => void
) {
  return supabase
    .channel(`conversation:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => {
        callback(payload.new)
      }
    )
    .subscribe()
}

/**
 * Subscribe to notifications
 */
export function subscribeToNotifications(
  userId: string,
  callback: (notification: any) => void
) {
  return supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        callback(payload.new)
      }
    )
    .subscribe()
}


