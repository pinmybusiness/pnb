import CtaButton from "./CtaButton";

export default function FinalCTA() {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-[#FF5211] via-orange-600 to-orange-700 text-white text-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-3 h-3 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-1/4 w-4 h-4 bg-white/30 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10" data-animate="scale-in">
        {/* Combined Badge – Merged for better flow */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-bold border border-white/30 min-w-0 flex-1">
            <span className="flex-shrink-0">⚡</span>
            <span className="truncate">Join 200+ professionals</span>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-bold border border-white/30 min-w-0 flex-1">
            <span className="flex-shrink-0">🇮🇳</span>
            <span className="truncate">Made in India – Join the Movement</span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Never Miss a Lead Again
        </h2>
        <p className="text-xl md:text-2xl mb-4 text-white/90 font-medium">
          Track every call, get team call reports on WhatsApp, and never miss a lead
        </p>
        <p className="text-lg mb-10 text-white/80">Start no credit card required.</p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <CtaButton
            href="/contact"
            text="Start for ₹99/month"
            size="xl"
            className="bg-white !text-[#FF5211] px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:bg-white transition-all hover:scale-105 inline-flex items-center gap-3 group"
          />
          <CtaButton
            href="/contact"
            text="Talk to Our Team"
            size="xl"
            variant="secondary"
            className="bg-transparent text-white px-10 py-5 rounded-full font-bold text-lg border-2 border-white  hover:text-[#FF5211] transition-all hover:scale-105 inline-flex items-center gap-3"
          />
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Setup in 2 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
}