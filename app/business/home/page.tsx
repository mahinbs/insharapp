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
  },
  {
    id: 2,
    sender: "Alex Chen",
    username: "@alexeats",
    profileImage:
      "https://readdy.ai/api/search-image?query=Young%20male%20food%20influencer%2C%20professional%20headshot%2C%20friendly%20expression%2C%20modern%20portrait%20photography%2C%20natural%20lighting%2C%20food%20blogger%20personality&width=60&height=60&seq=influencer2&orientation=squarish",
    messageCount: 1,
    unread: false,
  },
  {
    id: 3,
    sender: "Sarah Johnson",
    username: "@sarahstyles",
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face",
    messageCount: 5,
    unread: true,
  },
];

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
  const [activeSection, setActiveSection] = useState<"statistics" | "agenda">(
    "agenda"
  );

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

      {/* Section Tabs */}
      <div className="bg-white px-6 py-4 shadow-sm -mt-4">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveSection("agenda")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeSection === "agenda"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Agenda
          </button>

          <button
            onClick={() => setActiveSection("statistics")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeSection === "statistics"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Statistics
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-6">
        {activeSection === "statistics" && (
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

        {activeSection === "agenda" && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Greeting Section - Elegant */}
            <div className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -ml-24 -mb-24"></div>

              <div className="relative z-10">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div className="mb-4 sm:mb-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-lg">
                        <i className="ri-store-3-line text-white text-2xl"></i>
                      </div>
                      <div>
                        <p className="text-white/80 text-sm font-medium">
                          Welcome Back
                        </p>
                        <p className="text-white/60 text-xs">
                          {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2 leading-tight">
                      Hello,{" "}
                      <span className="text-yellow-200">
                        {businessInfo.name}
                      </span>
                      !
                    </h1>
                    <p className="text-white/90 text-base sm:text-lg max-w-2xl leading-relaxed">
                      Here's your comprehensive agenda for today. Stay on top of
                      your collaborations, manage your business activities, and
                      grow your partnerships seamlessly.
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex flex-col space-y-3 sm:min-w-[200px]">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-xs font-medium">
                            Today's Activity
                          </p>
                          <p className="text-2xl font-bold text-white">8</p>
                        </div>
                        <i className="ri-calendar-check-line text-white/80 text-xl"></i>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-xs font-medium">
                            New Messages
                          </p>
                          <p className="text-2xl font-bold text-white">
                            {businessMessages.filter((m) => m.unread).length}
                          </p>
                        </div>
                        <i className="ri-message-3-line text-white/80 text-xl"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                <Link href="/business/chat">
                  <button className="text-purple-600 text-sm font-semibold hover:text-purple-700 transition-colors">
                    View All
                  </button>
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {businessMessages.map((msg) => (
                  <Link
                    key={msg.id}
                    href="/business/chat"
                    className="relative group cursor-pointer"
                  >
                    <div className="relative">
                      <div
                        className={`w-16 h-16 rounded-full overflow-hidden border-4 transition-all duration-300 group-hover:scale-110 ${
                          msg.unread
                            ? "border-purple-500 shadow-lg shadow-purple-500/50"
                            : "border-gray-300"
                        }`}
                      >
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
                      {/* Message Count Badge */}
                      <div
                        className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ${
                          msg.unread
                            ? "bg-red-500 animate-pulse"
                            : "bg-gray-500"
                        }`}
                      >
                        {msg.messageCount}
                      </div>
                      {/* Unread Indicator */}
                      {msg.unread && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
                      )}
                    </div>
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      {msg.sender}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
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

            {/* Business Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <i className="ri-store-line text-white text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Business Name</p>
                    <p className="font-semibold text-gray-800">
                      {businessInfo.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <i className="ri-map-pin-line text-white text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-800">
                      {businessInfo.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <i className="ri-star-fill text-white text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-semibold text-gray-800">
                      {businessInfo.rating} / 5.0
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
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
