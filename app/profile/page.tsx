"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdvancedBottomNav from "../../components/AdvancedBottomNav";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [profileData, setProfileData] = useState({
    name: "Sarah Johnson",
    username: "sarahstyles",
    bio: "Lifestyle & Fashion Influencer | Creating content that inspires ✨",
    followers: "25.2K",
    following: "1.8K",
    posts: "342",
    location: "Los Angeles, CA",
    website: "sarahstyles.com",
    tiktok: "@sarahstyles",
    instagram: "@sarahstyles",
  });

  const nameParts = profileData.name.split(" ");
  const firstName = nameParts[0] || profileData.name;
  const formattedLastName = nameParts.slice(1).join(" ").toUpperCase();
  const followerLabel = profileData.followers
    ? `${profileData.followers} followers`
    : "";
  const contactEmail = `${profileData.username}@gmail.com`;

  const socialLinks = [
    {
      icon: "ri-tiktok-fill",
      handle: profileData.tiktok,
      stats: followerLabel ? `- ${followerLabel}` : "",
    },
    {
      icon: "ri-instagram-line",
      handle: profileData.instagram,
      stats: followerLabel ? `- ${followerLabel}` : "",
    },
  ];

  const detailList = [
    { icon: "ri-camera-3-line", text: profileData.bio },
    { icon: "ri-map-pin-line", text: profileData.location },
    { icon: "ri-mail-line", text: contactEmail },
    ...(profileData.website
      ? [{ icon: "ri-store-2-line", text: `Founder of ${profileData.website}` }]
      : []),
  ];

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
              <i className="ri-verified-badge-fill text-pink-500 text-2xl"></i>
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
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face"
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profileData.name
                    )}&background=random&size=160`;
                  }}
                />
              </div>
               <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-pink-500 rounded-full flex items-center justify-center border-2 border-white">
                <i className="ri-check-line text-white text-sm"></i>
              </div>
            </div>

              <div className="flex  flex-col mb-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-400 tracking-[0.35em]">
                    {profileData.username.toUpperCase()}
                  </p>
                  <div className="flex items-center bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white px-3 py-1 rounded-xl space-x-2 shadow-md">
                    <i className="ri-star-fill text-sm"></i>
                    <span className="text-sm font-semibold">5.0</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  Member since 2024
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
              <button className="w-full border-2 border-purple-500 text-purple-600 font-semibold py-3 rounded-xl text-sm tracking-wide hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-orange-500 hover:text-white transition-all duration-300">
                Edit My Information
              </button>
              <button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white font-semibold py-3 rounded-xl text-sm tracking-wide hover:shadow-lg transition-all duration-300">
                Update Portfolio
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
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
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mt-4">
        <div className="flex">
          {[
            { key: "posts", label: "Publications", icon: "ri-grid-fill" },
            { key: "reels", label: "Favorites", icon: "ri-bookmark-2-line" },
            { key: "tagged", label: "Saved", icon: "ri-user-line" },
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

      {/* App Bottom Navigation */}
      <AdvancedBottomNav userType="influencer" />
    </div>
  );
}
