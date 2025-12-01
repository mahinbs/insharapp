'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import logo_dark from '@/assetes/logo_dark.png';
import AdvancedBottomNav from '../../../components/AdvancedBottomNav';
import { useRouter } from 'next/navigation';

type SectionId =
  | 'information'
  | 'content'
  | 'gallery'
  | 'location'
  | 'timing'
  | 'establishment';

const sectionOrder: SectionId[] = [
  'information',
  'content',
  'gallery',
  'location',
  'timing',
  'establishment',
];

export default function BusinessDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<SectionId>('information');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const sectionsRef = useRef<Record<SectionId, HTMLDivElement | null>>({
    information: null,
    content: null,
    gallery: null,
    location: null,
    timing: null,
    establishment: null,
  });
  const observerRef = useRef<IntersectionObserver | null>(null);

  const tabs = useMemo(
    () => [
      { id: 'information', label: 'Information' },
      { id: 'content', label: 'Content' },
      { id: 'gallery', label: 'Gallery' },
      { id: 'location', label: 'Location' },
      { id: 'timing', label: 'Timing' },
      { id: 'establishment', label: 'Establishment' },
    ],
    []
  );

  const carouselImages = [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1541048901559-5b512f90c0f3?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80',
  ];

  const socialLinks = [
    { id: 'website', icon: 'ri-earth-line', label: 'www.17thbeauty.fr', href: 'https://www.17thbeauty.fr/' },
    { id: 'instagram', icon: 'ri-instagram-line', label: '@17th_beauty', href: 'https://www.instagram.com/17th_beauty' },
    { id: 'tiktok', icon: 'ri-tiktok-fill', label: '@17th_beauty', href: 'https://www.tiktok.com/@17th_beauty' },
  ];

  const contentHighlights = [
    { title: 'Brazilian Straightening', description: 'Keratin enriched ritual for long-lasting sleekness.' },
    { title: 'Tokyo Hydration', description: 'Multi-step hydration boosters tailored per hair type.' },
    { title: 'Luxury Nails', description: 'Chrome finishes, BIAB overlays and signature nail art.' },
  ];

  const galleryItems = [
    'https://picsum.photos/seed/beauty-gallery-1/900/900',
    'https://picsum.photos/seed/beauty-gallery-2/900/900',
    'https://picsum.photos/seed/beauty-gallery-3/900/900',
    'https://picsum.photos/seed/beauty-gallery-4/900/900',
  ];

  const videoShowcase = [
    'https://player.vimeo.com/video/76979871?h=8272103f6e',
    'https://player.vimeo.com/video/22439234?h=7d45d2d4d3',
  ];

  const weeklyTimings = [
    { day: 'Monday', value: '09:00 - 20:30' },
    { day: 'Tuesday', value: '09:00 - 20:30' },
    { day: 'Wednesday', value: '09:00 - 20:30' },
    { day: 'Thursday', value: '09:00 - 22:00' },
    { day: 'Friday', value: '09:00 - 22:00' },
    { day: 'Saturday', value: '10:00 - 23:00' },
    { day: 'Sunday', value: 'Closed' },
  ];

  const establishments = [
    {
      id: 'paris-17',
      title: '17th Beauty • Paris 17',
      address: '78 Rue du Faubourg, Paris',
      contact: '+33 1 45 78 90 21',
    },
    {
      id: 'paris-16',
      title: '17th Beauty • Paris 16',
      address: '12 Avenue Kléber, Paris',
      contact: '+33 1 88 90 11 45',
    },
  ];

  const handleTabClick = (id: SectionId) => {
    const section = sectionsRef.current[id];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveTab(id);
  };

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => sectionOrder.indexOf(a.target.id as SectionId) - sectionOrder.indexOf(b.target.id as SectionId));
        if (visible[0]) {
          const visibleId = visible[0].target.id as SectionId;
          setActiveTab(visibleId);
        }
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0.2,
      }
    );

    sectionOrder.forEach((id) => {
      const section = sectionsRef.current[id];
      if (section) {
        observerRef.current?.observe(section);
      }
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const registerSectionRef = (id: SectionId) => (el: HTMLDivElement | null) => {
    sectionsRef.current[id] = el;
  };

  const sectionClasses =
    'rounded-3xl bg-white/90 backdrop-blur px-5 py-6 shadow-lg border border-white/60';

  return (
    <div className="min-h-screen bg-gray-50/60 pb-28">
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white px-5 pt-6 pb-7 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={logo_dark.src}
              className="w-12 h-12 rounded-2xl bg-white/20 p-2 object-contain"
              alt="Inshaar"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/80">Business Suite</p>
              <h2 className="text-xl font-semibold">17th Beauty</h2>
            </div>
          </div>
          <div className="flex items-center space-x-3">
              <button className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur">
                <i className="ri-notification-line text-xl"></i>
              </button>
              <button onClick={() => router.push("/settings")} className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur">
                <i className="ri-settings-3-line text-xl"></i>
              </button>
            </div>
        </div>
        <div className="flex items-center justify-between mt-4 text-xs sm:text-sm text-white/80">
          <div className="flex items-center space-x-2">
            <i className="ri-map-pin-line text-white"></i>
            <span>Paris 17, France</span>
          </div>
          <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-semibold">
            Salon Partner
          </span>
        </div>
      </div>

      <div className="relative w-full h-[260px] overflow-hidden bg-gray-200">
        <img
          src={carouselImages[carouselIndex]}
          className="w-full h-full object-cover transition-all duration-500"
          alt="Salon hero carousel"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-white/80">Paris 17</p>
          <h2 className="text-2xl font-semibold">17th Beauty Salon</h2>
          <p className="text-sm opacity-80">Premium women-only beauty & wellness collective</p>
        </div>
      </div>

      <div className="flex justify-center space-x-2 mt-2">
        {carouselImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCarouselIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition ${
              carouselIndex === idx ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-slate-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          ></button>
        ))}
      </div>

      <div className="mt-6 px-4 sticky top-[140px] z-40">
        <div className="flex rounded-3xl bg-white p-1 shadow-inner overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id as SectionId)}
              className={`flex-1 whitespace-nowrap rounded-2xl py-3 px-2 text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white shadow-lg'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-5 space-y-4">
        <section id="information" ref={registerSectionRef('information')} className={sectionClasses}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Information</p>
              <h3 className="text-xl font-semibold text-slate-900">About 17th Beauty</h3>
            </div>
            <span className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-medium px-3 py-1">
              Open
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-6">
            17th Beauty (Shay Beauty) is a premium women-only salon located in Paris 17, specializing in Brazilian,
            Japanese & French straightening, Botox hair therapy, Tokyo hydration rituals, luxury manicure & pedicure
            services with vegan-safe products.
          </p>
          <div className="mt-5 grid gap-3">
            {socialLinks.map((item) => (
              <a
                href={item.href}
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-white/40 px-4 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white"
                target="_blank"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-2xl bg-white/20 text-white flex items-center justify-center">
                    <i className={`${item.icon} text-lg`}></i>
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <i className="ri-arrow-right-up-line text-xs text-white/80"></i>
              </a>
            ))}
          </div>
        </section>

        <section id="content" ref={registerSectionRef('content')} className={sectionClasses}>
          <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Content</p>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Signature Rituals</h3>
          <div className="grid gap-4">
            {contentHighlights.map((item) => (
              <div key={item.title} className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="gallery" ref={registerSectionRef('gallery')} className={sectionClasses}>
          <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Gallery</p>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Visual Moodboard</h3>
          <div className="grid grid-cols-2 gap-3">
            {galleryItems.map((src, idx) => (
              <img
                key={idx}
                src={src}
                className="w-full h-36 object-cover rounded-2xl ring-1 ring-black/5"
                alt={`Gallery item ${idx + 1}`}
              />
            ))}
          </div>
          <div className="mt-4 grid gap-4">
            {videoShowcase.map((video, idx) => (
              <div key={video} className="aspect-video rounded-2xl overflow-hidden border border-slate-100">
                <iframe
                  src={video}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  title={`Salon video ${idx + 1}`}
                ></iframe>
              </div>
            ))}
          </div>
        </section>

        <section id="location" ref={registerSectionRef('location')} className={sectionClasses}>
          <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Location</p>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Find Us on Maps</h3>
          <div className="rounded-2xl overflow-hidden ring-1 ring-black/5">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.332171913221!2d2.300248976937069!3d48.871640700772934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66ff9929d0b35%3A0x511f2f5dd1b6abb6!2sRue%20du%20Faubourg%20Saint-Honor%C3%A9%2C%20Paris!5e0!3m2!1sen!2sfr!4v1700000000000!5m2!1sen!2sfr"
              width="100%"
              height="240"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">78 Rue du Faubourg, Paris 17</p>
            <p>Next to Wagram Metro • Valet parking available</p>
          </div>
        </section>

        <section id="timing" ref={registerSectionRef('timing')} className={sectionClasses}>
          <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Timing</p>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Weekly Schedule</h3>
          <div className="divide-y divide-slate-100">
            {weeklyTimings.map((slot) => (
              <div key={slot.day} className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-slate-700">{slot.day}</span>
                <span className="text-sm text-slate-500">{slot.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="establishment" ref={registerSectionRef('establishment')} className={sectionClasses}>
          <p className="text-xs uppercase tracking-[0.35em] text-pink-500">Establishment</p>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Other Locations</h3>
          <div className="space-y-3">
            {establishments.map((loc) => (
              <div key={loc.id} className="p-4 rounded-2xl border border-white/60 bg-gradient-to-r from-white to-pink-50">
                <h4 className="text-sm font-semibold text-gray-900">{loc.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{loc.address}</p>
                <p className="text-xs text-gray-500 mt-1">Call: {loc.contact}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <AdvancedBottomNav userType="business" />
    </div>
  );
}
