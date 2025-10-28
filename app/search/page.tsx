
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdvancedBottomNav from '../../components/AdvancedBottomNav';

const categories = [
  { 
    id: 1, 
    name: 'Restaurant', 
    icon: 'ri-restaurant-line', 
    count: 45,
    gradient: 'from-red-400 to-orange-500',
    bgImage: 'https://readdy.ai/api/search-image?query=icon%2C%20Modern%20restaurant%20dining%2C%20elegant%20food%20service%2C%20contemporary%20culinary%20experience%2C%20sophisticated%20restaurant%20interior%2C%20fine%20dining%20atmosphere%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20subtle%20shadows&width=100&height=100&seq=restaurant1&orientation=squarish'
  },
  { 
    id: 2, 
    name: 'Beauty', 
    icon: 'ri-scissors-line', 
    count: 32,
    gradient: 'from-pink-400 to-rose-500',
    bgImage: 'https://readdy.ai/api/search-image?query=icon%2C%20Luxury%20beauty%20salon%2C%20professional%20makeup%20and%20skincare%2C%20elegant%20cosmetic%20services%2C%20premium%20beauty%20treatment%2C%20sophisticated%20wellness%20spa%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20subtle%20shadows&width=100&height=100&seq=beauty1&orientation=squarish'
  },
  { 
    id: 3, 
    name: 'Fashion', 
    icon: 'ri-shirt-line', 
    count: 28,
    gradient: 'from-purple-400 to-indigo-5',
    bgImage: 'https://readdy.ai/api/search-image?query=icon%2C%20Trendy%20fashion%20boutique%2C%20stylish%20clothing%20collection%2C%20modern%20apparel%20store%2C%20contemporary%20fashion%20design%2C%20elegant%20wardrobe%20styling%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20subtle%20shadows&width=100&height=100&seq=fashion1&orientation=squarish'
  },
  { 
    id: 4, 
    name: 'Fitness', 
    icon: 'ri-run-line', 
    count: 19,
    gradient: 'from-green-400 to-emerald-500',
    bgImage: 'https://readdy.ai/api/search-image?query=icon%2C%20Modern%20fitness%20gym%2C%20professional%20workout%20equipment%2C%20healthy%20lifestyle%20training%2C%20contemporary%20exercise%20facility%2C%20athletic%20wellness%20center%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20subtle%20shadows&width=100&height=100&seq=fitness1&orientation=squarish'
  },
  { 
    id: 5, 
    name: 'Travel', 
    icon: 'ri-plane-line', 
    count: 15,
    gradient: 'from-blue-400 to-cyan-500',
    bgImage: 'https://readdy.ai/api/search-image?query=icon%2C%20Luxury%20travel%20experience%2C%20premium%20vacation%20destinations%2C%20elegant%20tourism%20services%2C%20sophisticated%20travel%20planning%2C%20beautiful%20adventure%20destinations%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20subtle%20shadows&width=100&height=100&seq=travel1&orientation=squarish'
  },
  { 
    id: 6, 
    name: 'Tech', 
    icon: 'ri-smartphone-line', 
    count: 12,
    gradient: 'from-gray-400 to-slate-500',
    bgImage: 'https://readdy.ai/api/search-image?query=icon%2C%20Modern%20technology%20gadgets%2C%20innovative%20digital%20devices%2C%20contemporary%20tech%20products%2C%20sophisticated%20electronic%20equipment%2C%20cutting-edge%20technology%20solutions%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20subtle%20shadows&width=100&height=100&seq=tech1&orientation=squarish'
  }
];

const featuredOffers = [
  {
    id: 1,
    businessName: "Ocean View Spa",
    title: "Full Day Spa Package",
    value: "$250",
    category: "Beauty",
    image: "https://readdy.ai/api/search-image?query=Luxury%20spa%20treatment%20room%2C%20relaxing%20wellness%20environment%2C%20professional%20massage%20therapy%2C%20elegant%20spa%20interior%2C%20serene%20beauty%20salon%20atmosphere&width=300&height=200&seq=spa1&orientation=landscape",
    logo: "https://readdy.ai/api/search-image?query=Luxury%20spa%20logo%2C%20elegant%20wellness%20branding%2C%20premium%20beauty%20services%20logo%2C%20sophisticated%20spa%20brand%20identity%2C%20minimalist%20wellness%20design&width=60&height=60&seq=spalogo1&orientation=squarish"
  },
  {
    id: 2,
    businessName: "Street Style Boutique",
    title: "Complete Wardrobe Makeover",
    value: "$400",
    category: "Fashion",
    image: "https://readdy.ai/api/search-image?query=Trendy%20fashion%20boutique%20interior%2C%20stylish%20clothing%20display%2C%20modern%20retail%20store%2C%20fashionable%20apparel%20collection%2C%20contemporary%20shopping%20experience&width=300&height=200&seq=boutique1&orientation=landscape",
    logo: "https://readdy.ai/api/search-image?query=Modern%20fashion%20boutique%20logo%2C%20trendy%20clothing%20brand%20identity%2C%20urban%20fashion%20logo%2C%20stylish%20apparel%20branding%2C%20contemporary%20fashion%20design&width=60&height=60&seq=fashionlogo1&orientation=squarish"
  }
];

// ... existing code ...

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // Load countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
        const data = await response.json();
        const countryList = data.map((country: any) => ({
          name: country.name.common,
          code: country.cca2
        })).sort((a: any, b: any) => a.name.localeCompare(b.name));
        setCountries(countryList);
      } catch (error) {
        console.error('Error fetching countries:', error);
        // Fallback data
        setCountries([
          { name: 'United States', code: 'US' },
          { name: 'United Kingdom', code: 'GB' },
          { name: 'Canada', code: 'CA' },
          { name: 'Australia', code: 'AU' },
          { name: 'Germany', code: 'DE' },
          { name: 'France', code: 'FR' },
          { name: 'India', code: 'IN' },
          { name: 'Japan', code: 'JP' },
          { name: 'Brazil', code: 'BR' },
          { name: 'Mexico', code: 'MX' }
        ]);
      }
    };

    fetchCountries();
  }, []);

  // Load cities when country is selected
  useEffect(() => {
    if (selectedCountry) {
      setLoadingCities(true);
      setSelectedCity('');
      
      // Simulate API call for cities (using a mock service)
      const fetchCities = async () => {
        try {
          // Using a free cities API
          const response = await fetch(`https://api.countrystatecity.in/v1/countries/${countries.find(c => c.name === selectedCountry)?.code}/cities`, {
            headers: {
              'X-CSCAPI-KEY': 'YOUR_API_KEY' // This would need a real API key
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setCities(data.map((city: any) => ({ name: city.name })));
          } else {
            // Fallback cities data
            const fallbackCities = {
              'US': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'],
              'GB': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh', 'Bristol', 'Leicester'],
              'CA': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
              'AU': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong'],
              'DE': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'],
              'FR': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
              'IN': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow'],
              'JP': ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto', 'Kawasaki', 'Saitama'],
              'BR': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'],
              'MX': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Juárez', 'Zapopan', 'Nezahualcóyotl', 'Guadalupe']
            };
            
            const countryCode = countries.find(c => c.name === selectedCountry)?.code;
            const cityList = fallbackCities[countryCode as keyof typeof fallbackCities] || [];
            setCities(cityList.map(city => ({ name: city })));
          }
        } catch (error) {
          console.error('Error fetching cities:', error);
          // Fallback cities
          setCities([
            { name: 'New York' },
            { name: 'Los Angeles' },
            { name: 'Chicago' },
            { name: 'Houston' },
            { name: 'Phoenix' }
          ]);
        } finally {
          setLoadingCities(false);
        }
      };

      fetchCities();
    } else {
      setCities([]);
    }
  }, [selectedCountry, countries]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedCity('');
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const clearFilters = () => {
    setSelectedCountry('');
    setSelectedCity('');
    setSelectedCategory('');
    setSearchQuery('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCountry) count++;
    if (selectedCity) count++;
    if (selectedCategory) count++;
    if (searchQuery) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/influencer/dashboard">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-arrow-left-line text-white text-xl"></i>
            </div>
          </Link>
          <div className="flex flex-col items-center">
            <h1 className="font-['Pacifico'] text-2xl text-white mb-1">Inshaar</h1>
            <span className="text-white/80 text-sm">Discover</span>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative"
          >
            <i className="ri-filter-line text-white text-xl"></i>
            {getActiveFiltersCount() > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{getActiveFiltersCount()}</span>
              </div>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search offers, businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 px-4 py-3 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70"></i>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white mx-4 -mt-4 rounded-2xl shadow-lg p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
            <button 
              onClick={clearFilters}
              className="text-purple-600 text-sm font-medium hover:text-purple-700"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-4">
            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                disabled={!selectedCountry || loadingCities}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select a city</option>
                {loadingCities ? (
                  <option disabled>Loading cities...</option>
                ) : (
                  cities.map((city, index) => (
                    <option key={index} value={city.name}>
                      {city.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.name)}
                    className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                      selectedCategory === category.name
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <i className={`${category.icon} text-lg`}></i>
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters Summary */}
            {(selectedCountry || selectedCity || selectedCategory || searchQuery) && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Search: "{searchQuery}"
                    </span>
                  )}
                  {selectedCountry && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Country: {selectedCountry}
                    </span>
                  )}
                  {selectedCity && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                      City: {selectedCity}
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      Category: {selectedCategory}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Advanced Categories Section */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
          <button className="text-purple-600 font-medium text-sm flex items-center space-x-1">
            <span>View All</span>
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.name)}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`relative overflow-hidden rounded-3xl transition-all duration-500 transform ${
                selectedCategory === category.name
                  ? 'scale-105 shadow-2xl'
                  : hoveredCategory === category.id
                  ? 'scale-102 shadow-xl'
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={category.bgImage}
                  alt={category.name}
                  className="w-full h-full object-cover opacity-20"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} ${
                  selectedCategory === category.name ? 'opacity-90' : 'opacity-80'
                }`}></div>
              </div>
              
              {/* Content */}
              <div className="relative p-6 h-32 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    selectedCategory === category.name ? 'bg-white/30 scale-110' : 'bg-white/20'
                  }`}>
                    <i className={`${category.icon} text-2xl`}></i>
                  </div>
                  {selectedCategory === category.name && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <i className="ri-check-line text-purple-600 text-sm"></i>
                    </div>
                  )}
                </div>
                
                <div className="text-left">
                  <div className="font-bold text-lg mb-1">{category.name}</div>
                  <div className="text-sm opacity-90 flex items-center space-x-1">
                    <span>{category.count} offers</span>
                    <i className="ri-arrow-right-s-line text-xs"></i>
                  </div>
                </div>
              </div>
              
              {/* Animated Border */}
              {selectedCategory === category.name && (
                <div className="absolute inset-0 rounded-3xl border-2 border-white/50 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Trending Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Trending Now</h3>
          <div className="flex flex-wrap gap-2">
            {['Free Meals', 'Spa Days', 'Workout Gear', 'Travel Deals', 'Tech Reviews', 'Fashion Hauls'].map((tag, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 rounded-full text-sm font-medium hover:from-pink-200 hover:to-purple-200 transition-all duration-300 transform hover:scale-105"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Summary */}
        {(searchQuery || selectedCountry || selectedCity || selectedCategory) && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Search Results</h3>
                <p className="text-gray-600 text-sm">
                  {searchQuery && `Searching for "${searchQuery}"`}
                  {selectedCountry && ` in ${selectedCountry}`}
                  {selectedCity && `, ${selectedCity}`}
                  {selectedCategory && ` - ${selectedCategory} category`}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {featuredOffers.filter(offer => {
                    const matchesSearch = !searchQuery || 
                      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      offer.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      offer.category.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesCategory = !selectedCategory || offer.category === selectedCategory;
                    return matchesSearch && matchesCategory;
                  }).length}
                </div>
                <div className="text-gray-500 text-sm">offers found</div>
              </div>
            </div>
          </div>
        )}

        {/* Featured Offers */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Featured Offers</h2>
        <div className="space-y-4">
          {(() => {
            const filteredOffers = featuredOffers.filter(offer => {
              const matchesSearch = !searchQuery || 
                offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                offer.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                offer.category.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesCategory = !selectedCategory || offer.category === selectedCategory;
              return matchesSearch && matchesCategory;
            });

            if (filteredOffers.length === 0 && (searchQuery || selectedCategory)) {
              return (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-search-line text-4xl text-gray-400"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No offers found</h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search terms or filters to find more offers
                  </p>
                  <button 
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Clear Filters
                  </button>
                </div>
              );
            }

            return filteredOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {offer.value}
                </div>
                <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  {offer.category}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <img 
                    src={offer.logo}
                    alt={offer.businessName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{offer.businessName}</h3>
                    <p className="text-gray-500 text-sm">{offer.category}</p>
                  </div>
                </div>
                
                <h4 className="font-bold text-lg text-gray-800 mb-4">{offer.title}</h4>
                
                <Link href={`/offer-details/${offer.id}`}>
                  <button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
            ));
          })()}
        </div>
      </div>

      {/* Advanced Bottom Navigation */}
      <AdvancedBottomNav userType="influencer" />
    </div>
  );
}
