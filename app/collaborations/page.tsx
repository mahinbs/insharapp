"use client";

import { useState } from "react";
import Link from "next/link";
import AdvancedBottomNav from "../../components/AdvancedBottomNav";

const activeCollaborations = [
  {
    id: 1,
    businessName: "Café Mocha",
    businessLogo:
      "https://readdy.ai/api/search-image?query=Modern%20coffee%20shop%20logo%2C%20elegant%20caf%C3%A9%20branding%2C%20minimalist%20coffee%20brand%20identity%2C%20sophisticated%20caf%C3%A9%20logo%20design%2C%20premium%20coffee%20house%20branding&width=60&height=60&seq=cafe1&orientation=squarish",
    title: "Weekend Brunch Feature",
    progress: 75,
    deadline: "3 days left",
    status: "In Progress",
    requirements: [
      "Post 2 Instagram stories ✓",
      "Create 1 Instagram post ✓",
      "Tag @cafemocha ✓",
      "Visit and review (Pending)",
    ],
  },
  {
    id: 2,
    businessName: "Fitness Plus",
    businessLogo:
      "https://readdy.ai/api/search-image?query=Modern%20fitness%20gym%20logo%2C%20athletic%20training%20brand%20identity%2C%20professional%20fitness%20center%20branding%2C%20sports%20club%20logo%20design%2C%20health%20wellness%20branding&width=60&height=60&seq=gym1&orientation=squarish",
    title: "30-Day Membership Trial",
    progress: 40,
    deadline: "1 week left",
    status: "In Progress",
    requirements: [
      "Post workout stories ✓",
      "Create transformation post (Pending)",
      "Tag @fitnessplus (Pending)",
      "Complete 30-day challenge (Pending)",
    ],
  },
];

const completedCollaborations = [
  {
    id: 3,
    businessName: "Bella Vista Restaurant",
    businessLogo:
      "https://readdy.ai/api/search-image?query=Elegant%20restaurant%20logo%2C%20modern%20dining%20establishment%2C%20sophisticated%20branding%2C%20clean%20minimalist%20design%2C%20professional%20restaurant%20identity%2C%20upscale%20dining%20logo&width=60&height=60&seq=resto3&orientation=squarish",
    title: "3-Course Dinner Experience",
    completedDate: "2 weeks ago",
    rating: 5,
    review:
      "Amazing collaboration! The food was incredible and the team was very professional.",
  },
  {
    id: 4,
    businessName: "Urban Threads",
    businessLogo:
      "https://readdy.ai/api/search-image?query=Modern%20fashion%20boutique%20logo%2C%20trendy%20clothing%20brand%20identity%2C%20urban%20fashion%20logo%2C%20stylish%20apparel%20branding%2C%20contemporary%20fashion%20design&width=60&height=60&seq=fashion2&orientation=squarish",
    title: "Summer Collection Showcase",
    completedDate: "1 month ago",
    rating: 4,
    review:
      "Great experience working with Urban Threads. Love the outfit selection!",
  },
];

export default function CollaborationsPage() {
  const [activeTab, setActiveTab] = useState("active");

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
          <div className="flex flex-col items-center">
            <h1 className="font-['Pacifico'] text-2xl text-white mb-1">
              Inshaar
            </h1>
            <span className="text-white/80 text-sm">My Collaborations</span>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <i className="ri-more-line text-white text-xl"></i>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">
              {activeCollaborations.length}
            </div>
            <div className="text-white/80 text-sm">Active</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">
              {completedCollaborations.length}
            </div>
            <div className="text-white/80 text-sm">Completed</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-white text-2xl font-bold">4.8</div>
            <div className="text-white/80 text-sm">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeTab === "active"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Active ({activeCollaborations.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeTab === "completed"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Completed ({completedCollaborations.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === "active" && (
          <div className="space-y-4">
            {activeCollaborations.map((collab) => (
              <div
                key={collab.id}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={collab.businessLogo}
                    alt={collab.businessName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">
                      {collab.businessName}
                    </h3>
                    <p className="text-gray-600">{collab.title}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {collab.progress}%
                    </div>
                    <div className="text-gray-500 text-sm">Complete</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{collab.status}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${collab.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Requirements Checklist */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Requirements:
                  </h4>
                  <div className="space-y-1">
                    {collab.requirements.map((req, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <i
                          className={`${
                            req.includes("✓")
                              ? "ri-check-line text-green-500"
                              : "ri-time-line text-orange-500"
                          }`}
                        ></i>
                        <span
                          className={
                            req.includes("✓")
                              ? "text-gray-600 line-through"
                              : "text-gray-800"
                          }
                        >
                          {req}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    View Details
                  </button>
                  <Link href="/chat">
                    <button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300">
                      Message Business
                    </button>
                  </Link>
                </div>
              </div>
            ))}

            {activeCollaborations.length === 0 && (
              <div className="text-center py-12">
                <i className="ri-handshake-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Active Collaborations
                </h3>
                <p className="text-gray-500 mb-4">
                  Start applying to offers to see your collaborations here
                </p>
                <Link href="/search">
                  <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold">
                    Discover Offers
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="space-y-4">
            {completedCollaborations.map((collab) => (
              <div
                key={collab.id}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={collab.businessLogo}
                    alt={collab.businessName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">
                      {collab.businessName}
                    </h3>
                    <p className="text-gray-600">{collab.title}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center space-x-1 mb-1">
                      {[...Array(collab.rating)].map((_, i) => (
                        <i key={i} className="ri-star-fill text-yellow-400"></i>
                      ))}
                    </div>
                    <div className="text-gray-500 text-sm">Rating</div>
                  </div>
                </div>

                {/* Review */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    My Review:
                  </h4>
                  <p className="text-gray-600 text-sm">{collab.review}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    View Portfolio
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300">
                    Collaborate Again
                  </button>
                </div>
              </div>
            ))}

            {completedCollaborations.length === 0 && (
              <div className="text-center py-12">
                <i className="ri-trophy-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Completed Collaborations Yet
                </h3>
                <p className="text-gray-500">
                  Your completed collaborations will appear here
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Advanced Bottom Navigation */}
      <AdvancedBottomNav userType="influencer" />
    </div>
  );
}
