'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdvancedBottomNav from '../../components/AdvancedBottomNav';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Sarah Johnson',
    username: '@sarahstyles',
    bio: 'Lifestyle & Fashion Influencer | Creating content that inspires | Collaborating with amazing brands',
    followers: '25.2K',
    following: '1.8K',
    posts: '342',
    location: 'Los Angeles, CA',
    website: 'www.sarahstyles.com',
    tiktok: '@sarahstyles',
    instagram: '@sarahstyles'
  });

  const achievements = [
    { icon: 'ri-trophy-line', title: 'Top Collaborator', description: '50+ successful partnerships' },
    { icon: 'ri-star-line', title: '5-Star Rating', description: 'Excellent collaboration reviews' },
    { icon: 'ri-heart-line', title: 'Community Favorite', description: 'Loved by 10K+ followers' },
    { icon: 'ri-award-line', title: 'Verified Creator', description: 'Authentic content creator' }
  ];

  const recentCollaborations = [
    {
      id: 1,
      businessName: 'Bella Vista Restaurant',
      image: 'https://readdy.ai/api/search-image?query=Elegant%20restaurant%20interior%2C%20fine%20dining%20atmosphere%2C%20warm%20lighting%2C%20professional%20restaurant%20photography%2C%20luxury%20dining%20experience%2C%20modern%20restaurant%20design&width=80&height=80&seq=resto2&orientation=squarish',
      rating: 5,
      date: '2 weeks ago'
    },
    {
      id: 2,
      businessName: 'Urban Threads',
      image: 'https://readdy.ai/api/search-image?query=Modern%20fashion%20boutique%20storefront%2C%20trendy%20clothing%20store%2C%20stylish%20retail%20space%2C%20contemporary%20fashion%20display%2C%20urban%20fashion%20brand&width=80&height=80&seq=fashion2&orientation=squarish',
      rating: 5,
      date: '1 month ago'
    },
    {
      id: 3,
      businessName: 'Luxe Beauty Salon',
      image: 'https://readdy.ai/api/search-image?query=Luxury%20beauty%20salon%20interior%2C%20elegant%20spa%20environment%2C%20professional%20beauty%20services%2C%20modern%20salon%20design%2C%20premium%20wellness%20space&width=80&height=80&seq=salon2&orientation=squarish',
      rating: 4,
      date: '2 months ago'
    }
  ];

  const portfolioItems = [
    {
      id: 1,
      type: 'video',
      title: 'Bella Vista Restaurant Collaboration',
      business: 'Bella Vista Restaurant',
      thumbnail: 'https://readdy.ai/api/search-image?query=Food%20influencer%20video%20thumbnail%2C%20restaurant%20review%2C%20fine%20dining%20content%2C%20professional%20food%20photography%2C%20elegant%20restaurant%20atmosphere&width=300&height=200&seq=video1&orientation=landscape',
      duration: '2:34',
      views: '12.5K',
      likes: '1.2K',
      date: '2 weeks ago',
      platform: 'Instagram Reels',
      isCollaboration: true
    },
    {
      id: 2,
      type: 'video',
      title: 'Urban Threads Fashion Haul',
      business: 'Urban Threads',
      thumbnail: 'https://readdy.ai/api/search-image?query=Fashion%20influencer%20video%20thumbnail%2C%20clothing%20haul%2C%20style%20content%2C%20fashion%20boutique%20collaboration%2C%20trendy%20outfit%20showcase&width=300&height=200&seq=video2&orientation=landscape',
      duration: '3:12',
      views: '8.7K',
      likes: '890',
      date: '1 month ago',
      platform: 'TikTok',
      isCollaboration: true
    },
    {
      id: 3,
      type: 'video',
      title: 'Luxe Beauty Salon Makeover',
      business: 'Luxe Beauty Salon',
      thumbnail: 'https://readdy.ai/api/search-image?query=Beauty%20influencer%20video%20thumbnail%2C%20salon%20makeover%2C%20beauty%20transformation%2C%20professional%20styling%2C%20luxury%20beauty%20services&width=300&height=200&seq=video3&orientation=landscape',
      duration: '4:56',
      views: '15.2K',
      likes: '2.1K',
      date: '2 months ago',
      platform: 'Instagram Reels',
      isCollaboration: true
    },
    {
      id: 4,
      type: 'video',
      title: 'Morning Routine Vlog',
      business: null,
      thumbnail: 'https://readdy.ai/api/search-image?query=Lifestyle%20influencer%20video%20thumbnail%2C%20morning%20routine%2C%20personal%20vlog%2C%20daily%20lifestyle%20content%2C%20authentic%20influencer%20life&width=300&height=200&seq=video4&orientation=landscape',
      duration: '5:23',
      views: '6.8K',
      likes: '456',
      date: '3 weeks ago',
      platform: 'YouTube',
      isCollaboration: false
    },
    {
      id: 5,
      type: 'image',
      title: 'Fashion OOTD',
      business: null,
      thumbnail: 'https://readdy.ai/api/search-image?query=Fashion%20influencer%20photo%2C%20outfit%20of%20the%20day%2C%20style%20post%2C%20fashion%20photography%2C%20lifestyle%20content&width=300&height=300&seq=image1&orientation=squarish',
      duration: null,
      views: '4.2K',
      likes: '234',
      date: '1 week ago',
      platform: 'Instagram',
      isCollaboration: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/influencer/dashboard">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-arrow-left-line text-white text-xl"></i>
            </div>
          </Link>
          <h1 className="text-white font-semibold text-lg">Profile</h1>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <i className={`${isEditing ? 'ri-close-line' : 'ri-edit-line'} text-white text-xl`}></i>
          </button>
        </div>

        {/* Profile Header */}
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <img 
              src="https://readdy.ai/api/search-image?query=Young%20female%20lifestyle%20influencer%2C%20professional%20headshot%2C%20confident%20smile%2C%20modern%20portrait%20photography%2C%20bright%20natural%20lighting%2C%20social%20media%20personality%2C%20fashion%20blogger&width=120&height=120&seq=profile2&orientation=squarish"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white/30"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                <i className="ri-camera-line text-gray-600"></i>
              </button>
            )}
          </div>
          
          <h2 className="text-white text-2xl font-bold mb-1">{profileData.name}</h2>
          <p className="text-white/80 mb-4">{profileData.username}</p>
          
          {/* Stats */}
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-white text-xl font-bold">{profileData.followers}</div>
              <div className="text-white/80 text-sm">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-white text-xl font-bold">{profileData.following}</div>
              <div className="text-white/80 text-sm">Following</div>
            </div>
            <div className="text-center">
              <div className="text-white text-xl font-bold">{profileData.posts}</div>
              <div className="text-white/80 text-sm">Posts</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Bio Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">About</h3>
            {isEditing && (
              <button className="text-purple-600 text-sm font-medium">Edit</button>
            )}
          </div>
          <p className="text-gray-600 leading-relaxed">{profileData.bio}</p>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Social Media</h3>
            {isEditing && (
              <button className="text-purple-600 text-sm font-medium">Edit</button>
            )}
          </div>
          
          <div className="space-y-4">
            <a 
              href={`https://www.tiktok.com/${profileData.tiktok.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl hover:from-pink-100 hover:to-purple-100 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <i className="ri-tiktok-line text-white text-xl"></i>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{profileData.tiktok}</p>
                <p className="text-gray-500 text-sm">TikTok Profile</p>
              </div>
              <i className="ri-external-link-line text-gray-400 group-hover:text-purple-500 transition-colors"></i>
            </a>
            
            <a 
              href={`https://www.instagram.com/${profileData.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-3 bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl hover:from-pink-100 hover:to-orange-100 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <i className="ri-instagram-line text-white text-xl"></i>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{profileData.instagram}</p>
                <p className="text-gray-500 text-sm">Instagram Profile</p>
              </div>
              <i className="ri-external-link-line text-gray-400 group-hover:text-pink-500 transition-colors"></i>
            </a>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <i className="ri-map-pin-line text-gray-600"></i>
              </div>
              <div>
                <p className="text-gray-800 font-medium">{profileData.location}</p>
                <p className="text-gray-500 text-sm">Location</p>
              </div>
            </div>
            
            <a 
              href={`https://${profileData.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <i className="ri-global-line text-white text-xl"></i>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{profileData.website}</p>
                <p className="text-gray-500 text-sm">Website</p>
              </div>
              <i className="ri-external-link-line text-gray-400 group-hover:text-blue-500 transition-colors"></i>
            </a>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Portfolio</h3>
            <div className="flex items-center space-x-2">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-1">
                <i className="ri-upload-line"></i>
                <span>Upload</span>
              </button>
              <button className="text-purple-600 text-sm font-medium">Manage</button>
            </div>
          </div>

          {/* Portfolio Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{portfolioItems.length}</div>
              <div className="text-gray-500 text-sm">Total Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">
                {portfolioItems.filter(item => item.isCollaboration).length}
              </div>
              <div className="text-gray-500 text-sm">Collaborations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {portfolioItems.reduce((sum, item) => sum + parseFloat(item.views.replace('K', '')), 0).toFixed(1)}K
              </div>
              <div className="text-gray-500 text-sm">Total Views</div>
            </div>
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-2 gap-4">
            {portfolioItems.map((item) => (
              <div key={item.id} className="relative group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl bg-gray-100">
                  <img 
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Video Duration */}
                  {item.type === 'video' && item.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {item.duration}
                    </div>
                  )}
                  
                  {/* Platform Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.platform === 'Instagram' || item.platform === 'Instagram Reels' 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                        : item.platform === 'TikTok'
                        ? 'bg-black text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {item.platform}
                    </span>
                  </div>
                  
                  {/* Collaboration Badge */}
                  {item.isCollaboration && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <i className="ri-handshake-line text-white text-xs"></i>
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center text-white">
                      <i className="ri-play-circle-line text-3xl mb-2"></i>
                      <p className="text-sm font-medium">View Content</p>
                    </div>
                  </div>
                </div>
                
                {/* Content Info */}
                <div className="mt-2">
                  <h4 className="font-medium text-gray-800 text-sm mb-1 line-clamp-1">{item.title}</h4>
                  {item.business && (
                    <p className="text-purple-600 text-xs mb-1">with {item.business}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1">
                        <i className="ri-eye-line"></i>
                        <span>{item.views}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <i className="ri-heart-line"></i>
                        <span>{item.likes}</span>
                      </span>
                    </div>
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Area (when no content) */}
          {portfolioItems.length === 0 && (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <i className="ri-video-add-line text-4xl text-gray-400 mb-4"></i>
              <h4 className="text-lg font-semibold text-gray-600 mb-2">No Content Yet</h4>
              <p className="text-gray-500 mb-4">Upload your first video or image to showcase your work</p>
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                Upload Content
              </button>
            </div>
          )}

          {/* View All Button */}
          {portfolioItems.length > 0 && (
            <div className="text-center mt-6">
              <button className="text-purple-600 font-medium text-sm hover:text-purple-700 transition-colors">
                View All Portfolio Items →
              </button>
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievements</h3>
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className={`${achievement.icon} text-white text-xl`}></i>
                </div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">{achievement.title}</h4>
                <p className="text-gray-600 text-xs">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Collaborations */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Collaborations</h3>
            <Link href="/collaborations">
              <button className="text-purple-600 text-sm font-medium">View All</button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentCollaborations.map((collab) => (
              <div key={collab.id} className="flex items-center space-x-4">
                <img 
                  src={collab.image}
                  alt={collab.businessName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{collab.businessName}</h4>
                  <p className="text-gray-500 text-sm">{collab.date}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(collab.rating)].map((_, i) => (
                    <i key={i} className="ri-star-fill text-yellow-400 text-sm"></i>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <i className="ri-notification-line text-gray-600"></i>
                <span className="text-gray-800">Notifications</span>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </button>
            
            <button className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <i className="ri-shield-line text-gray-600"></i>
                <span className="text-gray-800">Privacy</span>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </button>
            
            <button className="w-full flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <i className="ri-question-line text-gray-600"></i>
                <span className="text-gray-800">Help & Support</span>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400"></i>
            </button>
            
            <button className="w-full flex items-center justify-between py-3 px-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
              <div className="flex items-center space-x-3">
                <i className="ri-logout-box-line text-red-600"></i>
                <span className="text-red-600">Sign Out</span>
              </div>
              <i className="ri-arrow-right-s-line text-red-400"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Bottom Navigation */}
      <AdvancedBottomNav userType="influencer" />
    </div>
  );
}