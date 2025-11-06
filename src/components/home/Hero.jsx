
import Link from "next/link";
import CtaButton from "./CtaButton";

export default function Hero() {

  return (
    <section className="relative bg-gradient-to-br from-[#FFF5EC] via-orange-50/40 to-white py-14 md:py-20 px-6 lg:px-8 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-[#FF5211]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-200/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#FF5211 1px, transparent 1px), linear-gradient(90deg, #FF5211 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-4 h-4 bg-[#FF5211]/20 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3s'}}></div>
        <div className="absolute top-1/3 right-20 w-3 h-3 bg-orange-400/20 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-5 h-5 bg-[#FF5211]/15 rounded-full animate-bounce" style={{animationDelay: '1.5s', animationDuration: '3.5s'}}></div>
      </div>

      {/* Background Curve */}
      <div className="absolute inset-x-0 bottom-0 h-32">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-full text-white"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,0 C300,100 600,50 900,80 1200,110 1440,60 1440,0 L1440,120 L0,120 Z"
            opacity="0.5"
          />
          <path
            fill="currentColor"
            d="M0,20 C400,90 800,40 1200,70 1300,80 1440,50 1440,20 L1440,120 L0,120 Z"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="text-center lg:text-left space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-orange-500/20 shadow-lg mb-4">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-green-600 font-bold tracking-wide text-xs sm:text-sm">
              🇮🇳 Made in India for Growing Sales Teams
            </span>
          </div>
          <h1 className="!text-4xl lg:!text-6xl font-extrabold leading-tight text-gray-900">
            Track Every Call.
            <br />
            <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Close Every Deal.
            </span>
          </h1>

<p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
  Trackly automatically logs all your <span className="font-semibold text-gray-900">SIM calls</span> — no VoIP, no number change.  
  Get complete visibility into your team’s daily calls.
</p>


          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link href='/contact' className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 sm:px-8 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center justify-center gap-2 sm:gap-3 group shadow-xl">
                <span>Start for ₹99/month</span>
                <span className="text-xl sm:text-2xl group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link href='/contact' className="bg-white text-orange-600 px-6 sm:px-8 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg border-2 border-orange-500/20 hover:border-orange-500 hover:shadow-xl transition-all hover:scale-105 inline-flex items-center justify-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                </svg>
                <span>Watch Demo</span>
              </Link>
            </div>
          </div>

<div className="flex items-center gap-4 pt-4 justify-center lg:justify-start">
  <div className="flex -space-x-3">
    {[
      "/images/trackly/avatars/user3.webp",
      "/images/trackly/avatars/user1.webp",
      "/images/trackly/avatars/user2.webp",
      "/images/trackly/avatars/user4.webp",
    ].map((src, i) => (
      <img
        key={i}
        src={src}
        alt={`User ${i + 1}`}
        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md object-cover"
      />
    ))}
  </div>
  <div className="text-left">
    <p className="text-xs sm:text-sm font-bold text-gray-900">200+ sales teams</p>
    <p className="text-xs text-gray-600">Already tracking smarter</p>
  </div>
</div>

        </div>

        {/* Right Side Image */}
        <div className="flex justify-center md:justify-end relative">
          <div className="relative group">
            <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-2xl px-4 py-3 border border-gray-100 z-20 animate-bounce" style={{animationDuration: '3s'}}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-gray-900">Live Tracking</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-2xl px-5 py-3 border border-gray-100 z-20 animate-bounce" style={{animationDuration: '3s', animationDelay: '1s'}}>
              <p className="text-xs text-gray-600 mb-1">Today's Calls</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">+247</p>
            </div>
            <div className="relative">
              <img
                src="/images/trackly/hero-image.png"
                alt="Trackly dashboard preview"
                width={550}
                height={450}
                className="drop-shadow-2xl rounded-3xl transform group-hover:scale-[1.02] transition-transform duration-500 relative z-10 border-4 border-white shadow-2xl"
              />
              <div className="absolute -inset-8 bg-gradient-to-tr from-[#FF5211]/30 via-orange-400/20 to-transparent rounded-3xl blur-3xl -z-10 group-hover:blur-[100px] transition-all duration-500" />
              <div className="absolute -inset-12 bg-gradient-to-br from-orange-300/20 via-[#FF5211]/10 to-transparent rounded-3xl blur-3xl -z-20 animate-pulse" />
            </div>
            <div className="absolute top-1/4 -right-8 w-16 h-16 bg-[#FF5211]/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-1/4 -left-8 w-20 h-20 bg-orange-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
}