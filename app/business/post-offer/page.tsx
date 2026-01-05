"use client";

import { useState } from "react";
import Link from "next/link";
import logo_dark from "@/assetes/logo_dark.png";

export default function PostOffer() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    serviceOffered: "",
    category: "",
    location: "",
    requirements: "",
    images: [],
  });

  const categories = [
    "Restaurant",
    "Beauty & Spa",
    "Fashion",
    "Fitness",
    "Travel",
    "Technology",
    "Home & Garden",
    "Entertainment",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Offer posted:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between">
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
            <span className="text-white/80 text-sm">Post New Offer</span>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 py-6 pb-24">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-gray-800 font-semibold mb-3">
              Offer Title
            </label>
            <input
              type="text"
              placeholder="e.g., Free 3-Course Dinner"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500 outline-none text-gray-800"
              required
            />
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-gray-800 font-semibold mb-3">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500 outline-none text-gray-800"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-gray-800 font-semibold mb-3">
              Description
            </label>
            <textarea
              placeholder="Describe what the influencer will receive and experience..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 resize-none"
              required
            />
            <div className="text-right text-gray-500 text-sm mt-2">
              {formData.description.length}/500
            </div>
          </div>

          {/* Service Offered */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-gray-800 font-semibold mb-3">
              What You're Offering
            </label>
            <textarea
              placeholder="Detail the specific service or product you're providing..."
              value={formData.serviceOffered}
              onChange={(e) =>
                setFormData({ ...formData, serviceOffered: e.target.value })
              }
              rows={3}
              maxLength={500}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 resize-none"
              required
            />
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-gray-800 font-semibold mb-3">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g., Downtown Plaza, 123 Main Street"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500 outline-none text-gray-800"
              required
            />
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-gray-800 font-semibold mb-3">
              Influencer Requirements
            </label>
            <textarea
              placeholder="e.g., Minimum 10K followers, Food niche, Post 3 stories, 1 Instagram post..."
              value={formData.requirements}
              onChange={(e) =>
                setFormData({ ...formData, requirements: e.target.value })
              }
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 resize-none"
              required
            />
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <label className="block text-gray-800 font-semibold mb-3">
              Photos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <i className="ri-image-add-line text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600 mb-2">
                Upload photos of your business or service
              </p>
              <p className="text-gray-500 text-sm">PNG, JPG up to 10MB each</p>
              <button
                type="button"
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium"
              >
                Choose Photos
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Post Offer
        </button>
      </div>
    </div>
  );
}
