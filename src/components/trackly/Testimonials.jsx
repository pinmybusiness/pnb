import React from "react";

export default function TestimonialsSection({ handleContactClick }) {
  // default data if none provided
const testimonials = [
  {
    quote:
      "I run a small digital agency, and Trackly made tracking client calls super easy. No more missed follow-ups!",
    author: "Kunal Mehta",
    role: "Founder",
    company: "AdBoost Media",
  },
  {
    quote:
      "As a real estate consultant, I used to forget call details. Now everything logs automatically — love the simplicity!",
    author: "Nisha Patel",
    role: "Property Consultant",
    company: "HomeVista Realty",
  },
  {
    quote:
      "I’m a freelancer handling multiple clients — Trackly’s insights helped me organize my calls and follow-ups like a pro.",
    author: "Ravi Kumar",
    role: "Freelance Marketer",
    company: "Self-employed",
  },
    {
    quote: "Trackly sends daily analytics of my entire sales team's calls directly on WhatsApp, so I stay updated without opening any dashboard.",
    author: "Rajesh Kumar",
    role: "Sales Manager",
    company: "Tech Solutions Pvt Ltd"
    }

];

  return (
    <section className="py-20 px-4  relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-[#FF5211] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-orange-300 rounded-full blur-3xl"></div>
      </div>

      {/* Floating quote marks decoration */}
      <div className="absolute top-10 left-10 text-[#FF5211]/5 text-9xl font-serif">"</div>
      <div className="absolute bottom-10 right-10 text-[#FF5211]/5 text-9xl font-serif rotate-180">"</div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-5 py-2 bg-white/80 backdrop-blur-sm text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
            💬 Customer Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Our <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">Customers Say</span>
          </h2>
          <p className="text-gray-600 text-lg">Real results from real sales professionals</p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <article
              key={i}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#FF5211]/30 hover:-translate-y-2"
              aria-label={`Testimonial from ${t.author}`}
            >
              {/* Gradient glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 to-orange-500/0 group-hover:from-[#FF5211]/5 group-hover:to-orange-500/5 rounded-3xl transition-all duration-500" aria-hidden></div>

              {/* Quote mark icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Star rating */}
              <div className="flex gap-1 mb-4 ml-8" aria-hidden>
                {[...Array(5)].map((_, idx) => (
                  <svg key={idx} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <div className="relative mb-6">
                <p className="text-gray-700 text-lg leading-relaxed italic">"{t.quote}"</p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6 group-hover:via-[#FF5211]/30 transition-colors" />

              {/* Author info */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                    {t.author?.split(" ")?.map((n) => n[0])?.join("")}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                </div>

                {/* Author details */}
                <div className="flex-1">
                  <p className="font-bold text-gray-900 group-hover:text-[#FF5211] transition-colors">{t.author}</p>
                  <p className="text-sm text-gray-600">{t.role}</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{t.company}</p>
                </div>

                {/* Verified badge */}
                <div className="flex-shrink-0">
                  <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-blue-200">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </div>
                </div>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF5211] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl" />
            </article>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 hidden md:grid grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[{ number: "1000+", label: "Active Users" }, { number: "4.9/5", label: "Average Rating" }, { number: "98%", label: "Would Recommend" }].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-[#FF5211]/30 hover:shadow-xl transition-all hover:-translate-y-1">
                <p className="text-3xl font-bold bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent mb-2">{stat.number}</p>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Join thousands of satisfied customers</p>
          <button
            onClick={handleContactClick}
            className="bg-gradient-to-r from-[#FF5211] to-orange-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-2 group"
            aria-label="Start now"
          >
            <span>Start for ₹99/month</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
