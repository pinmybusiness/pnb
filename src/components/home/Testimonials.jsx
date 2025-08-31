"use client";

import { ArrowRight, Quote, Star } from "lucide-react";
import Link from "next/link";

export default function Testimonials() {
  const testimonials = [
    {
      id: "1",
      name: "Rahul Sharma",
      role: "Head Chef, Mumbai",
      quote: "This platform made finding my dream chef job so easy! I got hired at a top restaurant in just a week.",
      rating: 5,
    },
    {
      id: "2",
      name: "Priya Singh",
      role: "Restaurant Owner, Delhi",
      quote: "Hiring staff used to be a headache, but this site connected me with the perfect manager in no time!",
      rating: 4,
    },
    {
      id: "3",
      name: "Arjun Patel",
      role: "Waiter, Bangalore",
      quote: "I love how simple it is to browse jobs and apply. Got a part-time gig that fits my schedule perfectly.",
      rating: 5,
    },
  ];

  return (
    <section
      className="bg-gradient-to-b from-white to-orange-50/20 py-20 relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/food-pattern.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <div className="mb-16 text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight animate-slide-in">
            What Our <span className="text-orange-600 relative">
              Users Say
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-orange-600/50 rounded-full animate-scale-in" />
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-lg animate-slide-in" style={{ animationDelay: "0.2s" }}>
            Hear from job seekers and restaurant owners who found success with us.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="relative group bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 animate-slide-in"
              style={{ animationDelay: `${0.3 * (index + 1)}s` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <Quote className="h-6 w-6 text-orange-600" />
                <div className="flex-1">
                  <p className="text-gray-600 text-base line-clamp-3">{testimonial.quote}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-orange-600 fill-orange-600" />
                ))}
                {[...Array(5 - testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-gray-300" />
                ))}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex items-center gap-6 animate-slide-in" style={{ animationDelay: "0.9s" }}>
          <Link
            href="/jobs"
            className="inline-flex items-center px-8 py-3.5 bg-orange-600 text-white text-lg font-semibold rounded-lg hover:bg-orange-700 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Join Them Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { width: 0; }
          to { width: 100%; }
        }
        .animate-slide-in {
          animation: slideIn 0.8s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}