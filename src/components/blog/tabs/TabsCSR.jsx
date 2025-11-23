"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TabsCSR({ tabs, pathname }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById("tabs-container");
      if (container) {
        setScrollPosition(container.scrollLeft);
        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(
          container.scrollLeft <
            container.scrollWidth - container.clientWidth - 10
        );
      }
    };

    const container = document.getElementById("tabs-container");
    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [tabs]);

  const scroll = (direction) => {
    const container = document.getElementById("tabs-container");
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!tabs.length) return null;

  return (
    <div className="-mt-10 max-w-7xl mx-auto relative group">
      {showLeftArrow && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      )}
      {showRightArrow && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
      )}

      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-[#FF5211] hover:shadow-xl transition-all opacity-0 group-hover:opacity-100 border border-gray-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-[#FF5211] hover:shadow-xl transition-all opacity-0 group-hover:opacity-100 border border-gray-200"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      <div className="bg-amber-50 rounded-2xl shadow-md border-2 border-gray-100 p-2 px-4 pb-3 relative overflow-hidden">
        <div
          id="tabs-container"
          className="flex gap-2 md:gap-5 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {tabs.map((tab) => {
            const isActive = pathname === tab.relativePath;

            return (
              <Link
                key={tab.id}
                href={tab.relativePath}
                className={`relative px-5 py-3 mt-[6px] rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? "text-white bg-gradient-to-r from-[#FF5211] to-orange-600 shadow-lg shadow-orange-200"
                    : "text-gray-600 border border-orange-200 bg-orange-50 hover:text-[#FF5211] hover:bg-orange-100"
                }`}
              >
                {isActive && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 border-2 border-white"></span>
                  </span>
                )}

                {tab.label}

                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-b-xl"></span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {tabs.length > 3 && (
        <div className="flex justify-center gap-1.5 mt-3 md:hidden">
          {tabs.map((tab) => {
            const isActive = pathname === tab.relativePath;
            return (
              <div
                key={tab.id}
                className={`h-1.5 rounded-full transition-all ${
                  isActive ? "w-6 bg-[#FF5211]" : "w-1.5 bg-gray-300"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
