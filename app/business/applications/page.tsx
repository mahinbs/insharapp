'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AdvancedBottomNav from '../../../components/AdvancedBottomNav';
import logo_dark from "../../../assetes/logo_dark.png";
import { acceptApplication, declineApplication } from '@/lib/supabase-business';
import { supabase } from '@/lib/supabase';
import { useBusinessData } from '@/contexts/BusinessDataContext';

const applications = [
  {
    id: 1,
    influencerName: "Emma Wilson",
    username: "@emmastyle",
    followers: "45K",
    engagement: "4.2%",
    niche: "Lifestyle",
    profileImage: "https://readdy.ai/api/search-image?query=Young%20female%20lifestyle%20influencer%2C%20professional%20headshot%2C%20confident%20smile%2C%20modern%20portrait%20photography%2C%20bright%20natural%20lighting%2C%20social%20media%20personality&width=60&height=60&seq=influencer3&orientation=squarish",
    offerTitle: "Free 3-Course Dinner",
    appliedDate: "2 days ago",
    status: "pending",
    message: "I love fine dining and would be thrilled to showcase your seasonal menu to my audience!"
  },
  {
    id: 2,
    influencerName: "Alex Chen",
    username: "@alexeats",
    followers: "32K",
    engagement: "5.1%",
    niche: "Food",
    profileImage: "https://readdy.ai/api/search-image?query=Young%20male%20food%20influencer%2C%20professional%20headshot%2C%20friendly%20expression%2C%20modern%20portrait%20photography%2C%20natural%20lighting%2C%20food%20blogger%20personality&width=60&height=60&seq=influencer4&orientation=squarish",
    offerTitle: "Weekend Brunch Package",
    appliedDate: "1 day ago",
    status: "pending",
    message: "Your brunch menu looks amazing! I specialize in food content and would love to collaborate."
  },
  {
    id: 3,
    influencerName: "Sofia Martinez",
    username: "@sofiastyle",
    followers: "28K",
    engagement: "3.8%",
    niche: "Lifestyle",
    profileImage: "https://readdy.ai/api/search-image?query=Young%20female%20lifestyle%20influencer%2C%20professional%20portrait%2C%20stylish%20appearance%2C%20modern%20photography%2C%20confident%20expression%2C%20social%20media%20content%20creator&width=60&height=60&seq=influencer5&orientation=squarish",
    offerTitle: "Free 3-Course Dinner",
    appliedDate: "3 days ago",
    status: "accepted",
    message: "Thank you for accepting! Looking forward to our collaboration."
  },
  {
    id: 4,
    influencerName: "Mike Johnson",
    username: "@mikeeats",
    followers: "18K",
    engagement: "4.5%",
    niche: "Food",
    profileImage: "https://readdy.ai/api/search-image?query=Young%20male%20food%20blogger%2C%20professional%20headshot%2C%20friendly%20smile%2C%20modern%20portrait%20photography%2C%20natural%20lighting%2C%20food%20content%20creator&width=60&height=60&seq=influencer6&orientation=squarish",
    offerTitle: "Weekend Brunch Package",
    appliedDate: "4 days ago",
    status: "declined",
    message: "Unfortunately, this doesn't align with our current brand direction."
  }
];

function BusinessApplicationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offerIdFilter = searchParams.get('offer');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const {
    applications,
    stats,
    applicationsLoading,
    statsLoading,
    refreshApplications,
    refreshStats,
    refreshCollaborations,
  } = useBusinessData();
  
  // Don't block on loading - show cached data immediately
  const loading = false;

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth');
          return;
        }

        // Load data - context handles caching
        await Promise.allSettled([
          refreshApplications(offerIdFilter ? { offerId: offerIdFilter } : undefined),
          refreshStats(),
        ]);
      } catch (error) {
        console.error('Error loading applications:', error);
      }
    };

    loadData();
  }, [router, offerIdFilter, refreshApplications, refreshStats]);

  // Transform applications to display format
  const transformedApplications = applications.map((app: any) => ({
    id: app.id,
    influencerName: app.influencer?.full_name || 'Influencer',
    username: app.influencer?.username || '@influencer',
    followers: app.influencer?.followers_count ? `${Math.floor(app.influencer.followers_count / 1000)}K` : '0K',
    engagement: app.influencer?.engagement_rate ? `${app.influencer.engagement_rate}%` : '0%',
    niche: app.influencer?.niche || 'General',
    profileImage: app.influencer?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.influencer?.full_name || 'Influencer')}&background=random&size=64`,
    offerTitle: app.offer?.title || 'Offer',
    appliedDate: app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'Recently',
    status: app.status || 'pending',
    message: app.message || 'No message provided',
    influencer: app.influencer, // Keep full influencer object for modal
  }));

  const filteredApplications = transformedApplications.filter(app => {
    if (activeFilter === 'all') return true;
    return app.status === activeFilter;
  });

  const handleAccept = async (id: string) => {
    try {
      // Check session before attempting to accept
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('You must be logged in to accept applications. Please log in and try again.');
        router.push('/auth');
        return;
      }

      const { data, error } = await acceptApplication(id);
      if (error) {
        console.error('Accept application error:', error);
        // Provide more helpful error messages
        if (error.message === 'Not authenticated') {
          alert('Your session has expired. Please log in again.');
          router.push('/auth');
        } else if (error.message?.includes('authorized') || error.message?.includes('permission')) {
          alert('You do not have permission to accept this application.');
        } else {
          alert('Failed to accept application: ' + (error.message || 'Unknown error'));
        }
        return;
      }
      
      // Refresh applications, stats, and collaborations to get updated data
      await Promise.allSettled([
        refreshApplications(offerIdFilter ? { offerId: offerIdFilter } : undefined),
        refreshStats(),
        refreshCollaborations(),
      ]);
      
      setSelectedApplication(null);
      
      // Move to accepted tab
      setActiveFilter('accepted');
      
      alert('Application accepted! Collaboration created.');
    } catch (err: any) {
      console.error('Error accepting application:', err);
      alert('Error: ' + (err.message || 'Failed to accept application. Please try again.'));
    }
  };

  const handleDecline = async (id: string) => {
    if (!confirm('Are you sure you want to decline this application?')) return;
    
    try {
      const { data, error } = await declineApplication(id);
      if (error) {
        alert('Failed to decline application: ' + error.message);
        return;
      }
      
      // Refresh applications and stats to get updated data
      await Promise.all([
        refreshApplications(offerIdFilter ? { offerId: offerIdFilter } : undefined),
        refreshStats(),
      ]);
      
      setSelectedApplication(null);
      
      // Move to declined tab
      setActiveFilter('declined');
      
      alert('Application declined.');
    } catch (err: any) {
      alert('Error: ' + (err.message || 'Failed to decline application'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/business/home">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-arrow-left-line text-white text-xl"></i>
            </div>
          </Link>
          <div className="flex flex-col items-center">
            <img 
              src={logo_dark.src}
              alt="Inshaar" 
              className="h-10 w-40 object-cover mb-1"
            />
            <span className="text-white/80 text-sm">
              {offerIdFilter ? 'Offer Applications' : 'Applications'}
            </span>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="text-white text-xl font-bold">{stats?.total_applications || 0}</div>
            <div className="text-white/80 text-xs">Total</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="text-white text-xl font-bold">{stats?.pending_applications || 0}</div>
            <div className="text-white/80 text-xs">Pending</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="text-white text-xl font-bold">{stats?.accepted_applications || 0}</div>
            <div className="text-white/80 text-xs">Accepted</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <div className="text-white text-xl font-bold">{(stats?.total_applications || 0) - (stats?.accepted_applications || 0) - (stats?.pending_applications || 0)}</div>
            <div className="text-white/80 text-xs">Declined</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeFilter === 'pending'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveFilter('accepted')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeFilter === 'accepted'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Accepted
          </button>
          <button
            onClick={() => setActiveFilter('declined')}
            className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeFilter === 'declined'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Declined
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="px-6 py-6">
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex items-start space-x-4">
                <img 
                  src={application.profileImage}
                  alt={application.influencerName}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(application.influencerName)}&background=random&size=64`;
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{application.influencerName}</h3>
                      <p className="text-purple-600 text-sm">{application.username}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        application.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        application.status === 'accepted' ? 'bg-green-100 text-green-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                      <span className="text-gray-500 text-sm">{application.appliedDate}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center">
                      <div className="font-semibold text-gray-800">{application.followers}</div>
                      <div className="text-gray-500 text-xs">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-800">{application.engagement}</div>
                      <div className="text-gray-500 text-xs">Engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-800">{application.niche}</div>
                      <div className="text-gray-500 text-xs">Niche</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">Applied for: <span className="font-medium">{application.offerTitle}</span></p>
                  {application.message && (
                    <p className="text-gray-600 text-sm mb-4 italic">"{application.message}"</p>
                  )}
                  
                  {application.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedApplication(application)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                      >
                        <i className="ri-user-line"></i>
                        <span>View Profile</span>
                      </button>
                      <button 
                        onClick={() => handleDecline(application.id)}
                        className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center justify-center space-x-1"
                      >
                        <i className="ri-close-line"></i>
                        <span>Decline</span>
                      </button>
                      <button 
                        onClick={() => handleAccept(application.id)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1"
                      >
                        <i className="ri-check-line"></i>
                        <span>Accept</span>
                      </button>
                    </div>
                  )}

                  {application.status === 'accepted' && (
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-100 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1">
                        <i className="ri-message-line"></i>
                        <span>Message</span>
                      </button>
                      <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-1">
                        <i className="ri-calendar-line"></i>
                        <span>Schedule</span>
                      </button>
                    </div>
                  )}

                  {application.status === 'declined' && (
                    <div className="text-center">
                      <span className="text-gray-500 text-sm">Application declined</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <i className="ri-user-star-line text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Applications Found</h3>
            <p className="text-gray-500">Applications will appear here when influencers apply to your offers</p>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Influencer Profile</h3>
              <button
                onClick={() => setSelectedApplication(null)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>
            
            <div className="text-center mb-6">
              <img 
                src={selectedApplication.influencer?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedApplication.influencer?.full_name || 'Influencer')}&background=random&size=80`}
                alt={selectedApplication.influencer?.full_name}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
              />
              <h4 className="font-bold text-lg text-gray-800">{selectedApplication.influencer?.full_name || 'Influencer'}</h4>
              <p className="text-purple-600">{selectedApplication.influencer?.username || '@influencer'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{selectedApplication.influencer?.followers_count ? `${Math.floor(selectedApplication.influencer.followers_count / 1000)}K` : '0K'}</div>
                <div className="text-gray-500 text-sm">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{selectedApplication.influencer?.engagement_rate ? `${selectedApplication.influencer.engagement_rate}%` : '0%'}</div>
                <div className="text-gray-500 text-sm">Engagement</div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href={`/profile/${selectedApplication.influencer?.id || selectedApplication.id}`}
                className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-center hover:bg-gray-200 transition-colors"
              >
                View Full Profile
              </Link>
              {selectedApplication.status === 'pending' && (
                <>
                  <button
                    onClick={async () => {
                      try {
                        await handleAccept(selectedApplication.id);
                      } catch (err) {
                        console.error('Error in accept handler:', err);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Accept Application
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await handleDecline(selectedApplication.id);
                      } catch (err) {
                        console.error('Error in decline handler:', err);
                      }
                    }}
                    className="w-full bg-red-100 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-200 transition-colors"
                  >
                    Decline Application
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Advanced Bottom Navigation */}
      <AdvancedBottomNav userType="business" />
    </div>
  );
}

export default function BusinessApplications() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    }>
      <BusinessApplicationsContent />
    </Suspense>
  );
}