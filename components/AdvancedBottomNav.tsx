
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  icon: string;
  activeIcon: string;
  label: string;
  badge?: number;
}

interface AdvancedBottomNavProps {
  userType: 'influencer' | 'business';
}

export default function AdvancedBottomNav({ userType }: AdvancedBottomNavProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const influencerNavItems: NavItem[] = [
    {
      href: '/influencer/dashboard',
      icon: 'ri-home-line',
      activeIcon: 'ri-home-fill',
      label: 'Home'
    },
    {
      href: '/search',
      icon: 'ri-search-line',
      activeIcon: 'ri-search-fill',
      label: 'Discover'
    },
    {
      href: '/collaborations',
      icon: 'ri-handshake-line',
      activeIcon: 'ri-handshake-fill',
      label: 'Collabs',
      badge: 3
    },
    {
      href: '/chat',
      icon: 'ri-message-line',
      activeIcon: 'ri-message-fill',
      label: 'Messages',
      badge: 2
    },
    {
      href: '/help',
      icon: 'ri-question-line',
      activeIcon: 'ri-question-fill',
      label: 'Help'
    },
    {
      href: '/profile',
      icon: 'ri-user-line',
      activeIcon: 'ri-user-fill',
      label: 'Profile'
    }
  ];

  const businessNavItems: NavItem[] = [
    {
      href: '/business/dashboard',
      icon: 'ri-dashboard-line',
      activeIcon: 'ri-dashboard-fill',
      label: 'Dashboard'
    },
    {
      href: '/business/offers',
      icon: 'ri-megaphone-line',
      activeIcon: 'ri-megaphone-fill',
      label: 'Offers'
    },
    {
      href: '/business/applications',
      icon: 'ri-user-star-line',
      activeIcon: 'ri-user-star-fill',
      label: 'Applications',
      badge: 5
    },
    {
      href: '/chat',
      icon: 'ri-message-line',
      activeIcon: 'ri-message-fill',
      label: 'Messages',
      badge: 1
    },
    {
      href: '/business/profile',
      icon: 'ri-store-2-line',
      activeIcon: 'ri-store-2-fill',
      label: 'Profile'
    },
    {
      href: '/business/explore',
      icon: 'ri-compass-line',
      activeIcon: 'ri-compass-fill',
      label: 'Explore'
    },
    {
      href: '/help',
      icon: 'ri-question-line',
      activeIcon: 'ri-question-fill',
      label: 'Help'
    }
  ];

  const navItems = userType === 'influencer' ? influencerNavItems : businessNavItems;

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  const isActive = (href: string) => {
    if (href === '/influencer/dashboard' || href === '/business/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : 'translate-y-full'
    }`}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white to-transparent pointer-events-none"></div>
      
      {/* Navigation container */}
      <div className="relative bg-white/95 backdrop-blur-lg border-t border-gray-200/50 shadow-2xl">
        {/* Active indicator line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500"></div>
        
        <div className="px-2 py-2">
          <div className={`grid ${navItems.length === 7 ? 'grid-cols-7' : navItems.length === 6 ? 'grid-cols-6' : 'grid-cols-5'} gap-1`}>
            {navItems.map((item, index) => {
              const active = isActive(item.href);
              return (
                <Link key={index} href={item.href}>
                  <div className={`relative flex flex-col items-center py-2 px-1 rounded-2xl transition-all duration-300 ${
                    active 
                      ? 'bg-gradient-to-br from-pink-50 to-purple-50 scale-105' 
                      : 'hover:bg-gray-50 active:scale-95'
                  }`}>
                    {/* Icon container with gradient background when active */}
                    <div className={`relative w-8 h-8 flex items-center justify-center rounded-xl mb-1 transition-all duration-300 ${
                      active 
                        ? 'bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 shadow-lg' 
                        : 'bg-gray-100/50'
                    }`}>
                      <i className={`${active ? item.activeIcon : item.icon} text-lg transition-all duration-300 ${
                        active ? 'text-white' : 'text-gray-700'
                      }`}></i>
                      
                      {/* Badge */}
                      {item.badge && item.badge > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white text-xs font-bold leading-none">
                            {item.badge > 9 ? '9+' : item.badge}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Label */}
                    <span className={`text-xs font-medium transition-all duration-300 ${
                      active 
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600' 
                        : 'text-gray-500'
                    }`}>
                      {item.label}
                    </span>
                    
                    {/* Active dot indicator */}
                    {active && (
                      <div className="absolute -bottom-1 w-1 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Bottom safe area for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-white/95"></div>
      </div>
    </div>
  );
}
