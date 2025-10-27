"use client";

import { useState } from "react";
import Link from "next/link";
import AdvancedBottomNav from "../../../components/AdvancedBottomNav";

const barterOffers = [
  {
    id: 1,
    businessName: "Bella Vista Restaurant",
    businessLogo:
      "https://readdy.ai/api/search-image?query=Elegant%20restaurant%20logo%2C%20modern%20dining%20establishment%2C%20sophisticated%20branding%2C%20clean%20minimalist%20design%2C%20professional%20restaurant%20identity%2C%20upscale%20dining%20logo&width=80&height=80&seq=resto1&orientation=squarish",
    offerImage:
      "https://readdy.ai/api/search-image?query=Gourmet%20restaurant%20meal%2C%20beautifully%20plated%20fine%20dining%20dish%2C%20elegant%20food%20presentation%2C%20professional%20food%20photography%2C%20warm%20restaurant%20lighting%2C%20luxury%20dining%20experience&width=300&height=200&seq=meal1&orientation=landscape",
    title: "Free 3-Course Dinner",
    description: "Promote our new seasonal menu",
    category: "Restaurant",
    location: "Downtown",
  },
  {
    id: 2,
    businessName: "Luxe Beauty Salon",
    businessLogo:
      "https://readdy.ai/api/search-image?query=Luxury%20beauty%20salon%20logo%2C%20elegant%20spa%20branding%2C%20premium%20beauty%20services%20logo%2C%20sophisticated%20wellness%20brand%20identity%2C%20minimalist%20beauty%20logo%20design&width=80&height=80&seq=salon1&orientation=squarish",
    offerImage:
      "https://readdy.ai/api/search-image?query=Luxury%20beauty%20salon%20interior%2C%20professional%20hair%20styling%20session%2C%20elegant%20spa%20treatment%20room%2C%20modern%20beauty%20salon%20equipment%2C%20relaxing%20wellness%20environment&width=300&height=200&seq=beauty1&orientation=landscape",
    title: "Complete Hair Makeover",
    description: "Hair cut, color & styling package",
    category: "Beauty",
    location: "Uptown",
  },
  {
    id: 3,
    businessName: "Urban Threads",
    businessLogo:
      "https://readdy.ai/api/search-image?query=Modern%20fashion%20boutique%20logo%2C%20trendy%20clothing%20brand%20identity%2C%20urban%20fashion%20logo%2C%20stylish%20apparel%20branding%2C%20contemporary%20fashion%20design&width=80&height=80&seq=fashion1&orientation=squarish",
    offerImage:
      "https://readdy.ai/api/search-image?query=Trendy%20fashion%20boutique%20interior%2C%20stylish%20clothing%20display%2C%20modern%20retail%20store%2C%20fashionable%20apparel%20collection%2C%20contemporary%20shopping%20experience&width=300&height=200&seq=clothes1&orientation=landscape",
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

export default function InfluencerDashboard() {
  const [activeTab, setActiveTab] = useState("available");

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-6 pt-12 pb-6">
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
                src="https://readdy.ai/api/search-image?query=Young%20female%20influencer%20profile%20photo%2C%20professional%20headshot%2C%20social%20media%20personality%2C%20confident%20smile%2C%20modern%20portrait%20photography%2C%20bright%20natural%20lighting&width=48&height=48&seq=profile1&orientation=squarish"
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
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Available Barter Offers
            </h2>
            {barterOffers.map((offer) => (
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
