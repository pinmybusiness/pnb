"use client";

import { Calendar, Clock, User, Mail, Phone, MapPin, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookDemoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    restaurant: "",
    date: "",
    time: "",
    message: ""
  });

  const availableTimes = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Demo booked:", formData);
    router.push("/demo-confirmed");
  };

  return (
    <div className="min-h-screen bg-gray-light">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-lg border border-soft hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <span className="ml-2 text-xl font-bold text-gray-800">RestoPro</span>
          </div>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Form */}
          <div className="bg-white rounded-2xl border border-soft shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Demo</h1>
            <p className="text-gray-600 mb-8">
              Schedule a personalized demo to see how RestoPro can transform your restaurant operations.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-soft rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-soft rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-soft rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={formData.restaurant}
                  onChange={(e) => setFormData({...formData, restaurant: e.target.value})}
                  className="w-full px-4 py-3 border border-soft rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 border border-soft rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    Preferred Time
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-4 py-3 border border-soft rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select a time</option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Anything specific you'd like to see?
                </label>
                <textarea
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-soft rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium shadow-sm mt-4"
              >
                Book Demo Now
              </button>
            </form>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-soft shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">What to Expect</h2>
              <div className="space-y-4">
                {[
                  "30-minute personalized walkthrough",
                  "See all features in action",
                  "Q&A with our product expert",
                  "Get your specific questions answered",
                  "No obligation to purchase"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-soft shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Our Office</h2>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700">123 Business Park, Sector 22</p>
                  <p className="text-gray-700">Gurugram, Haryana 122001</p>
                </div>
              </div>
              <div className="flex items-start gap-3 mb-4">
                <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <a href="tel:+911234567890" className="text-gray-700 hover:text-primary">+91 12345 67890</a>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <a href="mailto:demo@restopro.com" className="text-gray-700 hover:text-primary">demo@restopro.com</a>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-soft shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Demo Availability</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}