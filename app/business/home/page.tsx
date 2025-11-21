"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdvancedBottomNav from "../../../components/AdvancedBottomNav";

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

export default function InfluencerDashboard() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [userLocation, setUserLocation] = useState("Paris, France");

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Simplified Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome Back!</h1>
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
        <div className="relative">
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

      {/* Main Content */}
      <div className="px-1 py-6 -mt-4">
        {/* Restaurants Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">RESTAURANTS</h2>
            <Link
              href="/business/home"
              className="text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors"
            >
              VIEW ALL
            </Link>
          </div>

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
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium border border-white/30">
                    {restaurantOffers[0].category}
                  </span>
                </div>

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
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium border border-white/30">
                        {offer.category}
                      </span>
                    </div>

                    <h3 className="text-white text-lg font-bold mb-1">
                      {offer.businessName}
                    </h3>
                    <p className="text-white/90 text-sm mb-1">{offer.title}</p>
                    {/* <p className="text-white/80 text-xs mb-3">{offer.description}</p> */}
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
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">
              BEAUTY & WELLNESS
            </h2>
            <Link
              href="/business/home"
              className="text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors"
            >
              VIEW ALL
            </Link>
          </div>

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
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium border border-white/30">
                        {offer.category}
                      </span>
                    </div>

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

            <div className="relative rounded-2xl overflow-hidden group cursor-pointer">
              <img
                src={beautyOffers[3].offerImage}
                alt={beautyOffers[3].title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

              {/* Content Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium border border-white/30">
                    {beautyOffers[3].category}
                  </span>
                </div>

                <h3 className="text-white text-2xl font-bold mb-2">
                  {beautyOffers[3].businessName}
                </h3>
                <p className="text-white/90 text-lg mb-2">
                  {beautyOffers[3].title}
                </p>
                <p className="text-white/70 text-sm mb-4">
                  {beautyOffers[3].location}
                </p>

                <div className="flex items-center justify-between">
                  <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105">
                    APPLY NOW
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side - Three Cards Stacked */}
            <div className="flex gap-1 lg:flex-row w-full">
              {beautyOffers.slice(3).map((offer, index) => (
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
        </div>

        {/* Fashion Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              FASHION & STYLE
            </h2>
            <Link
              href="/business/home"
              className="text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors"
            >
              VIEW ALL
            </Link>
          </div>

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
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium border border-white/30">
                    {fashionOffers[0].category}
                  </span>
                </div>

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
        </div>
      </div>

      {/* Advanced Bottom Navigation */}
      <AdvancedBottomNav userType="business" />
    </div>
  );
}
