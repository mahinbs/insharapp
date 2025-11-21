"use client";

import Link from "next/link";
import AdvancedBottomNav from "../../components/AdvancedBottomNav";
import { useState } from "react";
import logo_dark from "@/assetes/logo_dark.png";

export default function HelpCenterPage() {
  const [activeAudience, setActiveAudience] = useState<"influencer" | "business">("influencer");

  const faqs = {
    influencer: [
      {
        q: "How do I apply to an offer?",
        a: "Go to Discover, open an offer, and tap Apply or Book to proceed.",
      },
      {
        q: "Where can I see my collaborations?",
        a: "Open Collabs from the bottom tabs to view active and completed work.",
      },
      {
        q: "How is my portfolio updated?",
        a: "Uploads appear instantly. Completed collabs can be added to your portfolio later.",
      },
    ],
    business: [
      {
        q: "How do I post a new offer?",
        a: "Navigate to Offers and tap Post New Offer to create a listing.",
      },
      {
        q: "Where can I review applications?",
        a: "Go to Applications to view, accept, or decline influencer applications.",
      },
      {
        q: "Can I message influencers directly?",
        a: "Yes, use the Messages tab to chat and coordinate details.",
      },
    ],
  } as const;

  const quickActions = [
    {
      icon: "ri-book-open-line",
      label: "Getting Started",
      href: "#getting-started",
      gradient: "from-pink-500 to-purple-500",
    },
    {
      icon: "ri-shield-check-line",
      label: "Safety & Guidelines",
      href: "#safety",
      gradient: "from-purple-500 to-orange-500",
    },
    {
      icon: "ri-customer-service-2-line",
      label: "Contact Support",
      href: "#contact",
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

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
          <div className="h-8 w-40 flex flex-col items-center">
            <img 
              src={logo_dark.src}
              alt="Inshaar" 
              className="h-full w-full object-cover mb-1"
            />
            <span className="text-white/80 text-sm">Help Center</span>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <i className="ri-question-line text-white text-xl"></i>
          </div>
        </div>

        {/* Audience Toggle */}
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-1 grid grid-cols-2 gap-1">
          <button
            onClick={() => setActiveAudience("influencer")}
            className={`py-2 rounded-lg text-sm font-medium ${
              activeAudience === "influencer"
                ? "bg-white text-purple-700"
                : "text-white/90"
            }`}
          >
            For Influencers
          </button>
          <button
            onClick={() => setActiveAudience("business")}
            className={`py-2 rounded-lg text-sm font-medium ${
              activeAudience === "business" ? "bg-white text-purple-700" : "text-white/90"
            }`}
          >
            For Businesses
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action, idx) => (
            <a key={idx} href={action.href} className={`rounded-xl p-4 text-center text-white bg-gradient-to-r ${action.gradient} shadow-md hover:shadow-lg transition-all duration-300`}>
              <i className={`${action.icon} text-2xl mb-1 block`}></i>
              <span className="text-sm font-semibold leading-tight">{action.label}</span>
            </a>
          ))}
        </div>

        {/* Getting Started */}
        <section id="getting-started" className="bg-white rounded-2xl p-5 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Getting Started</h3>
          {activeAudience === "influencer" ? (
            <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm">
              <li>Create your profile and add social links</li>
              <li>Discover offers and apply or book directly</li>
              <li>Track your active and completed collaborations</li>
              <li>Showcase your work in the portfolio section</li>
            </ul>
          ) : (
            <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm">
              <li>Set up your business profile</li>
              <li>Post offers with clear requirements</li>
              <li>Review applications and chat with influencers</li>
              <li>Track performance in your dashboard</li>
            </ul>
          )}
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-2xl p-5 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {(faqs[activeAudience]).map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                    <i className="ri-question-line"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1 text-sm">{item.q}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Safety */}
        <section id="safety" className="bg-white rounded-2xl p-5 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Safety & Guidelines</h3>
          <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm">
            <li>Communicate in-app to keep a record of agreements</li>
            <li>Share only necessary details and verify profiles</li>
            <li>Report suspicious activity to the support team</li>
          </ul>
        </section>

        {/* Contact Support */}
        <section id="contact" className="bg-white rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Contact Support</h3>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Typically replies in under 24h</span>
          </div>

          <div className="space-y-3">
            <a href="mailto:support@inshaar.app" className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center">
                  <i className="ri-mail-send-line text-lg"></i>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Email Inshaar Support</div>
                  <div className="text-gray-500 text-xs">support@inshaar.app</div>
                </div>
              </div>
              <i className="ri-external-link-line text-gray-400"></i>
            </a>

            <Link href="/chat">
              <div className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center">
                    <i className="ri-customer-service-2-line text-lg"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">Message Support</div>
                    <div className="text-gray-500 text-xs">Start a new support conversation</div>
                  </div>
                </div>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </div>
            </Link>
          </div>
        </section>
      </div>

      {/* Bottom Navigation (kept horizontal) */}
      <AdvancedBottomNav userType={activeAudience === "influencer" ? "influencer" : "business"} />
    </div>
  );
}


