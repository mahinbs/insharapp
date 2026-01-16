"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdvancedBottomNav from "../../../components/AdvancedBottomNav";
import logo_dark from "@/assetes/logo_dark.png";
import { useBusinessData } from "@/contexts/BusinessDataContext";
import { supabase } from "@/lib/supabase";

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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"thisWeek" | "upcoming" | "past">("thisWeek");
  const weekDates = getWeekDates();
  const { collaborations, refreshCollaborations } = useBusinessData();

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth');
          return;
        }

        // Load collaborations - context handles caching
        await refreshCollaborations();
      } catch (error) {
        console.error('Error loading agenda data:', error);
      }
    };

    loadData();
  }, [router, refreshCollaborations]);

  // Get current week start (Monday)
  const getWeekStart = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const weekStart = getWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  // Filter collaborations by status and date
  const thisWeekCollabs = useMemo(() => {
    return (collaborations || []).filter((collab: any) => {
      const collabDate = new Date(collab.scheduled_date);
      return collabDate >= weekStart && collabDate <= weekEnd && collab.status === 'active';
    }).map((collab: any) => ({
      id: collab.id,
      influencerName: collab.influencer?.full_name || 'Influencer',
      username: collab.influencer?.username || '@influencer',
      profileImage: collab.influencer?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(collab.influencer?.full_name || 'Influencer')}&background=random&size=64`,
      offerTitle: collab.offer?.title || 'Offer',
      date: new Date(collab.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: collab.scheduled_time ? new Date(`2000-01-01T${collab.scheduled_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD',
      status: collab.status === 'active' ? 'confirmed' : collab.status,
    }));
  }, [collaborations, weekStart, weekEnd]);

  const upcomingCollabs = useMemo(() => {
    return (collaborations || []).filter((collab: any) => {
      const collabDate = new Date(collab.scheduled_date);
      return collabDate > weekEnd && collab.status === 'active';
    }).map((collab: any) => ({
      id: collab.id,
      influencerName: collab.influencer?.full_name || 'Influencer',
      username: collab.influencer?.username || '@influencer',
      profileImage: collab.influencer?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(collab.influencer?.full_name || 'Influencer')}&background=random&size=64`,
      offerTitle: collab.offer?.title || 'Offer',
      date: new Date(collab.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: collab.scheduled_time ? new Date(`2000-01-01T${collab.scheduled_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD',
      status: 'confirmed',
    }));
  }, [collaborations, weekEnd]);

  const pastCollabs = useMemo(() => {
    return (collaborations || []).filter((collab: any) => {
      return collab.status === 'completed';
    }).map((collab: any) => ({
      id: collab.id,
      influencerName: collab.influencer?.full_name || 'Influencer',
      username: collab.influencer?.username || '@influencer',
      profileImage: collab.influencer?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(collab.influencer?.full_name || 'Influencer')}&background=random&size=64`,
      offerTitle: collab.offer?.title || 'Offer',
      date: new Date(collab.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: collab.scheduled_time ? new Date(`2000-01-01T${collab.scheduled_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD',
      status: 'completed',
      rating: 5, // Default rating - can be added to collaborations table later
    }));
  }, [collaborations]);

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
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      collab.status === "confirmed" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {collab.status.toUpperCase()}
                    </span>
                    {collab.status === "confirmed" && (
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

