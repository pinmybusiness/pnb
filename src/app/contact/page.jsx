"use client";

import { MapPin, Phone, Send, User, MessageSquare, Mail, ArrowRight, Clock, Zap } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus({ type: 'success', message: 'Form submitted successfully! We\'ll contact you soon.' });
        setFormData({ name: "", phone: "", message: "" });
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to submit form.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'An error occurred. Please try again.' });
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
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5EC] via-orange-50/40 to-white font-sans relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-72 md:w-96 h-72 md:h-96 bg-[#FF5211]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-80 md:w-[500px] h-80 md:h-[500px] bg-orange-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-48 md:w-64 h-48 md:h-64 bg-orange-200/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#FF5211 1px, transparent 1px), linear-gradient(90deg, #FF5211 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Main Section */}
      <section className="relative py-12 md:py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block px-5 py-2 bg-white/80 backdrop-blur-sm text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
              💬 Let's Connect
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 mb-4 md:mb-6">
              Get in Touch with Us
              <br />
              <span className="bg-gradient-to-r from-[#FF5211] via-orange-500 to-orange-600 bg-clip-text text-transparent">
                We're Here to Help
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Fill out the form below, and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start max-w-6xl mx-auto">
            {/* Contact Form */}
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
                  <div className={`mb-6 p-4 rounded-xl border-2 ${
                    status.type === 'success' 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : 'bg-red-50 border-red-200 text-red-700'
                  } flex items-start gap-3`}>
                    <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                      {status.type === 'success' ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </div>
                    <span className="flex-1 text-sm font-medium">{status.message}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
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
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
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
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
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
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Quick Contact Cards */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Phone className="w-6 h-6 text-[#FF5211]" />
                  Call Us Directly
                </h3>
                <a 
                  href="tel:+919798288748" 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-xl hover:shadow-md transition-all group/item"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-full flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Call or WhatsApp</p>
                      <p className="text-lg font-bold text-gray-900">+91 97982 88748</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover/item:text-[#FF5211] group-hover/item:translate-x-1 transition-all" />
                </a>
              </div>

              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-[#FF5211]" />
                  Chat on WhatsApp
                </h3>
                <a 
                  href="https://wa.me/919798288748" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all group/item"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Instant Response</p>
                      <p className="text-lg font-bold text-gray-900">Start Chat</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover/item:text-green-600 group-hover/item:translate-x-1 transition-all" />
                </a>
              </div>

              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-[#FF5211]" />
                  Email Us
                </h3>
                <a 
                  href="mailto:info@fasterq.in" 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl hover:shadow-md transition-all group/item"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Send us an email</p>
                      <p className="text-base md:text-lg font-bold text-gray-900">info@fasterq.in</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover/item:text-blue-600 group-hover/item:translate-x-1 transition-all" />
                </a>
              </div>

              {/* Business Hours */}
              <div className="bg-gradient-to-br from-[#FF5211]/5 to-orange-100/30 rounded-3xl p-6 md:p-8 border border-[#FF5211]/20">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#FF5211]" />
                  Business Hours
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Monday - Friday</span>
                    <span className="font-bold text-gray-900">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Saturday</span>
                    <span className="font-bold text-gray-900">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Sunday</span>
                    <span className="font-bold text-gray-900">Closed</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#FF5211]/20">
                  <p className="text-xs text-gray-600 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#FF5211]" />
                    <span>Emergency support available 24/7 via WhatsApp</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-16 md:mt-20">
            <div className="bg-gradient-to-r from-[#FF5211] via-orange-600 to-orange-700 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-48 md:w-64 h-48 md:h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-48 md:w-64 h-48 md:h-64 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>

              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Need Immediate Assistance?
                </h3>
                <p className="text-lg md:text-xl mb-8 text-white/90">
                  Our sales team is ready to help you choose the perfect plan for your business
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="tel:+919798288748"
                    className="bg-white text-[#FF5211] px-8 py-4 rounded-full font-bold text-base md:text-lg hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center justify-center gap-3 group"
                  >
                    <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Call Now</span>
                  </a>
                  <a
                    href="https://wa.me/919798288748"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-8 py-4 rounded-full font-bold text-base md:text-lg hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center justify-center gap-3 group border-2 border-white/20"
                  >
                    <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}