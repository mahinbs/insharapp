"use client";

import Link from "next/link";
import AdvancedBottomNav from "../../../components/AdvancedBottomNav";
import logo_colorful from "@/assetes/Logo3 (1).png";
import { cities } from "@/lib/cities-data";

export default function InfluencerCitiesPage() {
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="bg-white px-4 pt-4 pb-4 border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/influencer/dashboard"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <i className="ri-arrow-left-line text-gray-700 text-xl"></i>
          </Link>
          <img
            src={logo_colorful.src}
            alt="Inshaar"
            className="h-8 w-32 lg:h-10 lg:w-40 object-cover"
          />
          <div className="w-10" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black mt-4 tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
          Discover Our Cities
        </h1>
      </div>

      {/* Cities grid */}
      <div className="px-4 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {cities.map((city, index) => (
            <Link
              key={city.id}
              href={`/category/${city.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="relative rounded-2xl overflow-hidden group aspect-[4/5] transition-all duration-300 hover:shadow-2xl hover:shadow-pink-200/30 hover:-translate-y-1 hover:ring-2 hover:ring-pink-300/50"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/80 transition-all duration-300" />
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-bold text-sm sm:text-lg group-hover:text-pink-300 transition-colors duration-300 drop-shadow-sm line-clamp-2">
                  {city.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <AdvancedBottomNav userType="influencer" />
    </div>
  );
}
