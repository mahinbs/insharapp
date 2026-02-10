'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdvancedBottomNav from '../../components/AdvancedBottomNav';
import white_logo from "@/assetes/white-logo.png"
import { RiCustomerService2Fill } from "react-icons/ri";
import { getUserConversations, type Conversation } from '@/lib/supabase-messages';
import { supabase } from '@/lib/supabase';

export default function ChatList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadConversations() {
      try {
        // Get current user ID
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
        }

        const { data, error } = await getUserConversations();
        if (error) {
          console.error('Error loading conversations:', error);
          return;
        }
        if (data) {
          setConversations(data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadConversations();

    // Subscribe to new messages
    const channel = supabase
      .channel('conversations')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        () => {
          loadConversations();
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getUnreadCount = (conv: Conversation) => {
    if (!currentUserId) return 0;
    return conv.participant_1_id === currentUserId
      ? conv.participant_1_unread_count
      : conv.participant_2_unread_count;
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const otherParticipant = conv.other_participant;
    const name = otherParticipant?.full_name || otherParticipant?.business_name || '';
    return name.toLowerCase().includes(query);
  });

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
              src={white_logo.src}
              alt="Inshaar"
              className="h-12 w-40 object-cover mb-1"
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
        {loading ? (
          <div className="text-center py-12">
            <i className="ri-loader-4-line text-4xl text-pink-500 animate-spin mb-4"></i>
            <p className="text-gray-600">Loading conversations...</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {filteredConversations.map((conv) => {
                const otherParticipant = conv.other_participant;
                const name = otherParticipant?.full_name || otherParticipant?.business_name || 'Unknown';
                const avatar = otherParticipant?.avatar_url || otherParticipant?.business_logo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=60`;
                const unreadCount = getUnreadCount(conv);

                return (
                  <Link key={conv.id} href={`/chat/${conv.id}`}>
                    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={avatar}
                            alt={name}
                            className="w-14 h-14 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=60`;
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-800 truncate">{name}</h3>
                            <span className="text-gray-500 text-sm">{formatTime(conv.last_message_at)}</span>
                          </div>
                          <p className="text-gray-600 text-sm truncate">
                            {conv.last_message_preview || 'No messages yet'}
                          </p>
                        </div>

                        {unreadCount > 0 && (
                          <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">{unreadCount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredConversations.length === 0 && (
              <div className="text-center py-12">
                <i className="ri-message-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {searchQuery ? 'No conversations match your search' : 'No Messages Yet'}
                </h3>
                <p className="text-gray-500">
                  {searchQuery
                    ? 'Try a different search term'
                    : 'Start collaborating to begin conversations'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Advanced Bottom Navigation */}
      <AdvancedBottomNav userType="influencer" />
    </div>
  );
}
