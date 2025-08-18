"use client";

import Header from "@/components/Header";
import { MapPin, Phone, Clock, Send, User } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    // Add your form submission logic here (API call, etc.)
  };

  return (
    <div className="bg-gray-light min-h-screen">
      <Header activeLink="/contact" />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/5 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Call Us Directly
          </h1>
          <div className="mt-8">
            <a 
              href="tel:+911234567890" 
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-medium shadow-lg text-xl"
            >
              <Phone className="w-6 h-6" />
              +91 12345 67890
            </a>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-8">
            Prefer to message us? Fill out the form below and we'll call you back.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white border border-soft rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Request a Call Back</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-soft rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-soft rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    placeholder="Enter 10-digit mobile number"
                    pattern="[0-9]{10}"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Query
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 border border-soft rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    placeholder="Briefly describe your question or requirement"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium shadow-sm w-full"
                >
                  Request Call Back <Send className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white border border-soft rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Call Us Directly
                </h3>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    <strong>Sales:</strong> <a href="tel:+911234567891" className="hover:text-primary">+91 12345 67891</a>
                  </p>
                  <p className="text-gray-600">
                    <strong>Support:</strong> <a href="tel:+911234567892" className="hover:text-primary">+91 12345 67892</a>
                  </p>
                  <p className="text-gray-600">
                    <strong>Emergency:</strong> <a href="tel:+911234567893" className="hover:text-primary">+91 12345 67893</a> (24/7)
                  </p>
                </div>
              </div>

              <div className="bg-white border border-soft rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Visit Our Office
                </h3>
                <p className="text-gray-600">
                  123 Business Park, Sector 22<br />
                  Gurugram, Haryana 122001<br />
                  India
                </p>
              </div>

              <div className="bg-white border border-soft rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Working Hours
                </h3>
                <p className="text-gray-600">
                  <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM<br />
                  <strong>Saturday:</strong> 10:00 AM - 4:00 PM<br />
                  <strong>Sunday:</strong> Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}