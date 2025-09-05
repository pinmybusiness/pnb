"use client";

import { Search, FileText, Send } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-12 h-12 text-orange-600" />,
      title: "Search Jobs",
      desc: "Browse thousands of verified restaurant jobs across India.",
    },
    {
      icon: <FileText className="w-12 h-12 text-green-600" />,
      title: "Apply Easily",
      desc: "Quick apply with your profile in just a few clicks.",
    },
    {
      icon: <Send className="w-12 h-12 text-blue-600" />,
      title: "Get Hired",
      desc: "Connect with employers & land your next job faster.",
    },
  ];

  return (
    <section className="bg-gradient-to-b py-20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            How <span className="text-orange-600">It Works</span>
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Getting your dream restaurant job is simple and fast with IncogJobs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-8 text-center"
            >
              <div className="flex justify-center mb-6">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
