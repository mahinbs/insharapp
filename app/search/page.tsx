'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AdvancedBottomNav from '../../components/AdvancedBottomNav';

// Mock video data for TikTok/Reels style feed
const videoFeed = [
  { 
    id: 1, 
    influencer: {
      name: "Sarah Styles",
      handle: "@sarahstyles",
      avatar: "https://i.pravatar.cc/48?img=5",
      followers: "25K"
    },
    business: "Bella Vista Restaurant",
    videoUrl: "https://picsum.photos/seed/video-1/400/700",
    title: "Amazing dinner experience at Bella Vista! ✨",
    likes: 1800,
    comments: 89,
    shares: 23,
    views: "24.1K",
    isLiked: false
  },
  { 
    id: 2, 
    influencer: {
      name: "Foodie Guy",
      handle: "@foodieguy",
      avatar: "https://i.pravatar.cc/48?img=8",
      followers: "45K"
    },
    business: "Luxe Beauty Salon",
    videoUrl: "https://picsum.photos/seed/video-2/400/700",
    title: "Complete transformation at Luxe Beauty! 🔥",
    likes: 2100,
    comments: 156,
    shares: 45,
    views: "18.7K",
    isLiked: true
  },
  { 
    id: 3, 
    influencer: {
      name: "City Life",
      handle: "@citylife",
      avatar: "https://i.pravatar.cc/48?img=15",
      followers: "12K"
    },
    business: "Urban Threads",
    videoUrl: "https://picsum.photos/seed/video-3/400/700",
    title: "New outfit from Urban Threads - this style is everything! 💫",
    likes: 4200,
    comments: 234,
    shares: 89,
    views: "67.3K",
    isLiked: false
  },
  { 
    id: 4, 
    influencer: {
      name: "Fitness Queen",
      handle: "@fitnessqueen",
      avatar: "https://i.pravatar.cc/48?img=20",
      followers: "38K"
    },
    business: "FitLife Gym",
    videoUrl: "https://picsum.photos/seed/video-4/400/700",
    title: "Morning workout at FitLife Gym 💪",
    likes: 2800,
    comments: 178,
    shares: 67,
    views: "31.5K",
    isLiked: true
  }
];

export default function SearchPage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleLike = (videoId: number) => {
    setLikedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleScroll = (e: React.WheelEvent) => {
    if (isScrolling) return;
    
    setIsScrolling(true);
    const delta = e.deltaY;
    
    if (delta > 0 && currentVideoIndex < videoFeed.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    } else if (delta < 0 && currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
    }
    
    setTimeout(() => setIsScrolling(false), 500);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: currentVideoIndex * window.innerHeight,
        behavior: 'smooth'
      });
    }
  }, [currentVideoIndex]);

  return (
    <div className="min-h-screen bg-black pb-20 overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-6 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <Link href="/influencer/dashboard">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-arrow-left-line text-white text-xl"></i>
            </div>
          </Link>
          <div className="flex flex-col items-center">
            <h1 className="font-['Pacifico'] text-xl text-white mb-1">Inshaar</h1>
            <span className="text-white/80 text-xs">Discover</span>
          </div>
          <Link href="/help">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <i className="ri-question-line text-white text-xl"></i>
              </div>
          </Link>
        </div>
      </div>

      {/* Video Feed Container */}
      <div 
        ref={containerRef}
        className="relative h-screen overflow-y-scroll snap-y snap-mandatory"
        onWheel={handleScroll}
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {videoFeed.map((video, index) => (
          <div
            key={video.id}
            className="relative h-screen w-full snap-start flex items-center justify-center"
          >
            {/* Video/Image */}
            <div className="relative w-full h-full">
              <img
                src={video.videoUrl}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 pb-24">
                {/* Influencer Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={video.influencer.avatar}
                    alt={video.influencer.name}
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
            <div>
                    <h3 className="text-white font-bold text-lg">{video.influencer.name}</h3>
                    <p className="text-white/80 text-sm">{video.influencer.handle} • {video.influencer.followers} followers</p>
              </div>
            </div>

                {/* Video Title */}
                <p className="text-white text-base mb-4 font-medium">{video.title}</p>

                {/* Business Tag */}
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-4">
                  <i className="ri-store-line text-white"></i>
                  <span className="text-white text-sm font-medium">{video.business}</span>
                </div>
        </div>
        
              {/* Right Side Actions */}
              <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6">
            <button
                  onClick={() => handleLike(video.id)}
                  className="flex flex-col items-center space-y-1"
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    likedVideos.includes(video.id) ? 'bg-red-500' : 'bg-white/20 backdrop-blur-sm'
                  }`}>
                    <i className={`${likedVideos.includes(video.id) ? 'ri-heart-fill' : 'ri-heart-line'} text-white text-2xl`}></i>
                  </div>
                  <span className="text-white text-xs font-semibold">{video.likes}</span>
                </button>

                <button className="flex flex-col items-center space-y-1">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <i className="ri-chat-3-line text-white text-2xl"></i>
                  </div>
                  <span className="text-white text-xs font-semibold">{video.comments}</span>
            </button>

                <button className="flex flex-col items-center space-y-1">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <i className="ri-share-line text-white text-2xl"></i>
                  </div>
                  <span className="text-white text-xs font-semibold">{video.shares}</span>
                  </button>
              </div>
              
              {/* Views Counter */}
              <div className="absolute top-20 right-4">
                <div className="bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white text-xs font-medium">{video.views} views</span>
                </div>
              </div>
            </div>
        </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <AdvancedBottomNav userType="influencer" />
    </div>
  );
}
