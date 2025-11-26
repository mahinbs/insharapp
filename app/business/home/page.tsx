"use client";

import { useState } from "react";
import Link from "next/link";
import AdvancedBottomNav from "../../../components/AdvancedBottomNav";
import logo_dark from "@/assetes/logo_dark.png";

const restaurantOffers = [
  {
    id: 1,
    businessName: "Bella Vista Restaurant",
    offerImage: "https://picsum.photos/seed/restaurant-1/600/800",
    title: "Fine Dining Experience",
    category: "RESTAURANT",
    location: "PARIS 75014",
    featured: true,
  },
  {
    id: 2,
    businessName: "Cuisine de Bois",
    offerImage: "https://picsum.photos/seed/restaurant-2/400/400",
    title: "Wood-Fired Cuisine",
    category: "RESTAURANT",
    location: "ROSNY-SOUS-BOIS",
  },
  {
    id: 3,
    businessName: "Origado Rodizio",
    offerImage: "https://picsum.photos/seed/restaurant-3/400/400",
    title: "Brazilian Rodizio",
    category: "RESTAURANT",
    location: "ROSNY-SOUS-BOIS",
  },
];

const beautyOffers = [
  {
    id: 1,
    businessName: "Luxe Beauty Salon",
    offerImage: "https://picsum.photos/seed/beauty-1/600/600",
    title: "Complete Hair Makeover",
    description: "Hair cut, color & styling package",
    category: "BEAUTY",
    location: "UPTOWN DISTRICT",
    rating: 4.8,
    applications: 89,
  },
  {
    id: 2,
    businessName: "Style Studio",
    offerImage: "https://picsum.photos/seed/beauty-2/600/600",
    title: "Beauty Treatment",
    description: "Luxury facial and skincare",
    category: "BEAUTY",
    location: "CITY CENTER",
    rating: 4.6,
    applications: 67,
  },
  {
    id: 3,
    businessName: "Glamour Spa",
    offerImage: "https://picsum.photos/seed/beauty-3/400/400",
    title: "Spa Day Package",
    description: "Full day relaxation experience",
    category: "BEAUTY",
    location: "WEST END",
    rating: 4.9,
    applications: 94,
  },
  {
    id: 4,
    businessName: "Nail Art Studio",
    offerImage: "https://picsum.photos/seed/beauty-4/400/400",
    title: "Premium Nail Services",
    description: "Creative nail art designs",
    category: "BEAUTY",
    location: "EAST SIDE",
    rating: 4.7,
    applications: 56,
  },
  {
    id: 5,
    businessName: "Skin Care Clinic",
    offerImage: "https://picsum.photos/seed/beauty-5/400/400",
    title: "Advanced Facial Treatment",
    description: "Professional skincare solutions",
    category: "BEAUTY",
    location: "NORTH QUARTER",
    rating: 4.8,
    applications: 78,
  },
];

const fashionOffers = [
  {
    id: 1,
    businessName: "Urban Threads",
    offerImage: "https://picsum.photos/seed/fashion-1/600/800",
    title: "Designer Collection",
    category: "FASHION",
    location: "MALL DISTRICT",
    featured: true,
  },
  {
    id: 2,
    businessName: "Eco Fashion Co",
    offerImage: "https://picsum.photos/seed/fashion-2/400/400",
    title: "Sustainable Fashion",
    category: "FASHION",
    location: "GREEN QUARTER",
  },
  {
    id: 3,
    businessName: "Style Hub",
    offerImage: "https://picsum.photos/seed/fashion-3/400/400",
    title: "Streetwear Collection",
    category: "FASHION",
    location: "DOWNTOWN",
  },
];

const myOffers = [
  {
    id: 1,
    title: "Free 3-Course Dinner",
    description: "Promote our new seasonal menu",
    applications: 15,
    views: 234,
    status: "Active",
    image:
      "https://readdy.ai/api/search-image?query=Gourmet%20restaurant%20meal%2C%20beautifully%20plated%20fine%20dining%20dish%2C%20elegant%20food%20presentation%2C%20professional%20food%20photography%2C%20warm%20restaurant%20lighting%2C%20luxury%20dining%20experience&width=300&height=200&seq=meal2&orientation=landscape",
  },
  {
    id: 2,
    title: "Weekend Brunch Package",
    description: "Share your brunch experience",
    applications: 8,
    views: 156,
    status: "Active",
    image:
      "https://readdy.ai/api/search-image?query=Elegant%20brunch%20spread%2C%20artisanal%20breakfast%20dishes%2C%20fresh%20pastries%20and%20coffee%2C%20natural%20morning%20lighting%2C%20cozy%20restaurant%20atmosphere%2C%20food%20styling%20photography&width=300&height=200&seq=brunch1&orientation=landscape",
  },
];

const influencerRequests = [
  {
    id: 1,
    influencerName: "Emma Wilson",
    username: "@emmastyle",
    followers: "45K",
    engagement: "4.2%",
    niche: "Lifestyle",
    profileImage:
      "https://readdy.ai/api/search-image?query=Young%20female%20lifestyle%20influencer%2C%20professional%20headshot%2C%20confident%20smile%2C%20modern%20portrait%20photography%2C%20bright%20natural%20lighting%2C%20social%20media%20personality&width=60&height=60&seq=influencer1&orientation=squarish",
    offerTitle: "Free 3-Course Dinner",
    appliedDate: "2 days ago",
  },
  {
    id: 2,
    influencerName: "Alex Chen",
    username: "@alexeats",
    followers: "32K",
    engagement: "5.1%",
    niche: "Food",
    profileImage:
      "https://readdy.ai/api/search-image?query=Young%20male%20food%20influencer%2C%20professional%20headshot%2C%20friendly%20expression%2C%20modern%20portrait%20photography%2C%20natural%20lighting%2C%20food%20blogger%20personality&width=60&height=60&seq=influencer2&orientation=squarish",
    offerTitle: "Weekend Brunch Package",
    appliedDate: "1 day ago",
  },
];

export default function InfluencerDashboard() {
  const [activeTab, setActiveTab] = useState<"explore" | "offers">("explore");

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Simplified Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-4 pt-4 pb-4">
        <div className="flex items-center justify-center">
          <div className="w-40 h-10">
            <img
              src={logo_dark.src}
              alt="Inshaar"
              className="h-full w-full object-cover mb-1"
            />
          </div>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome Back!
            </h1>
            <p className="text-white/80 text-sm">
              Discover collaboration opportunities
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300">
              <i className="ri-notification-line text-white text-xl"></i>
            </button>
            <button className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300">
              <i className="ri-message-line text-white text-xl"></i>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <i className="ri-search-line text-gray-400 text-lg"></i>
          </div>
          <input
            type="text"
            placeholder="Search collaborations..."
            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-6 py-4 shadow-sm -mt-4">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("explore")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeTab === "explore"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => setActiveTab("offers")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeTab === "offers"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Offers & Applications
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-1 py-6">
        {activeTab === "explore" && (
          <>
            {/* Restaurants Section */}
            <div className="mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {/* Large Featured Card */}
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
                  <img
                    src={restaurantOffers[0].offerImage}
                    alt={restaurantOffers[0].title}
                    className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-2xl font-bold mb-2">
                      {restaurantOffers[0].businessName}
                    </h3>
                    <p className="text-white/90 text-lg mb-2">
                      {restaurantOffers[0].title}
                    </p>
                    <p className="text-white/70 text-sm mb-4">
                      {restaurantOffers[0].location}
                    </p>

                    <div className="flex items-center justify-between">
                      <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
                        APPLY NOW
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side - Two Smaller Cards */}
                <div className="flex gap-1 md:flex-col">
                  {restaurantOffers.slice(1).map((offer) => (
                    <div
                      key={offer.id}
                      className="relative rounded-2xl overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={offer.offerImage}
                        alt={offer.title}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-lg font-bold mb-1">
                          {offer.businessName}
                        </h3>
                        <p className="text-white/90 text-sm mb-1">{offer.title}</p>
                        <p className="text-white/70 text-xs mb-3">
                          {offer.location}
                        </p>

                        <div className="flex items-center justify-between">
                          <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300">
                            APPLY
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Beauty & Wellness Section */}
            <div className="mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {/* Left Side - Two Cards Stacked */}
                <div className="flex gap-1 md:flex-col">
                  {beautyOffers.slice(0, 2).map((offer, index) => (
                    <div
                      key={offer.id}
                      className="relative rounded-2xl overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={offer.offerImage}
                        alt={offer.title}
                        className="w-full h-80 lg:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-xl lg:text-lg font-bold mb-2 lg:mb-1">
                          {offer.businessName}
                        </h3>
                        <p className="text-white/90 text-lg lg:text-sm mb-2 lg:mb-1">
                          {offer.title}
                        </p>
                        <p className="text-white/70 text-sm lg:text-xs mb-4 lg:mb-3">
                          {offer.location}
                        </p>

                        <div className="flex items-center justify-between">
                          <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 lg:px-4 lg:py-2 rounded-xl lg:rounded-lg text-sm font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
                            {index === 0 ? "APPLY NOW" : "APPLY"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Middle Large Card */}
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
                  <img
                    src={beautyOffers[2].offerImage}
                    alt={beautyOffers[2].title}
                    className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-2xl font-bold mb-2">
                      {beautyOffers[2].businessName}
                    </h3>
                    <p className="text-white/90 text-lg mb-2">
                      {beautyOffers[2].title}
                    </p>
                    <p className="text-white/70 text-sm mb-4">
                      {beautyOffers[2].location}
                    </p>

                    <div className="flex items-center justify-between">
                      <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
                        APPLY NOW
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row - Two Smaller Beauty Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
                {beautyOffers.slice(3).map((offer) => (
                  <div
                    key={offer.id}
                    className="relative rounded-2xl overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={offer.offerImage}
                      alt={offer.title}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium border border-white/30">
                          {offer.category}
                        </span>
                      </div>

                      <h3 className="text-white text-lg font-bold mb-1">
                        {offer.businessName}
                      </h3>
                      <p className="text-white/90 text-sm mb-1">{offer.title}</p>
                      <p className="text-white/70 text-xs mb-3">
                        {offer.location}
                      </p>

                      <div className="flex items-center justify-between">
                        <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300">
                          APPLY
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fashion Section */}
            <div className="mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {/* Large Featured Card */}
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
                  <img
                    src={fashionOffers[0].offerImage}
                    alt={fashionOffers[0].title}
                    className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-2xl font-bold mb-2">
                      {fashionOffers[0].businessName}
                    </h3>
                    <p className="text-white/90 text-lg mb-2">
                      {fashionOffers[0].title}
                    </p>
                    <p className="text-white/70 text-sm mb-4">
                      {fashionOffers[0].location}
                    </p>

                    <div className="flex items-center justify-between">
                      <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
                        APPLY NOW
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side - Two Smaller Cards */}
                <div className="flex gap-1 lg:flex-col">
                  {fashionOffers.slice(1).map((offer) => (
                    <div
                      key={offer.id}
                      className="relative rounded-2xl overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={offer.offerImage}
                        alt={offer.title}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-lg font-bold mb-1">
                          {offer.businessName}
                        </h3>
                        <p className="text-white/90 text-sm mb-1">{offer.title}</p>
                        <p className="text-white/70 text-xs mb-3">
                          {offer.location}
                        </p>

                        <div className="flex items-center justify-between">
                          <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300">
                            APPLY
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "offers" && (
          <div className="px-4 sm:px-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">My Offers</h2>
                <Link href="/business/post-offer">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    <i className="ri-add-line mr-1"></i>
                    New Offer
                  </button>
                </Link>
              </div>
              {myOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-48 object-cover"
                    />

                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {offer.status}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {offer.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{offer.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {offer.applications}
                        </div>
                        <div className="text-gray-500 text-sm">Applications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-pink-600">
                          {offer.views}
                        </div>
                        <div className="text-gray-500 text-sm">Views</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                        Edit Offer
                      </button>
                      <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300">
                        View Applications
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Applications
                </h2>
                {influencerRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white rounded-2xl p-4 shadow-lg mb-4"
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={request.profileImage}
                        alt={request.influencerName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {request.influencerName}
                            </h3>
                            <p className="text-purple-600 text-sm">
                              {request.username}
                            </p>
                          </div>
                          <span className="text-gray-500 text-sm">
                            {request.appliedDate}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center">
                            <div className="font-semibold text-gray-800">
                              {request.followers}
                            </div>
                            <div className="text-gray-500 text-xs">
                              Followers
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-800">
                              {request.engagement}
                            </div>
                            <div className="text-gray-500 text-xs">
                              Engagement
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-800">
                              {request.niche}
                            </div>
                            <div className="text-gray-500 text-xs">Niche</div>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-3">
                          Applied for: {request.offerTitle}
                        </p>

                        <div className="flex space-x-2">
                          <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                            View Profile
                          </button>
                          <button className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors">
                            Decline
                          </button>
                          <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300">
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Bottom Navigation */}
      <AdvancedBottomNav userType="business" />
    </div>
  );
}