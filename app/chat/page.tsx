'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdvancedBottomNav from '../../components/AdvancedBottomNav';
import logo_dark from "@/assetes/logo_dark.png";
import { RiCustomerService2Fill } from "react-icons/ri";


const chatList = [
  {
    id: 1,
    name: "Bella Vista Restaurant",
    lastMessage: "Great! Looking forward to the collaboration",
    time: "2m ago",
    unread: 2,
    avatar: "https://readdy.ai/api/search-image?query=Elegant%20restaurant%20logo%2C%20modern%20dining%20establishment%2C%20sophisticated%20branding%2C%20clean%20minimalist%20design%2C%20professional%20restaurant%20identity%2C%20upscale%20dining%20logo&width=60&height=60&seq=chat1&orientation=squarish",
    online: true
  },
  {
    id: 2,
    name: "Luxe Beauty Salon",
    lastMessage: "When would you like to schedule your appointment?",
    time: "1h ago",
    unread: 0,
    avatar: "https://readdy.ai/api/search-image?query=Luxury%20beauty%20salon%20logo%2C%20elegant%20spa%20branding%2C%20premium%20beauty%20services%20logo%2C%20sophisticated%20wellness%20brand%20identity%2C%20minimalist%20beauty%20logo%20design&width=60&height=60&seq=chat2&orientation=squarish",
    online: false
  },
  {
    id: 3,
    name: "Urban Threads",
    lastMessage: "The outfit package is ready for pickup!",
    time: "3h ago",
    unread: 1,
    avatar: "https://readdy.ai/api/search-image?query=Modern%20fashion%20boutique%20logo%2C%20trendy%20clothing%20brand%20identity%2C%20urban%20fashion%20logo%2C%20stylish%20apparel%20branding%2C%20contemporary%20fashion%20design&width=60&height=60&seq=chat3&orientation=squarish",
    online: true
  }
];

export default function ChatList() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-6 pt-4 pb-4">
        <div className="flex items-center justify-between mb-6">
          <Link href="/influencer/dashboard">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-arrow-left-line text-white text-xl"></i>
            </div>
          </Link>
          <div className=" flex flex-col items-center">
            <img 
              src={logo_dark.src}
              alt="Inshaar" 
              className="h-8 w-40 object-cover mb-1"
            />
            <span className="text-white/80 text-sm">Messages</span>
          </div>
          <Link href="/help">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <RiCustomerService2Fill className="text-white text-xl" />
            </div>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 px-4 py-3 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70"></i>
        </div>
      </div>

      {/* Chat List */}
      <div className="px-6 py-6">
        <div className="space-y-2">
          {chatList.map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    {chat.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800 truncate">{chat.name}</h3>
                      <span className="text-gray-500 text-sm">{chat.time}</span>
                    </div>
                    <p className="text-gray-600 text-sm truncate">{chat.lastMessage}</p>
                  </div>
                  
                  {chat.unread > 0 && (
                    <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">{chat.unread}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {chatList.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-message-line text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Messages Yet</h3>
          <p className="text-gray-500">Start collaborating to begin conversations</p>
        </div>
      )}

      {/* Advanced Bottom Navigation */}
      <AdvancedBottomNav userType="influencer" />
    </div>
  );
}
