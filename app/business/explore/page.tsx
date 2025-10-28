"use client";

import { useState } from "react";
import Link from "next/link";
import AdvancedBottomNav from "../../../components/AdvancedBottomNav";

const exploreContent = [
  {
    id: 1,
    influencer: {
      name: "Sarah Styles",
      handle: "@sarahstyles",
      avatar: "https://i.pravatar.cc/48?img=5",
      followers: "25K",
      verified: true
    },
    business: "Bella Vista Restaurant",
    businessLogo: "https://i.pravatar.cc/32?img=12",
    content: {
      type: "video",
      thumbnail: "https://picsum.photos/seed/explore-1/400/600",
      duration: "0:45",
      platform: "Instagram Reels"
    },
    title: "Amazing dinner experience at Bella Vista! The ambiance is perfect for date night ✨",
    description: "Tried their new seasonal menu and it was absolutely incredible. The presentation was chef's kiss 👌",
    stats: {
      views: "24.1K",
      likes: "1.8K",
      comments: "89",
      shares: "23"
    },
    tags: ["#restaurant", "#foodie", "#datenight", "#bellaVista"],
    postedAt: "2 hours ago",
    isLiked: false,
    isBookmarked: false
  },
  {
    id: 2,
    influencer: {
      name: "Foodie Guy",
      handle: "@foodieguy",
      avatar: "https://i.pravatar.cc/48?img=8",
      followers: "45K",
      verified: true
    },
    business: "Luxe Beauty Salon",
    businessLogo: "https://i.pravatar.cc/32?img=32",
    content: {
      type: "image",
      thumbnail: "https://picsum.photos/seed/explore-2/400/600",
      platform: "Instagram"
    },
    title: "Complete transformation at Luxe Beauty! Look at this glow up 🔥",
    description: "From hair to makeup, everything was perfect. Highly recommend their services!",
    stats: {
      views: "18.7K",
      likes: "2.1K",
      comments: "156",
      shares: "45"
    },
    tags: ["#beauty", "#transformation", "#luxeBeauty", "#glowup"],
    postedAt: "5 hours ago",
    isLiked: true,
    isBookmarked: true
  },
  {
    id: 3,
    influencer: {
      name: "City Life",
      handle: "@citylife",
      avatar: "https://i.pravatar.cc/48?img=15",
      followers: "12K",
      verified: false
    },
    business: "Urban Threads",
    businessLogo: "https://i.pravatar.cc/32?img=14",
    content: {
      type: "video",
      thumbnail: "https://picsum.photos/seed/explore-3/400/600",
      duration: "1:20",
      platform: "TikTok"
    },
    title: "New outfit from Urban Threads - this style is everything! 💫",
    description: "Love how versatile this piece is. Can dress it up or down for any occasion.",
    stats: {
      views: "67.3K",
      likes: "4.2K",
      comments: "234",
      shares: "89"
    },
    tags: ["#fashion", "#urbanThreads", "#style", "#ootd"],
    postedAt: "1 day ago",
    isLiked: false,
    isBookmarked: false
  },
  {
    id: 4,
    influencer: {
      name: "Fitness Queen",
      handle: "@fitnessqueen",
      avatar: "https://i.pravatar.cc/48?img=20",
      followers: "38K",
      verified: true
    },
    business: "FitLife Gym",
    businessLogo: "https://i.pravatar.cc/32?img=25",
    content: {
      type: "video",
      thumbnail: "https://picsum.photos/seed/explore-4/400/600",
      duration: "2:15",
      platform: "Instagram Reels"
    },
    title: "Morning workout at FitLife Gym - this place has everything! 💪",
    description: "State-of-the-art equipment and amazing trainers. My new favorite gym!",
    stats: {
      views: "31.5K",
      likes: "2.8K",
      comments: "178",
      shares: "67"
    },
    tags: ["#fitness", "#gym", "#workout", "#fitlife"],
    postedAt: "2 days ago",
    isLiked: true,
    isBookmarked: false
  }
];

const categories = [
  { id: 1, name: "All", icon: "ri-apps-line" },
  { id: 2, name: "Restaurant", icon: "ri-restaurant-line" },
  { id: 3, name: "Beauty", icon: "ri-scissors-line" },
  { id: 4, name: "Fashion", icon: "ri-shirt-line" },
  { id: 5, name: "Fitness", icon: "ri-run-line" },
  { id: 6, name: "Travel", icon: "ri-plane-line" }
];

export default function BusinessExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([]);

  const handleLike = (postId: number) => {
    setLikedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleBookmark = (postId: number) => {
    setBookmarkedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const filteredContent = selectedCategory === "All" 
    ? exploreContent 
    : exploreContent.filter(post => 
        post.tags.some(tag => 
          tag.toLowerCase().includes(selectedCategory.toLowerCase())
        )
      );

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
            <span className="text-white/80 text-sm">Explore</span>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <i className="ri-compass-line text-white text-xl"></i>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search influencers, content..."
            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 px-4 py-3 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70"></i>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                selectedCategory === category.name
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <i className={category.icon}></i>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Feed */}
      <div className="px-6 py-6 space-y-6">
        {filteredContent.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Post Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <img
                  src={post.influencer.avatar}
                  alt={post.influencer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-800">{post.influencer.name}</h3>
                    {post.influencer.verified && (
                      <i className="ri-verified-badge-fill text-blue-500 text-sm"></i>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">{post.influencer.handle} • {post.influencer.followers} followers</p>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    src={post.businessLogo}
                    alt={post.business}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-gray-600 text-sm font-medium">{post.business}</span>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="relative">
              <img
                src={post.content.thumbnail}
                alt={post.title}
                className="w-full h-80 object-cover"
              />
              
              {/* Platform Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  post.content.platform.includes("Instagram")
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    : post.content.platform.includes("TikTok")
                    ? "bg-black text-white"
                    : "bg-red-500 text-white"
                }`}>
                  {post.content.platform}
                </span>
              </div>

              {/* Video Duration */}
              {post.content.type === "video" && post.content.duration && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {post.content.duration}
                </div>
              )}
            </div>

            {/* Post Actions */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-1 ${
                      likedPosts.includes(post.id) ? "text-red-500" : "text-gray-600"
                    }`}
                  >
                    <i className={`${likedPosts.includes(post.id) ? "ri-heart-fill" : "ri-heart-line"} text-xl`}></i>
                    <span className="text-sm font-medium">{post.stats.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600">
                    <i className="ri-chat-3-line text-xl"></i>
                    <span className="text-sm font-medium">{post.stats.comments}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600">
                    <i className="ri-share-line text-xl"></i>
                    <span className="text-sm font-medium">{post.stats.shares}</span>
                  </button>
                </div>
                <button
                  onClick={() => handleBookmark(post.id)}
                  className={`${
                    bookmarkedPosts.includes(post.id) ? "text-yellow-500" : "text-gray-600"
                  }`}
                >
                  <i className={`${bookmarkedPosts.includes(post.id) ? "ri-bookmark-fill" : "ri-bookmark-line"} text-xl`}></i>
                </button>
              </div>

              {/* Post Text */}
              <div className="mb-3">
                <h4 className="font-semibold text-gray-800 mb-1">{post.title}</h4>
                <p className="text-gray-600 text-sm mb-2">{post.description}</p>
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="text-blue-600 text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Post Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{post.stats.views} views</span>
                <span>{post.postedAt}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Load More */}
        <div className="text-center py-6">
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
            Load More Content
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <AdvancedBottomNav userType="business" />
    </div>
  );
}
