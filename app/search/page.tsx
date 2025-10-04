
'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdvancedBottomNav from '../../components/AdvancedBottomNav';

const categories = [
  { 
    id: 1, 
    name: 'Restaurant', 
    icon: 'ri-restaurant-line', 
    count: 45,
    gradient: 'from-red-400 to-orange-500',
    bgImage: 'https://readdy.ai/api/search-image?query=icon%2C%20Modern%20restaurant%20dining%2C%20elegant%20food%20service%2C%20contemporary%20culinary%20experience%2C%20sophisticated%20restaurant%20interior%2C%20fine%20dining%20atmosphere%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20subtle%20shadows&width=100&height=100&seq=restaurant1&orientation=squarish'
  },
  { 
    id: 2, 
    name: 'Beauty', 
    icon: 'ri-scissors-line', 
    count: 32,
    gradient: 'from-pink-400 to-rose-500',
    bgImage: 'https://readdy.ai/api/search-image?query=icon%2C%20Luxury%20beauty%20salon%2C%20professional%20makeup%20and%20skincare%2C%20elegant%20cosmetic%20services%2C%20premium%20beauty%20treatment%2C%20sophisticated%20wellness%20spa%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20subtle%20shadows&width=100&height=100&seq=beauty1&orientation=squarish'
  },
  { 
    id: 3, 
    name: 'Fashion', 
    icon: 'ri-shirt-line', 
    count: 28,
    gradient: 'from-purple-400 to-indigo-5',
    bgImage: 'https://readdy.ai/api/search-image?query=icon%2C%20Trendy%20fashion%20boutique%2C%20stylish%20clothing%20collection%2C%20modern%20apparel%20store%2C%20contemporary%20fashion%20design%2C%20elegant%20wardrobe%20styling%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20subtle%20shadows&width=100&height=100&seq=fashion1&orientation=squarish'
  },
  { 
    id: 4, 
    name: 'Fitness', 
    icon: 'ri-run-line', 
    count: 19,
    gradient: 'from-green-400 to-emerald-500',
    bgImage: 'https://readdy.ai/api/search-image?query=icon%2C%20Modern%20fitness%20gym%2C%20professional%20workout%20equipment%2C%20healthy%20lifestyle%20training%2C%20contemporary%20exercise%20facility%2C%20athletic%20wellness%20center%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20subtle%20shadows&width=100&height=100&seq=fitness1&orientation=squarish'
  },
  { 
    id: 5, 
    name: 'Travel', 
    icon: 'ri-plane-line', 
    count: 15,
    gradient: 'from-blue-400 to-cyan-500',
    bgImage: 'https://readdy.ai/api/search-image?query=icon%2C%20Luxury%20travel%20experience%2C%20premium%20vacation%20destinations%2C%20elegant%20tourism%20services%2C%20sophisticated%20travel%20planning%2C%20beautiful%20adventure%20destinations%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20subtle%20shadows&width=100&height=100&seq=travel1&orientation=squarish'
  },
  { 
    id: 6, 
    name: 'Tech', 
    icon: 'ri-smartphone-line', 
    count: 12,
    gradient: 'from-gray-400 to-slate-500',
    bgImage: 'https://readdy.ai/api/search-image?query=icon%2C%20Modern%20technology%20gadgets%2C%20innovative%20digital%20devices%2C%20contemporary%20tech%20products%2C%20sophisticated%20electronic%20equipment%2C%20cutting-edge%20technology%20solutions%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20subtle%20shadows&width=100&height=100&seq=tech1&orientation=squarish'
  }
];

const featuredOffers = [
  {
    id: 1,
    businessName: "Ocean View Spa",
    title: "Full Day Spa Package",
    value: "$250",
    category: "Beauty",
    image: "https://readdy.ai/api/search-image?query=Luxury%20spa%20treatment%20room%2C%20relaxing%20wellness%20environment%2C%20professional%20massage%20therapy%2C%20elegant%20spa%20interior%2C%20serene%20beauty%20salon%20atmosphere&width=300&height=200&seq=spa1&orientation=landscape",
    logo: "https://readdy.ai/api/search-image?query=Luxury%20spa%20logo%2C%20elegant%20wellness%20branding%2C%20premium%20beauty%20services%20logo%2C%20sophisticated%20spa%20brand%20identity%2C%20minimalist%20wellness%20design&width=60&height=60&seq=spalogo1&orientation=squarish"
  },
  {
    id: 2,
    businessName: "Street Style Boutique",
    title: "Complete Wardrobe Makeover",
    value: "$400",
    category: "Fashion",
    image: "https://readdy.ai/api/search-image?query=Trendy%20fashion%20boutique%20interior%2C%20stylish%20clothing%20display%2C%20modern%20retail%20store%2C%20fashionable%20apparel%20collection%2C%20contemporary%20shopping%20experience&width=300&height=200&seq=boutique1&orientation=landscape",
    logo: "https://readdy.ai/api/search-image?query=Modern%20fashion%20boutique%20logo%2C%20trendy%20clothing%20brand%20identity%2C%20urban%20fashion%20logo%2C%20stylish%20apparel%20branding%2C%20contemporary%20fashion%20design&width=60&height=60&seq=fashionlogo1&orientation=squarish"
  }
];

// ... existing code ...

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/influencer/dashboard">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-arrow-left-line text-white text-xl"></i>
            </div>
          </Link>
          <h1 className="text-white font-semibold text-xl">Discover</h1>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <i className="ri-filter-line text-white text-xl"></i>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search offers, businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 px-4 py-3 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70"></i>
        </div>
      </div>

      {/* Advanced Categories Section */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
          <button className="text-purple-600 font-medium text-sm flex items-center space-x-1">
            <span>View All</span>
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`relative overflow-hidden rounded-3xl transition-all duration-500 transform ${
                selectedCategory === category.name
                  ? 'scale-105 shadow-2xl'
                  : hoveredCategory === category.id
                  ? 'scale-102 shadow-xl'
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={category.bgImage}
                  alt={category.name}
                  className="w-full h-full object-cover opacity-20"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} ${
                  selectedCategory === category.name ? 'opacity-90' : 'opacity-80'
                }`}></div>
              </div>
              
              {/* Content */}
              <div className="relative p-6 h-32 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    selectedCategory === category.name ? 'bg-white/30 scale-110' : 'bg-white/20'
                  }`}>
                    <i className={`${category.icon} text-2xl`}></i>
                  </div>
                  {selectedCategory === category.name && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <i className="ri-check-line text-purple-600 text-sm"></i>
                    </div>
                  )}
                </div>
                
                <div className="text-left">
                  <div className="font-bold text-lg mb-1">{category.name}</div>
                  <div className="text-sm opacity-90 flex items-center space-x-1">
                    <span>{category.count} offers</span>
                    <i className="ri-arrow-right-s-line text-xs"></i>
                  </div>
                </div>
              </div>
              
              {/* Animated Border */}
              {selectedCategory === category.name && (
                <div className="absolute inset-0 rounded-3xl border-2 border-white/50 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Trending Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Trending Now</h3>
          <div className="flex flex-wrap gap-2">
            {['Free Meals', 'Spa Days', 'Workout Gear', 'Travel Deals', 'Tech Reviews', 'Fashion Hauls'].map((tag, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 rounded-full text-sm font-medium hover:from-pink-200 hover:to-purple-200 transition-all duration-300 transform hover:scale-105"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Offers */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Featured Offers</h2>
        <div className="space-y-4">
          {featuredOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {offer.value}
                </div>
                <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  {offer.category}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <img 
                    src={offer.logo}
                    alt={offer.businessName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{offer.businessName}</h3>
                    <p className="text-gray-500 text-sm">{offer.category}</p>
                  </div>
                </div>
                
                <h4 className="font-bold text-lg text-gray-800 mb-4">{offer.title}</h4>
                
                <Link href={`/offer-details/${offer.id}`}>
                  <button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Bottom Navigation */}
      <AdvancedBottomNav userType="influencer" />
    </div>
  );
}
