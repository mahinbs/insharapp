"use client";

import Link from "next/link";
import logo_dark from "@/assetes/logo_dark.png";

export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Logo container */}
      <div className="relative z-10 text-center">
        <div className="flex flex-col items-center justify-center">
          <img
            src={logo_dark.src}
            alt="Inshaar"
            className="h-8 w-40 object-cover mb-1"
          />
        </div>

        {/* Tagline animation */}
        <div className="mb-8 animate-pulse">
          <p className="text-white/90 text-lg font-medium tracking-wide">
            Influence. Inspire. Collaborate.
          </p>
        </div>

        {/* Get Started Button */}
        <Link href="/onboarding">
          <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-300 shadow-lg">
            Get Started
          </button>
        </Link>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-32 right-8 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/3 right-12 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
    </div>
  );
}
