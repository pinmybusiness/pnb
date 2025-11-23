"use client";

import { useEffect, useState } from "react";

export default function WhatsAppButton() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // 5 sec open → 5 sec close → loop
  useEffect(() => {
    const interval = setInterval(() => {
      setIsMobileOpen((prev) => !prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <a
      href="https://wa.me/919798288748?text=Hi%20FasterQ%20Team%2C%20I%20need%20help%20with%20call-tracking%20software"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group select-none"
    >
    {/* ================= MOBILE VERSION ================= */}
    <div className="md:hidden relative">

    {/* MOBILE BUTTON */}
    <div
        className={`relative flex items-center justify-start gap-2 rounded-full shadow-lg
        bg-[#25D366] border-2 border-white/30 overflow-hidden
        transition-all duration-500
        ${isMobileOpen ? "w-40 h-14 pl-2 pr-1" : "w-14 h-14 pl-0 pr-0 justify-center"}
        `}
    >

        {/* ICON (ALWAYS VISIBLE - NO Z-INDEX ISSUE) */}
        <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        className="w-9 h-9 ml-2"
        alt="WhatsApp"
        />

        {/* TEXT (FADE IN/OUT) */}
        <span
        className={`text-white text-sm font-semibold whitespace-nowrap transition-all duration-500
            ${isMobileOpen ? "opacity-100 ml-1" : "opacity-0 ml-0"}
        `}
        >
        Chat Now
        </span>

    </div>
    </div>

      {/* ================= DESKTOP VERSION ================= */}
      {/* Your same desktop code stays untouched */}
      <div className="hidden md:block relative">
        {/* Soft glow behind button */}
        <div className="absolute inset-0 -z-10 rounded-full bg-[#25D366] opacity-30 blur-xl transition-all duration-500 group-hover:opacity-50"></div>

        {/* Animated rotating border container */}
        <div className="relative p-[3px] rounded-full bg-gradient-to-r from-[#25D366] via-[#048677] to-[#67fd9e] bg-[length:200%_100%] animate-[gradient-flow_3s_linear_infinite] shadow-lg">
          
          {/* Inner white background */}
          <div className="bg-white rounded-full">
            
            {/* Main Button Content */}
            <div className="relative flex items-center gap-3 rounded-full px-2 pr-4 py-2 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[#25D366]/5 group-hover:to-[#128C7E]/5">
              
              {/* Icon container */}
              <div className="relative w-14 h-14 flex items-center justify-center">
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 animate-ping"></div>
                
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                  className="relative z-10 w-12 h-12 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                  alt="WhatsApp"
                />
              </div>

              {/* Text */}
              <div className="overflow-hidden max-w-xs opacity-100">
                <div className="flex flex-col">
                  <span className="text-gray-900 font-bold text-sm whitespace-nowrap transition-color group-hover:text-[#25D366]">
                    Chat with us
                  </span>
                  <span className="text-gray-500 text-xs -mt-0.5 whitespace-nowrap flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse"></span>
                    We reply fast ⚡
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </a>
  );
}
