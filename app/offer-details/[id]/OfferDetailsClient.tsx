"use client";

import { useState } from "react";
import Link from "next/link";

const offerDetails = {
  id: 1,
  businessName: "Bella Vista Restaurant",
  businessLogo:
    "https://readdy.ai/api/search-image?query=Elegant%20restaurant%20logo%2C%20modern%20dining%20establishment%2C%20sophisticated%20branding%2C%20clean%20minimalist%20design%2C%20professional%20restaurant%20identity%2C%20upscale%20dining%20logo&width=80&height=80&seq=resto2&orientation=squarish",
  title: "Free 3-Course Dinner",
  description:
    "Experience our new seasonal menu featuring locally sourced ingredients and innovative culinary techniques. This exclusive collaboration includes appetizer, main course, and dessert with wine pairing.",
  category: "Restaurant",
  location: "Downtown Plaza, 123 Main Street",
  requirements: [
    "Minimum 10K followers",
    "Food/Lifestyle niche",
    "Post 3 Instagram stories",
    "1 Instagram post with our hashtag",
    "Tag @bellavista in all posts",
  ],
  images: [
    "https://readdy.ai/api/search-image?query=Gourmet%20restaurant%20meal%2C%20beautifully%20plated%20fine%20dining%20dish%2C%20elegant%20food%20presentation%2C%20professional%20food%20photography%2C%20warm%20restaurant%20lighting%2C%20luxury%20dining%20experience&width=350&height=250&seq=meal3&orientation=landscape",
    "https://readdy.ai/api/search-image?query=Elegant%20restaurant%20interior%2C%20fine%20dining%20atmosphere%2C%20sophisticated%20table%20setting%2C%20warm%20ambient%20lighting%2C%20luxury%20restaurant%20decor%2C%20upscale%20dining%20room&width=350&height=250&seq=interior1&orientation=landscape",
    "https://readdy.ai/api/search-image?query=Professional%20chef%20preparing%20gourmet%20dish%2C%20culinary%20artistry%2C%20kitchen%20expertise%2C%20fine%20dining%20preparation%2C%20chef%20at%20work%20in%20restaurant%20kitchen&width=350&height=250&seq=chef1&orientation=landscape",
  ],
  businessInfo: {
    rating: 4.8,
    reviews: 234,
    collaborations: 45,
    responseTime: "2 hours",
  },
};

const reviews = [
  {
    id: 1,
    influencerName: "Emma Style",
    username: "@emmastyle",
    rating: 5,
    comment:
      "Amazing experience! The food was incredible and the staff was so welcoming. Great collaboration!",
    profileImage:
      "https://readdy.ai/api/search-image?query=Young%20female%20lifestyle%20influencer%2C%20professional%20headshot%2C%20confident%20smile%2C%20modern%20portrait%20photography%2C%20bright%20natural%20lighting%2C%20social%20media%20personality&width=50&height=50&seq=reviewer1&orientation=squarish",
  },
  {
    id: 2,
    influencerName: "Food Explorer",
    username: "@foodexplorer",
    rating: 5,
    comment:
      "Perfect partnership! The restaurant exceeded all expectations. Highly recommend for food influencers.",
    profileImage:
      "https://readdy.ai/api/search-image?query=Young%20male%20food%20influencer%2C%20professional%20headshot%2C%20friendly%20expression%2C%20modern%20portrait%20photography%2C%20natural%20lighting%2C%20food%20blogger%20personality&width=50&height=50&seq=reviewer2&orientation=squarish",
  },
];

interface OfferDetailsClientProps {
  offerId: string;
}

export default function OfferDetailsClient({
  offerId,
}: OfferDetailsClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookingStatus, setBookingStatus] = useState<
    "pending" | "accepted" | "declined" | null
  >(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<
    "success" | "warning" | "error"
  >("success");

  // Generate available time slots
  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
  ];

  // Generate available dates (next 30 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  const handleBookingSubmit = () => {
    if (!selectedDate || !selectedTime) {
      setNotificationMessage("Please select both date and time");
      setNotificationType("warning");
      setShowNotification(true);
      return;
    }

    // Simulate booking submission
    setBookingStatus("pending");
    setShowBookingModal(false);
    setNotificationMessage(
      "Booking request sent! Waiting for business confirmation."
    );
    setNotificationType("success");
    setShowNotification(true);

    // Simulate business response after 3 seconds
    setTimeout(() => {
      const isAccepted = Math.random() > 0.3; // 70% acceptance rate
      setBookingStatus(isAccepted ? "accepted" : "declined");
      setNotificationMessage(
        isAccepted
          ? "Great! Your booking has been confirmed by the business."
          : "Unfortunately, your booking request was declined by the business."
      );
      setNotificationType(isAccepted ? "success" : "error");
      setShowNotification(true);
    }, 3000);
  };

  const showNotificationComponent = () => {
    if (!showNotification) return null;

    const bgColor =
      notificationType === "success"
        ? "bg-green-500"
        : notificationType === "warning"
        ? "bg-yellow-500"
        : "bg-red-500";
    const icon =
      notificationType === "success"
        ? "ri-check-line"
        : notificationType === "warning"
        ? "ri-alert-line"
        : "ri-close-line";

    return (
      <div className="fixed top-4 right-4 z-50 animate-slide-in">
        <div
          className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm`}
        >
          <i className={`${icon} text-xl`}></i>
          <p className="text-sm font-medium">{notificationMessage}</p>
          <button
            onClick={() => setShowNotification(false)}
            className="ml-2 text-white/80 hover:text-white"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>
      </div>
    );
  };

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
          <div className="flex flex-col items-center">
            <h1 className="font-['Pacifico'] text-2xl text-white mb-1">
              Inshaar
            </h1>
            <span className="text-white/80 text-sm">Offer Details</span>
          </div>
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
                index === currentImageIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
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
            <h2 className="font-bold text-xl text-gray-800">
              {offerDetails.businessName}
            </h2>
            <p className="text-gray-600">
              {offerDetails.category} • {offerDetails.location}
            </p>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-1">
                <i className="ri-star-fill text-yellow-400"></i>
                <span className="text-sm font-medium">
                  {offerDetails.businessInfo.rating}
                </span>
                <span className="text-gray-500 text-sm">
                  ({offerDetails.businessInfo.reviews})
                </span>
              </div>
              <span className="text-gray-500 text-sm">
                {offerDetails.businessInfo.collaborations} collaborations
              </span>
            </div>
          </div>
        </div>

        {/* Offer Title */}
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {offerDetails.title}
        </h3>

        {/* Description */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-3">What You'll Get</h4>
          <p className="text-gray-600 leading-relaxed">
            {offerDetails.description}
          </p>
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
              <div className="text-2xl font-bold text-purple-600">
                {offerDetails.businessInfo.collaborations}
              </div>
              <div className="text-gray-500 text-sm">Collaborations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">
                {offerDetails.businessInfo.responseTime}
              </div>
              <div className="text-gray-500 text-sm">Response Time</div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-4">Recent Reviews</h4>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-100 pb-4 last:border-b-0"
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={review.profileImage}
                    alt={review.influencerName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-800">
                        {review.influencerName}
                      </span>
                      <span className="text-purple-600 text-sm">
                        {review.username}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(review.rating)].map((_, i) => (
                        <i
                          key={i}
                          className="ri-star-fill text-yellow-400 text-sm"
                        ></i>
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
        {bookingStatus === null ? (
          <button
            onClick={() => setShowBookingModal(true)}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Book Service
          </button>
        ) : (
          <div className="flex items-center justify-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full ${
                bookingStatus === "pending"
                  ? "bg-yellow-500"
                  : bookingStatus === "accepted"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
            <span
              className={`font-semibold ${
                bookingStatus === "pending"
                  ? "text-yellow-600"
                  : bookingStatus === "accepted"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {bookingStatus === "pending"
                ? "Booking Pending..."
                : bookingStatus === "accepted"
                ? "Booking Confirmed!"
                : "Booking Declined"}
            </span>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Book Service</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="space-y-6">
              {/* Service Details */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  {offerDetails.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {offerDetails.businessName}
                </p>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Select Date
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {availableDates.map((date) => {
                    const dateObj = new Date(date);
                    const dayName = dateObj.toLocaleDateString("en-US", {
                      weekday: "short",
                    });
                    const dayNumber = dateObj.getDate();
                    const monthName = dateObj.toLocaleDateString("en-US", {
                      month: "short",
                    });

                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                          selectedDate === date
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                        }`}
                      >
                        <div className="text-xs text-gray-500">{dayName}</div>
                        <div className="font-semibold">{dayNumber}</div>
                        <div className="text-xs text-gray-500">{monthName}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Select Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                        selectedTime === time
                          ? "border-pink-500 bg-pink-50 text-pink-700"
                          : "border-gray-200 hover:border-pink-300 hover:bg-pink-50"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Details */}
              {selectedDate && selectedTime && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Booking Summary
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-gray-600">Date:</span>{" "}
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p>
                      <span className="text-gray-600">Time:</span>{" "}
                      {selectedTime}
                    </p>
                    <p>
                      <span className="text-gray-600">Service:</span>{" "}
                      {offerDetails.title}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookingSubmit}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
            <div className="text-center mb-6">
              <i className="ri-check-double-line text-6xl text-green-500 mb-4"></i>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Application Sent!
              </h3>
              <p className="text-gray-600">
                We'll notify you when the business responds
              </p>
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

      {/* Notification */}
      {showNotificationComponent()}
    </div>
  );
}
