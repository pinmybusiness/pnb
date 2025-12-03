"use client";

import { useState } from "react";
import { Send, User, Phone, MessageSquare } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setStatus({
          type: "success",
          message: "Form submitted successfully! We'll contact you soon.",
        });
        setFormData({ name: "", phone: "", message: "" });
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to submit form.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="relative group bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100 hover:shadow-2xl transition-all duration-500">
      {/* Gradient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 via-orange-500/0 to-transparent group-hover:from-[#FF5211]/5 group-hover:via-orange-500/5 rounded-3xl transition-all duration-500"></div>

      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 rounded-2xl mb-4 shadow-sm">
            <Send className="w-7 h-7 md:w-8 md:h-8 text-[#FF5211]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Request a Call Back
          </h2>
          <p className="text-sm text-gray-600">We'll respond within 24 hours</p>
        </div>

        {status && (
          <div
            className={`mb-6 p-4 rounded-xl border-2 ${
              status.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            } flex items-start gap-3`}
          >
            <div className="flex-shrink-0 w-5 h-5 mt-0.5">
              {status.type === "success" ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="flex-1 text-sm font-medium">{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#FF5211]" />
                Your Name
              </span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5211]/20 focus:border-[#FF5211] transition-all duration-300 bg-gray-50/50 text-gray-900 placeholder:text-gray-400"
              required
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF5211]" />
                Mobile Number
              </span>
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5211]/20 focus:border-[#FF5211] transition-all duration-300 bg-gray-50/50 text-gray-900 placeholder:text-gray-400"
              required
              placeholder="Enter 10-digit mobile number"
              pattern="[0-9]{10}"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#FF5211]" />
                Your Query
              </span>
            </label>
            <textarea
              id="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF5211]/20 focus:border-[#FF5211] transition-all duration-300 bg-gray-50/50 resize-none text-gray-900 placeholder:text-gray-400"
              required
              placeholder="Briefly describe your question or requirement"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-[#FF5211] to-orange-600 text-white px-6 py-4 rounded-full font-bold text-base md:text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 shadow-lg ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Request Call Back
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            🔒 Your information is secure and will never be shared
          </p>
        </form>
      </div>
    </div>
  );
}
