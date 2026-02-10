'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import logo_dark from '@/assetes/logo_dark.png';
import AdvancedBottomNav from '../../../components/AdvancedBottomNav';
import { useRouter } from 'next/navigation';
import { updateProfile } from '@/lib/supabase-profile';
import { updateBusinessProfileData, createBusinessEstablishment } from '@/lib/supabase-business';
import { supabase } from '@/lib/supabase';
import { uploadImage, uploadVideo } from '@/lib/supabase-examples';
import { useBusinessData } from '@/contexts/BusinessDataContext';

type SectionId =
  | 'information'
  | 'content'
  | 'gallery'
  | 'location'
  | 'timing'
  | 'establishment'
  | 'statistics';

const sectionOrder: SectionId[] = [
  'information',
  'content',
  'gallery',
  'location',
  'timing',
  'establishment',
  'statistics',
];

export default function BusinessProfile() {
  const router = useRouter();
  const {
    profile: profileData,
    stats,
    establishments,
    weeklyReservations,
    profileLoading,
    statsLoading,
    establishmentsLoading,
    weeklyReservationsLoading,
    refreshEstablishments,
    refreshWeeklyReservations,
    refreshStats,
    refreshProfile,
  } = useBusinessData();
  
  // Don't block on loading - show cached data immediately
  // Only show loading spinner if we have no data at all
  const loading = !profileData && profileLoading;

  const [activeTab, setActiveTab] = useState<SectionId>('information');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showAddModal, setShowAddModal] = useState<{ type: string; section: SectionId } | null>(null);
  const sectionsRef = useRef<Record<SectionId, HTMLDivElement | null>>({
    information: null,
    content: null,
    gallery: null,
    location: null,
    timing: null,
    establishment: null,
    statistics: null,
  });
  const observerRef = useRef<IntersectionObserver | null>(null);

  const tabs = useMemo(
    () => [
      { id: 'information', label: 'Information' },
      { id: 'content', label: 'Content' },
      { id: 'gallery', label: 'Gallery' },
      { id: 'location', label: 'Location' },
      { id: 'timing', label: 'Timing' },
      { id: 'establishment', label: 'Establishment' },
      { id: 'statistics', label: 'Statistics' },
    ],
    []
  );

  // Load data that might not be in cache yet - don't block rendering
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/auth');
          return;
        }

        // Load data in parallel - context will handle caching
        // Use allSettled to not block if one fails
        Promise.allSettled([
          refreshEstablishments(),
          refreshWeeklyReservations(),
          refreshStats(),
        ]).catch((error) => {
          // Ignore AbortError - it's expected when component unmounts
          if (error?.name !== 'AbortError' && !error?.message?.includes('aborted')) {
            console.error('Error loading profile data:', error);
          }
        });
      } catch (error: any) {
        // Ignore AbortError - it's expected when component unmounts
        if (error?.name !== 'AbortError' && !error?.message?.includes('aborted')) {
          console.error('Error loading profile data:', error);
        }
      }
    };

    if (isMounted) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [router, refreshEstablishments, refreshWeeklyReservations, refreshStats]);

  // Handle hash navigation to statistics tab
  useEffect(() => {
    if (typeof window !== 'undefined' && !loading && profileData) {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'statistics') {
        // Wait for sections to be registered
        const checkSection = () => {
          if (sectionsRef.current.statistics) {
            sectionsRef.current.statistics.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveTab('statistics');
          } else {
            setTimeout(checkSection, 100);
          }
        };
        setTimeout(checkSection, 300);
      }
    }
  }, [loading, profileData]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => sectionOrder.indexOf(a.target.id as SectionId) - sectionOrder.indexOf(b.target.id as SectionId));
        if (visible[0]) {
          const visibleId = visible[0].target.id as SectionId;
          setActiveTab(visibleId);
        }
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0.2,
      }
    );

    sectionOrder.forEach((id) => {
      const section = sectionsRef.current[id];
      if (section) {
        observerRef.current?.observe(section);
      }
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const registerSectionRef = (id: SectionId) => (el: HTMLDivElement | null) => {
    sectionsRef.current[id] = el;
  };

  const sectionClasses =
    'rounded-3xl bg-white/90 backdrop-blur px-5 py-6 shadow-lg border border-white/60';

  // Use real data or fallback
  const businessInfo = {
    name: profileData?.business_name || "Your Business",
    location: profileData?.business_location || "Location",
    rating: 0, // Rating not stored in profile, can be calculated from stats if needed
    totalReservations: stats?.total_collaborations || 0,
    acceptedReservations: stats?.accepted_applications || 0,
    rejectedReservations: (stats?.total_applications || 0) - (stats?.accepted_applications || 0),
    weeklyReservations: stats?.upcoming_collaborations || 0,
  };

  // Calculate percentages safely to avoid NaN
  const totalReservations = businessInfo.totalReservations || 0;
  const acceptedReservations = businessInfo.acceptedReservations || 0;
  const rejectedReservations = businessInfo.rejectedReservations || 0;
  const acceptanceRate = totalReservations > 0 
    ? (acceptedReservations / totalReservations) 
    : 0;
  const rejectionRate = totalReservations > 0 
    ? (rejectedReservations / totalReservations) 
    : 0;
  
  const circumference = 2 * Math.PI * 140;
  const acceptedOffset = totalReservations > 0 
    ? circumference * (1 - acceptanceRate)
    : circumference;
  const rejectedOffset = totalReservations > 0
    ? circumference * (1 - acceptanceRate) + circumference * rejectionRate
    : circumference;

  // Get gallery, videos, and content from metadata (safe parsing)
  const safeParseMetadata = (data: any) => {
    if (!data) return {};
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return {};
      }
    }
    return data || {};
  };

  const metadata = safeParseMetadata(profileData?.metadata);
  const carouselImages = metadata.carousel_images || [];
  const galleryItems = metadata.gallery_images || [];
  const videoShowcase = metadata.videos || [];
  const contentHighlights = metadata.content_highlights || [];

  // Social links from profile
  const socialLinks = [
    profileData?.business_website && { id: 'website', icon: 'ri-earth-line', label: profileData.business_website, href: profileData.business_website },
    profileData?.business_instagram && { id: 'instagram', icon: 'ri-instagram-line', label: profileData.business_instagram, href: `https://instagram.com/${profileData.business_instagram.replace('@', '')}` },
    profileData?.business_tiktok && { id: 'tiktok', icon: 'ri-tiktok-fill', label: profileData.business_tiktok, href: `https://tiktok.com/@${profileData.business_tiktok.replace('@', '')}` },
  ].filter(Boolean) as any[];

  // Weekly timings from establishment or default (safe parsing)
  const safeParseTimings = (timings: any) => {
    if (!timings) return null;
    if (typeof timings === 'string') {
      try {
        return JSON.parse(timings);
      } catch {
        return null;
      }
    }
    return timings;
  };

  const establishmentTimings = safeParseTimings((establishments || [])[0]?.weekly_timings);
  const weeklyTimings = establishmentTimings ? 
    Object.entries(establishmentTimings).map(([day, value]) => ({ day, value: value as string })) :
    [
      { day: 'Monday', value: '09:00 - 20:30' },
      { day: 'Tuesday', value: '09:00 - 20:30' },
      { day: 'Wednesday', value: '09:00 - 20:30' },
      { day: 'Thursday', value: '09:00 - 22:00' },
      { day: 'Friday', value: '09:00 - 22:00' },
      { day: 'Saturday', value: '10:00 - 23:00' },
      { day: 'Sunday', value: 'Closed' },
    ];

  // Transform establishments data
  const transformedEstablishments = (establishments || []).length > 0 
    ? (establishments || []).map(est => ({
        id: est.id,
        title: est.title || `${businessInfo.name} • ${est.city || 'Location'}`,
        address: est.address,
        contact: est.phone || 'N/A',
      }))
    : [];

  const handleTabClick = (id: SectionId) => {
    const section = sectionsRef.current[id];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveTab(id);
  };

  // Only show loading if we have absolutely no profile data
  // Otherwise show the page with cached data and let it update in background
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }
  
  // If no profile data but not loading, show empty state or redirect
  if (!profileData && !profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No profile data available</p>
          <button
            onClick={() => router.push('/auth')}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-xl"
          >
            Go to Auth
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 pb-28">
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white px-5 pt-6 pb-7 sticky top-0 z-50 shadow-lg">
      <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {profileData?.business_logo ? (
              <img
                src={profileData.business_logo}
                className="w-12 h-12 rounded-2xl bg-white/20 p-2 object-cover"
                alt={businessInfo.name}
              />
            ) : (
              <img
                src={logo_dark.src}
                className="w-12 h-12 rounded-2xl bg-white/20 p-2 object-contain"
                alt="Inshaar"
              />
            )}
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/80">Business Suite</p>
              <h2 className="text-xl font-semibold">{businessInfo.name}</h2>
            </div>
          </div>
            <div className="flex items-center space-x-3">
              <button className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur">
                <i className="ri-notification-line text-xl"></i>
              </button>
              <button onClick={() => router.push("/settings")} className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur">
                <i className="ri-settings-3-line text-xl"></i>
              </button>
            </div>
          </div>
        <div className="flex items-center justify-between mt-4 text-xs sm:text-sm text-white/80">
          <div className="flex items-center space-x-2">
            <i className="ri-map-pin-line text-white"></i>
            <span>{businessInfo.location}</span>
        </div>
          <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-semibold">
            {profileData?.business_category || 'Business Partner'}
              </span>
            </div>
            </div>

      <div className="relative w-full h-[260px] overflow-hidden bg-gray-200">
        {carouselImages.length > 0 ? (
          <>
        <img
              src={carouselImages[carouselIndex] || carouselImages[0]}
          className="w-full h-full object-cover transition-all duration-500"
              alt="Business hero carousel"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-white/80">{businessInfo.location}</p>
              <h2 className="text-2xl font-semibold">{businessInfo.name}</h2>
              <p className="text-sm opacity-80">{profileData?.business_description || 'Your business description'}</p>
        </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
            <i className="ri-image-add-line text-6xl text-gray-400 mb-4"></i>
            <p className="text-gray-600 mb-2">No carousel images</p>
            <button
              onClick={() => setShowAddModal({ type: 'carousel', section: 'information' })}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <i className="ri-add-line mr-2"></i>Add Images
            </button>
          </div>
        )}
      </div>

      {carouselImages.length > 0 && (
      <div className="flex justify-center space-x-2 mt-2">
        {carouselImages.map((_: any, idx: number) => (
          <button
            key={idx}
            onClick={() => setCarouselIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition ${
              carouselIndex === idx ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-slate-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          ></button>
        ))}
      </div>
      )}

      <div className="mt-6 px-4 sticky top-[140px] z-40">
        <div className="flex rounded-3xl bg-white p-1 shadow-inner overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id as SectionId)}
              className={`flex-1 whitespace-nowrap rounded-2xl py-3 px-2 text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white shadow-lg'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-5 space-y-4">
        <section id="information" ref={registerSectionRef('information')} className={sectionClasses}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Information</p>
              <h3 className="text-xl font-semibold text-slate-900">About {businessInfo.name}</h3>
            </div>
            <span className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-medium px-3 py-1">
              Open
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-6">
            {profileData?.business_description || 'Add your business description to tell customers about your services and what makes you unique.'}
          </p>
          {!profileData?.business_description && (
            <button
              onClick={() => setShowAddModal({ type: 'description', section: 'information' })}
              className="mt-3 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center"
            >
              <i className="ri-add-line mr-2"></i>Add Description
            </button>
          )}
          <div className="mt-5 grid gap-3">
            {socialLinks.length > 0 ? (
              socialLinks.map((item: any) => (
              <a
                href={item.href}
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-white/40 px-4 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white"
                target="_blank"
                  rel="noopener noreferrer"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-2xl bg-white/20 text-white flex items-center justify-center">
                    <i className={`${item.icon} text-lg`}></i>
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <i className="ri-arrow-right-up-line text-xs text-white/80"></i>
              </a>
              ))
            ) : (
              <button
                onClick={() => setShowAddModal({ type: 'social', section: 'information' })}
                className="flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 px-4 py-6 bg-gray-50 hover:bg-gray-100 transition-all"
              >
                <i className="ri-add-line text-2xl text-gray-400 mr-2"></i>
                <span className="text-sm font-medium text-gray-600">Add Social Links</span>
              </button>
            )}
          </div>
        </section>

        <section id="content" ref={registerSectionRef('content')} className={sectionClasses}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Content</p>
              <h3 className="text-xl font-semibold text-slate-900">Signature Rituals</h3>
            </div>
            <button
              onClick={() => setShowAddModal({ type: 'content', section: 'content' })}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            >
              <i className="ri-add-line"></i>
            </button>
          </div>
          {contentHighlights.length > 0 ? (
            <div className="grid gap-4">
              {contentHighlights.map((item: any, idx: number) => (
                <div key={idx} className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900">{item.title || 'Content Title'}</h4>
                  <p className="text-xs text-gray-500 mt-1">{item.description || 'Content description'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
              <i className="ri-file-text-line text-4xl text-gray-400 mb-2"></i>
              <p className="text-gray-600 text-sm mb-3">No content highlights yet</p>
              <button
                onClick={() => setShowAddModal({ type: 'content', section: 'content' })}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
              >
                <i className="ri-add-line mr-2"></i>Add Content
              </button>
            </div>
          )}
        </section>

        <section id="gallery" ref={registerSectionRef('gallery')} className={sectionClasses}>
          <div className="flex items-center justify-between mb-4">
            <div>
          <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Gallery</p>
              <h3 className="text-xl font-semibold text-slate-900">Visual Moodboard</h3>
            </div>
            <button
              onClick={() => setShowAddModal({ type: 'gallery', section: 'gallery' })}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            >
              <i className="ri-add-line"></i>
            </button>
          </div>
          {galleryItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {galleryItems.map((src: any, idx: number) => (
                <div key={idx} className="relative group">
              <img
                src={src}
                className="w-full h-36 object-cover rounded-2xl ring-1 ring-black/5"
                alt={`Gallery item ${idx + 1}`}
              />
                  <button
                    onClick={() => {
                      const newGallery = galleryItems.filter((_: any, i: number) => i !== idx);
                      updateBusinessProfileData({ gallery_images: newGallery });
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <i className="ri-close-line text-xs"></i>
                  </button>
                </div>
            ))}
          </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
              <i className="ri-image-line text-4xl text-gray-400 mb-2"></i>
              <p className="text-gray-600 text-sm mb-3">No gallery images yet</p>
              <button
                onClick={() => setShowAddModal({ type: 'gallery', section: 'gallery' })}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
              >
                <i className="ri-add-line mr-2"></i>Add Images
              </button>
            </div>
          )}
          {videoShowcase.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-800">Videos</h4>
                <button
                  onClick={() => setShowAddModal({ type: 'video', section: 'gallery' })}
                  className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center text-xs"
                >
                  <i className="ri-add-line"></i>
                </button>
              </div>
              <div className="grid gap-4">
            {videoShowcase.map((video: any, idx: number) => (
                  <div key={idx} className="aspect-video rounded-2xl overflow-hidden border border-slate-100 relative group">
                <iframe
                  src={video}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                      title={`Business video ${idx + 1}`}
                ></iframe>
                    <button
                      onClick={() => {
                        const newVideos = videoShowcase.filter((_: any, i: number) => i !== idx);
                        updateBusinessProfileData({ videos: newVideos });
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="ri-close-line text-xs"></i>
                    </button>
              </div>
            ))}
          </div>
            </div>
          )}
          {videoShowcase.length === 0 && (
            <div className="mt-4 text-center py-6 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
              <i className="ri-video-line text-3xl text-gray-400 mb-2"></i>
              <p className="text-gray-600 text-xs mb-2">No videos yet</p>
              <button
                onClick={() => setShowAddModal({ type: 'video', section: 'gallery' })}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-xl font-semibold text-xs shadow-md hover:shadow-lg transition-all"
              >
                <i className="ri-add-line mr-1"></i>Add Video
              </button>
            </div>
          )}
        </section>

        <section id="location" ref={registerSectionRef('location')} className={sectionClasses}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Location</p>
              <h3 className="text-xl font-semibold text-slate-900">Find Us on Maps</h3>
            </div>
            {(!profileData?.business_address || !profileData?.business_location) && (
              <button
                onClick={() => setShowAddModal({ type: 'location', section: 'location' })}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
              >
                <i className="ri-add-line"></i>
              </button>
            )}
          </div>
          {profileData?.business_address || profileData?.business_location ? (
            <>
              <div className="rounded-2xl overflow-hidden ring-1 ring-black/5 bg-gray-100 relative">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dS6gaYo8eAiFeI&q=${encodeURIComponent(profileData.business_address || profileData.business_location || '')}`}
                  width="100%"
                  height="240"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ border: 0 }}
                  title="Business Location Map"
                ></iframe>
                {/* Fallback link if map doesn't load */}
                <div className="absolute bottom-2 right-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(profileData.business_address || profileData.business_location || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-white/90 backdrop-blur px-2 py-1 rounded text-blue-600 hover:text-blue-800"
                  >
                    Open in Maps
                  </a>
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">{profileData.business_address || 'Address'}</p>
                <p>{profileData.business_location || 'Location'}</p>
              </div>
            </>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
              <i className="ri-map-pin-line text-4xl text-gray-400 mb-2"></i>
              <p className="text-gray-600 text-sm mb-3">No location added yet</p>
              <button
                onClick={() => setShowAddModal({ type: 'location', section: 'location' })}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all"
              >
                <i className="ri-add-line mr-2"></i>Add Location
              </button>
            </div>
          )}
        </section>

        <section id="timing" ref={registerSectionRef('timing')} className={sectionClasses}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Timing</p>
              <h3 className="text-xl font-semibold text-slate-900">Weekly Schedule</h3>
            </div>
            <button
              onClick={() => setShowAddModal({ type: 'timing', section: 'timing' })}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            >
              <i className="ri-add-line"></i>
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {weeklyTimings.map((slot: any) => (
              <div key={slot.day} className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-slate-700">{slot.day}</span>
                <span className="text-sm text-slate-500">{slot.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="establishment" ref={registerSectionRef('establishment')} className={sectionClasses}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Establishment</p>
              <h3 className="text-xl font-semibold text-slate-900">Other Locations</h3>
            </div>
            <button
              onClick={() => setShowAddModal({ type: 'establishment', section: 'establishment' })}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            >
              <i className="ri-add-line"></i>
            </button>
          </div>
          <div className="space-y-3">
            {transformedEstablishments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="ri-store-line text-4xl mb-2"></i>
                <p className="text-sm mb-4">No establishments added yet</p>
                <button
                  onClick={() => setShowAddModal({ type: 'establishment', section: 'establishment' })}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center mx-auto"
                >
                  <i className="ri-add-line mr-2"></i>Add Establishment
                </button>
              </div>
            ) : (
              transformedEstablishments.map((loc: any) => (
              <div key={loc.id} className="p-4 rounded-2xl border border-white/60 bg-gradient-to-r from-white to-pink-50 relative group">
                <button
                  onClick={() => setShowAddModal({ type: 'establishment', section: 'establishment' })}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  title="Edit Establishment"
                >
                  <i className="ri-edit-line"></i>
                </button>
                <h4 className="text-sm font-semibold text-gray-900 pr-8">{loc.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{loc.address}</p>
                <p className="text-xs text-gray-500 mt-1">Call: {loc.contact}</p>
              </div>
              ))
            )}
          </div>
        </section>

        <section id="statistics" ref={registerSectionRef('statistics')} className={sectionClasses}>
          <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Statistics</p>
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Daily Statistics Analysis</h3>
          
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-6">
            {/* Main Pie Chart */}
            <div className="flex-shrink-0">
              <div className="relative w-80 h-80">
                <svg className="transform -rotate-90 w-80 h-80">
                  <circle
                    cx="160"
                    cy="160"
                    r="140"
                    stroke="currentColor"
                    strokeWidth="32"
                    fill="transparent"
                    className="text-gray-100"
                  />
                  <circle
                    cx="160"
                    cy="160"
                    r="140"
                    stroke="currentColor"
                    strokeWidth="32"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={acceptedOffset}
                    className="text-green-500"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="160"
                    cy="160"
                    r="140"
                    stroke="currentColor"
                    strokeWidth="32"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={rejectedOffset}
                    className="text-red-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-gray-800 mb-1">
                      {businessInfo.totalReservations}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total Reservations
                    </p>
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-2xl font-bold text-green-600">
                        {totalReservations > 0 ? Math.round(acceptanceRate * 100) : 0}%
                      </p>
                      <p className="text-xs text-gray-500">
                        Acceptance Rate
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Details */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <i className="ri-calendar-todo-line text-blue-500 text-xl"></i>
                    <h3 className="font-semibold text-gray-800">
                      Today's Reservations
                    </h3>
                  </div>
                </div>
                <div className="flex items-end space-x-2">
                  <p className="text-4xl font-bold text-gray-800">
                    {stats?.upcoming_collaborations ? 
                      weeklyReservations.reduce((sum, day) => sum + day.count, 0) : 0}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">reservations</p>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <i className="ri-check-double-line text-green-500 text-xl"></i>
                    <h3 className="font-semibold text-gray-800">Accepted</h3>
                  </div>
                </div>
                <div className="flex items-end space-x-2">
                  <p className="text-4xl font-bold text-gray-800">
                    {businessInfo.acceptedReservations}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">total</p>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-5 border-2 border-red-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <i className="ri-close-circle-line text-red-500 text-xl"></i>
                    <h3 className="font-semibold text-gray-800">Rejected</h3>
                  </div>
                </div>
                <div className="flex items-end space-x-2">
                  <p className="text-4xl font-bold text-gray-800">
                    {businessInfo.rejectedReservations}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">total</p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-5 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <i className="ri-bar-chart-line text-purple-500 text-xl"></i>
                    <h3 className="font-semibold text-gray-800">This Week</h3>
                  </div>
                </div>
                <div className="flex items-end space-x-2">
                  <p className="text-4xl font-bold text-gray-800">
                    {businessInfo.weeklyReservations}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">reservations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <i className="ri-calendar-check-line text-white text-xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {businessInfo.totalReservations}
              </h3>
              <p className="text-gray-500 text-sm">Total Reservations</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <i className="ri-checkbox-circle-line text-white text-xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {businessInfo.acceptedReservations}
              </h3>
              <p className="text-gray-500 text-sm">Accepted</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <i className="ri-close-circle-line text-white text-xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {businessInfo.rejectedReservations}
              </h3>
              <p className="text-gray-500 text-sm">Rejected</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <i className="ri-bar-chart-line text-white text-xl"></i>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">
                {businessInfo.weeklyReservations}
              </h3>
              <p className="text-gray-500 text-sm">This Week</p>
            </div>
          </div>

          {/* Weekly Reservations Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Weekly Reservations
            </h2>
            <div className="space-y-4">
              {(weeklyReservations || []).length > 0 ? (weeklyReservations || []).map((day: any, index: number) => {
                const maxCount = Math.max(
                  ...(weeklyReservations || []).map((d: any) => d.count || 0)
                );
                const percentage = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {day.day}
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {day.count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No reservations data available</p>
                </div>
              )}
            </div>
        </div>
        </section>
      </div>

      {/* Add Data Modal */}
      {showAddModal && (
        <AddDataModal
          type={showAddModal.type}
          section={showAddModal.section}
          onClose={() => setShowAddModal(null)}
          onSave={async (data: any) => {
            try {
              if (showAddModal.type === 'gallery' || showAddModal.type === 'carousel') {
                // Upload images with timeout
                const imageUrls: string[] = [];
                const uploadPromises = (data.files || []).map(async (file: File) => {
                  const uploadPromise = uploadImage(file, 'images');
                  const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Image upload timeout')), 30000)
                  );
                  return Promise.race([uploadPromise, timeoutPromise]) as Promise<{ publicUrl: string }>;
                });

                try {
                  const results = await Promise.all(uploadPromises);
                  imageUrls.push(...results.map(r => r.publicUrl));
                } catch (uploadError) {
                  console.error('Error uploading images:', uploadError);
                  throw new Error('Failed to upload images. Please try again.');
                }
                
                if (imageUrls.length === 0) {
                  throw new Error('No images were uploaded successfully.');
                }
                
                const currentImages = showAddModal.type === 'gallery' ? galleryItems : carouselImages;
                
                // Update profile with timeout
                const updatePromise = updateBusinessProfileData({
                  [showAddModal.type === 'gallery' ? 'gallery_images' : 'carousel_images']: [...currentImages, ...imageUrls]
                });
                const updateTimeoutPromise = new Promise((_, reject) => 
                  setTimeout(() => reject(new Error('Update timeout')), 10000)
                );
                
                const updateResult = await Promise.race([updatePromise, updateTimeoutPromise]) as any;
                if (updateResult?.error) {
                  const errorMsg = updateResult.error.message || 'Failed to save images';
                  // Check if it's a metadata column error
                  if (errorMsg.includes('metadata') || updateResult.error.code === 'PGRST204') {
                    throw new Error('Database column missing! Please run this SQL in Supabase SQL Editor:\n\nALTER TABLE profiles ADD COLUMN metadata JSONB DEFAULT \'{}\'::jsonb;\n\nThen refresh and try again.');
                  }
                  throw new Error(errorMsg);
                }
              } else if (showAddModal.type === 'video') {
                // For videos, we can accept URLs or upload files
                const videoUrls: string[] = [];
                if (data.url && data.url.trim()) {
                  videoUrls.push(data.url.trim());
                }
                if (data.files && data.files.length > 0) {
                  for (const file of data.files) {
                    const result = await uploadVideo(file);
                    videoUrls.push(result.publicUrl);
                  }
                }
                if (videoUrls.length > 0) {
                  await updateBusinessProfileData({
                    videos: [...videoShowcase, ...videoUrls]
                  });
                }
              } else if (showAddModal.type === 'content') {
                const newContent = {
                  title: data.title,
                  description: data.description
                };
                await updateBusinessProfileData({
                  content_highlights: [...contentHighlights, newContent]
                });
              } else if (showAddModal.type === 'description') {
                await updateProfile({
                  business_description: data.description
                });
              } else if (showAddModal.type === 'social') {
                await updateProfile({
                  business_website: data.website,
                  business_instagram: data.instagram,
                  business_tiktok: data.tiktok
                });
              } else if (showAddModal.type === 'location') {
                await updateProfile({
                  business_address: data.address,
                  business_location: data.location
                });
              } else if (showAddModal.type === 'timing') {
                // Update establishment with timing
                if (establishments[0]?.id) {
                  await supabase
                    .from('business_establishments')
                    .update({
                      weekly_timings: data.timings
                    })
                    .eq('id', establishments[0].id);
                } else {
                  // Create new establishment
                  await createBusinessEstablishment({
                    title: businessInfo.name,
                    address: profileData?.business_address || '',
                    city: profileData?.business_location || '',
                    weekly_timings: data.timings
                  });
                }
              } else if (showAddModal.type === 'establishment') {
                // Create or update establishment
                const establishmentData = {
                  title: data.title || businessInfo.name,
                  address: data.address || '',
                  city: data.city || '',
                  country: data.country || '',
                  postal_code: data.postal_code || '',
                  phone: data.phone || '',
                  email: data.email || '',
                  weekly_timings: data.timings || null
                };
                
                if (establishments[0]?.id) {
                  // Update existing establishment
                  await supabase
                    .from('business_establishments')
                    .update(establishmentData)
                    .eq('id', establishments[0].id);
                } else {
                  // Create new establishment
                  await createBusinessEstablishment(establishmentData);
                }
                
                // Reload establishments
                await refreshEstablishments();
              }
              
              // Reload profile data to show updated content
              await refreshProfile();
              
              setShowAddModal(null);
            } catch (error: any) {
              console.error('Error saving data:', error);
              let errorMessage = error.message || 'Failed to save data. Please try again.';
              
              // Check if it's a metadata column error
              if (error.message?.includes('metadata column') || error.message?.includes('METADATA_COLUMN_MISSING')) {
                errorMessage = 'Database column missing! Please run this SQL in Supabase SQL Editor:\n\nALTER TABLE profiles ADD COLUMN metadata JSONB DEFAULT \'{}\'::jsonb;\n\nThen try again.';
              }
              
              alert(errorMessage);
              // Don't close modal on error so user can retry
            }
          }}
        />
      )}

      <AdvancedBottomNav userType="business" />
    </div>
  );
}

// Add Data Modal Component
function AddDataModal({ type, section, onClose, onSave }: {
  type: string;
  section: SectionId;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [formData, setFormData] = useState<any>({});
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles([...files, ...selectedFiles]);
    
    selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Add timeout to prevent infinite loading
      const savePromise = onSave({ ...formData, files });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Save operation timed out. Please try again.')), 60000)
      );
      
      await Promise.race([savePromise, timeoutPromise]);
    } catch (error: any) {
      console.error('Save error:', error);
      alert(error.message || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-0 sm:p-4 z-50">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full h-full sm:h-auto sm:max-h-[90vh] flex flex-col sm:max-w-md">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            {type === 'gallery' && 'Add Gallery Images'}
            {type === 'carousel' && 'Add Carousel Images'}
            {type === 'video' && 'Add Video'}
            {type === 'content' && 'Add Content Highlight'}
            {type === 'description' && 'Add Description'}
            {type === 'social' && 'Add Social Links'}
            {type === 'location' && 'Add Location'}
            {type === 'timing' && 'Add Schedule'}
            {type === 'establishment' && 'Add/Edit Establishment'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <i className="ri-close-line text-gray-600"></i>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 pb-4">
          {(type === 'gallery' || type === 'carousel') && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Upload Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                />
                {previews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {previews.map((preview: string, idx: number) => (
                      <img key={idx} src={preview} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {type === 'video' && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Video URL (Vimeo, YouTube, etc.)
                </label>
                <input
                  type="text"
                  placeholder="https://player.vimeo.com/video/..."
                  value={formData.url || ''}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Enter a video embed URL</p>
              </div>
              <div className="text-center text-gray-500 text-sm font-medium">OR</div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Upload Video File
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFiles([file]);
                      setFormData({ ...formData, url: '' }); // Clear URL if file selected
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                />
              </div>
            </>
          )}

          {type === 'location' && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="123 Main Street"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  City/Location
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="Paris, France"
                  required
                />
              </div>
            </>
          )}

          {type === 'establishment' && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Establishment Name
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="Main Branch"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="123 Main Street"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country || ''}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="United States"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postal_code || ''}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="10001"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="location@business.com"
                />
              </div>
            </>
          )}

          {type === 'timing' && (
            <>
              <p className="text-sm text-gray-600 mb-4">Set your weekly business hours</p>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day: string) => (
                <div key={day} className="flex items-center space-x-3">
                  <div className="w-24">
                    <span className="text-sm font-medium text-gray-700">{day}</span>
                  </div>
                  <input
                    type="text"
                    value={formData[`${day.toLowerCase()}`] || ''}
                    onChange={(e) => setFormData({ ...formData, [`${day.toLowerCase()}`]: e.target.value, timings: { ...formData.timings, [day]: e.target.value } })}
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                    placeholder="09:00 - 20:30 or Closed"
                  />
                </div>
              ))}
            </>
          )}

          {type === 'content' && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  rows={4}
                  required
                />
              </div>
            </>
          )}

          {type === 'description' && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Business Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                rows={6}
                required
              />
            </div>
          )}

          {type === 'social' && (
            <>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="https://www.example.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={formData.instagram || ''}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  TikTok Handle
                </label>
                <input
                  type="text"
                  value={formData.tiktok || ''}
                  onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  placeholder="@username"
                />
              </div>
            </>
          )}
          </form>
        </div>

        {/* Fixed Bottom Action Buttons */}
        <div className="flex space-x-3 p-4 sm:p-6 pb-20 sm:pb-6 border-t bg-white rounded-b-3xl flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (formRef.current) {
                formRef.current.requestSubmit();
              }
            }}
            disabled={loading || ((type === 'gallery' || type === 'carousel') && files.length === 0) || (type === 'video' && !formData.url && files.length === 0) || (type === 'content' && (!formData.title || !formData.description)) || (type === 'description' && !formData.description) || (type === 'establishment' && (!formData.title || !formData.address))}
            className="flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
