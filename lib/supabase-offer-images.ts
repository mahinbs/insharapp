import { supabase } from './supabase'
import { uploadImage } from './supabase-examples'

/**
 * Offer Images API utilities
 * Functions to upload and manage restaurant/offer images
 */

/**
 * Upload multiple images for an offer
 */
export async function uploadOfferImages(offerId: string, imageFiles: File[]) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } }
    }

    // Verify user owns the offer
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('business_id, images, main_image')
      .eq('id', offerId)
      .single()

    if (offerError || !offer) {
      return { data: null, error: { message: 'Offer not found' } }
    }

    if (offer.business_id !== user.id) {
      return { data: null, error: { message: 'Not authorized to update this offer' } }
    }

    // Upload all images
    const uploadedUrls: string[] = []
    for (const file of imageFiles) {
      try {
        const uploadResult = await uploadImage(file, 'images')
        uploadedUrls.push(uploadResult.publicUrl)
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError)
        // Continue with other images
      }
    }

    if (uploadedUrls.length === 0) {
      return { data: null, error: { message: 'Failed to upload any images' } }
    }

    // Update offer with new images
    const existingImages = offer.images || []
    const allImages = [...existingImages, ...uploadedUrls]
    const newMainImage = offer.main_image || uploadedUrls[0]

    const { data: updatedOffer, error: updateError } = await supabase
      .from('offers')
      .update({
        images: allImages,
        main_image: newMainImage,
        updated_at: new Date().toISOString()
      })
      .eq('id', offerId)
      .select()
      .single()

    if (updateError) throw updateError

    return { data: updatedOffer, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Set main image for an offer
 */
export async function setOfferMainImage(offerId: string, imageUrl: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } }
    }

    // Verify user owns the offer
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('business_id, images')
      .eq('id', offerId)
      .single()

    if (offerError || !offer) {
      return { data: null, error: { message: 'Offer not found' } }
    }

    if (offer.business_id !== user.id) {
      return { data: null, error: { message: 'Not authorized to update this offer' } }
    }

    // Verify image is in the images array
    const images = offer.images || []
    if (!images.includes(imageUrl)) {
      return { data: null, error: { message: 'Image not found in offer images' } }
    }

    const { data: updatedOffer, error: updateError } = await supabase
      .from('offers')
      .update({
        main_image: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', offerId)
      .select()
      .single()

    if (updateError) throw updateError

    return { data: updatedOffer, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Remove image from offer
 */
export async function removeOfferImage(offerId: string, imageUrl: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } }
    }

    // Verify user owns the offer
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('business_id, images, main_image')
      .eq('id', offerId)
      .single()

    if (offerError || !offer) {
      return { data: null, error: { message: 'Offer not found' } }
    }

    if (offer.business_id !== user.id) {
      return { data: null, error: { message: 'Not authorized to update this offer' } }
    }

    // Remove image from array
    const images = (offer.images || []).filter((img: string) => img !== imageUrl)
    let newMainImage = offer.main_image

    // If removed image was main image, set first remaining image as main
    if (offer.main_image === imageUrl) {
      newMainImage = images[0] || null
    }

    const { data: updatedOffer, error: updateError } = await supabase
      .from('offers')
      .update({
        images: images,
        main_image: newMainImage,
        updated_at: new Date().toISOString()
      })
      .eq('id', offerId)
      .select()
      .single()

    if (updateError) throw updateError

    return { data: updatedOffer, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

/**
 * Update offer with image URLs directly (for manual updates)
 */
export async function updateOfferImages(offerId: string, imageUrls: string[], mainImageUrl?: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } }
    }

    // Verify user owns the offer
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('business_id')
      .eq('id', offerId)
      .single()

    if (offerError || !offer) {
      return { data: null, error: { message: 'Offer not found' } }
    }

    if (offer.business_id !== user.id) {
      return { data: null, error: { message: 'Not authorized to update this offer' } }
    }

    const { data: updatedOffer, error: updateError } = await supabase
      .from('offers')
      .update({
        images: imageUrls,
        main_image: mainImageUrl || imageUrls[0] || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', offerId)
      .select()
      .single()

    if (updateError) throw updateError

    return { data: updatedOffer, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}



