"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdvancedBottomNav from "../../components/AdvancedBottomNav";
import { getCurrentUserProfile, updateProfile, type Profile } from "@/lib/supabase-profile";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/supabase-examples";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editFormData, setEditFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    phone: '',
    location: '',
    website_url: '',
    followers_count: '',
    engagement_rate: '',
    niche: '',
    instagram_handle: '',
    tiktok_handle: '',
    avatar: null as File | null,
    avatarPreview: ''
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        // First check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth');
          return;
        }

        const { data, error } = await getCurrentUserProfile();
        if (error) {
          // If profile doesn't exist, show a message but don't redirect
          if (error.message === 'Profile not found') {
            console.warn('Profile not found, user may need to complete signup');
            setLoading(false);
            return;
          }
          console.error('Error loading profile:', error);
          // Only redirect on auth errors, not profile errors
          if (error.message === 'Not authenticated') {
            router.push('/auth');
            return;
          }
        }
        
        if (data) {
          setProfileData(data);
        }
      } catch (err) {
        console.error('Error:', err);
        // Don't redirect on errors, just show loading state
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  // Update form data when modal opens
  useEffect(() => {
    if (showEditModal && profileData) {
      setEditFormData({
        full_name: profileData.full_name || '',
        username: profileData.username || '',
        bio: profileData.bio || '',
        phone: profileData.phone || '',
        location: profileData.location || '',
        website_url: profileData.website_url || '',
        followers_count: profileData.followers_count?.toString() || '',
        engagement_rate: profileData.engagement_rate?.toString() || '',
        niche: profileData.niche || '',
        instagram_handle: profileData.instagram_handle || '',
        tiktok_handle: profileData.tiktok_handle || '',
        avatar: null,
        avatarPreview: profileData.avatar_url || ''
      });
    }
  }, [showEditModal, profileData]);

  const handleSaveProfile = async () => {
    if (!profileData) return;

    setSaving(true);
    try {
      let avatarUrl = editFormData.avatarPreview;

      // Upload new avatar if selected
      if (editFormData.avatar) {
        try {
          const uploadResult = await uploadImage(editFormData.avatar, 'images');
          avatarUrl = uploadResult.publicUrl;
        } catch (uploadError) {
          console.error('Avatar upload error:', uploadError);
          // Continue with existing avatar if upload fails
        }
      }

      // Prepare update data - parse numeric fields (handle string inputs)
      let followersCount: number | null = null;
      if (editFormData.followers_count && editFormData.followers_count.trim() !== '') {
        const cleaned = editFormData.followers_count.replace(/[^0-9.]/g, '');
        const parsed = parseInt(cleaned);
        followersCount = isNaN(parsed) ? null : parsed;
      }
      
      let engagementRate: number | null = null;
      if (editFormData.engagement_rate && editFormData.engagement_rate.trim() !== '') {
        const cleaned = editFormData.engagement_rate.replace('%', '').trim();
        const parsed = parseFloat(cleaned);
        engagementRate = isNaN(parsed) ? null : parsed;
      }

      // Build update data object - include ALL fields from the form
      // Process handles carefully - preserve @ symbols and trim whitespace
      const processHandle = (handle: string | undefined): string | undefined => {
        if (!handle) return undefined;
        const trimmed = handle.trim();
        return trimmed === '' ? undefined : trimmed;
      };

      const updateData: Partial<Profile> = {
        full_name: editFormData.full_name?.trim() || undefined,
        username: editFormData.username?.trim() || undefined,
        bio: editFormData.bio?.trim() || undefined,
        phone: editFormData.phone?.trim() || undefined,
        location: editFormData.location?.trim() || undefined,
        website_url: editFormData.website_url?.trim() || undefined,
        niche: editFormData.niche?.trim() || undefined,
        instagram_handle: processHandle(editFormData.instagram_handle),
        tiktok_handle: processHandle(editFormData.tiktok_handle),
      };
      
      // Include numeric fields (use undefined if not provided, 0 if explicitly set to 0)
      updateData.followers_count = followersCount !== null ? followersCount : undefined;
      updateData.engagement_rate = engagementRate !== null ? engagementRate : undefined;
      
      // Include avatar if uploaded or if we have a preview (existing avatar)
      if (avatarUrl) {
        updateData.avatar_url = avatarUrl;
      }

      console.log('Updating profile with data:', updateData);
      console.log('Instagram handle:', updateData.instagram_handle);
      console.log('TikTok handle:', updateData.tiktok_handle);
      
      try {
        const updatePromise = updateProfile(updateData);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Update timeout after 10 seconds')), 10000)
        );
        
        const { data: updatedProfile, error } = await Promise.race([
          updatePromise,
          timeoutPromise
        ]) as { data: any, error: any };

        if (error) {
          console.error('Error updating profile:', error);
          const errorMessage = error?.message || 'Unknown error occurred';
          alert(`Failed to update profile: ${errorMessage}. Please try again.`);
          setSaving(false);
          return;
        }

        if (updatedProfile) {
          console.log('Profile updated successfully:', updatedProfile);
          // Update local state with new profile data immediately
          setProfileData(updatedProfile);
          
          // Reload profile in background (don't block on it)
          getCurrentUserProfile()
            .then(({ data: freshProfile }) => {
              if (freshProfile) {
                console.log('Profile reloaded:', freshProfile);
                setProfileData(freshProfile);
              }
            })
            .catch((reloadError) => {
              console.error('Error reloading profile:', reloadError);
              // Don't block on reload error, we already have updatedProfile
            });
          
          setSaving(false);
          setShowEditModal(false);
          // Show success message
          alert('Profile updated successfully!');
        } else {
          console.error('No profile data returned from update');
          setSaving(false);
          alert('Profile update completed but no data returned. Please refresh the page.');
        }
      } catch (timeoutError: any) {
        console.error('Update timeout or error:', timeoutError);
        setSaving(false);
        alert(`Update timed out or failed: ${timeoutError?.message || 'Unknown error'}. Please try again.`);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-pink-500 animate-spin mb-4"></i>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData && !loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pb-24">
        <div className="text-center px-6">
          <i className="ri-user-add-line text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Profile Setup Required</h3>
          <p className="text-gray-600 mb-6">Your profile is being set up. Please wait a moment and refresh, or complete your profile setup.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Refresh Page
          </button>
        </div>
        <AdvancedBottomNav userType="influencer" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const nameParts = (profileData.full_name || 'User').split(" ");
  const firstName = nameParts[0] || profileData.full_name || 'User';
  const formattedLastName = nameParts.slice(1).join(" ").toUpperCase();
  const followersCount = profileData.followers_count || 0;
  const followersLabel = followersCount > 0 
    ? `${followersCount >= 1000 ? (followersCount / 1000).toFixed(1) + 'K' : followersCount} followers`
    : "";

  const socialLinks = [];
  if (profileData.tiktok_handle) {
    socialLinks.push({
      icon: "ri-tiktok-fill",
      handle: profileData.tiktok_handle,
      stats: followersLabel ? `- ${followersLabel}` : "",
    });
  }
  if (profileData.instagram_handle) {
    socialLinks.push({
      icon: "ri-instagram-line",
      handle: profileData.instagram_handle,
      stats: followersLabel ? `- ${followersLabel}` : "",
    });
  }

  const detailList = [];
  if (profileData.bio) {
    detailList.push({ icon: "ri-camera-3-line", text: profileData.bio });
  }
  if (profileData.location) {
    detailList.push({ icon: "ri-map-pin-line", text: profileData.location });
  }
  if (profileData.phone) {
    detailList.push({ icon: "ri-phone-line", text: profileData.phone });
  }
  if (profileData.website_url) {
    detailList.push({ icon: "ri-store-2-line", text: profileData.website_url });
  }
  if (profileData.niche) {
    detailList.push({ icon: "ri-hashtag", text: profileData.niche });
  }
  if (profileData.engagement_rate) {
    detailList.push({ icon: "ri-line-chart-line", text: `${profileData.engagement_rate}% engagement` });
  }

  const portfolioItems = [
    {
      id: 1,
      type: "video",
      title: "Bella Vista Restaurant Collaboration",
      business: "Bella Vista Restaurant",
      thumbnail:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop",
      duration: "2:34",
      views: "12.5K",
      likes: "1.2K",
      date: "2 weeks ago",
      platform: "Instagram Reels",
      isCollaboration: true,
      autoAdded: true,
    },
    {
      id: 2,
      type: "video",
      title: "Urban Threads Fashion Haul",
      business: "Urban Threads",
      thumbnail:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
      duration: "3:12",
      views: "8.7K",
      likes: "890",
      date: "1 month ago",
      platform: "TikTok",
      isCollaboration: true,
    },
    {
      id: 3,
      type: "video",
      title: "Luxe Beauty Salon Makeover",
      business: "Luxe Beauty Salon",
      thumbnail:
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop",
      duration: "4:56",
      views: "15.2K",
      likes: "2.1K",
      date: "2 months ago",
      platform: "Instagram Reels",
      isCollaboration: true,
    },
    {
      id: 4,
      type: "video",
      title: "Morning Routine Vlog",
      business: null,
      thumbnail:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      duration: "5:23",
      views: "6.8K",
      likes: "456",
      date: "3 weeks ago",
      platform: "YouTube",
      isCollaboration: false,
    },
    {
      id: 5,
      type: "image",
      title: "Fashion OOTD",
      business: null,
      thumbnail:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop",
      duration: null,
      views: "4.2K",
      likes: "234",
      date: "1 week ago",
      platform: "Instagram",
      isCollaboration: false,
    },
    {
      id: 6,
      type: "image",
      title: "Summer Vibes",
      business: null,
      thumbnail:
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=400&fit=crop",
      duration: null,
      views: "3.8K",
      likes: "198",
      date: "4 days ago",
      platform: "Instagram",
      isCollaboration: false,
    },
  ];

  const highlights = [
    {
      id: 1,
      title: "Collaborations",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 2,
      title: "Fashion",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 3,
      title: "Beauty",
      image:
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&h=100&fit=crop&crop=center",
    },
    {
      id: 4,
      title: "Travel",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&crop=center",
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-end space-x-2">
              <h1 className="text-3xl font-extrabold text-gray-900">
                {firstName}
              </h1>
              {formattedLastName && (
                <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  {formattedLastName}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="relative text-gray-700 hover:text-black transition-colors">
              <i className="ri-notification-3-line text-2xl"></i>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-pink-500"></span>
            </button>
            <button
              className="text-gray-700 hover:text-black transition-colors"
              onClick={() => router.push("/help")}
            >
              <i className="ri-information-line text-2xl"></i>
            </button>
            <button
              className="text-gray-700 hover:text-black transition-colors"
              onClick={() => router.push("/settings")}
            >
              <i className="ri-settings-3-line text-2xl"></i>
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center space-x-4 mb-6">
          <div className="w-full flex justify-around items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-black overflow-hidden">
                <img
                  src={profileData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profileData.full_name || 'User'
                  )}&background=random&size=160`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profileData.full_name || 'User'
                    )}&background=random&size=160`;
                  }}
                />
              </div>
            </div>

              <div className="flex  flex-col mb-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-400 tracking-[0.35em]">
                    {profileData.username?.toUpperCase() || 'USER'}
                  </p>
                  <div className="flex items-center bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white px-3 py-1 rounded-xl space-x-2 shadow-md">
                    <i className="ri-star-fill text-sm"></i>
                    <span className="text-sm font-semibold">5.0</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  Member since {new Date(profileData.created_at).getFullYear()}
                </p>
              </div>
          </div>

          <div>
            <div className="space-y-2 mb-4">
              {socialLinks.map((item) => (
                <div
                  key={item.icon}
                  className="flex items-center text-sm text-gray-900"
                >
                  <i className={`${item.icon} text-lg text-gray-700 mr-2`}></i>
                  <span className="font-semibold">{item.handle}</span>
                  <span className="text-gray-500 ml-1">{item.stats}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-sm text-gray-800 mb-4">
              {detailList.map((detail) => (
                <div key={detail.text} className="flex items-center space-x-2">
                  <i className={`${detail.icon} text-gray-600`}></i>
                  <span>{detail.text}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => setShowEditModal(true)}
                className="w-full border-2 border-purple-500 text-purple-600 font-semibold py-3 rounded-xl text-sm tracking-wide hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-orange-500 hover:text-white transition-all duration-300"
              >
                Edit My Information
              </button>
              <button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white font-semibold py-3 rounded-xl text-sm tracking-wide hover:shadow-lg transition-all duration-300">
                Update Portfolio
              </button>
            </div>
          </div>
        </div>

        {/* <div className="mb-6">
          <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
            {highlights.map((highlight) => (
              <div
                key={highlight.id}
                className="flex flex-col items-center space-y-1"
              >
                <div className="w-16 h-16 rounded-full border-2 border-gray-200 p-0.5">
                  <img
                    src={highlight.image}
                    alt={highlight.title}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        highlight.title
                      )}&background=random&size=100`;
                    }}
                  />
                </div>
                <span className="text-xs text-gray-600 uppercase tracking-wide">
                  {highlight.title}
                </span>
              </div>
            ))}
          </div>
        </div> */}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mt-4">
        <div className="flex">
          {[
            { key: "posts", label: "Publications", icon: "ri-grid-fill" },
            { key: "reels", label: "Favorites", icon: "ri-bookmark-2-line" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-[11px] font-bold tracking-wide uppercase flex items-center justify-center space-x-1 border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-pink-500 text-pink-500"
                  : "border-transparent text-gray-400"
              }`}
            >
              <i className={`${tab.icon} text-sm`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {portfolioItems.map((item) => (
          <div
            key={item.id}
            className="aspect-square relative group cursor-pointer"
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop&auto=format`;
              }}
            />

            {/* Video Overlay */}
            {item.type === "video" && (
              <div className="absolute top-2 right-2">
                <i className="ri-play-fill text-white text-lg drop-shadow-md"></i>
              </div>
            )}

            {/* Collaboration Badge */}
            {item.isCollaboration && (
              <div className="absolute top-2 left-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="ri-handshake-line text-white text-xs"></i>
                </div>
              </div>
            )}

            {/* Stats Overlay on Hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <i className="ri-heart-fill"></i>
                    <span>{item.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <i className="ri-eye-fill"></i>
                    <span>{item.views}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full h-full sm:h-auto sm:max-h-[90vh] flex flex-col sm:max-w-2xl">
            {/* Fixed Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <i className="ri-close-line text-gray-600 text-xl"></i>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
              <div className="space-y-6 pb-4">
              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  {editFormData.avatarPreview && (
                    <img
                      src={editFormData.avatarPreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                  )}
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setEditFormData({ ...editFormData, avatar: file });
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditFormData(prev => ({ ...prev, avatarPreview: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                    <div className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-center text-sm text-gray-600 hover:border-pink-400 transition-colors">
                      {editFormData.avatar ? 'Change Photo' : 'Upload Photo'}
                    </div>
                  </label>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={editFormData.full_name}
                  onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                  required
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={editFormData.username}
                  onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Phone and Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={editFormData.website_url}
                  onChange={(e) => setEditFormData({ ...editFormData, website_url: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                  placeholder="https://..."
                />
              </div>

              {/* Followers and Engagement */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Followers Count
                  </label>
                  <input
                    type="text"
                    value={editFormData.followers_count}
                    onChange={(e) => setEditFormData({ ...editFormData, followers_count: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    placeholder="e.g., 10000 or 10K"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Engagement Rate (%)
                  </label>
                  <input
                    type="text"
                    value={editFormData.engagement_rate}
                    onChange={(e) => setEditFormData({ ...editFormData, engagement_rate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    placeholder="e.g., 4.2"
                  />
                </div>
              </div>

              {/* Niche */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Niche
                </label>
                <input
                  type="text"
                  value={editFormData.niche}
                  onChange={(e) => setEditFormData({ ...editFormData, niche: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                  placeholder="e.g., Fashion, Food, Lifestyle"
                />
              </div>

              {/* Social Handles */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={editFormData.instagram_handle}
                    onChange={(e) => setEditFormData({ ...editFormData, instagram_handle: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    TikTok Handle
                  </label>
                  <input
                    type="text"
                    value={editFormData.tiktok_handle}
                    onChange={(e) => setEditFormData({ ...editFormData, tiktok_handle: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                    placeholder="@username"
                  />
                </div>
              </div>
            </div>
            </div>

            {/* Fixed Bottom Action Buttons */}
            <div className="flex space-x-3 p-4 sm:p-6 pb-20 sm:pb-6 border-t bg-white rounded-b-3xl flex-shrink-0">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={saving}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving || !editFormData.full_name}
                className="flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {saving ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Bottom Navigation */}
      <AdvancedBottomNav userType="influencer" />
    </div>
  );
}
