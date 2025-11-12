'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdvancedBottomNav from '../../components/AdvancedBottomNav';
import { usePathname } from 'next/navigation';

const businessServices = [
  {
    id: 1,
    title: 'Community Management',
    description: 'Professional social media community management to engage and grow your audience',
    icon: 'ri-group-line',
    gradient: 'from-blue-500 to-cyan-500',
    price: 'Custom Quote',
    features: ['Daily engagement', 'Content moderation', 'Audience growth', 'Analytics reports']
  },
  {
    id: 2,
    title: 'Digital Marketing',
    description: 'Meta & Google Ads management to maximize your ROI and reach',
    icon: 'ri-megaphone-line',
    gradient: 'from-purple-500 to-pink-500',
    price: 'Custom Quote',
    features: ['Campaign setup', 'Ad optimization', 'Performance tracking', 'ROI analysis']
  },
  {
    id: 3,
    title: 'Website Creation',
    description: 'Professional website design and development for your business',
    icon: 'ri-global-line',
    gradient: 'from-green-500 to-emerald-500',
    price: 'Custom Quote',
    features: ['Responsive design', 'SEO optimized', 'Fast loading', 'Mobile friendly']
  },
  {
    id: 4,
    title: 'Photoshoots & Photography',
    description: 'Professional photography services for products, events, and branding',
    icon: 'ri-camera-line',
    gradient: 'from-orange-500 to-red-500',
    price: 'Custom Quote',
    features: ['Product photography', 'Event coverage', 'Brand shoots', 'Post-production']
  }
];

const influencerServices = [
  {
    id: 1,
    title: 'UGC Training',
    description: 'Paid training service to master User Generated Content creation',
    icon: 'ri-graduation-cap-line',
    gradient: 'from-pink-500 to-purple-500',
    price: 'On Request',
    features: ['Content strategy', 'Video production', 'Editing techniques', 'Platform optimization']
  }
];

export default function ServicesPage() {
  const pathname = usePathname();
  // Determine user type based on pathname or default to influencer
  const userType = pathname?.includes('/business') ? 'business' : 'influencer';
  const services = userType === 'business' ? businessServices : influencerServices;

  const [selectedService, setSelectedService] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <Link href={userType === 'business' ? '/business/dashboard' : '/influencer/dashboard'}>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="ri-arrow-left-line text-white text-xl"></i>
            </div>
          </Link>
          <div className="flex flex-col items-center">
            <h1 className="font-['Pacifico'] text-2xl text-white mb-1">Inshaar</h1>
            <span className="text-white/80 text-sm">Services</span>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Services List */}
      <div className="px-6 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {userType === 'business' ? 'Business Services' : 'Creator Services'}
          </h2>
          <p className="text-gray-600 text-sm">
            {userType === 'business' 
              ? 'Professional services to grow your business'
              : 'Training and services to enhance your content creation'}
          </p>
        </div>

        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className={`bg-gradient-to-r ${service.gradient} p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <i className={`${service.icon} text-white text-3xl`}></i>
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-bold mb-1">{service.title}</h3>
                      <p className="text-white/90 text-sm">{service.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-gray-500 text-sm">Starting from</span>
                    <p className="text-2xl font-bold text-gray-800">{service.price}</p>
                  </div>
                  <button
                    onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Request Quote
                  </button>
                </div>

                {selectedService === service.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">What's Included:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <i className="ri-check-line text-green-500"></i>
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Need More Information?</h3>
          <p className="text-gray-600 text-sm mb-4">
            Contact our team to discuss your specific needs and get a customized quote.
          </p>
          <div className="flex space-x-3">
            <Link href="/chat">
              <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <i className="ri-message-line mr-2"></i>
                Message Support
              </button>
            </Link>
            <a href="mailto:services@inshaar.app">
              <button className="flex-1 bg-white border-2 border-purple-500 text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300">
                <i className="ri-mail-line mr-2"></i>
                Email Us
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <AdvancedBottomNav userType={userType} />
    </div>
  );
}

