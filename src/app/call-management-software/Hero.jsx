"use client"
import React from 'react';
import Link from 'next/link';
import CtaButton from '@/components/CtaButton';

const agents = [
  { name: 'Rahul K.', width: '88%', count: '74', delay: '0.8s' },
  { name: 'Priya S.', width: '72%', count: '61', delay: '0.9s' },
  { name: 'Amit R.', width: '60%', count: '51', delay: '1s' },
  { name: 'Sneha T.', width: '48%', count: '40', delay: '1.1s' },
];

const weekBars = ['28px', '36px', '22px', '44px', '32px', '40px', '38px'];

const features = [
  { icon: '📱', title: 'Works on SIM', sub: 'No VoIP needed' },
  { icon: '₹', title: '₹99/month', sub: 'Per agent, billed monthly' },
  { icon: '🔧', title: 'No Hardware', sub: 'Setup in 5 minutes' },
  { icon: '🇮🇳', title: 'Data in India', sub: '100% compliant' },
];

const avatars = [
  { initials: 'RK', color: 'bg-indigo-500' },
  { initials: 'PS', color: 'bg-pink-500' },
  { initials: 'AR', color: 'bg-teal-500' },
  { initials: 'ST', color: 'bg-orange-500' },
];

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#FFF5EC] via-orange-50/40 to-white py-14 md:py-20 -mt-10 md:pt-25 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* Animated Background Orbs */}
      <div className="absolute rounded-full pointer-events-none w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] top-[-150px] sm:top-[-200px] right-[-100px] sm:right-[-150px] bg-[radial-gradient(circle,rgba(247,149,51,0.12)_0%,transparent_70%)] animate-[pulse-slow_6s_ease-in-out_infinite]" />
      <div className="absolute rounded-full pointer-events-none w-[250px] sm:w-[350px] md:w-[400px] h-[250px] sm:h-[350px] md:h-[400px] bottom-[-50px] sm:bottom-[-100px] left-[-50px] sm:left-[-100px] bg-[radial-gradient(circle,rgba(247,149,51,0.08)_0%,transparent_70%)] animate-[pulse-slow_8s_ease-in-out_2s_infinite]" />
      <div className="absolute rounded-full pointer-events-none w-[150px] sm:w-[200px] h-[150px] sm:h-[200px] top-[40%] left-[40%] bg-[radial-gradient(circle,rgba(247,149,51,0.06)_0%,transparent_70%)] animate-[pulse-slow_5s_ease-in-out_1s_infinite]" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(247,149,51,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(247,149,51,0.04)_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:48px_48px]" />

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-start md:items-center">

          {/* ── LEFT COLUMN ── */}
          <div className="text-center lg:text-left space-y-5 sm:space-y-6 md:space-y-8">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-[rgba(247,149,51,0.15)] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold text-gray-700 shadow-sm mb-4 sm:mb-6 animate-[fadeSlideUp_0.5s_ease_both]">
              <div className="relative w-1.5 sm:w-2 h-1.5 sm:h-2">
                <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                <span className="absolute inset-0 rounded-full bg-green-500" />
              </div>
              500+ teams &nbsp;·&nbsp; Made in India 🇮🇳
            </div>

            {/* Heading */}
            <h1 className="!text-[28px] sm:!text-[32px] lg:!text-6xl font-extrabold leading-tight text-gray-900 mb-4 sm:mb-6 animate-[fadeSlideUp_0.6s_ease_0.1s_both]">
              <span className="block">India's Smartest</span>
              <span className="block bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-[length:200%_auto] text-transparent bg-clip-text animate-[shimmer_3s_linear_infinite]">
                Call Management
              </span>
              <span className="block text-xl sm:text-2xl md:text-3xl mt-1">
                Software - SIM Based, Not VoIP
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base leading-relaxed text-gray-700 max-w-md mx-auto lg:mx-0 mb-6 sm:mb-8 animate-[fadeSlideUp_0.6s_ease_0.2s_both]">
              Track every sales call from your team's existing SIM cards. Get live dashboards{' '}
              <strong className="text-gray-900 font-bold">WhatsApp reports &amp; call recordings</strong>
            </p>

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
            <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 animate-[fadeSlideUp_0.6s_ease_0.4s_both]">
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

          {/* ── RIGHT COLUMN - Dashboard (Mobile Responsive) ── */}
          <div className="relative animate-[fadeSlideUp_0.7s_ease_0.2s_both] mt-8 md:mt-0 w-full max-w-[95%] sm:max-w-full mx-auto md:mx-0 scale-[0.98] sm:scale-100 origin-top">

            {/* Floating Badge - Top */}
            <div className="absolute top-[-12px] sm:top-[-16px] right-[-8px] sm:right-[-12px] bg-white rounded-lg sm:rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 shadow-lg border border-gray-100 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold z-20 animate-[float_3s_ease-in-out_infinite]">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-green-500 animate-pulse" />
              Live Tracking
            </div>

            {/* Floating Badge - Bottom */}
            <div className="absolute bottom-[-12px] sm:bottom-[-16px] left-[-8px] sm:left-[-12px] bg-white rounded-lg sm:rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 shadow-lg border border-gray-100 z-20 animate-[float_3s_ease-in-out_0.8s_infinite]">
              <div className="text-[9px] sm:text-[11px] text-gray-500 mb-0.5">Today's Calls</div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#F79533] leading-none">+247</div>
            </div>

            {/* Dashboard Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl ring-1 ring-[rgba(247,149,51,0.08)] overflow-hidden transition-transform duration-300 hover:-translate-y-1">

              {/* Titlebar */}
              <div className="bg-[#1a1a1a] px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-red-500" />
                <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-green-500" />
                <span className="ml-1 sm:ml-2 text-[9px] sm:text-[11px] text-gray-400 font-medium truncate">
                  FasterQ Dashboard · Today
                </span>
              </div>

              <div className="p-3 sm:p-4">
                {/* Stats Row - Mobile Optimized */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 mb-4">
                  {[
                    { val: '684', label: 'Total Calls', trend: '↑ 18%' },
                    { val: '4:12m', label: 'Avg Duration', trend: '↑ 6%' },
                    { val: '97%', label: 'Answered Rate', trend: '↑ 3%' },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#fafafa] rounded-lg sm:rounded-xl p-2 sm:p-3 border border-black/5">
                      <div className="flex items-baseline justify-between gap-1">
                        <div className="text-base sm:text-lg md:text-xl font-extrabold">{s.val}</div>
                        <div className="text-[8px] sm:text-[10px] text-green-500 font-bold whitespace-nowrap">{s.trend}</div>
                      </div>
                      <div className="text-[8px] sm:text-[10px] text-gray-500 mt-0.5 sm:mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Agent Performance */}
                <div className="text-[9px] sm:text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2 sm:mb-2.5">
                  Agent Performance
                </div>
                <div className="space-y-2 sm:space-y-2.5">
                  {agents.map((agent) => (
                    <div key={agent.name} className="flex items-center gap-1.5 sm:gap-2.5">
                      <span className="text-[9px] sm:text-[11px] text-gray-500 w-10 sm:w-12 text-right truncate">{agent.name}</span>
                      <div className="flex-1 h-1 sm:h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#F79533] to-[#e07d1a]"
                          style={{
                            width: agent.width,
                            animation: `barGrow 1s ease ${agent.delay} both`,
                          }}
                        />
                      </div>
                      <span className="text-[9px] sm:text-[11px] font-bold w-5 sm:w-6 text-right">{agent.count}</span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-black/5 my-3 sm:my-3.5" />

                {/* Mini Bar Chart */}
                <div className="text-[9px] sm:text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2 sm:mb-2.5">
                  Calls This Week
                </div>
                <div className="h-9 sm:h-11 flex items-end gap-0.5 sm:gap-1 px-0.5">
                  {weekBars.map((h, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-gradient-to-t from-[rgba(247,149,51,0.8)] to-[rgba(247,149,51,0.3)] rounded-t transition-all duration-300 hover:opacity-80"
                      style={{
                        height: `calc(${h} * 0.7)`,
                        minHeight: '12px',
                        animation: `barGrow 0.6s ease ${0.3 + idx * 0.05}s both`,
                        transformOrigin: 'bottom',
                      }}
                      onMouseEnter={(e) => {
                        const originalHeight = h;
                        e.currentTarget.style.height = `calc(${originalHeight} * 0.85)`;
                      }}
                      onMouseLeave={(e) => {
                        const originalHeight = h;
                        e.currentTarget.style.height = `calc(${originalHeight} * 0.7)`;
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Feature Strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-10 sm:mt-12 md:mt-14 animate-[fadeSlideUp_0.6s_ease_0.5s_both]">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 text-center border border-[rgba(247,149,51,0.15)] transition-all duration-200 hover:border-[#F79533] hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 rounded-lg sm:rounded-xl bg-[#FFF4E0] flex items-center justify-center mx-auto mb-1.5 sm:mb-2 md:mb-2.5 text-base sm:text-lg md:text-xl">
                {f.icon}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-gray-700">{f.title}</div>
              <div className="text-[9px] sm:text-[11px] text-gray-500 mt-0.5">{f.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.1); opacity: 0.7; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes barGrow {
          from { width: 0; height: 0; opacity: 0; }
          to   { width: var(--w); height: var(--h); opacity: 1; }
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .stats-card {
            padding: 0.5rem;
          }
        }
      `}</style>
    </section>
  );
}