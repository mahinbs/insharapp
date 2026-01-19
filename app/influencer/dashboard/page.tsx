"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import AdvancedBottomNav from "../../../components/AdvancedBottomNav";
import logo_dark from "@/assetes/logo_dark.png";
import logo_colorful from "@/assetes/Logo3 (1).png";

// Near Me Offers - Large image cards
const nearMeOffers = [
  {
    id: 1,
    businessName: "NOMAS TACOS",
    location: "PARIS 75010",
    image: "https://picsum.photos/seed/tacos-1/400/300",
  },
  {
    id: 2,
    businessName: "RIZ DJON-DJON",
    location: "PARIS 75011",
    image: "https://picsum.photos/seed/rice-1/400/300",
  },
  {
    id: 3,
    businessName: "BELLA VISTA",
    location: "PARIS 75014",
    image: "https://picsum.photos/seed/restaurant-1/400/300",
  },
];

// Cities for discovery - 58 Algerian Wilayas
const cities = [
  { id: 1, name: "ADRAR", image: "https://picsum.photos/seed/adrar-1/400/500" },
  { id: 2, name: "CHLEF", image: "https://picsum.photos/seed/chlef-1/400/500" },
  { id: 3, name: "LAGHOUAT", image: "https://picsum.photos/seed/laghouat-1/400/500" },
  { id: 4, name: "OUM EL BOUAGHI", image: "https://picsum.photos/seed/oumelbouaghi-1/400/500" },
  { id: 5, name: "BATNA", image: "https://picsum.photos/seed/batna-1/400/500" },
  { id: 6, name: "BÉJAÏA", image: "https://picsum.photos/seed/bejaia-1/400/500" },
  { id: 7, name: "BISKRA", image: "https://picsum.photos/seed/biskra-1/400/500" },
  { id: 8, name: "BÉCHAR", image: "https://picsum.photos/seed/bechar-1/400/500" },
  { id: 9, name: "BLIDA", image: "https://picsum.photos/seed/blida-1/400/500" },
  { id: 10, name: "BOUIRA", image: "https://picsum.photos/seed/bouira-1/400/500" },
  { id: 11, name: "TAMANRASSET", image: "https://picsum.photos/seed/tamanrasset-1/400/500" },
  { id: 12, name: "TÉBESSA", image: "https://picsum.photos/seed/tebessa-1/400/500" },
  { id: 13, name: "TLEMCEN", image: "https://picsum.photos/seed/tlemcen-1/400/500" },
  { id: 14, name: "TIARET", image: "https://picsum.photos/seed/tiaret-1/400/500" },
  { id: 15, name: "TIZI OUZOU", image: "https://picsum.photos/seed/tiziouzou-1/400/500" },
  { id: 16, name: "ALGER", image: "https://picsum.photos/seed/alger-1/400/500" },
  { id: 17, name: "DJELFA", image: "https://picsum.photos/seed/djelfa-1/400/500" },
  { id: 18, name: "JIJEL", image: "https://picsum.photos/seed/jijel-1/400/500" },
  { id: 19, name: "SÉTIF", image: "https://picsum.photos/seed/setif-1/400/500" },
  { id: 20, name: "SAÏDA", image: "https://picsum.photos/seed/saida-1/400/500" },
  { id: 21, name: "SKIKDA", image: "https://picsum.photos/seed/skikda-1/400/500" },
  { id: 22, name: "SIDI BEL ABBÈS", image: "https://picsum.photos/seed/sidibelabbes-1/400/500" },
  { id: 23, name: "ANNABA", image: "https://picsum.photos/seed/annaba-1/400/500" },
  { id: 24, name: "GUELMA", image: "https://picsum.photos/seed/guelma-1/400/500" },
  { id: 25, name: "CONSTANTINE", image: "https://picsum.photos/seed/constantine-1/400/500" },
  { id: 26, name: "MÉDÉA", image: "https://picsum.photos/seed/medea-1/400/500" },
  { id: 27, name: "MOSTAGANEM", image: "https://picsum.photos/seed/mostaganem-1/400/500" },
  { id: 28, name: "M'SILA", image: "https://picsum.photos/seed/msila-1/400/500" },
  { id: 29, name: "MASCARA", image: "https://picsum.photos/seed/mascara-1/400/500" },
  { id: 30, name: "OUARGLA", image: "https://picsum.photos/seed/ouargla-1/400/500" },
  { id: 31, name: "ORAN", image: "https://picsum.photos/seed/oran-1/400/500" },
  { id: 32, name: "EL BAYADH", image: "https://picsum.photos/seed/elbayadh-1/400/500" },
  { id: 33, name: "ILLIZI", image: "https://picsum.photos/seed/illizi-1/400/500" },
  { id: 34, name: "BORDJ BOU ARRERIDJ", image: "https://picsum.photos/seed/bordjbouarreridj-1/400/500" },
  { id: 35, name: "BOUMERDÈS", image: "https://picsum.photos/seed/boumerdes-1/400/500" },
  { id: 36, name: "EL TARF", image: "https://picsum.photos/seed/eltarf-1/400/500" },
  { id: 37, name: "TINDOUF", image: "https://picsum.photos/seed/tindouf-1/400/500" },
  { id: 38, name: "TISSEMSILT", image: "https://picsum.photos/seed/tissemsilt-1/400/500" },
  { id: 39, name: "EL OUED", image: "https://picsum.photos/seed/eloued-1/400/500" },
  { id: 40, name: "KHENCHELA", image: "https://picsum.photos/seed/khenchela-1/400/500" },
  { id: 41, name: "SOUK AHRAS", image: "https://picsum.photos/seed/soukahras-1/400/500" },
  { id: 42, name: "TIPAZA", image: "https://picsum.photos/seed/tipaza-1/400/500" },
  { id: 43, name: "MILA", image: "https://picsum.photos/seed/mila-1/400/500" },
  { id: 44, name: "AÏN DEFLA", image: "https://picsum.photos/seed/aindefla-1/400/500" },
  { id: 45, name: "NAÂMA", image: "https://picsum.photos/seed/naama-1/400/500" },
  { id: 46, name: "AÏN TÉMOUCHENT", image: "https://picsum.photos/seed/aintemouchent-1/400/500" },
  { id: 47, name: "GHARDAÏA", image: "https://picsum.photos/seed/ghardaia-1/400/500" },
  { id: 48, name: "RELIZANE", image: "https://picsum.photos/seed/relizane-1/400/500" },
  { id: 49, name: "TIMIMOUN", image: "https://picsum.photos/seed/timimoun-1/400/500" },
  { id: 50, name: "BORDJ BADJI MOKHTAR", image: "https://picsum.photos/seed/bordjbadjimokhtar-1/400/500" },
  { id: 51, name: "OULED DJELLAL", image: "https://picsum.photos/seed/ouleddjellal-1/400/500" },
  { id: 52, name: "BÉNI ABBÈS", image: "https://picsum.photos/seed/beniabbes-1/400/500" },
  { id: 53, name: "IN SALAH", image: "https://picsum.photos/seed/insalah-1/400/500" },
  { id: 54, name: "IN GUEZZAM", image: "https://picsum.photos/seed/inguezzam-1/400/500" },
  { id: 55, name: "TOUGGOURT", image: "https://picsum.photos/seed/touggourt-1/400/500" },
  { id: 56, name: "DJANET", image: "https://picsum.photos/seed/djanet-1/400/500" },
  { id: 57, name: "EL M'GHAIR", image: "https://picsum.photos/seed/elmghair-1/400/500" },
  { id: 58, name: "EL MENIAA", image: "https://picsum.photos/seed/elmeniaa-1/400/500" },
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

// Last Minute Offers
const lastMinuteOffers = [
  {
    id: 1,
    title: "LUNCH & DINNER",
    businessName: "RESTAURANT KAYZO",
    location: "ARNOUVILLE",
    image: "https://picsum.photos/seed/kayzo-1/400/300",
  },
  {
    id: 2,
    title: "BRUNCH",
    businessName: "KAYZO",
    location: "ARNOUVILLE",
    image: "https://picsum.photos/seed/kayzo-brunch-1/400/300",
  },
  {
    id: 3,
    title: "DINNER",
    businessName: "CASA DI MARCO",
    location: "DEUIL-LA-BARRE",
    image: "https://picsum.photos/seed/casa-1/400/300",
  },
];

// Urgent Offers - Horizontal scroll
const urgentOffers = [
  {
    id: 1,
    businessName: "CASA DI MARCO",
    location: "DEUIL-LA-BARRE",
    image: "https://picsum.photos/seed/urgent-1/400/300",
  },
  {
    id: 2,
    businessName: "CASA DI SOISY",
    location: "SOISY-SOU",
    image: "https://picsum.photos/seed/urgent-2/400/300",
  },
  {
    id: 3,
    businessName: "BELLA VISTA",
    location: "PARIS 75014",
    image: "https://picsum.photos/seed/urgent-3/400/300",
  },
];

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
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = sectionRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-fadeIn");
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
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Scrolling Banner - Full Width */}
      <div className="w-full border-t border-b border-gray-200 bg-white/10 backdrop-blur-sm overflow-hidden">
            <div className="flex animate-scroll">
              <div className="flex space-x-6 sm:space-x-8 whitespace-nowrap">
                {[...Array(2)].map((_, setIndex) => (
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
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white border border-gray-200 transition-all duration-300 hover:border-pink-300"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-8 max-w-7xl mx-auto">
        {/* Near Me Section */}
        <div 
          ref={(el) => { sectionRefs.current[0] = el; }}
          className="opacity-0"
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
                    src={offer.image}
                    alt={offer.businessName}
                    className="w-full h-[200px] sm:h-[240px] lg:h-[280px] xl:h-[300px] object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-bold text-lg mb-1 group-hover:text-pink-300 transition-colors duration-300">
                      {offer.businessName}
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

        {/* Discover Our Cities Section */}
        <div 
          ref={(el) => { sectionRefs.current[1] = el; }}
          className="opacity-0"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent animate-gradient">
            DISCOVER OUR CITIES
          </h2>
          
          {/* First Row - Horizontal Scroll (X-axis) */}
          <div className="mb-4">
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
              <div className="flex space-x-4 pb-2" style={{ scrollSnapType: 'x mandatory' }}>
                {cities.slice(0, Math.ceil(cities.length / 2)).map((city, index) => (
                  <Link
                    key={city.id}
                    href={`/category/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="relative flex-shrink-0 w-[160px] sm:w-[180px] lg:w-[200px] rounded-2xl overflow-hidden group aspect-[4/5] animate-scaleIn hover:shadow-2xl transition-all duration-300"
                    style={{ 
                      scrollSnapAlign: 'start',
                      animationDelay: `${(index + 1) * 0.05}s` 
                    }}
                  >
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                    <div className="absolute bottom-4 left-4 right-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-bold text-lg sm:text-xl group-hover:text-pink-300 transition-colors duration-300">
                        {city.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Second Row - Vertical Scroll (Y-axis) */}
          <div className="overflow-y-auto scrollbar-hide max-h-[250px] lg:max-h-[400px] pr-2" style={{ scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch' }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {cities.slice(Math.ceil(cities.length / 2)).map((city, index) => (
                <Link
                  key={city.id}
                  href={`/category/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="relative rounded-2xl overflow-hidden group aspect-[4/5] animate-scaleIn hover:shadow-2xl transition-all duration-300"
                  style={{ 
                    scrollSnapAlign: 'start',
                    animationDelay: `${(index + 1) * 0.05}s` 
                  }}
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-bold text-lg sm:text-xl group-hover:text-pink-300 transition-colors duration-300">
                      {city.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* A Special Craving? Section */}
        <div 
          ref={(el) => { sectionRefs.current[2] = el; }}
          className="opacity-0"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 bg-clip-text text-transparent animate-gradient">
            A SPECIAL CRAVING?
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-6 lg:max-w-4xl lg:mx-auto">
            {specialCravings.map((item, index) => (
              <Link
                key={item.id}
                href={`/search?q=${item.title.toLowerCase()}`}
                className="relative rounded-2xl overflow-hidden group w-full h-full animate-scaleIn hover:shadow-2xl transition-all duration-300"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 max-h-[300px] md:max-h-[280px] lg:max-h-[240px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-xl sm:text-2xl group-hover:text-orange-300 transition-colors duration-300">
                    {item.title}
                  </h3>
                      </div>
              </Link>
                ))}
              </div>
            </div>

        {/* To Try Urgently Banner */}
        <div 
          className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-2xl p-4 sm:p-6 lg:p-8 text-center animate-pulseGlow hover:scale-105 transition-transform duration-300 cursor-pointer animate-fadeIn lg:max-w-4xl lg:mx-auto"
        >
          <h2 
            className="text-xl sm:text-2xl lg:text-3xl font-black text-white"
          >
            TO TRY URGENTLY
          </h2>
                  </div>

        {/* Last Minute Offers */}
        <div 
          ref={(el) => { sectionRefs.current[4] = el; }}
          className="opacity-0"
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
                    src={offer.image}
                    alt={offer.businessName}
                    className="w-full h-[200px] sm:h-[240px] lg:h-[280px] xl:h-[300px] object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-bold text-base mb-1 group-hover:text-purple-300 transition-colors duration-300">
                      {offer.title} - {offer.businessName}
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

        {/* Urgent Offers - Horizontal Scroll */}
        <div 
          ref={(el) => { sectionRefs.current[5] = el; }}
          className="opacity-0"
        >
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
                    src={offer.image}
                    alt={offer.businessName}
                    className="w-full h-[200px] sm:h-[240px] lg:h-[280px] xl:h-[300px] object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-bold text-lg mb-1 group-hover:text-orange-300 transition-colors duration-300">
                      {offer.businessName}
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
      </div>

      <AdvancedBottomNav userType="influencer" />
    </div>
  );
}