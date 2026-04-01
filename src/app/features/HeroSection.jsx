import Link from "next/link";
import React from "react";

const callLogs = [
  { type: "inbound", name: "9798288748", time: "2 min ago", duration: "4m 32s", status: "Answered" },
  { type: "missed", name: "9876543211", time: "8 min ago", duration: "—", status: "Missed" },
  { type: "outbound", name: "Amit Verma", time: "15 min ago", duration: "6m 11s", status: "Completed" },
  { type: "inbound", name: "8769876540", time: "22 min ago", duration: "2m 05s", status: "Answered" },
];

const typeConfig = {
  inbound: {
    icon: (
      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
        <path d="M14 2L2 14M2 2l4 4" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 14h5M2 9v5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    bg: "bg-green-50",
    dot: "bg-green-400",
    label: "text-green-700",
  },
  outbound: {
    icon: (
      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
        <path d="M2 14L14 2M14 14l-4-4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 2H9M14 2v5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    bg: "bg-blue-50",
    dot: "bg-blue-400",
    label: "text-blue-700",
  },
  missed: {
    icon: (
      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none">
        <path d="M3 3l10 10M13 3L3 13" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    bg: "bg-red-50",
    dot: "bg-red-400",
    label: "text-red-600",
  },
};

const avatars = [
  { initials: 'RK', color: 'bg-indigo-500' },
  { initials: 'PS', color: 'bg-pink-500' },
  { initials: 'AR', color: 'bg-teal-500' },
  { initials: 'ST', color: 'bg-orange-500' },
];

export default function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-br from-[#FFF5EC] via-[#FFF8F5] to-white overflow-hidden">
      {/* Background blobs */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full opacity-40 blob-animation-1"
        style={{
          background: "radial-gradient(circle, #FF521122 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute top-10 right-0 w-[400px] h-[400px] rounded-full opacity-30 blob-animation-2"
        style={{
          background: "radial-gradient(circle, #FF8C5A18 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full opacity-20 blob-animation-3"
        style={{
          background: "radial-gradient(circle, #FF521115 0%, transparent 70%)",
        }}
      />

      {/* Grid dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] grid-dot-pattern"
      />

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* LEFT: Copy */}
          <div className="text-center lg:text-left space-y-5 sm:space-y-6 md:space-y-8">

            {/* Badge */}
            <div className="max-w-fit fade-up-1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-200 shadow-sm text-sm font-semibold text-gray-700 mb-6">
              <span className="text-base">🇮🇳</span>
              <span>Made in India for Growing Sales Teams</span>
            </div>

            {/* Heading */}
            <h1 className="fade-up-2 !text-[32px] md:!text-6xl font-extrabold leading-tight text-gray-900 mb-5">
              Close More Deals with{" "} 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-[length:200%_auto] shimmer-animation">
                Smarter Call Tracking
              </span>
            </h1>

            {/* Subheading */}
            <p className="fade-up-3 text-base md:text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
Track inbound, missed, and outgoing calls, get daily WhatsApp reports, record conversations, and sync seamlessly with your CRM all from your team’s existing SIM cards.            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link href='/contact' className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-5 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center justify-center gap-2 sm:gap-3 group shadow-xl">
                <span>Start for ₹99/month</span>
                <span className="text-lg sm:text-xl md:text-2xl group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link href='/contact' className="bg-white text-orange-600 px-5 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg border-2 border-orange-500/20 hover:border-orange-500 hover:shadow-md transition-all hover:scale-105 inline-flex items-center justify-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                </svg>
                <span>Watch Demo</span>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 fade-up-5">
              <div className="flex">
                {avatars.map((av, idx) => (
                  <div
                    key={idx}
                    className={`w-7 sm:w-8 md:w-9 h-7 sm:h-8 md:h-9 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] sm:text-xs font-bold -ml-2 first:ml-0 ${av.color}`}
                  >
                    {av.initials}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#1a1a1a]">500+ sales teams</p>
                <span className="text-[10px] sm:text-xs text-gray-500">Already tracking smarter</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Mock Dashboard */}
          <div className="relative flex items-center justify-center lg:justify-end">

            {/* Floating mini card — Calls Today */}
            <div className="float-card-alt absolute -bottom-4 right-2 lg:-right-4 z-20 bg-white rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(255,82,17,0.18)] border border-orange-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12V4M4 8l4-4 4 4" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400 leading-none mb-0.5">Today</p>
                <p className="text-sm font-black text-gray-900">+247 Calls</p>
              </div>
            </div>

            {/* Main dashboard card */}
            <div className="relative z-10 w-full max-w-sm lg:max-w-md bg-white rounded-3xl shadow-[0_16px_64px_rgba(255,82,17,0.14),0_2px_16px_rgba(0,0,0,0.06)] border border-orange-100 overflow-hidden">

              {/* Card top bar */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF5211]" />
                  <span className="text-sm font-bold text-gray-800">Call Activity</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="px-2.5 py-1 rounded-full bg-orange-50 text-[#FF5211] font-semibold">Today</span>
                  <span>This Week</span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x divide-gray-100 px-1 py-3">
                {[
                  { label: "Inbound", value: "128", color: "text-green-600", bg: "bg-green-50" },
                  { label: "Outbound", value: "94", color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Missed", value: "25", color: "text-red-500", bg: "bg-red-50" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center py-2">
                    <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${s.bg} ${s.color}`}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Mini bar chart */}
              <div className="px-5 pb-3">
                <div className="flex items-end justify-between gap-1 h-12">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <div
                        className="w-full rounded-t-sm transition-all duration-300"
                        style={{
                          height: `${h}%`,
                          background: i === 5
                            ? "linear-gradient(180deg, #FF5211 0%, #FF8C5A 100%)"
                            : "#FF521115",
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <span key={i} className={`flex-1 text-center text-[9px] font-medium ${i === 5 ? "text-[#FF5211]" : "text-gray-300"}`}>{d}</span>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="mx-5 border-t border-dashed border-orange-100" />

              {/* Call log list */}
              <div className="px-4 py-3 space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-2">Recent Calls</p>
                {callLogs.map((log, i) => {
                  const cfg = typeConfig[log.type];
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-50/60 transition-colors duration-150 cursor-pointer"
                    >
                      <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                        {cfg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{log.name}</p>
                        <p className="text-[10px] text-gray-400">{log.time}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-[10px] font-bold ${cfg.label}`}>{log.status}</p>
                        <p className="text-[10px] text-gray-400">{log.duration}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Card footer */}
              <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">Updated just now</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF5211]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5211] live-pulse" />
                  Live
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}