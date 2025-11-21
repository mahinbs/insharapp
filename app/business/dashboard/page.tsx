
'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdvancedBottomNav from '../../../components/AdvancedBottomNav';
import logo_dark from "@/assetes/logo_dark.png";

const myOffers = [
  {
    id: 1,
    title: "Free 3-Course Dinner",
    description: "Promote our new seasonal menu",
    applications: 15,
    views: 234,
    status: "Active",
    image: "https://readdy.ai/api/search-image?query=Gourmet%20restaurant%20meal%2C%20beautifully%20plated%20fine%20dining%20dish%2C%20elegant%20food%20presentation%2C%20professional%20food%20photography%2C%20warm%20restaurant%20lighting%2C%20luxury%20dining%20experience&width=300&height=200&seq=meal2&orientation=landscape"
  },
  {
    id: 2,
    title: "Weekend Brunch Package",
    description: "Share your brunch experience",
    applications: 8,
    views: 156,
    status: "Active",
    image: "https://readdy.ai/api/search-image?query=Elegant%20brunch%20spread%2C%20artisanal%20breakfast%20dishes%2C%20fresh%20pastries%20and%20coffee%2C%20natural%20morning%20lighting%2C%20cozy%20restaurant%20atmosphere%2C%20food%20styling%20photography&width=300&height=200&seq=brunch1&orientation=landscape"
  }
];

const influencerRequests = [
  {
    id: 1,
    influencerName: "Emma Wilson",
    username: "@emmastyle",
    followers: "45K",
    engagement: "4.2%",
    niche: "Lifestyle",
    profileImage: "https://readdy.ai/api/search-image?query=Young%20female%20lifestyle%20influencer%2C%20professional%20headshot%2C%20confident%20smile%2C%20modern%20portrait%20photography%2C%20bright%20natural%20lighting%2C%20social%20media%20personality&width=60&height=60&seq=influencer1&orientation=squarish",
    offerTitle: "Free 3-Course Dinner",
    appliedDate: "2 days ago"
  },
  {
    id: 2,
    influencerName: "Alex Chen",
    username: "@alexeats",
    followers: "32K",
    engagement: "5.1%",
    niche: "Food",
    profileImage: "https://readdy.ai/api/search-image?query=Young%20male%20food%20influencer%2C%20professional%20headshot%2C%20friendly%20expression%2C%20modern%20portrait%20photography%2C%20natural%20lighting%2C%20food%20blogger%20personality&width=60&height=60&seq=influencer2&orientation=squarish",
    offerTitle: "Weekend Brunch Package",
    appliedDate: "1 day ago"
  }
];

export default function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState('offers');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-6 pt-4 pb-4">
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-40 h-10">
            <img 
              src={logo_dark.src}
              alt="Inshaar" 
              className="h-full w-full object-cover mb-1"
            />
            </div>
          <p className="text-white/80 text-sm">Business Dashboard</p>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <img 
                src="https://readdy.ai/api/search-image?query=Professional%20business%20owner%20portrait%2C%20confident%20entrepreneur%2C%20modern%20business%20headshot%2C%20professional%20attire%2C%20corporate%20photography%20style%2C%20friendly%20business%20person&width=48&height=48&seq=business1&orientation=squarish"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Bella Vista Restaurant</h2>
              <p className="text-white/80 text-sm">Fine Dining • Downtown</p>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">23</div>
            <div className="text-white/80 text-sm">Applications</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">2</div>
            <div className="text-white/80 text-sm">Active Offers</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">390</div>
            <div className="text-white/80 text-sm">Total Views</div>
          </div>
        </div>
      </div>

      {/* Post New Offer Button */}
      <div className="px-6 py-4">
        <Link href="/business/post-offer">
          <button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2">
            <i className="ri-add-line text-xl"></i>
            <span>Post New Barter Offer</span>
          </button>
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeTab === 'offers'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Offers & Applications
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Profile
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === 'offers' && (
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
              <div key={offer.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{offer.title}</h3>
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">Applications</h2>
              {influencerRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-2xl p-4 shadow-lg mb-4">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={request.profileImage}
                      alt={request.influencerName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800">{request.influencerName}</h3>
                          <p className="text-purple-600 text-sm">{request.username}</p>
                        </div>
                        <span className="text-gray-500 text-sm">{request.appliedDate}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center">
                          <div className="font-semibold text-gray-800">{request.followers}</div>
                          <div className="text-gray-500 text-xs">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-800">{request.engagement}</div>
                          <div className="text-gray-500 text-xs">Engagement</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-800">{request.niche}</div>
                          <div className="text-gray-500 text-xs">Niche</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">Applied for: {request.offerTitle}</p>
                      
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
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <Link href="/business/profile">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <i className="ri-store-2-line text-white text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">Business Profile</h3>
                      <p className="text-gray-500 text-sm">View and edit your business information</p>
                    </div>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400 text-xl"></i>
                </div>
              </div>
            </Link>
            
            <Link href="/business/explore">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                      <i className="ri-compass-line text-white text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">Explore</h3>
                      <p className="text-gray-500 text-sm">Discover influencer content</p>
                    </div>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400 text-xl"></i>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Advanced Bottom Navigation */}
      <AdvancedBottomNav userType="business" />
    </div>
  );
}
