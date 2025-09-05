"use client";

import Header from "@/components/Header";
import { MapPin, Phone, Send, User, MessageSquare } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import CtaButton from "@/components/CtaButton";

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="bg-gray-50 ">
      <Header activeLink="/contact" />

      {/* Main Section */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Get in Touch with Us
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're here to help! Fill out the form below, and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            {/* Contact Form */}
            <motion.div
              className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-200"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                Request a Call Back
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-orange-500" />
                      Your Name
                    </span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                    placeholder="Enter your full name"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-orange-500" />
                      Mobile Number
                    </span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                    placeholder="Enter 10-digit mobile number"
                    pattern="[0-9]{10}"
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-orange-500" />
                      Your Query
                    </span>
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                    placeholder="Briefly describe your question or requirement"
                  ></textarea>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <CtaButton
                    asButton
                    text="Request Call Back"
                    icon={Send}
                    size="lg"
                    className="w-full rounded-full"
                    onClick={handleSubmit} // triggers form submission
                  />
                </motion.div>

              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}