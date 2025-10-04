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
    email: 'sarah@example.com',
    phone: '+1 (555) 123-4567',
    location: 'Los Angeles, CA',
    website: 'www.sarahstyles.com'
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

        {/* Contact Information */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
            {isEditing && (
              <button className="text-purple-600 text-sm font-medium">Edit</button>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="ri-mail-line text-gray-600"></i>
              </div>
              <div>
                <p className="text-gray-800 font-medium">{profileData.email}</p>
                <p className="text-gray-500 text-sm">Email</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="ri-phone-line text-gray-600"></i>
              </div>
              <div>
                <p className="text-gray-800 font-medium">{profileData.phone}</p>
                <p className="text-gray-500 text-sm">Phone</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="ri-map-pin-line text-gray-600"></i>
              </div>
              <div>
                <p className="text-gray-800 font-medium">{profileData.location}</p>
                <p className="text-gray-500 text-sm">Location</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="ri-global-line text-gray-600"></i>
              </div>
              <div>
                <p className="text-gray-800 font-medium">{profileData.website}</p>
                <p className="text-gray-500 text-sm">Website</p>
              </div>
            </div>
          </div>
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