
'use client';

import { useState } from 'react';
import Link from 'next/link';

const offerDetails = {
  id: 1,
  businessName: "Bella Vista Restaurant",
  businessLogo: "https://readdy.ai/api/search-image?query=Elegant%20restaurant%20logo%2C%20modern%20dining%20establishment%2C%20sophisticated%20branding%2C%20clean%20minimalist%20design%2C%20professional%20restaurant%20identity%2C%20upscale%20dining%20logo&width=80&height=80&seq=resto2&orientation=squarish",
  title: "Free 3-Course Dinner",
  description: "Experience our new seasonal menu featuring locally sourced ingredients and innovative culinary techniques. This exclusive collaboration includes appetizer, main course, and dessert with wine pairing.",
  value: "$120",
  category: "Restaurant",
  location: "Downtown Plaza, 123 Main Street",
  requirements: [
    "Minimum 10K followers",
    "Food/Lifestyle niche",
    "Post 3 Instagram stories",
    "1 Instagram post with our hashtag",
    "Tag @bellavista in all posts"
  ],
  images: [
    "https://readdy.ai/api/search-image?query=Gourmet%20restaurant%20meal%2C%20beautifully%20plated%20fine%20dining%20dish%2C%20elegant%20food%20presentation%2C%20professional%20food%20photography%2C%20warm%20restaurant%20lighting%2C%20luxury%20dining%20experience&width=350&height=250&seq=meal3&orientation=landscape",
    "https://readdy.ai/api/search-image?query=Elegant%20restaurant%20interior%2C%20fine%20dining%20atmosphere%2C%20sophisticated%20table%20setting%2C%20warm%20ambient%20lighting%2C%20luxury%20restaurant%20decor%2C%20upscale%20dining%20room&width=350&height=250&seq=interior1&orientation=landscape",
    "https://readdy.ai/api/search-image?query=Professional%20chef%20preparing%20gourmet%20dish%2C%20culinary%20artistry%2C%20kitchen%20expertise%2C%20fine%20dining%20preparation%2C%20chef%20at%20work%20in%20restaurant%20kitchen&width=350&height=250&seq=chef1&orientation=landscape"
  ],
  businessInfo: {
    rating: 4.8,
    reviews: 234,
    collaborations: 45,
    responseTime: "2 hours"
  }
};

const reviews = [
  {
    id: 1,
    influencerName: "Emma Style",
    username: "@emmastyle",
    rating: 5,
    comment: "Amazing experience! The food was incredible and the staff was so welcoming. Great collaboration!",
    profileImage: "https://readdy.ai/api/search-image?query=Young%20female%20lifestyle%20influencer%2C%20professional%20headshot%2C%20confident%20smile%2C%20modern%20portrait%20photography%2C%20bright%20natural%20lighting%2C%20social%20media%20personality&width=50&height=50&seq=reviewer1&orientation=squarish"
  },
  {
    id: 2,
    influencerName: "Food Explorer",
    username: "@foodexplorer",
    rating: 5,
    comment: "Perfect partnership! The restaurant exceeded all expectations. Highly recommend for food influencers.",
    profileImage: "https://readdy.ai/api/search-image?query=Young%20male%20food%20influencer%2C%20professional%20headshot%2C%20friendly%20expression%2C%20modern%20portrait%20photography%2C%20natural%20lighting%2C%20food%20blogger%20personality&width=50&height=50&seq=reviewer2&orientation=squarish"
  }
];

interface OfferDetailsClientProps {
  offerId: string;
}

export default function OfferDetailsClient({ offerId }: OfferDetailsClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showApplyModal, setShowApplyModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-6 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <Link href="/influencer/dashboard">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-arrow-left-line text-white text-xl"></i>
            </div>
          </Link>
          <h1 className="text-white font-semibold text-lg">Offer Details</h1>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <i className="ri-heart-line text-white text-xl"></i>
          </div>
        </div>
      </div>

      {/* Image Carousel */}
      <div className="relative">
        <div className="h-64 overflow-hidden">
          <img 
            src={offerDetails.images[currentImageIndex]}
            alt="Offer"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Image indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {offerDetails.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Value badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full font-semibold">
          {offerDetails.value}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 pb-24">
        {/* Business Info */}
        <div className="flex items-center space-x-4 mb-6">
          <img 
            src={offerDetails.businessLogo}
            alt={offerDetails.businessName}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h2 className="font-bold text-xl text-gray-800">{offerDetails.businessName}</h2>
            <p className="text-gray-600">{offerDetails.category} • {offerDetails.location}</p>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-1">
                <i className="ri-star-fill text-yellow-400"></i>
                <span className="text-sm font-medium">{offerDetails.businessInfo.rating}</span>
                <span className="text-gray-500 text-sm">({offerDetails.businessInfo.reviews})</span>
              </div>
              <span className="text-gray-500 text-sm">{offerDetails.businessInfo.collaborations} collaborations</span>
            </div>
          </div>
        </div>

        {/* Offer Title */}
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{offerDetails.title}</h3>

        {/* Description */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-3">What You'll Get</h4>
          <p className="text-gray-600 leading-relaxed">{offerDetails.description}</p>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-3">Requirements</h4>
          <div className="space-y-2">
            {offerDetails.requirements.map((req, index) => (
              <div key={index} className="flex items-center space-x-3">
                <i className="ri-check-line text-green-500"></i>
                <span className="text-gray-600">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Business Stats */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-4">Business Info</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{offerDetails.businessInfo.collaborations}</div>
              <div className="text-gray-500 text-sm">Collaborations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{offerDetails.businessInfo.responseTime}</div>
              <div className="text-gray-500 text-sm">Response Time</div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-4">Recent Reviews</h4>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-start space-x-3">
                  <img 
                    src={review.profileImage}
                    alt={review.influencerName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-800">{review.influencerName}</span>
                      <span className="text-purple-600 text-sm">{review.username}</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(review.rating)].map((_, i) => (
                        <i key={i} className="ri-star-fill text-yellow-400 text-sm"></i>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
        <button
          onClick={() => setShowApplyModal(true)}
          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Apply for Collaboration
        </button>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
            <div className="text-center mb-6">
              <i className="ri-check-double-line text-6xl text-green-500 mb-4"></i>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Application Sent!</h3>
              <p className="text-gray-600">We'll notify you when the business responds</p>
            </div>
            
            <button
              onClick={() => setShowApplyModal(false)}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
