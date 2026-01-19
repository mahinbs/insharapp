'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { getCurrentUserProfile, Profile } from '@/lib/supabase-profile'
import { 
  getBusinessStats, 
  getBusinessOffers, 
  getBusinessApplications,
  getBusinessCollaborations,
  getBusinessEstablishments,
  getBusinessQRCodes,
  getWeeklyReservations,
  BusinessStats
} from '@/lib/supabase-business'
import { getUserConversations } from '@/lib/supabase-messages'

interface BusinessDataContextType {
  // Profile
  profile: Profile | null
  profileLoading: boolean
  profileError: any
  
  // Stats
  stats: BusinessStats | null
  statsLoading: boolean
  statsError: any
  
  // Offers
  offers: any[]
  offersLoading: boolean
  offersError: any
  
  // Applications
  applications: any[]
  applicationsLoading: boolean
  applicationsError: any
  
  // Collaborations
  collaborations: any[]
  collaborationsLoading: boolean
  collaborationsError: any
  
  // Establishments
  establishments: any[]
  establishmentsLoading: boolean
  establishmentsError: any
  
  // QR Codes
  qrCodes: any[]
  qrCodesLoading: boolean
  qrCodesError: any
  
  // Weekly Reservations
  weeklyReservations: any[]
  weeklyReservationsLoading: boolean
  weeklyReservationsError: any
  
  // Conversations
  conversations: any[]
  conversationsLoading: boolean
  conversationsError: any
  
  // Actions
  refreshProfile: () => Promise<void>
  refreshStats: () => Promise<void>
  refreshOffers: (filters?: any) => Promise<void>
  refreshApplications: (filters?: any) => Promise<void>
  refreshCollaborations: (filters?: any) => Promise<void>
  refreshEstablishments: () => Promise<void>
  refreshQRCodes: () => Promise<void>
  refreshWeeklyReservations: () => Promise<void>
  refreshConversations: () => Promise<void>
  refreshAll: () => Promise<void>
  
  // Cache timestamps
  lastUpdated: { [key: string]: number }
  
  // Loading state
  isLoading: boolean
}

const BusinessDataContext = createContext<BusinessDataContextType | undefined>(undefined)

// Cache duration: Longer durations for better performance and consistency
const CACHE_DURATION = {
  profile: 10 * 60 * 1000, // 10 minutes - profile rarely changes
  stats: 2 * 60 * 1000, // 2 minutes - stats update less frequently
  offers: 2 * 60 * 1000, // 2 minutes
  applications: 2 * 60 * 1000, // 2 minutes
  collaborations: 2 * 60 * 1000, // 2 minutes
  establishments: 5 * 60 * 1000, // 5 minutes - establishments rarely change
  qrCodes: 5 * 60 * 1000, // 5 minutes
  weeklyReservations: 2 * 60 * 1000, // 2 minutes
  conversations: 1 * 60 * 1000, // 1 minute - conversations update more frequently
}

export function BusinessDataProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<BusinessStats | null>(null)
  const [offers, setOffers] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [collaborations, setCollaborations] = useState<any[]>([])
  const [establishments, setEstablishments] = useState<any[]>([])
  const [qrCodes, setQRCodes] = useState<any[]>([])
  const [weeklyReservations, setWeeklyReservations] = useState<any[]>([])
  const [conversations, setConversations] = useState<any[]>([])
  
  const [profileLoading, setProfileLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [offersLoading, setOffersLoading] = useState(false)
  const [applicationsLoading, setApplicationsLoading] = useState(false)
  const [collaborationsLoading, setCollaborationsLoading] = useState(false)
  const [establishmentsLoading, setEstablishmentsLoading] = useState(false)
  const [qrCodesLoading, setQRCodesLoading] = useState(false)
  const [weeklyReservationsLoading, setWeeklyReservationsLoading] = useState(false)
  const [conversationsLoading, setConversationsLoading] = useState(false)
  
  const [profileError, setProfileError] = useState<any>(null)
  const [statsError, setStatsError] = useState<any>(null)
  const [offersError, setOffersError] = useState<any>(null)
  const [applicationsError, setApplicationsError] = useState<any>(null)
  const [collaborationsError, setCollaborationsError] = useState<any>(null)
  const [establishmentsError, setEstablishmentsError] = useState<any>(null)
  const [qrCodesError, setQRCodesError] = useState<any>(null)
  const [weeklyReservationsError, setWeeklyReservationsError] = useState<any>(null)
  const [conversationsError, setConversationsError] = useState<any>(null)
  
  const [lastUpdated, setLastUpdated] = useState<{ [key: string]: number }>({})
  const mountedRef = useRef(true)
  
  // Helper to check if data is stale
  const isStale = useCallback((key: string) => {
    const lastUpdate = lastUpdated[key]
    if (!lastUpdate) return true
    const duration = CACHE_DURATION[key as keyof typeof CACHE_DURATION] || 30 * 1000
    return Date.now() - lastUpdate > duration
  }, [lastUpdated])
  
  // Load profile
  const refreshProfile = useCallback(async (force = false) => {
    if (!force && !isStale('profile') && profile) {
      return
    }
    
    // Don't set loading if we have cached data - show it immediately
    if (!profile) {
      setProfileLoading(true)
    }
    setProfileError(null)
    
    try {
      // Check for session before making request
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (mountedRef.current) {
          setProfileError({ message: 'Not authenticated' })
          setProfileLoading(false)
        }
        return
      }
      
      const { data, error } = await getCurrentUserProfile()
      if (error) {
        // Don't log "Not authenticated" errors as they're expected when session is not ready
        if (error?.message !== 'Not authenticated') {
          console.error('Profile error:', error)
        }
        if (mountedRef.current) {
          setProfileError(error)
        }
        return
      }
      
      if (mountedRef.current) {
        setProfile(data)
        setProfileError(null)
        setLastUpdated(prev => ({ ...prev, profile: Date.now() }))
      }
    } catch (error: any) {
      // Ignore AbortError - it's expected when component unmounts
      if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
        return
      }
      if (mountedRef.current) {
        setProfileError(error)
        console.error('Error loading profile:', error)
      }
    } finally {
      if (mountedRef.current) {
        setProfileLoading(false)
      }
    }
  }, [profile, isStale])
  
  // Load stats
  const refreshStats = useCallback(async (force = false) => {
    if (!force && !isStale('stats') && stats !== null) {
      return
    }
    
    // Don't set loading if we have cached data - show it immediately
    if (!stats) {
      setStatsLoading(true)
    }
    setStatsError(null)
    
    try {
      // Check for session before making request
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (mountedRef.current) {
          setStatsError({ message: 'Not authenticated' })
          setStatsLoading(false)
        }
        return
      }
      
      const { data, error } = await getBusinessStats()
      if (error) {
        // Don't log "Not authenticated" errors as they're expected when session is not ready
        if (error?.message !== 'Not authenticated') {
          console.error('Stats error:', error)
        }
        if (mountedRef.current) {
          setStatsError(error)
        }
        return
      }
      
      if (mountedRef.current) {
        setStats(data)
        setStatsError(null)
        setLastUpdated(prev => ({ ...prev, stats: Date.now() }))
      }
    } catch (error: any) {
      // Ignore AbortError - it's expected when component unmounts
      if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
        return
      }
      if (mountedRef.current) {
        setStatsError(error)
        console.error('Error loading stats:', error)
      }
    } finally {
      if (mountedRef.current) {
        setStatsLoading(false)
      }
    }
  }, [stats, isStale])
  
  // Load offers
  const refreshOffers = useCallback(async (filters?: any, force = false) => {
    if (!force && !isStale('offers') && offers.length > 0 && !filters) {
      return
    }
    
    // Don't set loading if we have cached data - show it immediately
    if (offers.length === 0) {
      setOffersLoading(true)
    }
    setOffersError(null)
    
    try {
      // Check for session before making request
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (mountedRef.current) {
          setOffersError({ message: 'Not authenticated' })
          setOffersLoading(false)
        }
        return
      }
      
      const { data, error } = await getBusinessOffers(undefined, filters)
      if (error) throw error
      
      if (mountedRef.current) {
        setOffers(data || [])
        setOffersError(null)
        setLastUpdated(prev => ({ ...prev, offers: Date.now() }))
      }
    } catch (error: any) {
      // Ignore AbortError - it's expected when component unmounts
      if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
        return
      }
      if (mountedRef.current) {
        setOffersError(error)
        console.error('Error loading offers:', error)
      }
    } finally {
      if (mountedRef.current) {
        setOffersLoading(false)
      }
    }
  }, [offers, isStale])
  
  // Load applications
  const refreshApplications = useCallback(async (filters?: any, force = false) => {
    // If filters include offerId, always force refresh to get correct data
    const shouldForce = force || (filters?.offerId && applications.length > 0)
    
    if (!shouldForce && !isStale('applications') && applications.length > 0 && !filters?.offerId) {
      return
    }
    
    // Don't set loading if we have cached data - show it immediately
    if (applications.length === 0) {
      setApplicationsLoading(true)
    }
    setApplicationsError(null)
    
    try {
      // Check if component is still mounted
      if (!mountedRef.current) {
        return
      }
      
      // Check for session before making request
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (mountedRef.current) {
          setApplicationsError({ message: 'Not authenticated' })
          setApplicationsLoading(false)
        }
        return
      }
      
      // Double check mounted before making request
      if (!mountedRef.current) {
        return
      }
      
      const { data, error } = await getBusinessApplications(undefined, filters)
      
      // Check mounted again after async operation
      if (!mountedRef.current) {
        return
      }
      
      if (error) {
        // Don't throw - just set error state
        setApplicationsError(error)
        setApplicationsLoading(false)
        return
      }
      
      setApplications(data || [])
      setApplicationsError(null)
      setLastUpdated(prev => ({ ...prev, applications: Date.now() }))
      setApplicationsLoading(false)
    } catch (error: any) {
      // Ignore AbortError - it's expected when component unmounts
      if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
        return
      }
      if (mountedRef.current) {
        setApplicationsError(error)
        // Only log non-abort errors
        if (error?.name !== 'AbortError' && !error?.message?.includes('aborted')) {
          console.error('Error loading applications:', error)
        }
      }
    } finally {
      if (mountedRef.current) {
        setApplicationsLoading(false)
      }
    }
  }, [applications, isStale])
  
  // Load collaborations
  const refreshCollaborations = useCallback(async (filters?: any, force = false) => {
    if (!force && !isStale('collaborations') && collaborations.length > 0) {
      return
    }
    
    // Don't set loading if we have cached data - show it immediately
    if (collaborations.length === 0) {
      setCollaborationsLoading(true)
    }
    setCollaborationsError(null)
    
    try {
      const { data, error } = await getBusinessCollaborations(undefined, filters)
      if (error) throw error
      
      if (mountedRef.current) {
        setCollaborations(data || [])
        setCollaborationsError(null)
        setLastUpdated(prev => ({ ...prev, collaborations: Date.now() }))
      }
    } catch (error: any) {
      if (mountedRef.current) {
        setCollaborationsError(error)
        console.error('Error loading collaborations:', error)
      }
    } finally {
      if (mountedRef.current) {
        setCollaborationsLoading(false)
      }
    }
  }, [collaborations, isStale])
  
  // Load establishments
  const refreshEstablishments = useCallback(async (force = false) => {
    if (!force && !isStale('establishments') && establishments.length > 0) {
      return
    }
    
    // Don't set loading if we have cached data - show it immediately
    if (establishments.length === 0) {
      setEstablishmentsLoading(true)
    }
    setEstablishmentsError(null)
    
    try {
      // Check for session before making request
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (mountedRef.current) {
          setEstablishmentsError({ message: 'Not authenticated' })
          setEstablishmentsLoading(false)
        }
        return
      }
      
      const { data, error } = await getBusinessEstablishments()
      if (error) {
        // Don't log "Not authenticated" errors as they're expected when session is not ready
        if (error?.message !== 'Not authenticated') {
          console.error('Error loading establishments:', error)
        }
        if (mountedRef.current) {
          setEstablishmentsError(error)
        }
        return
      }
      
      if (mountedRef.current) {
        setEstablishments(data || [])
        setEstablishmentsError(null)
        setLastUpdated(prev => ({ ...prev, establishments: Date.now() }))
      }
    } catch (error: any) {
      // Ignore AbortError - it's expected when component unmounts
      if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
        return
      }
      if (mountedRef.current) {
        setEstablishmentsError(error)
        console.error('Error loading establishments:', error)
      }
    } finally {
      if (mountedRef.current) {
        setEstablishmentsLoading(false)
      }
    }
  }, [establishments, isStale])
  
  // Load QR codes
  const refreshQRCodes = useCallback(async (force = false) => {
    if (!force && !isStale('qrCodes') && qrCodes.length > 0) {
      return
    }
    
    // Don't set loading if we have cached data - show it immediately
    if (qrCodes.length === 0) {
      setQRCodesLoading(true)
    }
    setQRCodesError(null)
    
    try {
      // Check for session before making request
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (mountedRef.current) {
          setQRCodesError({ message: 'Not authenticated' })
          setQRCodesLoading(false)
        }
        return
      }
      
      const { data, error } = await getBusinessQRCodes()
      if (error) {
        // Don't log "Not authenticated" errors as they're expected when session is not ready
        if (error?.message !== 'Not authenticated') {
          console.error('Error loading QR codes:', error)
        }
        if (mountedRef.current) {
          setQRCodesError(error)
        }
        return
      }
      
      if (mountedRef.current) {
        setQRCodes(data || [])
        setQRCodesError(null)
        setLastUpdated(prev => ({ ...prev, qrCodes: Date.now() }))
      }
    } catch (error: any) {
      // Ignore AbortError - it's expected when component unmounts
      if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
        return
      }
      if (mountedRef.current) {
        setQRCodesError(error)
        console.error('Error loading QR codes:', error)
      }
    } finally {
      if (mountedRef.current) {
        setQRCodesLoading(false)
      }
    }
  }, [qrCodes, isStale])
  
  // Load weekly reservations
  const refreshWeeklyReservations = useCallback(async (force = false) => {
    if (!force && !isStale('weeklyReservations') && weeklyReservations.length > 0) {
      return
    }
    
    // Don't set loading if we have cached data - show it immediately
    if (weeklyReservations.length === 0) {
      setWeeklyReservationsLoading(true)
    }
    setWeeklyReservationsError(null)
    
    try {
      // Check for session before making request
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (mountedRef.current) {
          setWeeklyReservationsError({ message: 'Not authenticated' })
          setWeeklyReservationsLoading(false)
        }
        return
      }
      
      const { data, error } = await getWeeklyReservations()
      if (error) {
        // Don't log "Not authenticated" errors as they're expected when session is not ready
        if (error?.message !== 'Not authenticated') {
          console.error('Error loading weekly reservations:', error)
        }
        if (mountedRef.current) {
          setWeeklyReservationsError(error)
        }
        return
      }
      
      if (mountedRef.current) {
        setWeeklyReservations(data || [])
        setWeeklyReservationsError(null)
        setLastUpdated(prev => ({ ...prev, weeklyReservations: Date.now() }))
      }
    } catch (error: any) {
      // Ignore AbortError - it's expected when component unmounts
      if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
        return
      }
      if (mountedRef.current) {
        setWeeklyReservationsError(error)
        console.error('Error loading weekly reservations:', error)
      }
    } finally {
      if (mountedRef.current) {
        setWeeklyReservationsLoading(false)
      }
    }
  }, [weeklyReservations, isStale])
  
  // Load conversations
  const refreshConversations = useCallback(async (force = false) => {
    if (!force && !isStale('conversations') && conversations.length > 0) {
      return
    }
    
    // Don't set loading if we have cached data - show it immediately
    if (conversations.length === 0) {
      setConversationsLoading(true)
    }
    setConversationsError(null)
    
    try {
      // Check for session before making request
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (mountedRef.current) {
          setConversationsError({ message: 'Not authenticated' })
          setConversationsLoading(false)
        }
        return
      }
      
      const { data, error } = await getUserConversations()
      if (error) {
        // Don't log "Not authenticated" errors as they're expected when session is not ready
        if (error?.message !== 'Not authenticated') {
          console.error('Error loading conversations:', error)
        }
        if (mountedRef.current) {
          setConversationsError(error)
        }
        return
      }
      
      if (mountedRef.current) {
        setConversations(data || [])
        setConversationsError(null)
        setLastUpdated(prev => ({ ...prev, conversations: Date.now() }))
      }
    } catch (error: any) {
      // Ignore AbortError - it's expected when component unmounts
      if (error?.name === 'AbortError' || error?.message?.includes('aborted')) {
        return
      }
      if (mountedRef.current) {
        setConversationsError(error)
        console.error('Error loading conversations:', error)
      }
    } finally {
      if (mountedRef.current) {
        setConversationsLoading(false)
      }
    }
  }, [conversations, isStale])
  
  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.allSettled([
      refreshProfile(true),
      refreshStats(true),
      refreshOffers(undefined, true),
      refreshApplications(undefined, true),
      refreshCollaborations(undefined, true),
      refreshEstablishments(true),
      refreshQRCodes(true),
      refreshWeeklyReservations(true),
      refreshConversations(true),
    ])
  }, [refreshProfile, refreshStats, refreshOffers, refreshApplications, refreshCollaborations, refreshEstablishments, refreshQRCodes, refreshWeeklyReservations, refreshConversations])
  
  // Initialize: Load profile and stats on mount
  useEffect(() => {
    let isMounted = true
    let abortController: AbortController | null = null
    
    const initialize = async () => {
      try {
        // Create abort controller for this initialization
        abortController = new AbortController()
        
        // Wait a bit for auth to initialize
        await new Promise(resolve => setTimeout(resolve, 200))
        
        if (!isMounted || abortController?.signal.aborted) return
        
        // Check for session first with retry logic
        let session = null
        let sessionError = null
        let retries = 3
        
        while (retries > 0 && !session) {
          const result = await supabase.auth.getSession()
          session = result.data.session
          sessionError = result.error
          
          if (session?.user) break
          
          if (retries > 1 && !abortController?.signal.aborted) {
            await new Promise(resolve => setTimeout(resolve, 300))
          }
          retries--
        }
        
        if (sessionError || !session || !isMounted || abortController?.signal.aborted) {
          if (sessionError && !sessionError.message?.includes('aborted')) {
            console.warn('BusinessDataContext: No session found, skipping data load')
          }
          return
        }
        
        // Load essential data in parallel - don't block rendering
        // Use allSettled to ensure we don't fail if one request fails
        if (isMounted && !abortController?.signal.aborted) {
          Promise.allSettled([
            refreshProfile(true),
            refreshStats(true),
          ]).catch((error) => {
            // Ignore AbortError - it's expected when component unmounts
            if (error?.name !== 'AbortError' && !error?.message?.includes('aborted') && isMounted) {
              console.error('BusinessDataContext: Error loading initial data:', error)
            }
          })
        }
      } catch (error: any) {
        // Ignore AbortError - it's expected when component unmounts
        if (error?.name !== 'AbortError' && !error?.message?.includes('aborted') && isMounted) {
          console.error('BusinessDataContext: Error initializing:', error)
        }
      }
    }
    
    initialize()
    
    // Listen to auth state changes to refresh data
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Wait a bit for session to be fully ready
        await new Promise(resolve => setTimeout(resolve, 300))
        if (isMounted) {
          Promise.allSettled([
            refreshProfile(true),
            refreshStats(true),
          ])
        }
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setProfile(null)
          setStats(null)
          setOffers([])
          setApplications([])
          setCollaborations([])
        }
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Refresh data when token is refreshed
        if (isMounted) {
          Promise.allSettled([
            refreshProfile(true),
            refreshStats(true),
          ])
        }
      }
    })
    
    return () => {
      isMounted = false
      if (abortController) {
        abortController.abort()
      }
      subscription.unsubscribe()
    }
  }, [router, refreshProfile, refreshStats])
  
  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])
  
  const isLoading = profileLoading || statsLoading || offersLoading || applicationsLoading || 
    collaborationsLoading || establishmentsLoading || qrCodesLoading || 
    weeklyReservationsLoading || conversationsLoading
  
  const value: BusinessDataContextType = {
    profile,
    profileLoading,
    profileError,
    stats,
    statsLoading,
    statsError,
    offers,
    offersLoading,
    offersError,
    applications,
    applicationsLoading,
    applicationsError,
    collaborations,
    collaborationsLoading,
    collaborationsError,
    establishments,
    establishmentsLoading,
    establishmentsError,
    qrCodes,
    qrCodesLoading,
    qrCodesError,
    weeklyReservations,
    weeklyReservationsLoading,
    weeklyReservationsError,
    conversations,
    conversationsLoading,
    conversationsError,
    refreshProfile: () => refreshProfile(true),
    refreshStats: () => refreshStats(true),
    refreshOffers: (filters?: any) => refreshOffers(filters, true),
    refreshApplications: (filters?: any) => refreshApplications(filters, true),
    refreshCollaborations: (filters?: any) => refreshCollaborations(filters, true),
    refreshEstablishments: () => refreshEstablishments(true),
    refreshQRCodes: () => refreshQRCodes(true),
    refreshWeeklyReservations: () => refreshWeeklyReservations(true),
    refreshConversations: () => refreshConversations(true),
    refreshAll,
    lastUpdated,
    isLoading,
  }
  
  return (
    <BusinessDataContext.Provider value={value}>
      {children}
    </BusinessDataContext.Provider>
  )
}

export function useBusinessData() {
  const context = useContext(BusinessDataContext)
  if (context === undefined) {
    throw new Error('useBusinessData must be used within a BusinessDataProvider')
  }
  return context
}

