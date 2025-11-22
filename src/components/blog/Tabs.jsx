"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BLOG_BASE_URL;
const WEBSITE = process.env.NEXT_PUBLIC_WEBSITE_ID;

export default function Tabs({ slug }) {
  const pathname = usePathname();
  const [tabs, setTabs] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to extract relative path from full URL
  const getRelativePath = (url) => {
    if (!url) return '';
    
    try {
      // If it's already a relative path, return as is
      if (url.startsWith('/')) {
        return url;
      }
      
      // If it's a full URL, extract the pathname
      if (url.startsWith('http')) {
        const urlObj = new URL(url);
        return urlObj.pathname;
      }
      
      return url;
    } catch (error) {
      console.error('Error parsing URL:', error);
      return url;
    }
  };

  useEffect(() => {
    const fetchNavigationTabs = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API}/api/get-post-navigation-tabs?slug=${slug}&website=${WEBSITE}`
        );
        const data = await response.json();
        
        if (data.statusCode === 200 && data.tabs) {
          // Format tabs data with relative paths
          const formattedTabs = data.tabs.map((tab, index) => {
            const relativePath = getRelativePath(tab.tab_url);
            
            return {
              id: index,
              label: tab.tab_name,
              url: tab.tab_url,
              relativePath: relativePath,
              order: tab.tab_order
            };
          });

          // Sort by order
          const sortedTabs = formattedTabs.sort((a, b) => a.order - b.order);
          setTabs(sortedTabs);
        } else {
          console.log('No navigation tabs found for this post');
          setTabs([]);
        }
      } catch (error) {
        console.error('Error fetching navigation tabs:', error);
        setTabs([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug && WEBSITE) {
      fetchNavigationTabs();
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById('tabs-container');
      if (container) {
        setScrollPosition(container.scrollLeft);
        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(
          container.scrollLeft < container.scrollWidth - container.clientWidth - 10
        );
      }
    };

    const container = document.getElementById('tabs-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [tabs]);

  const scroll = (direction) => {
    const container = document.getElementById('tabs-container');
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="-mt-8 max-w-7xl mx-auto px-4">
        <div className="bg-amber-50 rounded-2xl border-2 border-gray-100 p-4">
          <div className="flex gap-2 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-xl animate-pulse w-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!tabs.length) return null;

  return (
    <div className="-mt-10 max-w-7xl mx-auto relative group">
      {/* Gradient fade effects */}
      {showLeftArrow && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      )}
      {showRightArrow && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
      )}

      {/* Left scroll button */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-[#FF5211] hover:shadow-xl transition-all opacity-0 group-hover:opacity-100 border border-gray-200"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Right scroll button */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-[#FF5211] hover:shadow-xl transition-all opacity-0 group-hover:opacity-100 border border-gray-200"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Tabs container */}
      <div className="bg-amber-50 rounded-2xl shadow-md border-2 border-gray-100 p-2 px-4 pb-3 relative overflow-hidden">
        <div
          id="tabs-container"
          className="flex gap-2 md:gap-5 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {tabs.map((tab) => {
            // Use relative path for active state comparison
            const isActive = pathname === tab.relativePath;
            
            return (
              <Link
                key={tab.id}
                href={tab.relativePath} // Use relative path for Next.js Link
                className={`
                  relative px-5 py-3 mt-[6px] rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0
                  ${isActive 
                    ? "text-white bg-gradient-to-r from-[#FF5211] to-orange-600 shadow-lg shadow-orange-200" 
                    : "text-gray-600 border-1 border-orange-200 bg-orange-50 hover:text-[#FF5211] hover:bg-orange-100"
                  }
                `}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 border-2 border-white"></span>
                  </span>
                )}
                
                {tab.label}
                
                {/* Bottom active bar */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-b-xl"></span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile indicator dots */}
      {tabs.length > 3 && (
        <div className="flex justify-center gap-1.5 mt-3 md:hidden">
          {tabs.map((tab) => {
            const isActive = pathname === tab.relativePath;
            return (
              <div
                key={tab.id}
                className={`h-1.5 rounded-full transition-all ${
                  isActive
                    ? "w-6 bg-[#FF5211]"
                    : "w-1.5 bg-gray-300"
                }`}
              />
            );
          })}
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}