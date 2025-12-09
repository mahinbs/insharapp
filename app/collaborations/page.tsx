"use client";

import { useState } from "react";
import Link from "next/link";
import AdvancedBottomNav from "../../components/AdvancedBottomNav";
import logo_dark from "@/assetes/logo_dark.png";

const activeCollaborations = [
  {
    id: 1,
    businessName: "Café Mocha",
    businessLogo:
      "https://readdy.ai/api/search-image?query=Modern%20coffee%20shop%20logo%2C%20elegant%20caf%C3%A9%20branding%2C%20minimalist%20coffee%20brand%20identity%2C%20sophisticated%20caf%C3%A9%20logo%20design%2C%20premium%20coffee%20house%20branding&width=60&height=60&seq=cafe1&orientation=squarish",
    title: "Weekend Brunch Feature",
    startDate: "Dec 15, 2024",
    deadline: "Dec 22, 2024",
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
    startDate: "Dec 10, 2024",
    deadline: "Jan 10, 2025",
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
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-6 pt-4 pb-4">
        <div className="flex items-center justify-between mb-6">
          <Link href="/influencer/dashboard">
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
                    <p className="text-gray-600 mb-1">{collab.title}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <i className="ri-calendar-line"></i>
                        <span>Started: {collab.startDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <i className="ri-time-line"></i>
                        <span>Due: {collab.deadline}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      collab.status === 'In Progress' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {collab.status}
                    </div>
                  </div>
                </div>

                {/* Timeline Info */}
                <div className="mb-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <i className="ri-calendar-check-line text-blue-600"></i>
                        <span className="text-sm font-medium text-gray-700">Collaboration Timeline</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{collab.startDate}</span> - <span className="font-medium">{collab.deadline}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements Checklist */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                    <i className="ri-task-line text-purple-600"></i>
                    <span>Collaboration Tasks</span>
                  </h4>
                  <div className="space-y-2">
                    {collab.requirements.map((req, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                          req.includes("✓")
                            ? "bg-green-50 border border-green-200"
                            : "bg-orange-50 border border-orange-200"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          req.includes("✓")
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }`}>
                          <i
                            className={`text-white text-sm ${
                              req.includes("✓")
                                ? "ri-check-line"
                                : "ri-time-line"
                            }`}
                          ></i>
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            req.includes("✓")
                              ? "text-green-700 line-through"
                              : "text-orange-700"
                          }`}
                        >
                          {req.replace(" ✓", "").replace(" (Pending)", "")}
                        </span>
                        {req.includes("✓") && (
                          <span className="ml-auto text-green-600 text-xs font-medium">
                            Completed
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                    <i className="ri-eye-line"></i>
                    <span>View Details</span>
                  </button>
                  <Link href="/chat">
                    <button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                      <i className="ri-message-3-line"></i>
                      <span>Message Business</span>
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
                    <p className="text-gray-600 mb-2">{collab.title}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <i className="ri-calendar-check-line"></i>
                        <span>Completed: {collab.completedDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <i className="ri-star-fill text-yellow-400"></i>
                        <span>{collab.rating}/5 Rating</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      Completed
                    </div>
                  </div>
                </div>

                {/* Review */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <i className="ri-star-fill text-yellow-400"></i>
                    <h4 className="font-semibold text-gray-800">My Review</h4>
                    <div className="flex items-center space-x-1 ml-auto">
                      {[...Array(collab.rating)].map((_, i) => (
                        <i key={i} className="ri-star-fill text-yellow-400 text-sm"></i>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{collab.review}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                    <i className="ri-image-line"></i>
                    <span>View Portfolio</span>
                  </button>
                  <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
                    <i className="ri-refresh-line"></i>
                    <span>Collaborate Again</span>
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
