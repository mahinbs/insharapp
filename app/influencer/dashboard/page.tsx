"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdvancedBottomNav from "../../../components/AdvancedBottomNav";
import logo_colorful from "@/assetes/Logo3 (1).png";
import { getOffers } from "@/lib/supabase-offers";
import { useAuth } from "@/contexts/AuthContext";
import type { Offer } from "@/lib/supabase-offers";

import { cities } from "@/lib/cities-data";

const CITIES_INITIAL = 5;

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
      <div className="bg-white px-4 pt-4 pb-4 border-b border-gray-100 animate-fadeInDown">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={logo_colorful.src}
                alt="Inshaar"
                className="h-8 w-32 lg:h-10 lg:w-40 object-cover"
              />
            </div>
            <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm border border-gray-100">
              <i className="ri-notification-line text-gray-700 text-xl"></i>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl group">
            <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg group-hover:text-pink-500 transition-colors duration-300"></i>
            <input
              type="text"
              placeholder="Search for offers, brands, cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:bg-white border border-gray-100 transition-all duration-300 hover:border-pink-200 shadow-sm"
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
                className="opacity-0 translate-y-4 transition-all duration-700 ease-out"
              >
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-800">
                    NEAR ME
                  </h2>
                </div>
                <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 lg:overflow-visible lg:mx-0 lg:px-0">
                  <div className="flex space-x-5 pb-4 lg:grid lg:grid-cols-3 lg:gap-8 lg:pb-0 lg:space-x-0" style={{ scrollSnapType: 'x mandatory' }}>
                    {nearMeOffers.map((offer, index) => (
                      <Link
                        key={offer.id}
                        href={`/offer-details/${offer.id}`}
                        className="relative flex-shrink-0 w-[280px] sm:w-[320px] lg:w-full rounded-3xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                        style={{
                          scrollSnapAlign: 'start',
                          transitionDelay: `${index * 50}ms`
                        }}
                      >
                        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                        <img
                          src={offer.main_image || offer.images?.[0] || 'https://picsum.photos/400/300'}
                          alt={offer.business_name || offer.title}
                          className="w-full h-[220px] sm:h-[260px] lg:h-[300px] object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out relative z-10"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 opacity-90 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-30">
                          <h3 className="text-white font-bold text-xl mb-1 group-hover:text-pink-300 transition-colors duration-300">
                            {offer.business_name || offer.title}
                          </h3>
                          <div className="flex items-center text-white/90 text-sm space-x-1">
                            <i className="ri-map-pin-2-line text-pink-400"></i>
                            <span>{offer.location}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Discover Our Cities Section - 5 cities + View more link to full page */}
            <div className="opacity-100 py-2">
              <div className="flex flex-row items-center justify-between gap-2 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-orange-500 rounded-full"></div>
                  <h2 className="text-xl sm:text-3xl font-black tracking-tight text-gray-800 flex-shrink-0 min-w-0">
                    DISCOVER OUR CITIES
                  </h2>
                </div>
                <Link
                  href="/influencer/cities"
                  className="group flex items-center space-x-1 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors bg-purple-50 px-3 py-1.5 rounded-full"
                >
                  <span>View all</span>
                  <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>

              <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
                <div
                  className="flex space-x-4 lg:grid lg:grid-cols-5 lg:gap-6 lg:pb-0 pb-4"
                  style={{ scrollSnapType: 'x mandatory' }}
                >
                  {cities.slice(0, CITIES_INITIAL).map((city, index) => (
                    <Link
                      key={city.id}
                      href={`/category/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="relative flex-shrink-0 w-[150px] sm:w-[200px] lg:w-full rounded-3xl overflow-hidden group aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                      style={{
                        scrollSnapAlign: 'start',
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:via-black/20 transition-all duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                        <h3 className="text-white font-black text-lg sm:text-xl text-center tracking-wide group-hover:scale-105 transition-transform duration-300 drop-shadow-md">
                          {city.name}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* A Special Craving? Section - Modern Layout */}
            <div className="py-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-pink-500 via-red-500 to-yellow-500 rounded-full shadow-lg shadow-pink-200"></div>
                  <h2 className="text-2xl sm:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                    A SPECIAL CRAVING?
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                {specialCravings.map((item, index) => {
                  const categoryMap: { [key: string]: string } = {
                    AFTERWORK: "Restaurant",
                    BRUNCH: "Restaurant",
                  };
                  const category = categoryMap[item.title] || "Restaurant";

                  return (
                    <Link
                      key={item.id}
                      href={`/category/${category.toLowerCase()}?type=${item.title.toLowerCase()}`}
                      className="group relative h-[280px] sm:h-[350px] rounded-[2rem] overflow-hidden shadow-xl transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 hover:rotate-1"
                    >
                      {/* Image with zoom effect */}
                      <div className="absolute inset-0 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                      </div>

                      {/* Glassmorphic Card Content */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-white/80 text-xs font-bold tracking-widest uppercase mb-1">Discover</p>
                              <h3 className="text-white font-black text-3xl sm:text-4xl italic tracking-tighter drop-shadow-lg">
                                {item.title}
                              </h3>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transform -rotate-45 group-hover:rotate-0 transition-transform duration-500">
                              <i className="ri-arrow-right-up-line text-xl font-bold"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* To Try Urgently Banner - Clickable */}
            <div className="py-4">
              <Link
                href="/search"
                className="group block relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer lg:max-w-4xl lg:mx-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-[length:200%_200%] animate-gradient"></div>
                <div className="relative py-8 sm:py-12 px-6 flex flex-col items-center justify-center text-center space-y-2">
                  <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md group-hover:tracking-wide transition-all duration-500">
                    TO TRY URGENTLY
                  </h2>
                  <div className="flex items-center space-x-2 text-white/90 text-sm sm:text-base font-medium bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full">
                    <span>Explore trending places</span>
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </div>
              </Link>
            </div>

            {/* Last Minute Offers - Exclusive Carousel (One Card View) */}
            {lastMinuteOffers.length > 0 && (
              <div
                ref={(el) => { sectionRefs.current[4] = el; }}
                className="opacity-0 translate-y-4 transition-all duration-700 ease-out delay-100 py-4"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-1.5 h-8 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full shadow-lg shadow-purple-200"></div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-800">
                    LAST MINUTE OFFERS
                  </h2>
                </div>

                {/* Full-width carousel for "One Card" feel */}
                <div className="flex space-x-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
                  {lastMinuteOffers.map((offer, index) => (
                    <Link
                      key={offer.id}
                      href={`/offer-details/${offer.id}`}
                      className="relative flex-shrink-0 w-[85vw] sm:w-[450px] lg:w-[500px] h-[350px] sm:h-[450px] rounded-[2.5rem] overflow-hidden group shadow-2xl transition-all duration-500 hover:shadow-purple-500/20 snap-center"
                    >
                      <img
                        src={offer.main_image || offer.images?.[0] || 'https://picsum.photos/400/300'}
                        alt={offer.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                        loading="lazy"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />

                      {/* Floating Tag */}
                      <div className="absolute top-6 right-6">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold px-4 py-2 rounded-full flex items-center shadow-lg">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                          Ending Soon
                        </div>
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
                          <h3 className="text-white font-black text-2xl sm:text-3xl mb-2 leading-tight group-hover:text-purple-200 transition-colors">
                            {offer.title}
                          </h3>
                          <p className="text-white/90 font-medium text-lg mb-4 flex items-center">
                            <i className="ri-store-2-line mr-2 text-purple-300"></i>
                            {offer.business_name}
                          </p>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-white/80 text-sm bg-black/40 px-3 py-1 rounded-full">
                              <i className="ri-map-pin-line mr-1 text-purple-400"></i>
                              {offer.location}
                            </div>
                            <div className="flex items-center text-white/80 text-sm bg-black/40 px-3 py-1 rounded-full">
                              <i className="ri-time-line mr-1 text-purple-400"></i>
                              Expires: Today
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Urgent Offers - Max 10 offers */}
            {urgentOffers.length > 0 && (
              <div
                ref={(el) => { sectionRefs.current[5] = el; }}
                className="opacity-0 translate-y-4 transition-all duration-700 ease-out delay-200"
              >
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-800">
                    URGENT OFFERS
                  </h2>
                </div>
                <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 lg:overflow-visible lg:mx-0 lg:px-0">
                  <div className="flex space-x-5 pb-4 lg:grid lg:grid-cols-3 lg:gap-8 lg:pb-0 lg:space-x-0" style={{ scrollSnapType: 'x mandatory' }}>
                    {urgentOffers.map((offer, index) => (
                      <Link
                        key={offer.id}
                        href={`/offer-details/${offer.id}`}
                        className="relative flex-shrink-0 w-[280px] sm:w-[320px] lg:w-full rounded-3xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                        style={{ scrollSnapAlign: 'start' }}
                      >
                        <img
                          src={offer.main_image || offer.images?.[0] || 'https://picsum.photos/400/300'}
                          alt={offer.business_name || offer.title}
                          className="w-full h-[220px] sm:h-[260px] lg:h-[300px] object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5">
                          <h3 className="text-white font-bold text-lg mb-1 group-hover:text-orange-300 transition-colors duration-300">
                            {offer.business_name || offer.title}
                          </h3>
                          <div className="flex items-center text-white/80 text-sm mb-1">
                            <i className="ri-map-pin-line mr-1"></i>
                            {offer.location}
                          </div>
                        </div>
                        {/* Tag */}
                        <div className="absolute top-4 right-4 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                          Urgent
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* All Restaurants Section - Modern Carousel */}
            {filteredOffers.length > 0 && (
              <div className="opacity-100 pt-8 pb-4">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-1.5 h-8 bg-gray-900 rounded-full shadow-lg"></div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
                    ALL RESTAURANTS
                  </h2>
                </div>

                <div className="flex space-x-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
                  {filteredOffers.map((offer, index) => (
                    <Link
                      key={offer.id}
                      href={`/offer-details/${offer.id}`}
                      className="relative flex-shrink-0 w-[280px] sm:w-[350px] lg:w-[400px] h-[320px] sm:h-[400px] rounded-[2rem] overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 snap-center border border-gray-100"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <img
                        src={offer.main_image || offer.images?.[0] || 'https://picsum.photos/400/300'}
                        alt={offer.business_name || offer.title}
                        className="w-full h-[65%] object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 top-[50%] bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />

                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <h3 className="text-gray-900 font-black text-xl mb-1 group-hover:text-pink-600 transition-colors duration-300">
                          {offer.business_name || offer.title}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium mb-3 line-clamp-2">{offer.category} • {offer.location}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-pink-600 font-bold text-sm bg-pink-50 px-3 py-1 rounded-full">
                            View Offer
                          </span>
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
                            <i className="ri-arrow-right-line"></i>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Show empty message only if searching and no results, or if no offers at all */}
            {filteredOffers.length === 0 && !loading && searchQuery && (
              <div className="text-center py-24 bg-gray-50 rounded-3xl animate-fadeIn">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <i className="ri-search-2-line text-4xl text-gray-300"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No offers matches found
                </h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  We couldn't find any offers matching "{searchQuery}". Try a different keyword or category.
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