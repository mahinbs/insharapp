"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AdvancedBottomNav from "../../../components/AdvancedBottomNav";
import { getProfileByUserId, type Profile } from "@/lib/supabase-profile";
import { supabase } from "@/lib/supabase";

export default function ProfileByIdPage() {
  const router = useRouter();
  const params = useParams();
  const profileId = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!profileId) {
        setError("Profile ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check if user is authenticated (optional - profile might be public)
        const { data: { session } } = await supabase.auth.getSession();

        // Get profile by ID
        const { data, error: profileError } = await getProfileByUserId(profileId);
        
        if (profileError) {
          console.error('Error loading profile:', profileError);
          setError(profileError.message || 'Failed to load profile');
          setLoading(false);
          return;
        }
        
        if (!data) {
          setError('Profile not found');
          setLoading(false);
          return;
        }

        setProfileData(data);
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [profileId]);

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

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pb-24">
        <div className="text-center px-6">
          <i className="ri-error-warning-line text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Profile Not Found</h3>
          <p className="text-gray-600 mb-6">{error || 'The profile you are looking for does not exist.'}</p>
          <button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Go Back
          </button>
        </div>
        <AdvancedBottomNav userType={profileData?.user_type || "influencer"} />
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

  // For business profiles, show business social links
  if (profileData.user_type === 'business') {
    if (profileData.business_instagram) {
      socialLinks.push({
        icon: "ri-instagram-line",
        handle: profileData.business_instagram,
        stats: "",
      });
    }
    if (profileData.business_tiktok) {
      socialLinks.push({
        icon: "ri-tiktok-fill",
        handle: profileData.business_tiktok,
        stats: "",
      });
    }
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

  // Business-specific details
  if (profileData.user_type === 'business') {
    if (profileData.business_name) {
      detailList.push({ icon: "ri-store-3-line", text: profileData.business_name });
    }
    if (profileData.business_category) {
      detailList.push({ icon: "ri-folder-line", text: profileData.business_category });
    }
    if (profileData.business_location) {
      detailList.push({ icon: "ri-map-pin-2-line", text: profileData.business_location });
    }
    if (profileData.business_website) {
      detailList.push({ icon: "ri-global-line", text: profileData.business_website });
    }
  }

  const portfolioItems = [
    {
      id: 1,
      type: "video",
      title: "Collaboration Content",
      business: profileData.user_type === 'business' ? profileData.business_name : null,
      thumbnail: profileData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.full_name || 'User')}&background=random&size=400`,
      duration: "2:34",
      views: "12.5K",
      likes: "1.2K",
      date: "2 weeks ago",
      platform: "Instagram Reels",
      isCollaboration: true,
      autoAdded: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <i className="ri-arrow-left-line text-gray-700 text-xl"></i>
          </button>
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
          <div className="w-10"></div>
        </div>

        <div className="flex flex-col justify-center items-center space-x-4 mb-6">
          <div className="w-full flex justify-around items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-black overflow-hidden">
                <img
                  src={profileData.avatar_url || profileData.business_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    profileData.full_name || profileData.business_name || 'User'
                  )}&background=random&size=160`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profileData.full_name || profileData.business_name || 'User'
                    )}&background=random&size=160`;
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col mb-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-400 tracking-[0.35em]">
                  {profileData.username?.toUpperCase() || profileData.business_name?.toUpperCase() || 'USER'}
                </p>
                <div className="flex items-center bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white px-3 py-1 rounded-xl space-x-2 shadow-md">
                  <i className="ri-star-fill text-sm"></i>
                  <span className="text-sm font-semibold">5.0</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {profileData.user_type === 'business' ? 'Business' : 'Influencer'} since {new Date(profileData.created_at).getFullYear()}
              </p>
            </div>
          </div>

          <div>
            <div className="space-y-2 mb-4">
              {socialLinks.map((item, index) => (
                <div
                  key={`${item.icon}-${index}`}
                  className="flex items-center text-sm text-gray-900"
                >
                  <i className={`${item.icon} text-lg text-gray-700 mr-2`}></i>
                  <span className="font-semibold">{item.handle}</span>
                  <span className="text-gray-500 ml-1">{item.stats}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-sm text-gray-800 mb-4">
              {detailList.map((detail, index) => (
                <div key={`${detail.text}-${index}`} className="flex items-center space-x-2">
                  <i className={`${detail.icon} text-gray-600`}></i>
                  <span>{detail.text}</span>
                </div>
              ))}
            </div>
          </div>
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

      {/* App Bottom Navigation */}
      <AdvancedBottomNav userType={profileData.user_type || "influencer"} />
    </div>
  );
}

