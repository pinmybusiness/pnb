"use client";

import { ArrowRight, Quote, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import CtaButton from "../CtaButton";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="bg-white py-20 relative overflow-hidden">
      {/* Abstract background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-white"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            What Our <span className="text-orange-600">Users Say</span>
          </h2>
          {/* <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from job seekers and restaurant owners who found success with us.
          </p> */}
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 relative"
              variants={cardVariants}
            >
              <div className="absolute top-0 right-0 p-4">
                <Quote className="h-10 w-10 text-orange-200 opacity-60" />
              </div>
              
              <div className="mb-4 relative z-10">
                <p className="text-lg text-gray-800 leading-relaxed italic">{testimonial.quote}</p>
              </div>

              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating ? "text-orange-500 fill-orange-500" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mt-4">{testimonial.name}</h3>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
          <div className="flex justify-center mt-16">
            <CtaButton href="/jobs" text="Join Them Now" />
          </div>
      </div>
    </section>
  );
}