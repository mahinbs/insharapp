import { supabase } from './supabase/client'
import { getValidSession } from './supabase-session'

/**
 * Messages API utilities
 */

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  receiver_id: string
  content: string
  message_type: 'text' | 'image' | 'file' | 'offer' | 'application'
  offer_id?: string
  application_id?: string
  is_read: boolean
  read_at?: string
  created_at: string
  sender?: {
    full_name?: string
    username?: string
    avatar_url?: string
    business_name?: string
    business_logo?: string
  }
}

export interface Conversation {
  id: string
  participant_1_id: string
  participant_2_id: string
  last_message_id?: string
  last_message_at?: string
  last_message_preview?: string
  participant_1_unread_count: number
  participant_2_unread_count: number
  created_at: string
  updated_at: string
  other_participant?: {
    id: string
    full_name?: string
    username?: string
    avatar_url?: string
    business_name?: string
    business_logo?: string
    user_type: string
  }
}

/**
 * Get or create conversation
 */
export async function getOrCreateConversation(
  participant1Id: string,
  participant2Id: string
) {
  try {
    // Try to find existing conversation
    const { data: existing, error: findError } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(participant_1_id.eq.${participant1Id},participant_2_id.eq.${participant2Id}),and(participant_1_id.eq.${participant2Id},participant_2_id.eq.${participant1Id})`)
      .single()

    if (existing && !findError) {
      return { data: existing, error: null }
    }

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
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Get user conversations
 */
export async function getUserConversations(userId?: string) {
  try {
    let userIdToUse = userId
    if (!userIdToUse) {
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
      userIdToUse = session.user.id
    }

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participant1:profiles!conversations_participant_1_id_fkey (
          id,
          full_name,
          username,
          avatar_url,
          business_name,
          business_logo,
          user_type
        ),
        participant2:profiles!conversations_participant_2_id_fkey (
          id,
          full_name,
          username,
          avatar_url,
          business_name,
          business_logo,
          user_type
        )
      `)
      .or(`participant_1_id.eq.${userIdToUse},participant_2_id.eq.${userIdToUse}`)
      .order('last_message_at', { ascending: false, nullsFirst: false })

    if (error) {
      // Don't throw - return error object instead
      return { data: null, error }
    }

    // Transform data to include other participant
    const transformed = data?.map((conv: any) => {
      const otherParticipant = 
        conv.participant_1_id === userIdToUse 
          ? conv.participant2 
          : conv.participant1

      return {
        ...conv,
        other_participant: otherParticipant
      }
    })

    return { data: transformed as Conversation[], error: null }
  } catch (error: any) {
    return { data: null, error: error.message ? error : { message: 'Failed to load conversations' } }
  }
}

/**
 * Get messages for a conversation
 */
export async function getConversationMessages(conversationId: string) {
  try {
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
    return { data: data as Message[], error: null }
  } catch (error: any) {
    return { data: null, error }
  }
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
  try {
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

    // Get current conversation to increment unread count
    const { data: conversation } = await supabase
      .from('conversations')
      .select('participant_2_unread_count')
      .eq('id', conversationId)
      .single()

    // Update conversation
    await supabase
      .from('conversations')
      .update({
        last_message_id: data.id,
        last_message_at: data.created_at,
        last_message_preview: content.substring(0, 100),
        participant_2_unread_count: (conversation?.participant_2_unread_count || 0) + 1
      })
      .eq('id', conversationId)

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(conversationId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('messages')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('conversation_id', conversationId)
      .eq('receiver_id', user.id)
      .eq('is_read', false)

    if (error) throw error

    // Update conversation unread count
    const { data: conv } = await supabase
      .from('conversations')
      .select('participant_1_id, participant_2_id')
      .eq('id', conversationId)
      .single()

    if (conv) {
      const isParticipant1 = conv.participant_1_id === user.id
      await supabase
        .from('conversations')
        .update({
          [isParticipant1 ? 'participant_1_unread_count' : 'participant_2_unread_count']: 0
        })
        .eq('id', conversationId)
    }

    return { error: null }
  } catch (error: any) {
    return { error }
  }
}



