"use client";

import Header from "@/components/Header";
import { Users, Clock, BarChart2, Shield, Heart, Globe } from "lucide-react";

export default function AboutPage() {
  const ourMission = [
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: "Connecting Talent",
      description:
        "Our mission is to bridge the gap between skilled professionals and leading employers in the hospitality industry.",
    },
    {
      icon: <Heart className="w-8 h-8 text-orange-600" />,
      title: "Building Careers",
      description:
        "We are dedicated to helping individuals find meaningful and long-lasting careers, not just jobs.",
    },
    {
      icon: <Globe className="w-8 h-8 text-orange-600" />,
      title: "Empowering Employers",
      description:
        "We provide employers with the tools to find the right talent quickly and efficiently, saving time and resources.",
    },
  ];

  const stats = [
    { value: "500+", label: "Happy Employers" },
    { value: "10K+", label: "Verified Job Seekers" },
    { value: "100+", label: "Cities Served" },
    { value: "95%", label: "Placement Success Rate" },
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      <Header activeLink="/about" />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-orange-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tighter">
            We're On a Mission to <span className="text-orange-600">Connect</span> Talent
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Founded in 2025, FasterQ.in is the premier job portal dedicated to revolutionizing hiring in the hospitality industry. We connect top talent with opportunities at the best restaurants and hotels across India.
          </p>
          <div className="relative w-full max-w-4xl mx-auto h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="/images/about-hero-image.png" 
              alt="Diverse team of professionals in a restaurant setting" 
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Guiding <span className="text-orange-600">Principles</span>
            </h2>
            <p className="text-md md:text-lg text-gray-600 max-w-2xl mx-auto">
              We believe in building a reliable and efficient ecosystem for hospitality professionals and businesses.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ourMission.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-6 mx-auto">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-center">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey <span className="text-orange-600">So Far</span>
            </h2>
            <p className="text-md md:text-lg text-gray-600 max-w-2xl mx-auto">
              We are proud of the impact we've made in a short time.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-orange-50 rounded-2xl p-8 text-center shadow-md">
                <div className="text-4xl md:text-5xl font-extrabold text-orange-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-800">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}