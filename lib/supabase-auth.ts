import { supabase } from './supabase'
import { useRouter } from 'next/navigation'

/**
 * Authentication utilities for Supabase
 */

export interface SignUpData {
  email: string
  password: string
  fullName: string
  userType: 'influencer' | 'business'
  username?: string
  businessName?: string
  businessCategory?: string
}

export interface SignInData {
  email: string
  password: string
}

/**
 * Sign up as Influencer
 */
export async function signUpInfluencer(data: {
  email: string
  password: string
  fullName: string
  username?: string
}) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          user_type: 'influencer',
          full_name: data.fullName,
          username: data.username
        }
      }
    })

    if (authError) throw authError

    // Profile is auto-created by trigger, but update it with additional info
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          full_name: data.fullName,
          user_type: 'influencer'
        })
        .eq('id', authData.user.id)

      if (profileError) {
        console.error('Profile update error:', profileError)
        // Don't throw, profile was created by trigger
      }
    }

    return { data: authData, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Sign up as Business
 */
export async function signUpBusiness(data: {
  email: string
  password: string
  businessName: string
  businessCategory: string
}) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          user_type: 'business',
          business_name: data.businessName
        }
      }
    })

    if (authError) throw authError

    // Update profile with business details
    if (authData.user) {
      // Wait a bit for profile trigger to create profile
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          business_name: data.businessName,
          business_category: data.businessCategory,
          user_type: 'business'
        })
        .eq('id', authData.user.id)

      if (profileError) {
        console.error('Profile update error:', profileError)
        // Try to insert if update failed
        await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: data.email,
            user_type: 'business',
            business_name: data.businessName,
            business_category: data.businessCategory
          })
      }
    }

    return { data: authData, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Sign in
 */
export async function signIn(data: SignInData) {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })

    if (error) throw error

    return { data: authData, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Sign out
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error: any) {
    return { error }
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { data: user, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Get current user profile
 */
export async function getCurrentUserProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: null }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * OAuth Sign in
 */
export async function signInWithOAuth(provider: 'google' | 'facebook' | 'github' | 'twitter' | 'discord' | 'azure' | 'linkedin' | 'bitbucket' | 'apple' | 'twitch' | 'spotify' | 'slack' | 'notion' | 'twilio' | 'sendgrid' | 'workos' | 'zoom') {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}



