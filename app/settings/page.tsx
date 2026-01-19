"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdvancedBottomNav from "../../components/AdvancedBottomNav";
import { signOut } from "@/lib/supabase-auth";
import { getCurrentUserProfile } from "@/lib/supabase-profile";
import { supabase } from "@/lib/supabase";

const page = () => {
  const router = useRouter();
  const [userType, setUserType] = useState<'influencer' | 'business'>('business');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserType = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth');
          return;
        }

        const profileResult = await getCurrentUserProfile();
        if (profileResult.data?.user_type) {
          setUserType(profileResult.data.user_type);
        }
      } catch (error) {
        console.error('Error loading user type:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserType();
  }, []);

  const handleSignOut = async (router: ReturnType<typeof useRouter>) => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Sign out error:', error);
        alert('Failed to sign out. Please try again.');
        return;
      }
      // Redirect to auth page after successful sign out
      router.push('/auth');
      // Force a page reload to clear any cached state
      window.location.href = '/auth';
    } catch (error) {
      console.error('Sign out error:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  const options = [
    {
      icon: "ri-shield-line",
      label: "Services",
      action: (router: ReturnType<typeof useRouter>) => router.push("/services"),
    },
    { icon: "ri-notification-line", label: "Notifications" },
    { icon: "ri-shield-check-line", label: "Privacy" },
    { icon: "ri-question-line", label: "Help & Support" },
    { 
      icon: "ri-logout-box-line", 
      label: "Sign Out", 
      danger: true,
      action: handleSignOut,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white px-6 pt-10 pb-28 rounded-b-[32px]">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-white/90"
        >
          <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur">
            <i className="ri-arrow-left-line text-lg"></i>
          </div>
          <span className="font-semibold">Back</span>
        </button>
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">
            Settings
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Control Center
          </h1>
          <p className="text-sm text-white/80 mt-2">
            Manage your services, alerts, privacy preferences, and account access.
          </p>
        </div>
      </div>

      <div className="-mt-16 px-6">
        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <div className="space-y-4">
            {options.map((option) => (
              <button
                key={option.label}
                onClick={() => option.action?.(router)}
                className={`w-full flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 ${
                  option.danger ? "bg-red-50/40" : "bg-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-11 w-11 rounded-2xl flex items-center justify-center ${
                      option.danger ? "bg-red-50" : "bg-gray-50"
                    }`}
                  >
                    <i
                      className={`${option.icon} text-lg ${
                        option.danger ? "text-red-500" : "text-gray-600"
                      }`}
                    ></i>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      option.danger ? "text-red-600" : "text-gray-800"
                    }`}
                  >
                    {option.label}
                  </span>
                </div>
                <i
                  className={`ri-arrow-right-s-line text-lg ${
                    option.danger ? "text-red-400" : "text-gray-400"
                  }`}
                ></i>
              </button>
            ))}
          </div>
        </div>
      </div>

      {!loading && <AdvancedBottomNav userType={userType} />}
    </div>
  );
};

export default page;
