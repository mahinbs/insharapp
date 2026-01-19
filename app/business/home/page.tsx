"use client";

import { useState } from "react";
import Link from "next/link";
import AdvancedBottomNav from "../../../components/AdvancedBottomNav";
import logo_dark from "@/assetes/logo_dark.png";

// Sample statistics data
const weeklyReservations = [
  { day: "Mon", count: 12 },
  { day: "Tue", count: 18 },
  { day: "Wed", count: 15 },
  { day: "Thu", count: 22 },
  { day: "Fri", count: 28 },
  { day: "Sat", count: 35 },
  { day: "Sun", count: 20 },
];

const businessMessages = [
  {
    id: 1,
    sender: "Emma Wilson",
    username: "@emmastyle",
    profileImage:
      "https://readdy.ai/api/search-image?query=Young%20female%20lifestyle%20influencer%2C%20professional%20headshot%2C%20confident%20smile%2C%20modern%20portrait%20photography%2C%20bright%20natural%20lighting%2C%20social%20media%20personality&width=60&height=60&seq=influencer1&orientation=squarish",
    messageCount: 3,
    unread: true,
    lastMessage: "Hi! I'm interested in collaborating with your restaurant. Would love to discuss details!",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    sender: "Alex Chen",
    username: "@alexeats",
    profileImage:
      "https://readdy.ai/api/search-image?query=Young%20male%20food%20influencer%2C%20professional%20headshot%2C%20friendly%20expression%2C%20modern%20portrait%20photography%2C%20natural%20lighting%2C%20food%20blogger%20personality&width=60&height=60&seq=influencer2&orientation=squarish",
    messageCount: 1,
    unread: false,
    lastMessage: "Thanks for the opportunity! Looking forward to working together.",
    timestamp: "1 day ago",
  },
  {
    id: 3,
    sender: "Sarah Johnson",
    username: "@sarahstyles",
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face",
    messageCount: 5,
    unread: true,
    lastMessage: "Can we schedule a call to discuss the collaboration details?",
    timestamp: "30 minutes ago",
  },
];

// Brief Statistics Data
const briefStats = {
  today: 8,
  thisWeek: 150,
  thisMonth: 642,
  previousMonth: 598,
  total: 168,
  accepted: 142,
  rejected: 26,
};

const businessInfo = {
  name: "Bella Vista Restaurant",
  location: "Paris 75014",
  rating: 4.9,
  totalReservations: 168,
  acceptedReservations: 142,
  rejectedReservations: 26,
  weeklyReservations: 150,
};

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

export default function BusinessDashboard() {

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
              Manage your business dashboard
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300">
              <i className="ri-notification-line text-white text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-6">
        {false && (
          <div className="space-y-6 max-w-6xl mx-auto">


            {/* Daily Statistics Analysis - Comprehensive Pie Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Daily Statistics Analysis
              </h2>
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Main Pie Chart */}
                <div className="flex-shrink-0">
                  <div className="relative w-80 h-80">
                    <svg className="transform -rotate-90 w-80 h-80">
                      {/* Background circle */}
                      <circle
                        cx="160"
                        cy="160"
                        r="140"
                        stroke="currentColor"
                        strokeWidth="32"
                        fill="transparent"
                        className="text-gray-100"
                      />
                      {/* Accepted Reservations (Total) */}
                      <circle
                        cx="160"
                        cy="160"
                        r="140"
                        stroke="currentColor"
                        strokeWidth="32"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 140}
                        strokeDashoffset={
                          2 *
                          Math.PI *
                          140 *
                          (1 -
                            businessInfo.acceptedReservations /
                              businessInfo.totalReservations)
                        }
                        className="text-green-500"
                        strokeLinecap="round"
                      />
                      {/* Rejected Reservations */}
                      <circle
                        cx="160"
                        cy="160"
                        r="140"
                        stroke="currentColor"
                        strokeWidth="32"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 140}
                        strokeDashoffset={
                          2 *
                            Math.PI *
                            140 *
                            (1 -
                              businessInfo.acceptedReservations /
                                businessInfo.totalReservations) +
                          2 *
                            Math.PI *
                            140 *
                            (businessInfo.rejectedReservations /
                              businessInfo.totalReservations)
                        }
                        className="text-red-500"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-5xl font-bold text-gray-800 mb-1">
                          {businessInfo.totalReservations}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total Reservations
                        </p>
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-2xl font-bold text-green-600">
                            {Math.round(
                              (businessInfo.acceptedReservations /
                                businessInfo.totalReservations) *
                                100
                            )}
                            %
                          </p>
                          <p className="text-xs text-gray-500">
                            Acceptance Rate
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics Details */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {/* Today's Reservations */}
                  <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <i className="ri-calendar-todo-line text-blue-500 text-xl"></i>
                        <h3 className="font-semibold text-gray-800">
                          Today's Reservations
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-end space-x-2">
                      <p className="text-4xl font-bold text-gray-800">8</p>
                      <p className="text-sm text-gray-600 mb-1">reservations</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Accepted:</span>
                        <span className="font-bold text-green-600">6</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">Rejected:</span>
                        <span className="font-bold text-red-600">2</span>
                      </div>
                    </div>
                  </div>

                  {/* Accepted Reservations */}
                  <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <i className="ri-check-double-line text-green-500 text-xl"></i>
                        <h3 className="font-semibold text-gray-800">
                          Accepted
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-end space-x-2">
                      <p className="text-4xl font-bold text-gray-800">
                        {businessInfo.acceptedReservations}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">total</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Today:</span>
                        <span className="font-bold text-green-600">6</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">Rate:</span>
                        <span className="font-bold text-green-600">
                          {Math.round(
                            (businessInfo.acceptedReservations /
                              businessInfo.totalReservations) *
                              100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rejected Reservations */}
                  <div className="bg-red-50 rounded-xl p-5 border-2 border-red-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <i className="ri-close-circle-line text-red-500 text-xl"></i>
                        <h3 className="font-semibold text-gray-800">
                          Rejected
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-end space-x-2">
                      <p className="text-4xl font-bold text-gray-800">
                        {businessInfo.rejectedReservations}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">total</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Today:</span>
                        <span className="font-bold text-red-600">2</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">Rate:</span>
                        <span className="font-bold text-red-600">
                          {Math.round(
                            (businessInfo.rejectedReservations /
                              businessInfo.totalReservations) *
                              100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Summary */}
                  <div className="bg-purple-50 rounded-xl p-5 border-2 border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <i className="ri-bar-chart-line text-purple-500 text-xl"></i>
                        <h3 className="font-semibold text-gray-800">
                          This Week
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-end space-x-2">
                      <p className="text-4xl font-bold text-gray-800">
                        {businessInfo.weeklyReservations}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">reservations</p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-purple-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Avg/Day:</span>
                        <span className="font-bold text-purple-600">
                          {Math.round(businessInfo.weeklyReservations / 7)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">Trend:</span>
                        <span className="font-bold text-green-600 flex items-center">
                          <i className="ri-arrow-up-line mr-1"></i>
                          +12%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-center gap-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      Accepted ({businessInfo.acceptedReservations})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      Rejected ({businessInfo.rejectedReservations})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <i className="ri-calendar-check-line text-white text-xl"></i>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">
                  {businessInfo.totalReservations}
                </h3>
                <p className="text-gray-500 text-sm">Total Reservations</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <i className="ri-checkbox-circle-line text-white text-xl"></i>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">
                  {businessInfo.acceptedReservations}
                </h3>
                <p className="text-gray-500 text-sm">Accepted</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <i className="ri-close-circle-line text-white text-xl"></i>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">
                  {businessInfo.rejectedReservations}
                </h3>
                <p className="text-gray-500 text-sm">Rejected</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <i className="ri-bar-chart-line text-white text-xl"></i>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">
                  {businessInfo.weeklyReservations}
                </h3>
                <p className="text-gray-500 text-sm">This Week</p>
              </div>
            </div>

            {/* Weekly Reservations Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Weekly Reservations
              </h2>
              <div className="space-y-4">
                {weeklyReservations.map((day, index) => {
                  const maxCount = Math.max(
                    ...weeklyReservations.map((d) => d.count)
                  );
                  const percentage = (day.count / maxCount) * 100;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {day.day}
                        </span>
                        <span className="text-sm font-bold text-gray-800">
                          {day.count}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {true && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Greeting Section - Simplified */}
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-2xl p-6 shadow-lg">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                Hello, {businessInfo.name}!
                    </h1>
              <p className="text-white/90 text-sm">
                Manage your collaborations and grow your partnerships
              </p>
            </div>

            {/* Business Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Business Information</h2>
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <i className="ri-building-line text-white text-lg"></i>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <i className="ri-store-line text-white text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Business Name</p>
                    <p className="font-semibold text-gray-800">
                      {businessInfo.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <i className="ri-map-pin-line text-white text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-800">
                      {businessInfo.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100 hover:shadow-md transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <i className="ri-star-fill text-white text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-semibold text-gray-800">
                      {businessInfo.rating} / 5.0
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-all duration-300 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <i className="ri-calendar-check-line text-white text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Reservations</p>
                    <p className="font-semibold text-gray-800">
                      {businessInfo.totalReservations}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <i className="ri-message-3-line text-white text-lg"></i>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                </div>
                <Link href="/business/chat">
                  <button className="text-purple-600 text-sm font-semibold hover:text-purple-700 transition-colors flex items-center space-x-1">
                    <span>View All</span>
                    <i className="ri-arrow-right-line"></i>
                  </button>
                </Link>
              </div>
              <div className="space-y-3">
                {businessMessages.map((msg) => (
                  <Link
                    key={msg.id}
                    href="/business/chat"
                    className="block"
                  >
                    <div className={`relative bg-white rounded-xl p-4 border-2 transition-all duration-300 hover:shadow-md ${
                      msg.unread 
                        ? "border-purple-200 bg-purple-50/50" 
                        : "border-gray-100 hover:border-gray-200"
                    }`}>
                      <div className="flex items-start space-x-3">
                        {/* Profile Image */}
                        <div className="relative flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
                            msg.unread 
                              ? "border-purple-500" 
                              : "border-gray-300"
                          }`}>
                            <img
                              src={msg.profileImage}
                              alt={msg.sender}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  msg.sender
                                )}&background=random&size=64`;
                              }}
                            />
                          </div>
                          {/* Unread Indicator */}
                          {msg.unread && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>

                        {/* Message Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-800 text-sm">{msg.sender}</h3>
                              <span className="text-gray-500 text-xs">{msg.username}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {msg.unread && (
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              )}
                              <span className="text-gray-400 text-xs">{msg.timestamp}</span>
                            </div>
                          </div>
                          <p className={`text-sm mb-2 line-clamp-2 ${
                            msg.unread ? "text-gray-800 font-medium" : "text-gray-600"
                          }`}>
                            {msg.lastMessage}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {msg.messageCount > 1 && (
                                <span className="text-xs text-gray-500">
                                  {msg.messageCount} messages
                                </span>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                // Handle reply action
                              }}
                              className="text-purple-600 hover:text-purple-700 text-xs font-semibold flex items-center space-x-1 transition-colors"
                            >
                              <i className="ri-reply-line"></i>
                              <span>Reply</span>
                            </button>
                          </div>
                        </div>

                        {/* Message Count Badge */}
                        {msg.unread && msg.messageCount > 0 && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
                            {msg.messageCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {businessMessages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <i className="ri-message-line text-4xl mb-2"></i>
                  <p>No messages yet</p>
                </div>
              )}
            </div>

            {/* Brief Statistics Section */}
            <Link href="/business/profile#statistics">
              <div className="mt-6 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Quick Statistics</h2>
                  <i className="ri-arrow-right-line text-white text-2xl group-hover:translate-x-1 transition-transform"></i>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all">
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="ri-calendar-todo-line text-white text-lg"></i>
                      <p className="text-white/80 text-xs font-medium">Today</p>
                    </div>
                    <p className="text-3xl font-bold text-white">{briefStats.today}</p>
                    <p className="text-white/70 text-xs mt-1">bookings</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all">
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="ri-calendar-week-line text-white text-lg"></i>
                      <p className="text-white/80 text-xs font-medium">This Week</p>
                    </div>
                    <p className="text-3xl font-bold text-white">{briefStats.thisWeek}</p>
                    <p className="text-white/70 text-xs mt-1">bookings</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all">
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="ri-calendar-month-line text-white text-lg"></i>
                      <p className="text-white/80 text-xs font-medium">This Month</p>
                    </div>
                    <p className="text-3xl font-bold text-white">{briefStats.thisMonth}</p>
                    <p className="text-white/70 text-xs mt-1">bookings</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all">
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="ri-bar-chart-line text-white text-lg"></i>
                      <p className="text-white/80 text-xs font-medium">Previous</p>
                    </div>
                    <p className="text-3xl font-bold text-white">{briefStats.previousMonth}</p>
                    <p className="text-white/70 text-xs mt-1">last month</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/30 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{briefStats.accepted}</p>
                      <p className="text-white/80 text-xs">Accepted</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{briefStats.rejected}</p>
                      <p className="text-white/80 text-xs">Rejected</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-xs mb-1">Total</p>
                    <p className="text-3xl font-bold text-white">{briefStats.total}</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Offers & Applications Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Offers & Applications
                </h2>
                <Link href="/business/post-offer">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    <i className="ri-add-line mr-1"></i>
                    New Offer
                  </button>
                </Link>
              </div>
              <div className="space-y-4">
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
                          <div className="text-gray-500 text-sm">
                            Applications
                          </div>
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

                {/* Applications */}
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Applications
                  </h3>
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
          </div>
        )}
      </div>

      {/* Advanced Bottom Navigation */}
      <AdvancedBottomNav userType="business" />
    </div>
  );
}
