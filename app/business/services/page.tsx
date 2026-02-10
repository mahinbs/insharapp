'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdvancedBottomNav from '../../../components/AdvancedBottomNav';
import logo_dark from "@/assetes/logo_dark.png";
import { RiCustomerService2Fill } from "react-icons/ri";

interface ServiceFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

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
    description: 'Engage and grow your audience',
    icon: 'ri-group-line',
    brief: 'We manage your social communities with daily engagement, content moderation, and audience growth strategies. Get regular analytics and reports to track performance and build an authentic, active following.',
    points: [
      'Daily engagement and moderation across your social channels',
      'Audience growth and community-building strategies',
      'Analytics reports and performance tracking',
      'Content calendar and posting support',
      'Crisis and reputation management',
    ],
    images: [
      'https://picsum.photos/seed/community-mgmt-1/400/300',
      'https://picsum.photos/seed/community-mgmt-2/400/300',
      'https://picsum.photos/seed/community-mgmt-3/400/300',
    ],
  },
  {
    id: 2,
    title: 'Digital Marketing',
    description: 'Meta & Google Ads management',
    icon: 'ri-megaphone-line',
    brief: 'Full-service Meta and Google Ads campaigns: setup, optimization, and performance tracking. We focus on ROI and scalable growth for your brand across paid channels.',
    points: [
      'Meta (Facebook & Instagram) and Google Ads campaign setup',
      'Ad creative and targeting optimization',
      'Performance tracking and ROI analysis',
      'A/B testing and conversion optimization',
      'Budget management and scaling strategies',
    ],
    images: [
      'https://picsum.photos/seed/digital-mkt-1/400/300',
      'https://picsum.photos/seed/digital-mkt-2/400/300',
      'https://picsum.photos/seed/digital-mkt-3/400/300',
    ],
  },
  {
    id: 3,
    title: 'Website Creation',
    description: 'Professional website design',
    icon: 'ri-global-line',
    brief: 'Custom, responsive websites designed for conversion. SEO-optimized, fast-loading, and mobile-friendly so your business looks professional and ranks well.',
    points: [
      'Custom design and responsive layout (mobile, tablet, desktop)',
      'SEO optimization and fast loading',
      'Contact forms and lead capture',
      'Content management and updates',
      'Hosting setup and ongoing support',
    ],
    images: [
      'https://picsum.photos/seed/website-1/400/300',
      'https://picsum.photos/seed/website-2/400/300',
      'https://picsum.photos/seed/website-3/400/300',
    ],
  },
  {
    id: 4,
    title: 'Photoshoots & Photography',
    description: 'Professional photography services',
    icon: 'ri-camera-line',
    brief: 'Product photography, event coverage, and brand shoots with full post-production. High-quality visuals that elevate your brand and marketing materials.',
    points: [
      'Product and catalog photography',
      'Event and corporate coverage',
      'Brand and lifestyle shoots',
      'Photo editing and retouching',
      'High-resolution delivery for web and print',
    ],
    images: [
      'https://picsum.photos/seed/photography-1/400/300',
      'https://picsum.photos/seed/photography-2/400/300',
      'https://picsum.photos/seed/photography-3/400/300',
    ],
  },
];

export default function BusinessServicesPage() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [getServiceModal, setGetServiceModal] = useState<typeof businessServices[0] | null>(null);
  const [serviceFormData, setServiceFormData] = useState<ServiceFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [serviceFormSubmitted, setServiceFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<VIPFormData>({
    name: '',
    email: '',
    business: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleGetServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServiceFormSubmitted(true);
    setTimeout(() => {
      setServiceFormSubmitted(false);
      setServiceFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      setGetServiceModal(null);
    }, 3000);
  };

  const openGetServiceModal = (service: typeof businessServices[0]) => {
    setGetServiceModal(service);
    setServiceFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
              className="h-8 w-32 lg:h-10 lg:w-40 object-cover mb-1"
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
              <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className={`${service.icon} text-white text-2xl`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white text-lg font-bold mb-0.5">{service.title}</h3>
                    <p className="text-white/90 text-xs">{service.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                    className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <i className={`ri-arrow-${selectedService === service.id ? 'up' : 'down'}-s-line text-white text-lg transition-transform`}></i>
                  </button>
                </div>
              </div>
              {selectedService === service.id && (
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">{service.brief}</p>
                  {service.points && service.points.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">What we provide</p>
                      <ul className="space-y-1.5">
                        {service.points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <i className="ri-check-line text-purple-500 mt-0.5 flex-shrink-0" aria-hidden />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {/* 2-3 images in a row: mobile 2-3 cols, tablet/desktop 3 cols with fixed height */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 max-w-2xl">
                    {service.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-lg overflow-hidden bg-gray-200 h-20 sm:h-28 md:h-32 w-full"
                      >
                        <img
                          src={img}
                          alt={`${service.title} ${idx + 1}`}
                          className="w-full h-full object-cover object-center"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 200px"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => openGetServiceModal(service)}
                    className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    Get service
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Get service modal */}
        {getServiceModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">Request: {getServiceModal.title}</h3>
                <button
                  onClick={() => setGetServiceModal(null)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                  <i className="ri-close-line text-gray-600"></i>
                </button>
              </div>
              <form onSubmit={handleGetServiceSubmit} className="p-6 space-y-4">
                {serviceFormSubmitted ? (
                  <div className="text-center py-8">
                    <i className="ri-checkbox-circle-line text-green-500 text-4xl mb-2"></i>
                    <p className="text-green-600 font-semibold">Request submitted!</p>
                    <p className="text-gray-500 text-sm mt-1">We&apos;ll be in touch soon.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                        <input
                          type="text"
                          value={serviceFormData.firstName}
                          onChange={(e) => setServiceFormData({ ...serviceFormData, firstName: e.target.value })}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                          placeholder="First name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                        <input
                          type="text"
                          value={serviceFormData.lastName}
                          onChange={(e) => setServiceFormData({ ...serviceFormData, lastName: e.target.value })}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                          placeholder="Last name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={serviceFormData.email}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={serviceFormData.phone}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, phone: e.target.value })}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">What you want</label>
                      <textarea
                        value={serviceFormData.message}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, message: e.target.value })}
                        required
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
                        placeholder="Describe what you need for this service..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white shadow-md hover:shadow-lg transition-all"
                    >
                      Submit request
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        )}

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

