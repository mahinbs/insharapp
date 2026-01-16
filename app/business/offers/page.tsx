"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdvancedBottomNav from "../../../components/AdvancedBottomNav";
import logo_dark from "@/assetes/logo_dark.png";
import { updateOffer, deleteOffer } from "@/lib/supabase-offers";
import { useAuth } from "@/contexts/AuthContext";
import { useBusinessData } from "@/contexts/BusinessDataContext";

const myOffers = [
  {
    id: 1,
    title: "Free 3-Course Dinner",
    description: "Promote our new seasonal menu",
    applications: 15,
    views: 234,
    status: "Active",
    createdDate: "2024-01-15",
    image:
      "https://readdy.ai/api/search-image?query=Gourmet%20restaurant%20meal%2C%20beautifully%20plated%20fine%20dining%20dish%2C%20elegant%20food%20presentation%2C%20professional%20food%20photography%2C%20warm%20restaurant%20lighting%2C%20luxury%20dining%20experience&width=300&height=200&seq=meal4&orientation=landscape",
  },
  {
    id: 2,
    title: "Weekend Brunch Package",
    description: "Share your brunch experience",
    applications: 8,
    views: 156,
    status: "Active",
    createdDate: "2024-01-12",
    image:
      "https://readdy.ai/api/search-image?query=Elegant%20brunch%20spread%2C%20artisanal%20breakfast%20dishes%2C%20fresh%20pastries%20and%20coffee%2C%20natural%20morning%20lighting%2C%20cozy%20restaurant%20atmosphere%2C%20food%20styling%20photography&width=300&height=200&seq=brunch2&orientation=landscape",
  },
  {
    id: 3,
    title: "Chef's Special Tasting",
    description: "Exclusive 5-course tasting menu",
    applications: 3,
    views: 89,
    status: "Draft",
    createdDate: "2024-01-10",
    image:
      "https://readdy.ai/api/search-image?query=Fine%20dining%20tasting%20menu%2C%20chef%20special%20dishes%2C%20gourmet%20food%20presentation%2C%20elegant%20plating%2C%20professional%20culinary%20photography%2C%20upscale%20restaurant%20experience&width=300&height=200&seq=tasting1&orientation=landscape",
  },
];

const applications = [
  {
    id: 1,
    influencerName: "Emma Wilson",
    username: "@emmastyle",
    followers: "45K",
    engagement: "4.2%",
    niche: "Lifestyle",
    profileImage: "https://readdy.ai/api/search-image?query=Young%20female%20lifestyle%20influencer%2C%20professional%20headshot%2C%20confident%20smile%2C%20modern%20portrait%20photography%2C%20bright%20natural%20lighting%2C%20social%20media%20personality&width=60&height=60&seq=influencer3&orientation=squarish",
    offerTitle: "Free 3-Course Dinner",
    appliedDate: "2 days ago",
    status: "pending"
  },
  {
    id: 2,
    influencerName: "Alex Chen",
    username: "@alexeats",
    followers: "32K",
    engagement: "5.1%",
    niche: "Food",
    profileImage: "https://readdy.ai/api/search-image?query=Young%20male%20food%20influencer%2C%20professional%20headshot%2C%20friendly%20expression%2C%20modern%20portrait%20photography%2C%20natural%20lighting%2C%20food%20blogger%20personality&width=60&height=60&seq=influencer4&orientation=squarish",
    offerTitle: "Weekend Brunch Package",
    appliedDate: "1 day ago",
    status: "pending"
  }
];

export default function BusinessOffers() {
  const router = useRouter();
  const { user, session, loading: authLoading } = useAuth();
  const {
    offers,
    stats,
    offersLoading,
    statsLoading,
    refreshOffers,
    refreshStats,
  } = useBusinessData();
  
  const [activeTab, setActiveTab] = useState("offers");
  // Don't block on loading - show cached data immediately
  const loading = authLoading;

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user || !session) {
      router.push('/auth');
      return;
    }

    // Load data - context handles caching
    Promise.allSettled([
      refreshOffers(),
      refreshStats(),
    ]);
  }, [router, user, session, authLoading, refreshOffers, refreshStats]);

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    
    const { error } = await deleteOffer(offerId);
    if (error) {
      alert('Failed to delete offer: ' + error.message);
      return;
    }
    
    // Refresh offers to get updated data
    await refreshOffers();
  };

  const filteredOffers = offers.filter((offer) => {
    if (activeTab === "offers") return true;
    return offer.status.toLowerCase() === activeTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/business/home">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-arrow-left-line text-white text-xl"></i>
            </div>
          </Link>
          <div className=" flex flex-col items-center">
            <img 
              src={logo_dark.src}
              alt="Inshaar" 
              className="h-10 w-40 object-cover mb-1"
            />
            <span className="text-white/80 text-sm">My Offers</span>
          </div>
          <Link href="/business/post-offer">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-add-line text-white text-xl"></i>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">{stats?.total_offers || 0}</div>
            <div className="text-white/80 text-sm">Total Offers</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">{stats?.total_applications || 0}</div>
            <div className="text-white/80 text-sm">Applications</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">{stats?.total_views || 0}</div>
            <div className="text-white/80 text-sm">Total Views</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("offers")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeTab === "offers"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            My Offers
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeTab === "applications"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Applications
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === "offers" && (
          <div className="space-y-4">
            {filteredOffers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <i className="ri-file-list-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Offers Yet</h3>
                <p className="text-gray-500 mb-6">Create your first offer to start attracting influencers</p>
                <Link href="/business/post-offer">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all">
                    Create Offer
                  </button>
                </Link>
              </div>
            ) : (
              filteredOffers.map((offer) => (
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

                    <div
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${
                        offer.status === "Active"
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {offer.status}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-800">
                        {offer.title}
                      </h3>
                      <span className="text-gray-500 text-sm">
                        {offer.createdDate}
                      </span>
                    </div>
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
                      <Link href={`/business/post-offer?edit=${offer.id}`} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1">
                        <i className="ri-edit-line"></i>
                        <span>Edit</span>
                      </Link>
                      <Link href={`/offer-details/${offer.id}`} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1">
                        <i className="ri-eye-line"></i>
                        <span>View Details</span>
                      </Link>
                      <button 
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "applications" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Influencer Applications</h2>
            <p className="text-gray-500 text-sm mb-4">View applications in the Applications page</p>
            <Link href="/business/applications">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all">
                Go to Applications
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
