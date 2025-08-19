"use client";

import { Sparkles, Clock, Users, BarChart2, ArrowRight, BookOpen, LogIn, Check, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState('analytics');

  const features = {
    analytics: {
      title: "Real-time Performance Dashboard",
      description: "Monitor all key metrics from customer wait times to table turnover with intuitive visualizations.",
      icon: <BarChart2 className="w-5 h-5 text-primary" />,
      stats: [
        { value: "40%", label: "Reduction in wait times" },
        { value: "92%", label: "Customer satisfaction" }
      ]
    },
    queue: {
      title: "Smart Queue Management",
      description: "Automatically optimize customer flow and reduce wait times during peak hours.",
      icon: <Clock className="w-5 h-5 text-primary" />,
      stats: [
        { value: "35%", label: "Faster table turnover" },
        { value: "24/7", label: "Automated monitoring" }
      ]
    },
    customers: {
      title: "Guest Experience Tools",
      description: "Enhance satisfaction with automated notifications and feedback collection.",
      icon: <Users className="w-5 h-5 text-primary" />,
      stats: [
        { value: "4.8★", label: "Average rating" },
        { value: "3x", label: "Repeat customers" }
      ]
    }
  };

  const testimonials = [
    {
      quote: "RestoPro reduced our wait times by 40% and increased revenue by 25% in just 3 months.",
      author: "Rahul Sharma",
      role: "Owner, Spice Route"
    },
    {
      quote: "The AI queue management has transformed how we handle peak hours. Highly recommended!",
      author: "Priya Patel",
      role: "Manager, Urban Tandoor"
    }
  ];

  return (
    <div className="min-h-[calc(100dvh-64px)] flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Content */}
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
                <Sparkles className="w-4 h-4 mr-2" />
                Trusted by 850+ Restaurants
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight animate-fade-in delay-100">
                Listen Smarter. <br/>
                Grow Faster.  <br/>
                With <span className="text-primary">ListenLift AI.</span>
              </h1>

              <p className="text-l text-gray-700 animate-fade-in delay-200">
                Capture feedback, uncover insights, and act faster with AI-driven listening.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-300">
                <Link href="/book-demo">
                  <button className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center group">
                    <span>Book a Demo</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                  
                {/*<Link href="/auth/login">
                  <button className="px-8 py-4 border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-lg transition-all duration-300 flex items-center justify-center">
                    Existing User? Login
                  </button>
                </Link>*/}
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 pt-4 animate-fade-in delay-400">
                {[
                  { icon: <Shield className="w-5 h-5 text-green-600" />, text: "Secure & Reliable" },
                  { icon: <TrendingUp className="w-5 h-5 text-blue-600" />, text: "Proven Results" },
                  { icon: <Check className="w-5 h-5 text-primary" />, text: "Easy Setup" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-sm font-medium text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Feature Tabs */}
            <div className="lg:w-1/2 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 animate-fade-in-left">
              {/* Feature Tabs */}
              <div className="flex border-b border-gray-200 bg-gray-50">
                {Object.keys(features).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFeature(tab)}
                    className={`px-6 py-4 text-sm font-medium flex-1 flex items-center justify-center gap-2 transition-colors ${activeFeature === tab ? 'text-primary border-b-2 border-primary bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {features[tab].icon}
                    {features[tab].title.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Active Feature Content */}
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {features[activeFeature].title}
                </h3>
                <p className="text-gray-700 mb-6 text-sm">
                  {features[activeFeature].description}
                </p>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {features[activeFeature].stats.map((stat, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-primary">{stat.value}</div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Demo CTA */}
               {/* <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2 text-center">See it in action</h4>
                  <Link href="/book-demo">
                    <button className="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-medium transition-colors">
                      Schedule Demo
                    </button>
                  </Link>
                </div>*/}
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-soft shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">{testimonial.author}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div> */}
      </section>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in.delay-100 {
          animation-delay: 0.1s;
        }
        .animate-fade-in.delay-200 {
          animation-delay: 0.2s;
        }
        .animate-fade-in.delay-300 {
          animation-delay: 0.3s;
        }
        .animate-fade-in.delay-400 {
          animation-delay: 0.4s;
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-left {
          animation: fadeInLeft 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}