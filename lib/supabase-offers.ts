import { supabase } from './supabase/client'
import { getValidSession } from './supabase-session'

// Type definitions
export interface CreateOfferData {
  title: string
  description: string
  category: string
  location: string
  service_offered?: string
  requirements?: string[] | string
  images?: (string | File)[]  // Can be URLs or File objects
  expires_at?: string
}

export interface Offer {
  id: string
  business_id: string
  title: string
  description: string
  category: string
  location: string
  service_offered?: string | null
  requirements?: string[] | null
  images?: string[] | null
  main_image?: string | null
  business_name?: string | null
  business_logo?: string | null
  status: string
  expires_at?: string | null
  created_at: string
  updated_at: string
  views_count?: number
  applications_count?: number
}

// Simple timeout helper
const withTimeout = <T>(
  promise: Promise<T>,
  ms: number,
  errorMessage: string
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(errorMessage));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

/**
 * Create a new offer
 */
export async function createOffer(offerData: CreateOfferData) {
  console.log('📝 createOffer: Starting...');
  
  try {
    // Step 1: Ensure session is ready before proceeding
    console.log('Step 1: Ensuring session is ready...');
    
    const { session, error: sessionError } = await getValidSession();
    
    if (sessionError || !session) {
      console.error('No valid session found:', sessionError);
      throw new Error('Your session has expired. Please log in again.');
    }
    
    const user = session.user;
    if (!user) {
      console.error('No user found in session');
      throw new Error('Not authenticated. Please log in again.');
    }
    
    console.log('✓ Authenticated as:', user.email);

    // Step 2: Get business profile
    console.log('Step 2: Fetching business profile...');
    const profileQuery = supabase
        .from('profiles')
        .select('business_name, business_logo, user_type')
        .eq('id', user.id)
      .maybeSingle();
    
    const profileResult = await withTimeout(
      profileQuery as unknown as Promise<any>,
      10000,
      'Profile fetch timeout'
    );
    
    const { data: profile, error: profileError } = profileResult;

    if (profileError) {
      console.error('Profile error:', profileError);
      throw new Error('Failed to fetch business profile. Please try again.');
    }

    if (!profile) {
      console.error('No profile found');
      throw new Error('Business profile not found. Please complete your profile first.');
    }

    if (profile.user_type !== 'business') {
      console.error('User is not a business:', profile.user_type);
      throw new Error('Only businesses can create offers.');
    }

    console.log('✓ Profile found:', profile.business_name);
    
    // Step 3: Upload images if they are File objects
    console.log('Step 3: Processing images...');
    let imageUrls: string[] = [];
    
    if (offerData.images && offerData.images.length > 0) {
      for (let i = 0; i < offerData.images.length; i++) {
        const item = offerData.images[i];
        
        // If it's already a URL string, use it
        if (typeof item === 'string') {
          imageUrls.push(item);
          continue;
        }
        
        // If it's a File object, upload it
        if (item instanceof File) {
          try {
            console.log(`Uploading image ${i + 1}/${offerData.images.length}: ${item.name}`);
            
            const fileExt = item.name.split('.').pop();
            if (!fileExt) {
              console.warn(`Skipping image ${i + 1}: Invalid file format`);
              continue;
            }
            
            const fileName = `${user.id}/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `offer-images/${fileName}`;
            
            // Upload file
            const { error: uploadError } = await supabase.storage
              .from('images')
              .upload(filePath, item, {
                cacheControl: '3600',
                upsert: false
              });
            
            if (uploadError) {
              console.warn(`Failed to upload image ${i + 1}:`, uploadError.message);
              continue;
            }
            
            // Get public URL
            const { data: urlData } = supabase.storage
              .from('images')
              .getPublicUrl(filePath);
            
            if (urlData?.publicUrl) {
              imageUrls.push(urlData.publicUrl);
              console.log(`✓ Image ${i + 1} uploaded successfully`);
            }
          } catch (uploadErr: any) {
            console.warn(`Error uploading image ${i + 1}:`, uploadErr.message);
            // Continue with other images
          }
        }
      }
      
      console.log(`Successfully processed ${imageUrls.length}/${offerData.images.length} images`);
    }
    
    // Step 4: Prepare offer data
    console.log('Step 4: Preparing offer data...');
    
    // Process requirements
    let requirements: string[] = [];
    if (offerData.requirements) {
      if (Array.isArray(offerData.requirements)) {
        requirements = offerData.requirements;
      } else if (typeof offerData.requirements === 'string') {
        requirements = offerData.requirements
          .split('\n')
          .map((req: string) => req.trim())
          .filter((req: string) => req.length > 0);
      }
    }
    
    console.log(`Requirements: ${requirements.length} items`);

    // Process expiration date
    let expiresAtTimestamp = null;
    if (offerData.expires_at && offerData.expires_at.trim()) {
      const dateStr = offerData.expires_at.trim();
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        expiresAtTimestamp = new Date(dateStr + 'T23:59:59').toISOString();
        console.log(`Expiration date: ${dateStr}`);
      }
    }

    // Step 5: Insert into database
    console.log('Step 5: Inserting into database...');
    
    const insertData = {
      business_id: user.id,
      title: offerData.title.trim() || "New Offer",
      description: offerData.description.trim(),
      category: offerData.category,
      location: offerData.location.trim(),
      service_offered: offerData.service_offered?.trim() || null,
      requirements: requirements,
      images: imageUrls, // Always an array of URL strings
      main_image: imageUrls.length > 0 ? imageUrls[0] : null,
      business_name: profile.business_name || null,
      business_logo: profile.business_logo || null,
      status: 'active',
      expires_at: expiresAtTimestamp,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Inserting data:', {
      title: insertData.title.substring(0, 50),
      category: insertData.category,
      location: insertData.location.substring(0, 30),
      requirements_count: insertData.requirements.length,
      images_count: insertData.images.length
    });
    
    // Try to insert with timeout
    const insertQuery = supabase
        .from('offers')
        .insert(insertData)
        .select()
      .single();
    
    const insertResult = await withTimeout(
      insertQuery as unknown as Promise<any>,
      15000, // 15 second timeout for DB insert
      'Database insert timeout. Please try again.'
    );
    
    const { data, error } = insertResult;

    if (error) {
      console.error('Database insert error:', error);
      
      // Handle specific database errors
      if (error.code === '23503') {
        throw new Error('Business profile not found. Please complete your profile.');
      } else if (error.code === '42501') {
        throw new Error('Permission denied. Please check your account permissions.');
      } else if (error.code === '23505') {
        throw new Error('An offer with similar details already exists.');
      } else if (error.message?.includes('violates row-level security')) {
        throw new Error('Permission denied. Please check your RLS policies.');
      }
      
      throw error;
    }
    
    if (!data) {
      console.error('No data returned from insert');
      throw new Error('Failed to create offer. No confirmation received.');
    }
    
    console.log('✓ Offer created successfully!');
    console.log('Offer ID:', data.id);
    
    return { data: data as Offer, error: null };
    
  } catch (error: any) {
    console.error('✗ createOffer failed:', error);
    
    // Return formatted error
    let errorMessage = error.message || 'Failed to create offer';
    
    // Simplify error messages for user
    if (errorMessage.includes('timeout')) {
      errorMessage = 'Operation timed out. Please check your connection and try again.';
    } else if (errorMessage.includes('network')) {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (errorMessage.includes('permission')) {
      errorMessage = 'Permission denied. Please make sure you are logged in as a business.';
    }
    
    return { 
      data: null, 
      error: { 
        message: errorMessage,
        code: error.code || 'CREATE_FAILED'
      } 
    };
  }
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
  try {
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

    const queryResult = await withTimeout(
      query as unknown as Promise<any>,
      10000, // 10 seconds
      'Fetch offers timeout. Please try again.'
    )

    const { data, error } = queryResult

    if (error) {
      console.error('getOffers: Error:', error);
      return { data: null, error: { message: error.message || 'Failed to fetch offers' } }
    }

    return { data: data as Offer[], error: null }
  } catch (error: any) {
    console.error('getOffers: Unexpected error:', error);
    return { 
      data: null, 
      error: { 
        message: error.message || 'An unexpected error occurred while fetching offers.' 
      } 
    }
  }
}

/**
 * Get offer by ID
 */
export async function getOfferById(offerId: string) {
  try {
    const query = supabase
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

    const queryResult = await withTimeout(
      query as unknown as Promise<any>,
      10000, // 10 seconds
      'Fetch offer timeout. Please try again.'
    )

    const { data, error } = queryResult

    if (error) {
      console.error('getOfferById: Error:', error);
      return { data: null, error: { message: error.message || 'Failed to fetch offer' } }
    }

    if (!data) {
      return { data: null, error: { message: 'Offer not found' } }
    }

    return { data: data as Offer, error: null }
  } catch (error: any) {
    console.error('getOfferById: Unexpected error:', error);
    return { 
      data: null, 
      error: { 
        message: error.message || 'An unexpected error occurred while fetching the offer.' 
      } 
    }
  }
}

/**
 * Update an offer
 */
export async function updateOffer(offerId: string, updateData: Partial<CreateOfferData> & { status?: string }) {
  try {
    console.log('📝 updateOffer: Starting...');
    
    // Step 1: Ensure session is ready before proceeding
    console.log('Step 1: Ensuring session is ready...');
    
    const { session, error: sessionError } = await getValidSession();
    
    if (sessionError || !session) {
      console.error('No valid session found:', sessionError);
      return { data: null, error: { message: 'Your session has expired. Please log in again.' } }
    }
    
    const user = session.user;
    if (!user) {
      console.error('No user found in session');
      return { data: null, error: { message: 'Not authenticated. Please log in again.' } }
    }
    
    console.log('✓ Authenticated as:', user.email);

    // Process requirements if provided
    let requirements: string[] | undefined = undefined;
    if (updateData.requirements !== undefined) {
      if (Array.isArray(updateData.requirements)) {
        requirements = updateData.requirements;
      } else if (typeof updateData.requirements === 'string') {
        requirements = updateData.requirements
          .split('\n')
          .map((req: string) => req.trim())
          .filter((req: string) => req.length > 0);
      }
    }

    // Process expiration date if provided
    let expiresAtTimestamp: string | null | undefined = undefined;
    if (updateData.expires_at !== undefined) {
      if (updateData.expires_at && updateData.expires_at.trim()) {
        const dateStr = updateData.expires_at.trim();
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          expiresAtTimestamp = new Date(dateStr + 'T23:59:59').toISOString();
        } else if (!isNaN(Date.parse(dateStr))) {
          expiresAtTimestamp = dateStr;
        }
      } else {
        expiresAtTimestamp = null;
      }
    }

    // Prepare update data
    const updatePayload: any = {
      updated_at: new Date().toISOString()
    };

    if (updateData.title !== undefined) updatePayload.title = updateData.title.trim();
    if (updateData.description !== undefined) updatePayload.description = updateData.description.trim();
    if (updateData.category !== undefined) updatePayload.category = updateData.category;
    if (updateData.location !== undefined) updatePayload.location = updateData.location.trim();
    if (updateData.service_offered !== undefined) updatePayload.service_offered = updateData.service_offered?.trim() || null;
    if (requirements !== undefined) updatePayload.requirements = requirements;
    if (updateData.images !== undefined) {
      updatePayload.images = updateData.images;
      updatePayload.main_image = updateData.images && updateData.images.length > 0 ? updateData.images[0] : null;
    }
    if (expiresAtTimestamp !== undefined) updatePayload.expires_at = expiresAtTimestamp;
    if (updateData.status !== undefined) updatePayload.status = updateData.status;

    const updateQuery = supabase
      .from('offers')
      .update(updatePayload)
      .eq('id', offerId)
      .select()
      .single();

    const updateResult = await withTimeout(
      updateQuery as unknown as Promise<any>,
      15000, // 15 seconds
      'Update operation timeout. Please try again.'
    );

    const { data, error } = updateResult;

    if (error) {
      console.error('updateOffer: Update error:', error);
      return { data: null, error: { message: error.message || 'Failed to update offer' } }
    }
    
    if (!data) {
      console.error('updateOffer: No data returned from update');
      return { data: null, error: { message: 'Failed to update offer. Please try again.' } }
    }
    
    console.log('updateOffer: Success! Offer ID:', data.id);
    return { data: data as Offer, error: null }
  } catch (error: any) {
    console.error('updateOffer: Unexpected error:', error);
    return { 
      data: null, 
      error: { 
        message: error.message || 'An unexpected error occurred. Please try again.' 
      } 
    }
  }
}

/**
 * Delete an offer
 */
export async function deleteOffer(offerId: string) {
  try {
    // Quick auth check with timeout
    const { data: { session }, error: authError } = await withTimeout(
      supabase.auth.getSession(),
      10000, // 10 seconds
      'Authentication timeout. Please check your connection.'
    );
    
    if (authError) throw authError;
    if (!session?.user) {
      console.error('deleteOffer: Not authenticated');
      return { error: { message: 'Not authenticated. Please log in again.' } }
    }

    const deleteQuery = supabase
      .from('offers')
      .delete()
      .eq('id', offerId);

    const deleteResult = await withTimeout(
      deleteQuery as unknown as Promise<any>,
      15000, // 15 seconds
      'Delete operation timeout. Please try again.'
    );

    const { error } = deleteResult;

    if (error) {
      console.error('deleteOffer: Delete error:', error);
      return { error: { message: error.message || 'Failed to delete offer' } }
    }

    console.log('deleteOffer: Success! Offer ID:', offerId);
    return { error: null }
  } catch (error: any) {
    console.error('deleteOffer: Unexpected error:', error);
    return { 
      error: { 
        message: error.message || 'An unexpected error occurred. Please try again.' 
      } 
    }
  }
}

// Add this helper function for debugging
export async function debugAuthState() {
  try {
    console.log('=== DEBUG AUTH STATE ===');
    
    // Check localStorage for Supabase auth
    if (typeof window !== 'undefined') {
      const authKeys = Object.keys(localStorage).filter(key => key.includes('supabase') || key.includes('auth'));
      console.log('Auth-related localStorage keys:', authKeys);
      
      for (const key of authKeys) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const parsed = JSON.parse(value);
            console.log(`${key}:`, {
              exists: !!parsed,
              expires_at: parsed.expires_at ? new Date(parsed.expires_at * 1000) : 'No expiry',
              user_id: parsed.user?.id || parsed.user_id || 'N/A'
            });
          }
        } catch (e) {
          console.log(`${key}: Could not parse`);
        }
      }
    }
    
    // Try to get session
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log('Session error:', error);
    console.log('Session exists:', !!session);
    if (session) {
      console.log('User ID:', session.user.id);
      console.log('User email:', session.user.email);
      console.log('Session expires at:', session.expires_at ? new Date(session.expires_at * 1000) : 'No expiry');
    }
    
    return { session, error };
  } catch (error: any) {
    console.error('Debug error:', error);
    return { session: null, error };
  }
}