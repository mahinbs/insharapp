'use client';

import { useState } from 'react';
import Link from 'next/link';
import logo_colorful from "@/assetes/Logo3 (1).png";

const onboardingSlides = [
  {
    title: "Collaborate with top brands effortlessly",
    description: "Connect with amazing businesses and get exclusive services in exchange for your influence",
    image: "https://readdy.ai/api/search-image?query=Young%20diverse%20influencers%20collaborating%20with%20luxury%20brands%2C%20modern%20smartphone%20interface%2C%20vibrant%20social%20media%20aesthetic%2C%20professional%20photography%20style%2C%20bright%20colorful%20background%20with%20gradient%20elements%2C%20people%20smiling%20and%20engaging%20with%20products&width=300&height=400&seq=onboard1&orientation=portrait"
  },
  {
    title: "Grow your business with influencer barter deals",
    description: "Reach new audiences through authentic influencer partnerships without spending cash",
    image: "https://readdy.ai/api/search-image?query=Business%20owners%20and%20entrepreneurs%20working%20with%20social%20media%20influencers%2C%20modern%20office%20setting%2C%20handshake%20collaboration%2C%20professional%20business%20meeting%2C%20bright%20modern%20interior%20with%20gradient%20lighting%2C%20success%20and%20growth%20concept&width=300&height=400&seq=onboard2&orientation=portrait"
  },
  {
    title: "No cash. Just collaboration",
    description: "Trade your services for authentic promotion and build lasting partnerships",
    image: "https://readdy.ai/api/search-image?query=Barter%20exchange%20concept%2C%20hands%20exchanging%20services%20instead%20of%20money%2C%20modern%20illustration%20style%2C%20colorful%20gradient%20background%2C%20collaboration%20symbols%2C%20digital%20marketplace%20aesthetic%2C%20clean%20minimalist%20design&width=300&height=400&seq=onboard3&orientation=portrait"
  }
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Logo */}
      <div className="flex justify-between items-center p-6">
        <div className=" flex items-center">
          <img 
            src={logo_colorful.src}
            alt="Inshaar" 
            className="h-10 w-40 object-cover"
          />
        </div>
        <Link href="/auth" className="text-gray-500 font-medium">
          Skip
        </Link>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-80 h-96 mb-8 rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src={onboardingSlides[currentSlide].image}
            alt="Onboarding"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4 px-4">
          {onboardingSlides[currentSlide].title}
        </h2>
        
        <p className="text-gray-600 text-center mb-8 px-6 leading-relaxed">
          {onboardingSlides[currentSlide].description}
        </p>

        {/* Dots indicator */}
        <div className="flex space-x-2 mb-8">
          {onboardingSlides.map((_: any, index: number) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 \${
                index === currentSlide 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center p-6">
        <button
          onClick={prevSlide}
          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 \${
            currentSlide === 0 
              ? 'text-transparent' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          disabled={currentSlide === 0}
        >
          Previous
        </button>

        {currentSlide === onboardingSlides.length - 1 ? (
          <Link href="/auth">
            <button className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Get Started
            </button>
          </Link>
        ) : (
          <button
            onClick={nextSlide}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}