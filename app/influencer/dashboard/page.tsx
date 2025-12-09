"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdvancedBottomNav from "../../../components/AdvancedBottomNav";
import logo_dark from "@/assetes/logo_dark.png";

const barterOffers = [
  {
    id: 1,
    businessName: "Bella Vista Restaurant",
    businessLogo: "https://i.pravatar.cc/80?img=12",
    offerImage: "https://picsum.photos/seed/offer-meal-1/600/400",
    title: "Free 3-Course Dinner",
    description:
      "Promote our new seasonal menu and get a complimentary 3-course dining experience for two",
    category: "Restaurant",
    location: "Downtown, New York",
    city: "New York",
    rating: 4.9,
    applications: 156,
    duration: "2 weeks"
  },
  {
    id: 2,
    businessName: "Luxe Beauty Salon",
    businessLogo: "https://i.pravatar.cc/80?img=32",
    offerImage: "https://picsum.photos/seed/offer-beauty-1/600/400",
    title: "Complete Hair Makeover",
    description:
      "Hair cut, color & styling package worth $250. Perfect for influencers in beauty niche",
    category: "Beauty",
    location: "Uptown, Los Angeles",
    city: "Los Angeles",
    rating: 4.8,
    applications: 89,
    duration: "1 week"
  },
  {
    id: 3,
    businessName: "Urban Threads",
    businessLogo: "https://i.pravatar.cc/80?img=14",
    offerImage: "https://picsum.photos/seed/offer-fashion-1/600/400",
    title: "Designer Outfit Package",
    description:
      "Complete outfit worth $300 from our new collection. Style and share your looks",
    category: "Fashion",
    location: "Mall District, Chicago",
    city: "Chicago",
    rating: 4.7,
    applications: 67,
    duration: "3 weeks"
  },
];

const categories = [
  { id: 1, name: "All", icon: "ri-apps-line", count: 45 },
  { id: 2, name: "Restaurant", icon: "ri-restaurant-line", count: 12 },
  { id: 3, name: "Beauty", icon: "ri-scissors-line", count: 8 },
  { id: 4, name: "Fashion", icon: "ri-shirt-line", count: 15 },
  { id: 5, name: "Fitness", icon: "ri-run-line", count: 6 },
  { id: 6, name: "Travel", icon: "ri-plane-line", count: 4 },
  { id: 7, name: "Activities", icon: "ri-gamepad-line", count: 10 },
];

// List of cities for filtering
const cities = [
  "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
  "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
  "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis",
  "Seattle", "Denver", "Washington", "Boston", "El Paso", "Nashville",
  "Detroit", "Oklahoma City", "Portland", "Las Vegas", "Memphis", "Louisville",
  "Baltimore", "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento",
  "Kansas City", "Mesa", "Atlanta", "Omaha", "Colorado Springs", "Raleigh",
  "Virginia Beach", "Miami", "Oakland", "Minneapolis", "Tulsa", "Cleveland",
  "Wichita", "Arlington", "Tampa", "New Orleans", "Honolulu", "Anaheim",
  "Santa Ana", "St. Louis", "Riverside", "Corpus Christi", "Lexington",
  "Henderson", "Stockton", "Saint Paul", "St. Petersburg", "Cincinnati",
  "St. Louis", "Pittsburgh", "Greensboro", "Lincoln", "Anchorage", "Plano",
  "Orlando", "Irvine", "Newark", "Durham", "Chula Vista", "Toledo", "Fort Wayne",
  "St. Petersburg", "Laredo", "Jersey City", "Chandler", "Madison", "Lubbock",
  "Scottsdale", "Reno", "Buffalo", "Gilbert", "Glendale", "North Las Vegas",
  "Winston-Salem", "Chesapeake", "Norfolk", "Fremont", "Garland", "Irving",
  "Hialeah", "Richmond", "Boise", "Spokane", "Baton Rouge", "Tacoma",
  "San Bernardino", "Modesto", "Fontana", "Santa Clarita", "Birmingham",
  "Oxnard", "Fayetteville", "Moreno Valley", "Rochester", "Glendale",
  "Huntington Beach", "Salt Lake City", "Grand Rapids", "Amarillo", "Yonkers",
  "Aurora", "Montgomery", "Akron", "Little Rock", "Huntsville", "Augusta",
  "Port St. Lucie", "Grand Prairie", "Columbus", "Tallahassee", "Overland Park",
  "Tempe", "McKinney", "Mobile", "Cape Coral", "Shreveport", "Frisco",
  "Knoxville", "Worcester", "Brownsville", "Vancouver", "Fort Lauderdale",
  "Sioux Falls", "Ontario", "Chattanooga", "Providence", "Newport News",
  "Rancho Cucamonga", "Santa Rosa", "Oceanside", "Salem", "Elk Grove",
  "Garden Grove", "Pembroke Pines", "Peoria", "Eugene", "Corona", "Cary",
  "Springfield", "Fort Collins", "Jackson", "Alexandria", "Hayward", "Lancaster",
  "Lakewood", "Lafayette", "Palmdale", "Hollywood", "Brooklyn", "Paterson",
  "Naperville", "Pomona", "Joliet", "Torrance", "Gainesville", "McAllen",
  "Syracuse", "Concord", "Fort Smith", "Coral Springs", "Lakewood", "Pembroke Pines",
  "Hollywood", "Pasadena", "Killeen", "Macon", "Kansas City", "Bellevue",
  "Surprise", "Roseville", "Thornton", "Odessa", "Denton", "Waco", "St. George",
  "Carrollton", "Midland", "Norman", "Athens", "Abilene", "Beaumont", "Round Rock",
  "Allentown", "Evansville", "Richardson", "Odessa", "Arvada", "Cambridge",
  "Sugar Land", "Pearland", "Palm Bay", "Columbia", "Harlingen", "Pueblo",
  "Tyler", "Stamford", "Topeka", "Wichita Falls", "Green Bay", "Thousand Oaks",
  "El Monte", "McKinney", "West Valley City", "Clearwater", "Waterbury",
  "Costa Mesa", "Westminster", "Santa Monica", "Everett", "Downey", "Lowell",
  "Gresham", "Inglewood", "Richmond", "Jurupa Valley", "Rialto", "Daly City",
  "Compton", "Burbank", "San Mateo", "Renton", "Antioch", "High Point",
  "Round Rock", "Lakewood", "Brockton", "Westminster", "South Gate", "Norwalk",
  "Daly City", "Burbank", "Renton", "Inglewood", "Vacaville", "Edinburg",
  "Carmel", "Spokane Valley", "San Angelo", "La Crosse", "Bellingham",
  "Kenosha", "Racine", "Appleton", "Eau Claire", "Janesville", "Oshkosh",
  "Waukesha", "Fond du Lac", "Sheboygan", "Wausau", "Stevens Point", "Superior",
  "Beloit", "Fitchburg", "Neenah", "Menasha", "Beaver Dam", "Marshfield",
  "Wisconsin Rapids", "Baraboo", "Portage", "Watertown", "Oconomowoc",
  "Cudahy", "South Milwaukee", "St. Francis", "Greendale", "Oak Creek",
  "Franklin", "Muskego", "New Berlin", "Greenfield", "West Allis", "Wauwatosa"
];

const top10Offers = [
  {
    id: 1,
    businessName: "Bella Vista Restaurant",
    title: "Free 3-Course Dinner",
    category: "Restaurant",
    rating: 4.9,
    applications: 156,
    image: "https://picsum.photos/seed/top-restaurant-1/200/200"
  },
  {
    id: 2,
    businessName: "Luxe Beauty Salon",
    title: "Complete Hair Makeover",
    category: "Beauty",
    rating: 4.8,
    applications: 89,
    image: "https://picsum.photos/seed/top-beauty-1/200/200"
  },
  {
    id: 3,
    businessName: "Urban Threads",
    title: "Designer Outfit Package",
    category: "Fashion",
    rating: 4.7,
    applications: 67,
    image: "https://picsum.photos/seed/top-fashion-1/200/200"
  },
];

const nearbyBusinesses = [
  {
    id: 1,
    businessName: "Café Mocha",
    category: "Restaurant",
    distance: "0.2 miles",
    rating: 4.6,
    image: "https://picsum.photos/seed/near-coffee-1/200/200",
    offers: 5,
  },
  {
    id: 2,
    businessName: "FitLife Gym",
    category: "Fitness",
    distance: "0.5 miles",
    rating: 4.5,
    image: "https://picsum.photos/seed/near-gym-1/200/200",
    offers: 3,
  },
  {
    id: 3,
    businessName: "Style Studio",
    category: "Beauty",
    distance: "0.8 miles",
    rating: 4.7,
    image: "https://picsum.photos/seed/near-beauty-1/200/200",
    offers: 7,
  },
];

const trendingBusinesses = [
  {
    id: 1,
    businessName: "Eco Fashion Co",
    category: "Fashion",
    trend: "Rising",
    growth: "+23%",
    image: "https://picsum.photos/seed/trend-fashion-1/200/200",
    trendIcon: "ri-trending-up-line",
  },
  {
    id: 2,
    businessName: "Tech Hub Café",
    category: "Restaurant",
    trend: "Hot",
    growth: "+45%",
    image: "https://picsum.photos/seed/trend-restaurant-1/200/200",
    trendIcon: "ri-fire-line",
  },
  {
    id: 3,
    businessName: "Wellness Spa",
    category: "Beauty",
    trend: "Popular",
    growth: "+18%",
    image: "https://picsum.photos/seed/trend-beauty-1/200/200",
    trendIcon: "ri-heart-line",
  },
];

const categoryDetails = {
  "Restaurant": {
    types: ["Classic", "Fast Food", "World Cuisine", "Fine Dining", "Cafe", "Food Truck"]
  },
  "Beauty": {
    types: ["Hair Salon", "Nail Salon", "Spa", "Skincare", "Makeup", "Barber Shop"]
  },
  "Fashion": {
    types: ["Clothing", "Accessories", "Shoes", "Jewelry", "Vintage", "Luxury"]
  },
  "Fitness": {
    types: ["Gym", "Yoga", "Pilates", "CrossFit", "Dance", "Martial Arts"]
  },
  "Travel": {
    types: ["Hotels", "Tourism", "Adventure", "Luxury", "Budget", "Eco-Tourism"]
  },
  "Activities": {
    types: ["Entertainment", "Sports", "Outdoor", "Indoor", "Events", "Tours"]
  }
};

// Dynamic announcements data - can be fetched from API later
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
  const [activeTab, setActiveTab] = useState("available");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCityFilter, setShowCityFilter] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [tempSelectedCategory, setTempSelectedCategory] = useState("");
  const [userLocation, setUserLocation] = useState("Downtown, NYC");
  const router = useRouter();

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === "All") {
      setSelectedCategory("All");
      setShowCategoryModal(false);
    } else {
      setTempSelectedCategory(categoryName);
      setShowCategoryModal(true);
    }
  };

  const handleCategoryTypeSelect = (category: string, type: string) => {
    setShowCategoryModal(false);
    const cityParam = selectedCity ? `&city=${encodeURIComponent(selectedCity)}` : '';
    router.push(`/category/${category.toLowerCase()}?type=${type.toLowerCase()}${cityParam}`);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city === selectedCity ? null : city);
    setShowCityFilter(false);
  };

  const filteredOffers = barterOffers.filter((offer) => {
    const categoryMatch = selectedCategory === "All" || offer.category === selectedCategory;
    const cityMatch = !selectedCity || (offer.city && offer.city.toLowerCase() === selectedCity.toLowerCase());
    return categoryMatch && cityMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50/60 pb-18">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-4 pt-4 pb-4 sm:px-6">
        {/* Scrolling Banner */}
        <div className="mb-6 w-full mx-auto max-w-4xl">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3 sm:p-4 overflow-hidden">
            <div className="flex animate-scroll">
              <div className="flex space-x-6 sm:space-x-8 whitespace-nowrap">
                {[...Array(2)].map((_, setIndex) => (
                  <div key={setIndex} className="flex space-x-6 sm:space-x-8">
                    {dynamicAnnouncements.map((announcement) => (
                      <div key={`${setIndex}-${announcement.id}`} className="flex items-center space-x-2 text-white/90">
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
        </div>

        {/* Logo Section */}
        <div className=" flex flex-col items-center mx-auto mb-6">
          <img 
            src={logo_dark.src}
            alt="Inshaar" 
            className="h-10 w-40 object-cover mb-1"
          />
          <span className="text-white/80 text-xs sm:text-sm">
            Influencer Dashboard
          </span>
        </div>

        {/* Location & Quick Actions */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="ri-map-pin-line text-white/80 text-sm"></i>
            <span className="text-white/80 text-xs sm:text-sm">
              {userLocation}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/search">
              <button className="bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-white/30 transition-all duration-300 active:scale-95">
                <i className="ri-search-line mr-1"></i>
                Search
              </button>
            </Link>
            <button className="bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-white/30 transition-all duration-300 active:scale-95">
              <i className="ri-refresh-line mr-1"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white px-4 py-4 shadow-sm sm:px-6">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("available")}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
              activeTab === "available"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Available Offers
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 sm:px-6">
        {activeTab === "available" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Categories - UPDATED */}
            <div>
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Categories
                </h2>
                <div className="flex items-center space-x-3">
                  {/* City Filter Button */}
                  <button
                    onClick={() => setShowCityFilter(!showCityFilter)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                      selectedCity
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <i className="ri-map-pin-line"></i>
                    <span>{selectedCity || "All Cities"}</span>
                    {selectedCity && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCity(null);
                        }}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                      >
                        <i className="ri-close-line text-xs"></i>
                      </button>
                    )}
                  </button>
                  <span className="text-gray-500 text-sm">Category &gt;</span>
                </div>
              </div>

              {/* City Filter Dropdown */}
              {showCityFilter && (
                <div className="mb-4 px-2">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 max-h-64 overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-gray-800">Select City</h3>
                      <button
                        onClick={() => {
                          setShowCityFilter(false);
                          setCitySearchQuery("");
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <i className="ri-close-line text-lg"></i>
                      </button>
                    </div>
                    {/* City Search Input */}
                    <div className="mb-3">
                      <div className="relative">
                        <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                        <input
                          type="text"
                          placeholder="Search city..."
                          value={citySearchQuery}
                          onChange={(e) => setCitySearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {cities
                        .filter((city) =>
                          city.toLowerCase().includes(citySearchQuery.toLowerCase())
                        )
                        .map((city) => (
                          <button
                            key={city}
                            onClick={() => handleCitySelect(city)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                              selectedCity === city
                                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {city}
                          </button>
                        ))}
                    </div>
                    {cities.filter((city) =>
                      city.toLowerCase().includes(citySearchQuery.toLowerCase())
                    ).length === 0 && (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No cities found
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.name)}
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all duration-300 border-2 ${
                      selectedCategory === category.name
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-purple-500/25 border-transparent scale-105"
                        : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <i
                      className={`${category.icon} text-xl sm:text-2xl mb-2`}
                    ></i>
                    <span className="text-xs sm:text-sm font-semibold">
                      {category.name}
                    </span>
                    <span
                      className={`text-xs mt-1 ${
                        selectedCategory === category.name
                          ? "text-white/80"
                          : "text-gray-500"
                      }`}
                    >
                      {category.count} offers
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Top 10 Offers - Carousel Design */}
            <div className="bg-white rounded-lg p-5 sm:p-6 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <i className="ri-trophy-line text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                      Top Offers
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      Most popular collaborations
                    </p>
                  </div>
                </div>
                <Link
                  href="/search"
                  className="text-purple-600 text-sm font-semibold hover:text-purple-700 transition-colors"
                >
                  View All
                </Link>
              </div>
              <div className="overflow-x-auto scrollbar-hide -mx-5 sm:-mx-6 px-5 sm:px-6">
                <div className="flex space-x-4 pb-2" style={{ scrollSnapType: 'x mandatory' }}>
                  {top10Offers.map((offer, index) => (
                    <div
                      key={offer.id}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group flex-shrink-0 w-[280px] sm:w-[300px]"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <div className="relative mb-4">
                        <img
                          src={offer.image}
                          alt={offer.businessName}
                          className="w-full h-32 sm:h-28 rounded-xl object-cover shadow-md"
                        />
                        <div className="absolute top-3 left-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                            {index + 1}
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                          {offer.applications} applied
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base flex-1 pr-2">
                            {offer.businessName}
                          </h4>
                        </div>
                        <p className="text-gray-600 text-xs">{offer.title}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <i className="ri-star-fill text-yellow-400 text-sm"></i>
                            <span className="text-xs text-gray-600 font-semibold">
                              {offer.rating}
                            </span>
                          </div>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                            {offer.category}
                          </span>
                        </div>
                      </div>
                      <Link href={`/offer-details/${offer.id}`}>
                        <button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95">
                          Apply Now
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* What's Around Me - Modern Card Design */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <i className="ri-map-pin-line text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                      Nearby Businesses
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      Close to your location
                    </p>
                  </div>
                </div>
                <button className="text-purple-600 text-sm font-semibold hover:text-purple-700 transition-colors">
                  <i className="ri-refresh-line mr-1"></i>
                  Refresh
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbyBusinesses.map((business) => (
                  <div
                    key={business.id}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="relative mb-4">
                      <img
                        src={business.image}
                        alt={business.businessName}
                        className="w-full h-32 sm:h-28 rounded-xl object-cover shadow-md"
                      />
                      <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                        {business.offers} offers
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-800 text-sm sm:text-base">
                        {business.businessName}
                      </h4>
                      <p className="text-gray-600 text-xs">
                        {business.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <i className="ri-map-pin-line text-blue-500 text-sm"></i>
                          <span className="text-xs text-gray-600">
                            {business.distance}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <i className="ri-star-fill text-yellow-400 text-sm"></i>
                          <span className="text-xs text-gray-600 font-semibold">
                            {business.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95">
                      Explore Offers
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Businesses - Modern Card Design */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <i className="ri-fire-line text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                      Trending Now
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      Rising opportunities
                    </p>
                  </div>
                </div>
                <Link
                  href="/search"
                  className="text-purple-600 text-sm font-semibold hover:text-purple-700 transition-colors"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingBusinesses.map((business) => (
                  <div
                    key={business.id}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="relative mb-4">
                      <img
                        src={business.image}
                        alt={business.businessName}
                        className="w-full h-32 sm:h-28 rounded-xl object-cover shadow-md"
                      />
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            business.trend === "Hot"
                              ? "bg-red-500 text-white"
                              : business.trend === "Rising"
                              ? "bg-green-500 text-white"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {business.trend}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-800 text-sm sm:text-base">
                        {business.businessName}
                      </h4>
                      <p className="text-gray-600 text-xs">
                        {business.category}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <i
                            className={
                              business.trendIcon + " text-orange-500 text-sm"
                            }
                          ></i>
                          <span className="text-xs text-gray-600">
                            Trending
                          </span>
                        </div>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {business.growth}
                        </span>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95">
                      Explore
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtered Offers - Modern Card Design */}
            {selectedCategory !== "All" && (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <i className="ri-gift-line text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                      {selectedCategory} Offers
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      Handpicked collaborations for you
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {filteredOffers
                    .map((offer) => (
                      <div
                        key={offer.id}
                        className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-3xl group"
                      >
                        {/* Large Hero Image */}
                        <div className="relative h-56 sm:h-64 overflow-hidden">
                          <img
                            src={offer.offerImage}
                            alt={offer.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                          {/* Top Badges */}
                          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                            <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                              {offer.category}
                            </span>
                          </div>

                          {/* Bottom Gradient Content */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <img
                                src={offer.businessLogo}
                                alt={offer.businessName}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                              />
                              <div className="flex-1">
                                <h3 className="font-bold text-white text-lg">
                                  {offer.businessName}
                                </h3>
                                <div className="flex items-center space-x-3 mt-1">
                                  <div className="flex items-center space-x-1">
                                    <i className="ri-star-fill text-yellow-400 text-sm"></i>
                                    <span className="text-white text-sm font-semibold">
                                      {offer.rating}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <i className="ri-user-line text-white/80 text-sm"></i>
                                    <span className="text-white/80 text-sm">
                                      {offer.applications} applied
                                    </span>
                                  </div>
                                  <span className="text-white/80 text-sm">
                                    • {offer.location}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Content Below Image */}
                        <div className="p-5 sm:p-6">
                          <h4 className="font-bold text-gray-800 text-xl sm:text-2xl mb-3">
                            {offer.title}
                          </h4>
                          <p className="text-gray-600 mb-5 leading-relaxed text-sm sm:text-base">
                            {offer.description}
                          </p>

                          <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <i className="ri-time-line"></i>
                                <span>{offer.duration}</span>
                              </div>
                            </div>
                          </div>

                          <Link href={`/offer-details/${offer.id}`}>
                            <button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-100 group-hover:shadow-2xl">
                              <span className="flex items-center justify-center space-x-2">
                                <i className="ri-send-plane-fill"></i>
                                <span>Apply for Collaboration</span>
                              </span>
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {tempSelectedCategory} Types
                </h3>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-1">
                Choose a specific type to explore offers
              </p>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid grid-cols-2 gap-3">
                {categoryDetails[tempSelectedCategory as keyof typeof categoryDetails]?.types.map((type, index) => (
                  <button
                    key={index}
                    onClick={() => handleCategoryTypeSelect(tempSelectedCategory, type)}
                    className="bg-gray-50 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white text-gray-700 p-4 rounded-2xl text-center transition-all duration-300 hover:scale-105"
                  >
                    <span className="font-semibold text-sm">{type}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <AdvancedBottomNav userType="influencer" />
    </div>
  );
}