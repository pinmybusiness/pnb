"use client";

import Header from "@/components/Header";
import { Users, Clock, BarChart2, Shield, Heart, Globe } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Wait Time Reduction",
      description: "Our system has helped restaurants reduce average wait times by 35% across all locations."
    },
    {
      icon: <BarChart2 className="w-8 h-8 text-primary" />,
      title: "Revenue Growth",
      description: "Partners report an average 22% increase in revenue within 3 months of implementation."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Data Security",
      description: "Enterprise-grade security protecting your business and customer data."
    }
  ];

  const stats = [
    { value: "850+", label: "Restaurants Using Our System" },
    { value: "92%", label: "Customer Satisfaction Rate" },
    { value: "35%", label: "Average Wait Time Reduction" },
    { value: "24/7", label: "Dedicated Support" }
  ];

  return (
    <div className="bg-gray-light min-h-screen">
     <Header activeLink="/about" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/5 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Revolutionizing <span className="text-primary">Restaurant Management</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Founded in 2025, Hirewaala has helped hundreds of restaurants streamline operations and enhance customer experiences through intelligent technology.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-light border border-soft rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white border border-soft rounded-xl p-6 text-center shadow-sm">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}