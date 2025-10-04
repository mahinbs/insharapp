'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdvancedBottomNav from '../../../components/AdvancedBottomNav';

const myOffers = [
  {
    id: 1,
    title: "Free 3-Course Dinner",
    description: "Promote our new seasonal menu",
    value: "$120",
    applications: 15,
    views: 234,
    status: "Active",
    createdDate: "2024-01-15",
    image: "https://readdy.ai/api/search-image?query=Gourmet%20restaurant%20meal%2C%20beautifully%20plated%20fine%20dining%20dish%2C%20elegant%20food%20presentation%2C%20professional%20food%20photography%2C%20warm%20restaurant%20lighting%2C%20luxury%20dining%20experience&width=300&height=200&seq=meal4&orientation=landscape"
  },
  {
    id: 2,
    title: "Weekend Brunch Package",
    description: "Share your brunch experience",
    value: "$80",
    applications: 8,
    views: 156,
    status: "Active",
    createdDate: "2024-01-12",
    image: "https://readdy.ai/api/search-image?query=Elegant%20brunch%20spread%2C%20artisanal%20breakfast%20dishes%2C%20fresh%20pastries%20and%20coffee%2C%20natural%20morning%20lighting%2C%20cozy%20restaurant%20atmosphere%2C%20food%20styling%20photography&width=300&height=200&seq=brunch2&orientation=landscape"
  },
  {
    id: 3,
    title: "Chef's Special Tasting",
    description: "Exclusive 5-course tasting menu",
    value: "$180",
    applications: 3,
    views: 89,
    status: "Draft",
    createdDate: "2024-01-10",
    image: "https://readdy.ai/api/search-image?query=Fine%20dining%20tasting%20menu%2C%20chef%20special%20dishes%2C%20gourmet%20food%20presentation%2C%20elegant%20plating%2C%20professional%20culinary%20photography%2C%20upscale%20restaurant%20experience&width=300&height=200&seq=tasting1&orientation=landscape"
  }
];

export default function BusinessOffers() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredOffers = myOffers.filter(offer => {
    if (activeFilter === 'all') return true;
    return offer.status.toLowerCase() === activeFilter;
  });

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
          <h1 className="text-white font-semibold text-xl">My Offers</h1>
          <Link href="/business/post-offer">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-add-line text-white text-xl"></i>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">3</div>
            <div className="text-white/80 text-sm">Total Offers</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">26</div>
            <div className="text-white/80 text-sm">Applications</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">479</div>
            <div className="text-white/80 text-sm">Total Views</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            All Offers
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeFilter === 'active'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveFilter('draft')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeFilter === 'draft'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Drafts
          </button>
        </div>
      </div>

      {/* Offers List */}
      <div className="px-6 py-6">
        <div className="space-y-4">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {offer.value}
                </div>
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${
                  offer.status === 'Active' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-yellow-500 text-white'
                }`}>
                  {offer.status}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-800">{offer.title}</h3>
                  <span className="text-gray-500 text-sm">{offer.createdDate}</span>
                </div>
                <p className="text-gray-600 mb-4">{offer.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{offer.applications}</div>
                    <div className="text-gray-500 text-sm">Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">{offer.views}</div>
                    <div className="text-gray-500 text-sm">Views</div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1">
                    <i className="ri-edit-line"></i>
                    <span>Edit</span>
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1">
                    <i className="ri-eye-line"></i>
                    <span>View Details</span>
                  </button>
                  <button className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors">
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOffers.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-megaphone-line text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Offers Found</h3>
            <p className="text-gray-500 mb-6">Create your first barter offer to get started</p>
            <Link href="/business/post-offer">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Create Offer
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Advanced Bottom Navigation */}
      <AdvancedBottomNav userType="business" />
    </div>
  );
}