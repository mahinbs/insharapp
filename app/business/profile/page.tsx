"use client";

import Link from "next/link";
import AdvancedBottomNav from "../../../components/AdvancedBottomNav";
import { useState } from "react";
import { useRouter } from "next/navigation";

const showcaseItems = [
  {
    id: 1,
    influencer: "@sarahstyles",
    platform: "Instagram Reels",
    type: "video",
    title: "Dining at Bella Vista",
    thumbnail: "https://picsum.photos/seed/showcase-1/800/600",
    views: "24.1K",
    likes: "1.8K",
    date: "2 weeks ago",
  },
  {
    id: 2,
    influencer: "@foodieguy",
    platform: "TikTok",
    type: "video",
    title: "Chef's Special Review",
    thumbnail: "https://picsum.photos/seed/showcase-2/800/600",
    views: "57.3K",
    likes: "3.2K",
    date: "1 month ago",
  },
  {
    id: 3,
    influencer: "@citylife",
    platform: "Instagram",
    type: "image",
    title: "Cozy Corner Spotlight",
    thumbnail: "https://picsum.photos/seed/showcase-3/800/600",
    views: "8.9K",
    likes: "640",
    date: "3 days ago",
  },
];

export default function BusinessProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/business/dashboard">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-arrow-left-line text-white text-xl"></i>
            </div>
          </Link>
          <div className="flex flex-col items-center">
            <h1 className="font-['Pacifico'] text-2xl text-white mb-1">Inshaar</h1>
            <span className="text-white/80 text-sm">Business Profile</span>
          </div>
          <Link href="/help">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <i className="ri-question-line text-white text-xl"></i>
            </div>
          </Link>
        </div>

        {/* Business Summary */}
        <div className="flex items-center space-x-4">
          <img
            src="https://picsum.photos/seed/business-avatar/96/96"
            alt="Business Logo"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40"
          />
          <div>
            <h2 className="text-white font-semibold text-lg">Bella Vista Restaurant</h2>
            <p className="text-white/80 text-sm">Restaurant • Downtown</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("about")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeTab === "about"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab("showcase")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeTab === "showcase"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Showcase
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {activeTab === "about" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">About the Business</h3>
            <p className="text-gray-600 text-sm mb-4">
              We are a modern restaurant offering seasonal menus and curated dining experiences.
              Our collaborations with influencers help us showcase our ambience, hospitality, and dishes.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">28</div>
                <div className="text-gray-500 text-sm">Past Collabs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">4.8</div>
                <div className="text-gray-500 text-sm">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">126K</div>
                <div className="text-gray-500 text-sm">Total Views</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "showcase" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Influencer Showcase</h3>
              <button className="text-purple-600 text-sm font-medium">Manage</button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-4">
              {showcaseItems.map((item) => (
                <div key={item.id} className="relative group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl bg-gray-100">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Platform Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.platform.includes("Instagram")
                          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                          : item.platform.includes("TikTok")
                          ? "bg-black text-white"
                          : "bg-red-500 text-white"
                      }`}>
                        {item.platform}
                      </span>
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center text-white">
                        <i className="ri-play-circle-line text-3xl mb-1"></i>
                        <p className="text-xs font-medium">View Content</p>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-2">
                    <h4 className="font-medium text-gray-800 text-sm mb-1 line-clamp-1">{item.title}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{item.influencer}</span>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <i className="ri-eye-line"></i>
                          <span>{item.views}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <i className="ri-heart-line"></i>
                          <span>{item.likes}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {showcaseItems.length === 0 && (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <i className="ri-gallery-line text-4xl text-gray-400 mb-4"></i>
                <h4 className="text-lg font-semibold text-gray-600 mb-2">No Showcase Content Yet</h4>
                <p className="text-gray-500 mb-4">Content from influencer collaborations will appear here</p>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                  Add Content
                </button>
              </div>
            )}
          </div>
        )}
      </div>

              {/* Settings */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>
          <div className="space-y-4">
          <button className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => router.push('/business/services')}
            >
              <div className="flex items-center space-x-3">
                <i className="ri-shield-line text-gray-600"></i>
                <span className="text-gray-800">Services</span>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </button>

            <button className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <i className="ri-notification-line text-gray-600"></i>
                <span className="text-gray-800">Notifications</span>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </button>
            
            <button className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <i className="ri-shield-line text-gray-600"></i>
                <span className="text-gray-800">Privacy</span>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </button>
            
            <button className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <i className="ri-question-line text-gray-600"></i>
                <span className="text-gray-800">Help & Support</span>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </button>
            
            <button className="w-full flex items-center justify-between py-3 px-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
              <div className="flex items-center space-x-3">
                <i className="ri-logout-box-line text-red-600"></i>
                <span className="text-red-600">Sign Out</span>
              </div>
              <i className="ri-arrow-right-s-line text-red-400"></i>
            </button>
          </div>
        </div>

      <AdvancedBottomNav userType="business" />
    </div>
  );
}


