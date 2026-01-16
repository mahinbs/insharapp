"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import logo_dark from "@/assetes/logo_dark.png";
import { createOffer, getOfferById, updateOffer } from "@/lib/supabase-offers";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

function PostOfferContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, session, loading: authLoading } = useAuth();
  
  // Safely get edit offer ID with null check
  const editOfferId = searchParams?.get('edit') || null;
  const isEditMode = !!editOfferId;
  const mountedRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [loadingOffer, setLoadingOffer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    serviceOffered: "",
    category: "",
    location: "",
    requirements: "",
    expiresAt: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  
  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<{
    category?: string;
    description?: string;
    serviceOffered?: string;
  }>({});

  const categories = [
    "Restaurant",
    "Beauty & Spa",
    "Fashion",
    "Fitness",
    "Travel",
    "Technology",
    "Home & Garden",
    "Entertainment",
  ];

  // Mark component as mounted
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Check authentication on mount - wait for auth to be ready
  useEffect(() => {
    // Don't proceed if auth is still loading
    if (authLoading) {
      return;
    }

    if (!mountedRef.current) return;
    
    const checkAuth = async () => {
      try {
        if (!mountedRef.current) return;
        if (!user || !session) {
          router.push('/auth');
          return;
        }

        // Load offer data if in edit mode
        if (isEditMode && editOfferId) {
          setLoadingOffer(true);
          const result = await getOfferById(editOfferId);
          if (result.data) {
            const offer = result.data;
            setFormData({
              title: offer.title || "",
              description: offer.description || "",
              serviceOffered: offer.service_offered || "",
              category: offer.category || "",
              location: offer.location || "",
              requirements: Array.isArray(offer.requirements) 
                ? offer.requirements.join('\n') 
                : offer.requirements || "",
              expiresAt: offer.expires_at 
                ? new Date(offer.expires_at).toISOString().split('T')[0] 
                : "",
            });
            if (offer.images && offer.images.length > 0) {
              setExistingImageUrls(offer.images);
              setImagePreviews(offer.images);
            }
          } else if (result.error) {
            setError('Failed to load offer: ' + result.error.message);
          }
          setLoadingOffer(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };
    
    checkAuth();
  }, [router, isEditMode, editOfferId, user, session, authLoading]);

  // Validation functions
  const validateForm = (): boolean => {
    const errors: {
      category?: string;
      description?: string;
      serviceOffered?: string;
    } = {};

    // Validate category
    if (!formData.category) {
      errors.category = "Category is required";
    } else if (!categories.includes(formData.category)) {
      errors.category = `Category must be one of: ${categories.join(", ")}`;
    }

    // Validate description (max 500 characters)
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.length > 500) {
      errors.description = `Description must be 500 characters or less (currently ${formData.description.length})`;
    }

    // Validate service offered (max 500 characters)
    if (!formData.serviceOffered.trim()) {
      errors.serviceOffered = "Service offered is required";
    } else if (formData.serviceOffered.length > 500) {
      errors.serviceOffered = `Service offered must be 500 characters or less (currently ${formData.serviceOffered.length})`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 5 images total (existing + new)
    const totalImages = imagePreviews.length + files.length;
    const filesToAdd = totalImages > 5 
      ? files.slice(0, 5 - imagePreviews.length)
      : files;
    
    setImageFiles([...imageFiles, ...filesToAdd]);

    // Create previews
    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_: any, i: number) => i !== index));
    setImagePreviews(imagePreviews.filter((_: any, i: number) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
    // Clear previous errors
    setError(null);
    setValidationErrors({});
    
    // Basic validation
    if (!formData.category) {
      setError("Please select a category");
      return;
    }
    
    if (!formData.description.trim()) {
      setError("Please enter a description");
      return;
    }
    
    if (formData.description.length > 500) {
      setError("Description must be 500 characters or less");
      return;
    }
    
    if (!formData.serviceOffered.trim()) {
      setError("Please describe what you're offering");
      return;
    }
    
    if (formData.serviceOffered.length > 500) {
      setError("Service offered must be 500 characters or less");
      return;
    }
    
    if (!formData.location.trim()) {
      setError("Please enter a location");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting offer creation...');
      
      // Prepare offer data - pass File objects directly, they'll be uploaded in createOffer
      const offerData = {
        title: formData.title.trim() || "New Offer",
        description: formData.description.trim(),
        category: formData.category,
        location: formData.location.trim(),
        service_offered: formData.serviceOffered.trim(),
        requirements: formData.requirements
          .split('\n')
          .map(r => r.trim())
          .filter(r => r.length > 0),
        images: imageFiles, // Pass File objects directly - createOffer will upload them
        expires_at: formData.expiresAt && formData.expiresAt.trim() 
          ? formData.expiresAt.trim() 
          : undefined
      };
      
      console.log('Creating offer with data:', {
        title: offerData.title,
        category: offerData.category,
        location: offerData.location,
        requirements_count: offerData.requirements.length,
        images_count: offerData.images.length,
        has_expiration: !!offerData.expires_at
      });
      
      // Create or update the offer
      let result;
      if (isEditMode && editOfferId) {
        // Update existing offer
        // For edit mode, we need to upload new files first, then combine URLs
        let finalImageUrls = [...existingImageUrls];
        
        // Upload new files if any
        if (imageFiles.length > 0) {
          if (!user) {
            throw new Error('Not authenticated');
          }
          
          for (const file of imageFiles) {
            try {
              const fileExt = file.name.split('.').pop();
              if (!fileExt) continue;
              
              const fileName = `${user.id}/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
              const filePath = fileName;
              
              const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file, {
                  cacheControl: '3600',
                  upsert: false
                });
              
              if (uploadError) {
                console.warn('Failed to upload image:', uploadError.message);
                continue;
              }
              
              const { data } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);
              
              if (data?.publicUrl) {
                finalImageUrls.push(data.publicUrl);
              }
            } catch (uploadErr: any) {
              console.warn('Error uploading image:', uploadErr.message);
              // Continue with other images
            }
          }
        }
        
        const updateData = {
          title: offerData.title,
          description: offerData.description,
          category: offerData.category,
          location: offerData.location,
          service_offered: offerData.service_offered,
          requirements: offerData.requirements,
          images: finalImageUrls, // Use string URLs for update
          expires_at: offerData.expires_at
        };
        
        result = await updateOffer(editOfferId, updateData);
        
        if (result.error) {
          throw new Error(result.error.message);
        }
        
        if (!result.data) {
          throw new Error('Failed to update offer');
        }
        
        console.log('✅ Offer updated successfully! ID:', result.data.id);
      } else {
        // Create new offer
        result = await createOffer(offerData);
        
        if (result.error) {
          throw new Error(result.error.message);
        }
        
        if (!result.data) {
          throw new Error('Failed to create offer');
        }
        
        console.log('✅ Offer created successfully! ID:', result.data.id);
      }
      
      // Redirect to business home
      if (mountedRef.current) {
        router.push('/business/home');
        router.refresh(); // Refresh the page to show updated offer
      }
      
    } catch (err: any) {
      console.error('❌ Error creating offer:', err);
      
      let errorMessage = err.message || 'An error occurred while creating the offer';
      
      // User-friendly error messages
      if (errorMessage.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your internet connection and try again.';
      } else if (errorMessage.includes('network')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (errorMessage.includes('permission') || errorMessage.includes('not authorized')) {
        errorMessage = 'Permission denied. Please make sure you are logged in as a business account.';
      } else if (errorMessage.includes('profile')) {
        errorMessage = 'Business profile not found. Please complete your business profile first.';
      } else if (errorMessage.includes('RLS') || errorMessage.includes('row-level security')) {
        errorMessage = 'Permission error. Please check your database permissions.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <Link href="/business/home">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-arrow-left-line text-white text-xl"></i>
            </div>
          </Link>
          <div className=" flex flex-col items-center">
            <img 
              src={logo_dark.src}
              alt="Inshaar" 
              className="h-10 w-40 object-cover mb-1"
            />
            <span className="text-white/80 text-sm">{isEditMode ? 'Edit Offer' : 'Post New Offer'}</span>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 py-6 pb-24">
        <form id="offer-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-gray-800 font-semibold mb-3">
              Offer Title
            </label>
            <input
              type="text"
              placeholder="e.g., Free 3-Course Dinner"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500 outline-none text-gray-800"
              required
            />
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-gray-800 font-semibold mb-3">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value });
                // Clear validation error when user selects
                if (validationErrors.category) {
                  setValidationErrors({ ...validationErrors, category: undefined });
                }
              }}
              className={`w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 ${
                validationErrors.category ? 'ring-2 ring-red-500' : ''
              }`}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {validationErrors.category && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <i className="ri-error-warning-line mr-1"></i>
                {validationErrors.category}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-gray-800 font-semibold mb-3">
              Description
            </label>
            <textarea
              placeholder="Describe what the influencer will receive and experience..."
              value={formData.description}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, description: value });
                // Clear validation error when user types
                if (validationErrors.description && value.length <= 500) {
                  setValidationErrors({ ...validationErrors, description: undefined });
                }
              }}
              rows={4}
              maxLength={500}
              className={`w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 resize-none ${
                validationErrors.description ? 'ring-2 ring-red-500' : ''
              }`}
              required
            />
            <div className="flex items-center justify-between mt-2">
              <div>
                {validationErrors.description && (
                  <p className="text-red-500 text-sm flex items-center">
                    <i className="ri-error-warning-line mr-1"></i>
                    {validationErrors.description}
                  </p>
                )}
              </div>
              <div className={`text-sm ${
                formData.description.length > 500 
                  ? 'text-red-500 font-semibold' 
                  : formData.description.length > 450 
                    ? 'text-orange-500' 
                    : 'text-gray-500'
              }`}>
                {formData.description.length}/500
              </div>
            </div>
          </div>

          {/* Service Offered */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-gray-800 font-semibold mb-3">
              What You're Offering
            </label>
            <textarea
              placeholder="Detail the specific service or product you're providing..."
              value={formData.serviceOffered}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, serviceOffered: value });
                // Clear validation error when user types
                if (validationErrors.serviceOffered && value.length <= 500) {
                  setValidationErrors({ ...validationErrors, serviceOffered: undefined });
                }
              }}
              rows={3}
              maxLength={500}
              className={`w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 resize-none ${
                validationErrors.serviceOffered ? 'ring-2 ring-red-500' : ''
              }`}
              required
            />
            <div className="flex items-center justify-between mt-2">
              <div>
                {validationErrors.serviceOffered && (
                  <p className="text-red-500 text-sm flex items-center">
                    <i className="ri-error-warning-line mr-1"></i>
                    {validationErrors.serviceOffered}
                  </p>
                )}
              </div>
              <div className={`text-sm ${
                formData.serviceOffered.length > 500 
                  ? 'text-red-500 font-semibold' 
                  : formData.serviceOffered.length > 450 
                    ? 'text-orange-500' 
                    : 'text-gray-500'
              }`}>
                {formData.serviceOffered.length}/500
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-gray-800 font-semibold mb-3">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g., Downtown Plaza, 123 Main Street"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500 outline-none text-gray-800"
              required
            />
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-gray-800 font-semibold mb-3">
              Influencer Requirements
            </label>
            <textarea
              placeholder="Enter each requirement on a new line:&#10;• Minimum 10K followers&#10;• Food niche&#10;• Post 3 stories&#10;• 1 Instagram post"
              value={formData.requirements}
              onChange={(e) =>
                setFormData({ ...formData, requirements: e.target.value })
              }
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 resize-none"
              required
            />
            <div className="text-right text-gray-500 text-sm mt-2">
              {formData.requirements.length}/500
            </div>
          </div>

          {/* Expiration Date (Optional) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-gray-800 font-semibold mb-3">
              Offer Expiration Date (Optional)
            </label>
            <input
              type="date"
              value={formData.expiresAt}
              onChange={(e) =>
                setFormData({ ...formData, expiresAt: e.target.value })
              }
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500 outline-none text-gray-800"
            />
            <p className="text-gray-500 text-sm mt-2">
              Leave empty if the offer has no expiration date
            </p>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-gray-800 font-semibold mb-3">
              Photos (up to 5 images)
            </label>
            
            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        // Remove from previews
                        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
                        // If it's an existing URL, remove from existingImageUrls
                        if (existingImageUrls.includes(preview)) {
                          setExistingImageUrls(existingImageUrls.filter(url => url !== preview));
                        }
                        // If it's a file, remove from imageFiles
                        if (index < imageFiles.length) {
                          setImageFiles(imageFiles.filter((_, i) => i !== index));
                        }
                      }}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="ri-close-line text-sm"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area */}
            {imagePreviews.length < 5 && (
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 transition-colors">
                  <i className="ri-image-add-line text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-600 mb-2">
                    {imagePreviews.length === 0 
                      ? 'Upload photos of your business or service'
                      : `Add more photos (${imagePreviews.length}/5)`
                    }
                  </p>
                  <p className="text-gray-500 text-sm">PNG, JPG up to 10MB each</p>
                  <div className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium inline-block">
                    Choose Photos
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={imagePreviews.length >= 5}
                />
              </label>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center space-x-2">
                <i className="ri-error-warning-line text-red-500"></i>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              if (mountedRef.current) {
                router.back();
              }
            }}
            disabled={loading}
            className="flex-1 bg-gray-100 text-gray-800 py-4 rounded-2xl font-semibold text-lg disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            form="offer-form"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                {isEditMode ? 'Updating Offer...' : 'Creating Offer...'}
              </>
            ) : (
              isEditMode ? 'Update Offer' : 'Post Offer'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PostOffer() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      }
    >
      <PostOfferContent />
    </Suspense>
  );
}
