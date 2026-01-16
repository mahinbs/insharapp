"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdvancedBottomNav from "../../../components/AdvancedBottomNav";
import logo_dark from "@/assetes/logo_dark.png";
import logo_colorful from "@/assetes/Logo3 (1).png";
import { getOffers } from "@/lib/supabase-offers";
import { useAuth } from "@/contexts/AuthContext";
import type { Offer } from "@/lib/supabase-offers";

// Cities for discovery (static)

// Cities for discovery
const cities = [
  {
    id: 1,
    name: "PARIS",
    image: "https://picsum.photos/seed/paris-1/400/500",
  },
  {
    id: 2,
    name: "LONDON",
    image: "https://picsum.photos/seed/london-1/400/500",
  },
  {
    id: 3,
    name: "MARSEILLE",
    image: "https://picsum.photos/seed/marseille-1/400/500",
  },
  {
    id: 4,
    name: "NEW YORK",
    image: "https://picsum.photos/seed/nyc-1/400/500",
  },
];

// Special Cravings - Large cards
const specialCravings = [
  {
    id: 1,
    title: "AFTERWORK",
    image: "https://picsum.photos/seed/afterwork-1/400/500",
  },
  {
    id: 2,
    title: "BRUNCH",
    image: "https://picsum.photos/seed/brunch-1/400/500",
  },
];

// Static data for cities and cravings (not from database)

// Dynamic announcements data
const dynamicAnnouncements = [
  {
    id: 1,
    type: "restaurant",
    message: "New: Bella Vista Restaurant joins!",
    icon: "ri-store-line",
    color: "text-pink-300"
  },
  {
    id: 2,
    type: "influencer",
    message: "Welcome 500+ new influencers this month!",
    icon: "ri-user-star-line",
    color: "text-purple-300"
  },
  {
    id: 3,
    type: "event",
    message: "Influencer Meetup Saturday",
    icon: "ri-calendar-event-line",
    color: "text-purple-300"
  },
  {
    id: 4,
    type: "special",
    message: "Limited Time: Exclusive Restaurant Partnerships",
    icon: "ri-gift-line",
    color: "text-orange-300"
  },
  {
    id: 5,
    type: "milestone",
    message: "1000+ successful collabs!",
    icon: "ri-trophy-line",
    color: "text-purple-300"
  },
  {
    id: 6,
    type: "restaurant",
    message: "New: Luxe Beauty Salon joins!",
    icon: "ri-store-line",
    color: "text-pink-300"
  }
];

export default function InfluencerDashboard() {
  const router = useRouter();
  const { user, session, loading: authLoading } = useAuth();
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Check authentication and fetch offers
  useEffect(() => {
    // Don't proceed if auth is still loading
    if (authLoading) {
      return;
    }

    let mounted = true;

    async function init() {
      try {
        // Check if user is authenticated
        if (!user || !session) {
          if (mounted) {
            router.push('/auth');
          }
          return;
        }

        // Fetch offers in parallel
        const offersPromise = getOffers({ limit: 20 });
        
        // Wait for offers
        const { data: offersData, error: offersError } = await offersPromise;
        
        if (!mounted) return;

        if (offersError) {
          console.error('Error fetching offers:', offersError);
          setOffers([]);
        } else if (offersData) {
          setOffers(offersData);
        } else {
          setOffers([]);
        }
      } catch (error) {
        console.error('Error in dashboard init:', error);
        if (mounted) {
          setOffers([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [router, user, session, authLoading]);

  useEffect(() => {
    // Wait for offers to load before setting up observers
    if (loading) return;

    // Fallback: Make sections visible after a short delay if observer doesn't fire
    const fallbackTimeout = setTimeout(() => {
      sectionRefs.current.forEach((ref) => {
        if (ref) {
          ref.classList.remove("opacity-0");
          ref.classList.add("opacity-100");
        }
      });
    }, 500);

    const observers = sectionRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.remove("opacity-0");
              entry.target.classList.add("opacity-100");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      clearTimeout(fallbackTimeout);
      observers.forEach((observer) => observer?.disconnect());
    };
  }, [loading, offers]);

  // Filter offers based on search
  const filteredOffers = offers.filter(offer => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      offer.title.toLowerCase().includes(query) ||
      offer.business_name?.toLowerCase().includes(query) ||
      offer.location.toLowerCase().includes(query) ||
      offer.category.toLowerCase().includes(query)
    );
  });

  // Limit offers per section (show all if fewer than max)
  const nearMeOffers = filteredOffers.slice(0, 5); // Max 3-5 offers
  const lastMinuteOffers = filteredOffers.slice(0, 6); // Max 4-6 offers
  const urgentOffers = filteredOffers.slice(0, 10); // Max 7-10 offers
  // All Restaurants shows all offers (no limit)

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Scrolling Banner - Full Width */}
      <div className="w-full border-t border-b border-gray-200 bg-white/10 backdrop-blur-sm overflow-hidden">
            <div className="flex animate-scroll">
              <div className="flex space-x-6 sm:space-x-8 whitespace-nowrap">
                {[...Array(2)].map((_: any, setIndex: number) => (
                  <div key={setIndex} className="flex space-x-6 sm:space-x-8">
                    {dynamicAnnouncements.map((announcement) => (
                  <div key={`${setIndex}-${announcement.id}`} className="flex items-center space-x-2 text-gray-700 py-3">
                        <i className={`${announcement.icon} ${announcement.color} text-sm sm:text-base`}></i>
                        <span className="text-xs sm:text-sm font-medium">
                          {announcement.message}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>

      {/* Simple Header */}
      <div className="bg-white px-4 pt-4 pb-4 border-b border-gray-100 animate-fadeIn">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img 
                src={logo_colorful.src}
            alt="Inshaar" 
                className="h-8 w-32 lg:h-10 lg:w-40 object-cover"
          />
        </div>
            <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-110">
              <i className="ri-notification-line text-gray-700 text-xl"></i>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
            <input
              type="text"
              placeholder="SEARCH"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white border border-gray-200 transition-all duration-300 hover:border-pink-300"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-8 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <>
            {/* Near Me Section - Max 5 offers */}
            {nearMeOffers.length > 0 && (
              <div 
                ref={(el) => { sectionRefs.current[0] = el; }}
                className="opacity-0 transition-opacity duration-500"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent animate-gradient">
                  NEAR ME
                </h2>
                <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 lg:overflow-visible lg:mx-0 lg:px-0">
                  <div className="flex space-x-4 pb-2 lg:grid lg:grid-cols-3 lg:gap-6 lg:pb-0" style={{ scrollSnapType: 'x mandatory' }}>
                    {nearMeOffers.map((offer, index) => (
                      <Link
                        key={offer.id}
                        href={`/offer-details/${offer.id}`}
                        className="relative flex-shrink-0 w-[280px] sm:w-[320px] lg:w-full rounded-2xl overflow-hidden group animate-scaleIn"
                        style={{ 
                          scrollSnapAlign: 'start',
                          animationDelay: `${(index + 1) * 0.1}s`
                        }}
                      >
                        <img
                          src={offer.main_image || offer.images?.[0] || 'https://picsum.photos/400/300'}
                          alt={offer.business_name || offer.title}
                          className="w-full h-[200px] sm:h-[240px] lg:h-[280px] xl:h-[300px] object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-white font-bold text-lg mb-1 group-hover:text-pink-300 transition-colors duration-300">
                            {offer.business_name || offer.title}
                          </h3>
                          <p className="text-white/90 text-sm">
                            {offer.location}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

        {/* Discover Our Cities Section - Always Show */}
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent animate-gradient">
            DISCOVER OUR CITIES
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {cities.map((city, index) => (
              <Link
                key={city.id}
                href={`/category/${city.name.toLowerCase()}`}
                className="relative rounded-2xl overflow-hidden group aspect-[4/5] lg:aspect-[3/4] animate-scaleIn hover:shadow-2xl transition-all duration-300"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-xl sm:text-2xl group-hover:text-pink-300 transition-colors duration-300">
                    {city.name}
                    </h3>
                </div>
              </Link>
            ))}
          </div>
              </div>

        {/* A Special Craving? Section - Always Show */}
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent animate-gradient">
            A SPECIAL CRAVING?
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-6 lg:max-w-4xl lg:mx-auto">
            {specialCravings.map((item, index) => {
              // Map cravings to categories
              const categoryMap: { [key: string]: string } = {
                'AFTERWORK': 'Restaurant',
                'BRUNCH': 'Restaurant'
              };
              const category = categoryMap[item.title] || 'Restaurant';
              
              return (
              <Link
                key={item.id}
                href={`/category/${category.toLowerCase()}?type=${item.title.toLowerCase()}`}
                className="relative rounded-2xl overflow-hidden group aspect-[4/5] lg:aspect-[3/4] animate-scaleIn hover:shadow-2xl transition-all duration-300"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-xl sm:text-2xl group-hover:text-orange-300 transition-colors duration-300">
                    {item.title}
                  </h3>
                      </div>
              </Link>
              );
            })}
              </div>
            </div>

        {/* To Try Urgently Banner - Clickable */}
        <Link 
          href="/search"
          className="block bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-2xl p-4 sm:p-6 lg:p-8 text-center animate-pulseGlow hover:scale-105 transition-transform duration-300 cursor-pointer animate-fadeIn lg:max-w-4xl lg:mx-auto"
        >
          <h2 
            className="text-xl sm:text-2xl lg:text-3xl font-black"
            style={{ 
              WebkitTextStroke: '2px white',
              WebkitTextFillColor: 'black',
              color: 'black'
            }}
          >
            TO TRY URGENTLY
          </h2>
        </Link>

            {/* Last Minute Offers - Max 6 offers */}
            {lastMinuteOffers.length > 0 && (
              <div 
                ref={(el) => { sectionRefs.current[4] = el; }}
                className="opacity-0 transition-opacity duration-500"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent animate-gradient">
                  LAST MINUTE OFFERS
                </h2>
                <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 lg:overflow-visible lg:mx-0 lg:px-0">
                  <div className="flex space-x-4 pb-2 lg:grid lg:grid-cols-3 lg:gap-6 lg:pb-0" style={{ scrollSnapType: 'x mandatory' }}>
                    {lastMinuteOffers.map((offer, index) => (
                      <Link
                        key={offer.id}
                        href={`/offer-details/${offer.id}`}
                        className="relative flex-shrink-0 w-[280px] sm:w-[320px] lg:w-full rounded-2xl overflow-hidden group animate-scaleIn"
                        style={{ 
                          scrollSnapAlign: 'start',
                          animationDelay: `${(index + 1) * 0.1}s`
                        }}
                      >
                        <img
                          src={offer.main_image || offer.images?.[0] || 'https://picsum.photos/400/300'}
                          alt={offer.title}
                          className="w-full h-[200px] sm:h-[240px] lg:h-[280px] xl:h-[300px] object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-white font-bold text-base mb-1 group-hover:text-purple-300 transition-colors duration-300">
                            {offer.title}
                          </h3>
                          <p className="text-white/90 text-sm">
                            {offer.business_name} • {offer.location}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Urgent Offers - Max 10 offers */}
            {urgentOffers.length > 0 && (
              <div 
                ref={(el) => { sectionRefs.current[5] = el; }}
                className="opacity-0 transition-opacity duration-500"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent animate-gradient">
                  URGENT OFFERS
                </h2>
                <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 lg:overflow-visible lg:mx-0 lg:px-0">
                  <div className="flex space-x-4 pb-2 lg:grid lg:grid-cols-3 lg:gap-6 lg:pb-0" style={{ scrollSnapType: 'x mandatory' }}>
                    {urgentOffers.map((offer, index) => (
                      <Link
                        key={offer.id}
                        href={`/offer-details/${offer.id}`}
                        className="relative flex-shrink-0 w-[280px] sm:w-[320px] lg:w-full rounded-2xl overflow-hidden group animate-scaleIn"
                        style={{ 
                          scrollSnapAlign: 'start',
                          animationDelay: `${(index + 1) * 0.1}s`
                        }}
                      >
                        <img
                          src={offer.main_image || offer.images?.[0] || 'https://picsum.photos/400/300'}
                          alt={offer.business_name || offer.title}
                          className="w-full h-[200px] sm:h-[240px] lg:h-[280px] xl:h-[300px] object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-white font-bold text-lg mb-1 group-hover:text-orange-300 transition-colors duration-300">
                            {offer.business_name || offer.title}
                          </h3>
                          <p className="text-white/90 text-sm">
                            {offer.location}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* All Restaurants Section - Shows all offers (no limit) */}
            {filteredOffers.length > 0 && (
              <div className="opacity-100">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent animate-gradient">
                  ALL RESTAURANTS
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {filteredOffers.map((offer) => (
                    <Link
                      key={offer.id}
                      href={`/offer-details/${offer.id}`}
                      className="relative rounded-2xl overflow-hidden group animate-scaleIn hover:shadow-2xl transition-all duration-300"
                    >
                      <img
                        src={offer.main_image || offer.images?.[0] || 'https://picsum.photos/400/300'}
                        alt={offer.business_name || offer.title}
                        className="w-full h-48 sm:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4">
                        <h3 className="text-white font-bold text-lg mb-1 group-hover:text-pink-300 transition-colors duration-300">
                          {offer.business_name || offer.title}
                        </h3>
                        <p className="text-white/90 text-sm">{offer.location}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Show empty message only if searching and no results, or if no offers at all */}
            {filteredOffers.length === 0 && !loading && searchQuery && (
              <div className="text-center py-20">
                <i className="ri-inbox-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No offers match your search
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or check back later
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <AdvancedBottomNav userType="influencer" />
    </div>
  );
}