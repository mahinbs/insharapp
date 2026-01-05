"use client";

import { useState } from "react";
import Link from "next/link";
import AdvancedBottomNav from "../../../components/AdvancedBottomNav";
import logo_dark from "@/assetes/logo_dark.png";

const thisWeekCollabs = [
  {
    id: 1,
    influencerName: "Emma Wilson",
    username: "@emmastyle",
    profileImage: "https://readdy.ai/api/search-image?query=Young%20female%20lifestyle%20influencer%2C%20professional%20headshot%2C%20confident%20smile%2C%20modern%20portrait%20photography%2C%20bright%20natural%20lighting%2C%20social%20media%20personality&width=60&height=60&seq=influencer1&orientation=squarish",
    offerTitle: "Free 3-Course Dinner",
    date: "Dec 18, 2024",
    time: "7:00 PM",
    status: "confirmed",
    visitInfo: {
      arrivalTime: "2024-12-18T19:05:00Z",
      isOnTime: true,
      checkedIn: true,
    },
  },
  {
    id: 2,
    influencerName: "Alex Chen",
    username: "@alexeats",
    profileImage: "https://readdy.ai/api/search-image?query=Young%20male%20food%20influencer%2C%20professional%20headshot%2C%20friendly%20expression%2C%20modern%20portrait%20photography%2C%20natural%20lighting%2C%20food%20blogger%20personality&width=60&height=60&seq=influencer2&orientation=squarish",
    offerTitle: "Weekend Brunch Package",
    date: "Dec 20, 2024",
    time: "11:00 AM",
    status: "pending",
  },
];

const upcomingCollabs = [
  {
    id: 3,
    influencerName: "Sarah Johnson",
    username: "@sarahstyles",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face",
    offerTitle: "Designer Outfit Package",
    date: "Dec 25, 2024",
    time: "2:00 PM",
    status: "confirmed",
  },
];

const pastCollabs = [
  {
    id: 4,
    influencerName: "Mike Tastes",
    username: "@miketastes",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    offerTitle: "3-Course Dinner Experience",
    date: "Dec 5, 2024",
    time: "7:00 PM",
    status: "completed",
    rating: 5,
  },
  {
    id: 5,
    influencerName: "Lifestyle Lux",
    username: "@lifestylelux",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    offerTitle: "Weekend Brunch Feature",
    date: "Nov 28, 2024",
    time: "11:00 AM",
    status: "completed",
    rating: 4,
  },
];

// Get current week dates
const getWeekDates = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(today.setDate(diff));
  
  const week = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    week.push({
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      fullDate: date.toISOString().split('T')[0],
      isToday: date.toDateString() === new Date().toDateString(),
    });
  }
  return week;
};

export default function BusinessAgendaPage() {
  const [activeTab, setActiveTab] = useState<"thisWeek" | "upcoming" | "past">("thisWeek");
  const weekDates = getWeekDates();

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-6 pt-4 pb-4">
        <div className="flex items-center justify-between mb-6">
          <Link href="/business/home">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <i className="ri-arrow-left-line text-white text-xl"></i>
            </div>
          </Link>
          <div className="flex flex-col items-center">
            <img 
              src={logo_dark.src}
              alt="Inshaar" 
              className="h-10 w-40 object-cover mb-1"
            />
          </div>
          <div className="w-10 h-10"></div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white px-4 py-4 shadow-sm sticky top-0 z-40">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("thisWeek")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeTab === "thisWeek"
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeTab === "upcoming"
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeTab === "past"
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Past Collab
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {activeTab === "thisWeek" && (
          <div className="space-y-4">
            {thisWeekCollabs.map((collab) => (
              <div
                key={collab.id}
                className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={collab.profileImage}
                    alt={collab.influencerName}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-100"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">
                      {collab.influencerName}
                    </h3>
                    <p className="text-purple-600 text-sm mb-1">{collab.username}</p>
                    <p className="text-gray-600 text-sm">{collab.offerTitle}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-xs text-gray-500 flex items-center space-x-1">
                        <i className="ri-calendar-line"></i>
                        <span>{collab.date}</span>
                      </span>
                      <span className="text-xs text-gray-500 flex items-center space-x-1">
                        <i className="ri-time-line"></i>
                        <span>{collab.time}</span>
                      </span>
                    </div>
                    {collab.visitInfo?.checkedIn && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${
                          collab.visitInfo.isOnTime 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          <i className={`ri-${collab.visitInfo.isOnTime ? 'check' : 'time'}-line`}></i>
                          <span>{collab.visitInfo.isOnTime ? 'On Time' : 'Late Arrival'}</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          Arrived: {new Date(collab.visitInfo.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      collab.status === "confirmed" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {collab.status.toUpperCase()}
                    </span>
                    {!collab.visitInfo?.checkedIn && collab.status === "confirmed" && (
                      <span className="text-xs text-gray-500 flex items-center space-x-1">
                        <i className="ri-time-line"></i>
                        <span>Awaiting check-in</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {thisWeekCollabs.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <i className="ri-calendar-line text-4xl text-gray-300 mb-2"></i>
                <p className="text-gray-500 text-sm">No collaborations this week</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "upcoming" && (
          <div className="space-y-6">
            {/* Weekly Calendar */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100">
              <h3 className="font-bold text-lg text-gray-800 mb-4">This Week</h3>
              <div className="grid grid-cols-7 gap-2">
                {weekDates.map((day, index) => (
                  <div
                    key={index}
                    className={`text-center p-3 rounded-xl transition-all ${
                      day.isToday
                        ? "bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 text-white shadow-lg"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <p className={`text-xs font-medium mb-1 ${day.isToday ? "text-white/80" : "text-gray-500"}`}>
                      {day.day}
                    </p>
                    <p className={`text-lg font-bold ${day.isToday ? "text-white" : "text-gray-800"}`}>
                      {day.date}
                    </p>
                    <p className={`text-xs mt-1 ${day.isToday ? "text-white/80" : "text-gray-400"}`}>
                      {day.month}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Collaborations */}
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-4">Upcoming Collaborations</h3>
              <div className="space-y-4">
                {upcomingCollabs.map((collab) => (
                  <div
                    key={collab.id}
                    className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-5 shadow-lg border-2 border-purple-100"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={collab.profileImage}
                        alt={collab.influencerName}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-200"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-800">
                          {collab.influencerName}
                        </h3>
                        <p className="text-purple-600 text-sm mb-1">{collab.username}</p>
                        <p className="text-gray-600 text-sm">{collab.offerTitle}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className="text-xs text-gray-500 flex items-center space-x-1">
                            <i className="ri-calendar-line"></i>
                            <span>{collab.date}</span>
                          </span>
                          <span className="text-xs text-gray-500 flex items-center space-x-1">
                            <i className="ri-time-line"></i>
                            <span>{collab.time}</span>
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        CONFIRMED
                      </span>
                    </div>
                  </div>
                ))}
                {upcomingCollabs.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl">
                    <i className="ri-calendar-todo-line text-4xl text-gray-300 mb-2"></i>
                    <p className="text-gray-500 text-sm">No upcoming collaborations</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "past" && (
          <div className="space-y-4">
            {pastCollabs.map((collab) => (
              <div
                key={collab.id}
                className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100 opacity-90"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={collab.profileImage}
                    alt={collab.influencerName}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200 grayscale"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-700">
                      {collab.influencerName}
                    </h3>
                    <p className="text-gray-500 text-sm mb-1">{collab.username}</p>
                    <p className="text-gray-600 text-sm">{collab.offerTitle}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-xs text-gray-400 flex items-center space-x-1">
                        <i className="ri-calendar-line"></i>
                        <span>{collab.date}</span>
                      </span>
                      <div className="flex items-center space-x-1">
                        {[...Array(collab.rating)].map((_, i) => (
                          <i key={i} className="ri-star-fill text-yellow-400 text-xs"></i>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                    COMPLETED
                  </span>
                </div>
              </div>
            ))}
            {pastCollabs.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <i className="ri-history-line text-4xl text-gray-300 mb-2"></i>
                <p className="text-gray-500 text-sm">No past collaborations</p>
              </div>
            )}
          </div>
        )}
      </div>

      <AdvancedBottomNav userType="business" />
    </div>
  );
}

