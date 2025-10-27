'use client';

import Link from 'next/link';

export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Logo container */}
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <h1 className="font-['Pacifico'] text-6xl text-white mb-4 drop-shadow-lg bg-gradient-to-r from-white via-white/95 to-white/90 bg-clip-text text-transparent">
            Inshaar
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300 mx-auto rounded-full shadow-lg"></div>
        </div>
        
        {/* Tagline animation */}
        <div className="mb-8 animate-pulse">
          <p className="text-white/90 text-lg font-medium tracking-wide">
            Influence. Inspire. Collaborate.
          </p>
        </div>

        {/* Scrolling Banner */}
        <div className="mb-12 w-full max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 overflow-hidden">
            <div className="flex animate-scroll">
              <div className="flex space-x-8 whitespace-nowrap">
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-store-line text-pink-300"></i>
                  <span className="text-sm font-medium">New: Luxe Beauty Salon joins Inshaar!</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-calendar-event-line text-purple-300"></i>
                  <span className="text-sm font-medium">Event: Influencer Meetup this Saturday</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-gift-line text-orange-300"></i>
                  <span className="text-sm font-medium">Special: 50% off first collaboration</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-restaurant-line text-pink-300"></i>
                  <span className="text-sm font-medium">Update: Bella Vista Restaurant now accepting applications</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-trophy-line text-purple-300"></i>
                  <span className="text-sm font-medium">Achievement: 1000+ successful collaborations!</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-megaphone-line text-orange-300"></i>
                  <span className="text-sm font-medium">News: Inshaar featured in TechCrunch</span>
                </div>
                {/* Duplicate for seamless loop */}
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-store-line text-pink-300"></i>
                  <span className="text-sm font-medium">New: Luxe Beauty Salon joins Inshaar!</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-calendar-event-line text-purple-300"></i>
                  <span className="text-sm font-medium">Event: Influencer Meetup this Saturday</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-gift-line text-orange-300"></i>
                  <span className="text-sm font-medium">Special: 50% off first collaboration</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-restaurant-line text-pink-300"></i>
                  <span className="text-sm font-medium">Update: Bella Vista Restaurant now accepting applications</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-trophy-line text-purple-300"></i>
                  <span className="text-sm font-medium">Achievement: 1000+ successful collaborations!</span>
                </div>
                <div className="flex items-center space-x-2 text-white/90">
                  <i className="ri-megaphone-line text-orange-300"></i>
                  <span className="text-sm font-medium">News: Inshaar featured in TechCrunch</span>
                </div>
              </div>
            </div>
          </div>
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