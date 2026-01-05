'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdvancedBottomNav from '../../../components/AdvancedBottomNav';
import logo_dark from "@/assetes/logo_dark.png";
import { RiCustomerService2Fill } from "react-icons/ri";

interface VIPFormData {
  name: string;
  email: string;
  business: string;
  message: string;
}

const businessServices = [
  {
    id: 1,
    title: 'Community Management',
    description: 'Professional social media community management to engage and grow your audience',
    icon: 'ri-group-line',
    features: ['Daily engagement', 'Content moderation', 'Audience growth', 'Analytics reports']
  },
  {
    id: 2,
    title: 'Digital Marketing',
    description: 'Meta & Google Ads management to maximize your ROI and reach',
    icon: 'ri-megaphone-line',
    features: ['Campaign setup', 'Ad optimization', 'Performance tracking', 'ROI analysis']
  },
  {
    id: 3,
    title: 'Website Creation',
    description: 'Professional website design and development for your business',
    icon: 'ri-global-line',
    features: ['Responsive design', 'SEO optimized', 'Fast loading', 'Mobile friendly']
  },
  {
    id: 4,
    title: 'Photoshoots & Photography',
    description: 'Professional photography services for products, events, and branding',
    icon: 'ri-camera-line',
    features: ['Product photography', 'Event coverage', 'Brand shoots', 'Post-production']
  }
];

export default function BusinessServicesPage() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [formData, setFormData] = useState<VIPFormData>({
    name: '',
    email: '',
    business: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', business: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 px-6 pt-4 pb-1">
        <div className="flex items-center justify-between mb-6">
          <Link href="/business/home">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-arrow-left-line text-white text-xl"></i>
            </div>
          </Link>
          <div className=" flex flex-col items-center">
            <img 
              src={logo_dark.src}
              alt="Inshaar" 
              className="h-10 w-40 object-cover mb-1"
            />
            <span className="text-white/80 text-sm">Business Services</span>
          </div>
          <Link href="/help">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <RiCustomerService2Fill className="text-white text-xl" />
            </div>
          </Link>
        </div>
      </div>

      {/* Services List */}
      <div className="px-6 py-6 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Business Services</h2>
          <p className="text-gray-600 text-sm">
            Professional services to grow your business and enhance your online presence
          </p>
        </div>

        <div className="space-y-4">
          {businessServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <i className={`${service.icon} text-white text-3xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold mb-1">{service.title}</h3>
                    <p className="text-white/90 text-sm">{service.description}</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/30">
                  <div
                    onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                    className="flex items-center justify-between cursor-pointer mb-3"
                  >
                    <h4 className="text-white font-semibold">What's Included:</h4>
                    <i className={`ri-arrow-${selectedService === service.id ? 'up' : 'down'}-s-line text-white text-xl transition-transform`}></i>
                  </div>
                  {selectedService === service.id && (
                    <div className="space-y-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <i className="ri-check-line text-white text-lg"></i>
                          <span className="text-white/90 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* VIP Influencers Section */}
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-2xl p-6 border-2 border-purple-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <i className="ri-vip-crown-line text-white text-2xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">List of VIP Influencers</h3>
              <p className="text-gray-600 text-sm">Access our curated network of top-tier influencers</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 mb-4">
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Connect with premium influencers who have proven track records, high engagement rates, and authentic audiences. Our VIP list includes influencers across various niches including food, lifestyle, beauty, fashion, and travel.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-500"></i>
                <span className="text-sm text-gray-700">Verified accounts</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-500"></i>
                <span className="text-sm text-gray-700">High engagement</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-500"></i>
                <span className="text-sm text-gray-700">Authentic audience</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-check-line text-green-500"></i>
                <span className="text-sm text-gray-700">Premium quality</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl p-5">
            <h4 className="font-semibold text-gray-800 mb-4">Request Access</h4>
            {formSubmitted ? (
              <div className="text-center py-6">
                <i className="ri-checkbox-circle-line text-green-500 text-4xl mb-2"></i>
                <p className="text-green-600 font-semibold">Request submitted successfully!</p>
                <p className="text-gray-500 text-sm mt-1">We'll contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.business}
                    onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    placeholder="Your business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all resize-none"
                    placeholder="Tell us about your collaboration needs..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Submit Request
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Need More Information?</h3>
          <p className="text-gray-600 text-sm mb-4">
            Contact our team to discuss your specific needs and get a customized quote.
          </p>
          <div className="flex space-x-3">
            <Link href="/business/chat">
              <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <i className="ri-message-line mr-2"></i>
                Message Support
              </button>
            </Link>
            <a href="mailto:services@inshaar.app">
              <button className="flex-1 bg-white border-2 border-purple-500 text-purple-600 py-3 px-2 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300">
                <i className="ri-mail-line mr-2"></i>
                Email Us
              </button>
            </a>
          </div>
        </div>

        {/* Service Benefits */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Why Choose Our Services?</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-checkbox-circle-line text-blue-600 text-xl"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">Expert Team</h4>
                <p className="text-gray-600 text-xs">Certified professionals with years of experience</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-time-line text-purple-600 text-xl"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">Fast Delivery</h4>
                <p className="text-gray-600 text-xs">Quick turnaround times for all projects</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-shield-check-line text-green-600 text-xl"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">Quality Guaranteed</h4>
                <p className="text-gray-600 text-xs">100% satisfaction guarantee on all services</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-customer-service-2-line text-orange-600 text-xl"></i>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">24/7 Support</h4>
                <p className="text-gray-600 text-xs">Round-the-clock customer support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <AdvancedBottomNav userType="business" />
    </div>
  );
}

