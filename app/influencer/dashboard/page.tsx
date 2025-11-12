"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdvancedBottomNav from "../../../components/AdvancedBottomNav";

const barterOffers = [
  {
    id: 1,
    businessName: "Bella Vista Restaurant",
    businessLogo:
      "https://i.pravatar.cc/80?img=12",
    offerImage:
      "https://picsum.photos/seed/offer-meal-1/1200/640",
    title: "Free 3-Course Dinner",
    description: "Promote our new seasonal menu",
    category: "Restaurant",
    location: "Downtown",
  },
  {
    id: 2,
    businessName: "Luxe Beauty Salon",
    businessLogo:
      "https://i.pravatar.cc/80?img=32",
    offerImage:
      "https://picsum.photos/seed/offer-beauty-1/1200/640",
    title: "Complete Hair Makeover",
    description: "Hair cut, color & styling package",
    category: "Beauty",
    location: "Uptown",
  },
  {
    id: 3,
    businessName: "Urban Threads",
    businessLogo:
      "https://i.pravatar.cc/80?img=14",
    offerImage:
      "https://picsum.photos/seed/offer-fashion-1/1200/640",
    title: "Designer Outfit Package",
    description: "Complete outfit worth $300",
    category: "Fashion",
    location: "Mall District",
  },
];

const myCollaborations = [
  {
    id: 1,
    businessName: "Café Mocha",
    status: "Active",
    deadline: "3 days left",
    progress: 75,
  },
  {
    id: 2,
    businessName: "Fitness Plus",
    status: "Completed",
    rating: 5,
  },
];

const categories = [
  { id: 1, name: "All", icon: "ri-apps-line", count: 45 },
  { id: 2, name: "Restaurant", icon: "ri-restaurant-line", count: 12 },
  { id: 3, name: "Beauty", icon: "ri-scissors-line", count: 8 },
  { id: 4, name: "Fashion", icon: "ri-shirt-line", count: 15 },
  { id: 5, name: "Fitness", icon: "ri-run-line", count: 6 },
  { id: 6, name: "Travel", icon: "ri-plane-line", count: 4 },
];

const top10Offers = [
  {
    id: 1,
    businessName: "Bella Vista Restaurant",
    title: "Free 3-Course Dinner",
    category: "Restaurant",
    rating: 4.9,
    applications: 156,
    image: "https://picsum.photos/seed/top-restaurant-1/80/80",
  },
  {
    id: 2,
    businessName: "Luxe Beauty Salon",
    title: "Complete Hair Makeover",
    category: "Beauty",
    rating: 4.8,
    applications: 89,
    image: "https://picsum.photos/seed/top-beauty-1/80/80",
  },
  {
    id: 3,
    businessName: "Urban Threads",
    title: "Designer Outfit Package",
    category: "Fashion",
    rating: 4.7,
    applications: 67,
    image: "https://picsum.photos/seed/top-fashion-1/80/80",
  },
];

const nearbyBusinesses = [
  {
    id: 1,
    businessName: "Café Mocha",
    category: "Restaurant",
    distance: "0.2 miles",
    rating: 4.6,
    image: "https://picsum.photos/seed/near-coffee-1/80/80",
  },
  {
    id: 2,
    businessName: "FitLife Gym",
    category: "Fitness",
    distance: "0.5 miles",
    rating: 4.5,
    image: "https://picsum.photos/seed/near-gym-1/80/80",
  },
  {
    id: 3,
    businessName: "Style Studio",
    category: "Beauty",
    distance: "0.8 miles",
    rating: 4.7,
    image: "https://picsum.photos/seed/near-beauty-1/80/80",
  },
];

const trendingBusinesses = [
  {
    id: 1,
    businessName: "Eco Fashion Co",
    category: "Fashion",
    trend: "Rising",
    growth: "+23%",
    image: "https://picsum.photos/seed/trend-fashion-1/80/80",
  },
  {
    id: 2,
    businessName: "Tech Hub Café",
    category: "Restaurant",
    trend: "Hot",
    growth: "+45%",
    image: "https://picsum.photos/seed/trend-restaurant-1/80/80",
  },
  {
    id: 3,
    businessName: "Wellness Spa",
    category: "Beauty",
    trend: "Popular",
    growth: "+18%",
    image: "https://picsum.photos/seed/trend-beauty-1/80/80",
  },
];

export default function InfluencerDashboard() {
  const [activeTab, setActiveTab] = useState("available");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userLocation, setUserLocation] = useState("Downtown, NYC");

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-6 pt-12 pb-6">
        {/* Scrolling Banner */}
        <div className="mb-6 w-full mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 overflow-hidden">
            <div className="flex animate-scroll">
              <div className="flex space-x-8 whitespace-nowrap">
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-store-line text-pink-300"></i>
                  <span className="text-sm font-medium">New: Luxe Beauty Salon joins Inshaar!</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-calendar-event-line text-purple-300"></i>
                  <span className="text-sm font-medium">Event: Influencer Meetup this Saturday</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-gift-line text-orange-300"></i>
                  <span className="text-sm font-medium">Special: 50% off first collaboration</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-restaurant-line text-pink-300"></i>
                  <span className="text-sm font-medium">Update: Bella Vista Restaurant now accepting applications</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-trophy-line text-purple-300"></i>
                  <span className="text-sm font-medium">Achievement: 1000+ successful collaborations!</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-megaphone-line text-orange-300"></i>
                  <span className="text-sm font-medium">News: Inshaar featured in TechCrunch</span>
                </div>
                {/* Duplicate for seamless loop */}
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-store-line text-pink-300"></i>
                  <span className="text-sm font-medium">New: Luxe Beauty Salon joins Inshaar!</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-calendar-event-line text-purple-300"></i>
                  <span className="text-sm font-medium">Event: Influencer Meetup this Saturday</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-gift-line text-orange-300"></i>
                  <span className="text-sm font-medium">Special: 50% off first collaboration</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-restaurant-line text-pink-300"></i>
                  <span className="text-sm font-medium">Update: Bella Vista Restaurant now accepting applications</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-trophy-line text-purple-300"></i>
                  <span className="text-sm font-medium">Achievement: 1000+ successful collaborations!</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-megaphone-line text-orange-300"></i>
                  <span className="text-sm font-medium">News: Inshaar featured in TechCrunch</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Section */}
        <div className="text-center mb-6">
          <h1 className="font-['Pacifico'] text-3xl text-white mb-2 drop-shadow-lg">
            Inshaar
          </h1>
          <p className="text-white/80 text-sm">Influencer Dashboard</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <img 
                src="https://i.pravatar.cc/48?img=5"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">
                Welcome back, Sarah!
              </h2>
              <p className="text-white/80 text-sm">
                @sarahstyles • 25K followers
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href="/notifications">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i className="ri-notification-line text-white text-xl"></i>
              </div>
            </Link>
            <Link href="/chat">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i className="ri-message-line text-white text-xl"></i>
              </div>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">12</div>
            <div className="text-white/80 text-sm">Active Offers</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">8</div>
            <div className="text-white/80 text-sm">Completed</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">4.9</div>
            <div className="text-white/80 text-sm">Rating</div>
          </div>
        </div>

        {/* Location & Quick Actions */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="ri-map-pin-line text-white/80"></i>
            <span className="text-white/80 text-sm">{userLocation}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/search">
              <button className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-white/30 transition-colors">
                <i className="ri-search-line mr-1"></i>
                Search
              </button>
            </Link>
            <button className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-white/30 transition-colors">
              <i className="ri-refresh-line mr-1"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("available")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeTab === "available"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Available Offers
          </button>
          <button
            onClick={() => setActiveTab("collaborations")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeTab === "collaborations"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            My Collaborations
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === "available" && (
          <div className="space-y-6">
            {/* Categories - Display directly on homepage */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Categories</h2>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {categories.filter(cat => cat.name !== "All").map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 ${
                      selectedCategory === category.name
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md scale-105"
                        : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                    }`}
                  >
                    <i className={`${category.icon} text-2xl mb-2`}></i>
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className={`text-xs mt-1 ${
                      selectedCategory === category.name
                        ? "text-white/80"
                        : "text-gray-500"
                    }`}>
                      {category.count} offers
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Top 10 Section */}
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <i className="ri-trophy-line text-yellow-500"></i>
                  <span>Top 10 Offers</span>
                </h3>
                <Link href="/search" className="text-purple-600 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {top10Offers.map((offer, index) => (
                  <div key={offer.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <img src={offer.image} alt={offer.businessName} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm">{offer.businessName}</h4>
                      <p className="text-gray-600 text-xs">{offer.title}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center space-x-1">
                          <i className="ri-star-fill text-yellow-400 text-xs"></i>
                          <span className="text-xs text-gray-600">{offer.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i className="ri-user-line text-gray-400 text-xs"></i>
                          <span className="text-xs text-gray-600">{offer.applications} applied</span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/offer-details/${offer.id}`}>
                      <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-lg text-xs font-medium">
                        Apply
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Around Me */}
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <i className="ri-map-pin-line text-blue-500"></i>
                  <span>What's Around Me</span>
                </h3>
                <button className="text-purple-600 text-sm font-medium">
                  <i className="ri-refresh-line mr-1"></i>
                  Refresh
                </button>
              </div>
              <div className="space-y-3">
                {nearbyBusinesses.map((business) => (
                  <div key={business.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <img src={business.image} alt={business.businessName} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm">{business.businessName}</h4>
                      <p className="text-gray-600 text-xs">{business.category}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center space-x-1">
                          <i className="ri-map-pin-line text-gray-400 text-xs"></i>
                          <span className="text-xs text-gray-600">{business.distance}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i className="ri-star-fill text-yellow-400 text-xs"></i>
                          <span className="text-xs text-gray-600">{business.rating}</span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Businesses */}
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <i className="ri-fire-line text-orange-500"></i>
                  <span>Trending Now</span>
                </h3>
                <Link href="/search" className="text-purple-600 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {trendingBusinesses.map((business) => (
                  <div key={business.id} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <img src={business.image} alt={business.businessName} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm">{business.businessName}</h4>
                      <p className="text-gray-600 text-xs">{business.category}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          business.trend === "Hot" ? "bg-red-100 text-red-700" :
                          business.trend === "Rising" ? "bg-green-100 text-green-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {business.trend}
                        </span>
                        <span className="text-xs text-green-600 font-medium">{business.growth}</span>
                      </div>
                    </div>
                    <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-lg text-xs font-medium">
                      Explore
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtered Offers */}
            {selectedCategory !== "All" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {selectedCategory} Offers
                </h3>
                <div className="space-y-4">
                  {barterOffers
                    .filter(offer => offer.category === selectedCategory)
                    .map((offer) => (
                    <div
                      key={offer.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                <div className="relative">
                  <img 
                    src={offer.offerImage}
                    alt={offer.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <img 
                      src={offer.businessLogo}
                      alt={offer.businessName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                            <h3 className="font-semibold text-gray-800">
                              {offer.businessName}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              {offer.category} • {offer.location}
                            </p>
                    </div>
                  </div>
                  
                        <h4 className="font-bold text-lg text-gray-800 mb-2">
                          {offer.title}
                        </h4>
                  <p className="text-gray-600 mb-4">{offer.description}</p>
                  
                  <Link href={`/offer-details/${offer.id}`}>
                    <button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                      Apply for Collaboration
                    </button>
                  </Link>
                </div>
              </div>
            ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "collaborations" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              My Collaborations
            </h2>
            {myCollaborations.map((collab) => (
              <div
                key={collab.id}
                className="bg-white rounded-2xl p-4 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">
                    {collab.businessName}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      collab.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {collab.status}
                  </span>
                </div>
                
                {collab.status === "Active" && (
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{collab.deadline}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${collab.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {collab.status === "Completed" && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex space-x-1">
                      {[...Array(collab.rating)].map((_, i) => (
                        <i key={i} className="ri-star-fill text-yellow-400"></i>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Bottom Navigation */}
      <AdvancedBottomNav userType="influencer" />
    </div>
  );
}
