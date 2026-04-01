import CtaButton from "../components/CtaButton";

export default function FinalCTA({
  title = "Never Miss a Lead Again",
  subtitle = "Track every call, get team call reports on WhatsApp, and never miss a lead",
  note = "Start - no credit card required.",
  primaryText = "Start for ₹99/month",
  primaryLink = "/contact",
  secondaryText = "Talk to Our Team",
  secondaryLink = "/contact",
  badges = [
    "⚡ Join 500+ professionals",
    "🇮🇳 Made in India – Join the Movement",
  ],
  trustPoints = [
    "No credit card required",
    "Cancel anytime",
    "Setup in 2 minutes",
  ],
}) {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-[#FF5211] via-orange-600 to-orange-700 text-white text-center relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Floating dots */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-3 h-3 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }}></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-32 left-1/4 w-4 h-4 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "1.5s" }}></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">

        {/* Badges */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          {badges.map((badge, i) => (
            <div key={i} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-bold border border-white/30">
              {badge}
            </div>
          ))}
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          {title}
        </h2>

        <p className="text-md md:text-xl mb-10 text-white/90 font-medium">
          {subtitle}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <CtaButton
            href={primaryLink}
            text={primaryText}
            size="xl"
            className="!bg-white !text-[#FF5211] px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105"
          />
          <CtaButton
            href={secondaryLink}
            text={secondaryText}
            size="xl"
            variant="outline"
            className="bg-transparent text-white px-10 py-5 rounded-full font-bold text-lg border-2 border-white hover:!text-[#FF5211] hover:bg-white transition-all hover:scale-105"
          />
        </div>

        {/* Trust Points */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-white/80">
          {trustPoints.map((point, i) => (
            <div key={i} className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{point}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}