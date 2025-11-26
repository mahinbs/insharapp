'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdvancedBottomNav from '../../../components/AdvancedBottomNav';
import logo_dark from "../../../assetes/logo_dark.png";

const chatList = [
  {
    id: 1,
    name: "Sarah Styles",
    username: "@sarahstyles",
    lastMessage: "Thank you for accepting my application! When can we schedule?",
    time: "2m ago",
    unread: 2,
    avatar: "https://i.pravatar.cc/48?img=5",
    online: true,
    collaboration: "Free 3-Course Dinner"
  },
  {
    id: 2,
    name: "Alex Chen",
    username: "@alexeats",
    lastMessage: "I've completed the content. Here's the link to review.",
    time: "1h ago",
    unread: 0,
    avatar: "https://i.pravatar.cc/48?img=8",
    online: false,
    collaboration: "Weekend Brunch Package"
  },
  {
    id: 3,
    name: "Emma Wilson",
    username: "@emmastyle",
    lastMessage: "Looking forward to working with you!",
    time: "3h ago",
    unread: 1,
    avatar: "https://readdy.ai/api/search-image?query=Young%20female%20lifestyle%20influencer%2C%20professional%20headshot%2C%20confident%20smile%2C%20modern%20portrait%20photography%2C%20bright%20natural%20lighting%2C%20social%20media%20personality&width=60&height=60&seq=influencer1&orientation=squarish",
    online: true,
    collaboration: "Chef's Special Tasting"
  },
  {
    id: 4,
    name: "Fitness Queen",
    username: "@fitnessqueen",
    lastMessage: "The gym session was amazing! Thank you so much.",
    time: "5h ago",
    unread: 0,
    avatar: "https://i.pravatar.cc/48?img=20",
    online: false,
    collaboration: "30-Day Membership"
  }
];

export default function BusinessChatList() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chatList.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.collaboration.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-6 pt-4 pb-4">
        <div className="flex items-center justify-between mb-6">
          <Link href="/business/dashboard">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-arrow-left-line text-white text-xl"></i>
            </div>
          </Link>
          <div className="flex flex-col items-center">
            <img 
              src={logo_dark.src}
              alt="Inshaar" 
              className="h-8 w-40 object-cover mb-1"
            />
            <span className="text-white/80 text-sm">Messages</span>
          </div>
          <Link href="/help">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <i className="ri-question-line text-white text-xl"></i>
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
          {filteredChats.map((chat) => (
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
                      <div>
                        <h3 className="font-semibold text-gray-800 truncate">{chat.name}</h3>
                        <p className="text-purple-600 text-xs truncate">{chat.username}</p>
                      </div>
                      <span className="text-gray-500 text-sm">{chat.time}</span>
                    </div>
                    <p className="text-gray-600 text-sm truncate mb-1">{chat.lastMessage}</p>
                    <p className="text-gray-400 text-xs truncate">Collaboration: {chat.collaboration}</p>
                  </div>
                  
                  {chat.unread > 0 && (
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
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
      {filteredChats.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-message-line text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Messages Found</h3>
          <p className="text-gray-500">
            {searchQuery ? 'Try a different search term' : 'Start collaborating to begin conversations'}
          </p>
        </div>
      )}

      {/* Advanced Bottom Navigation */}
      <AdvancedBottomNav userType="business" />
    </div>
  );
}

