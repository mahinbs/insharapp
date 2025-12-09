'use client';

import { useState } from 'react';
import Link from 'next/link';
import logo_dark from "@/assetes/logo_dark.png";

export default function AuthScreen() {
  const [userType, setUserType] = useState<'influencer' | 'business' | null>(null);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="h-full w-full flex flex-col justify-center py-4">
            <img 
              src={logo_dark.src}
              alt="Inshaar" 
              className="h-10 w-40 object-cover mb-1"
            />
            <span className="text-white/80 text-xs">Choose your path to collaboration</span>
          </div>

      {/* User type selection */}
      {!userType && (
        <div className="flex-1 px-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            I am a...
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={() => setUserType('influencer')}
              className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-pink-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <i className="ri-user-star-line text-white text-2xl"></i>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-800">Influencer</h3>
                  <p className="text-gray-600">Collaborate with brands and get amazing services</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setUserType('business')}
              className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
                  <i className="ri-building-line text-white text-2xl"></i>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-800">Business Owner</h3>
                  <p className="text-gray-600">Find influencers to promote your business</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Auth form */}
      {userType && (
        <div className="flex-1 px-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-gray-600">
                {isLogin ? 'Sign in to continue' : 'Join the collaboration revolution'}
              </p>
            </div>

            <div className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
                />
              )}
              
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
              />
              
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-gray-800"
              />

              <Link href={userType === 'influencer' ? '/influencer/dashboard' : '/business/dashboard'}>
                <button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </Link>
            </div>

            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-gray-500 text-sm">or continue with</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all duration-300">
                <i className="ri-instagram-line text-xl"></i>
                <span>Continue with Instagram</span>
              </button>
              
              <button className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all duration-300">
                <i className="ri-google-line text-xl"></i>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-600 font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            <button
              onClick={() => setUserType(null)}
              className="w-full mt-4 text-gray-500 font-medium"
            >
              ← Back to user type selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}