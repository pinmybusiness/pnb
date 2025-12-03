import {
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  ArrowRight,
  Clock,
  Zap,
} from "lucide-react";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact FasterQ | Request a Call Back or WhatsApp Us",
  description:
    "Get in touch with FasterQ for SIM-based call tracking. Request a call back, chat on WhatsApp, or email our team for support and sales inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5EC] via-orange-50/40 to-white font-sans relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 w-72 md:w-96 h-72 md:h-96 bg-[#FF5211]/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 -right-20 w-80 md:w-[500px] h-80 md:h-[500px] bg-orange-300/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-48 md:w-64 h-48 md:h-64 bg-orange-200/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(#FF5211 1px, transparent 1px), linear-gradient(90deg, #FF5211 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        ></div>
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
              Fill out the form below, and we'll get back to you as soon as
              possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start max-w-6xl mx-auto">
            {/* ✅ Contact Form is now a separate client component */}
            <ContactForm />

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
                      <p className="text-sm text-gray-600 font-medium">
                        Call or WhatsApp
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        +91 97982 88748
                      </p>
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
                  href="https://wa.me/919798288748?text=Hi%20there!%20I%20just%20visited%20your%20site%20and%20wanted%20to%20connect."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all group/item"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Instant Response
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        Start Chat
                      </p>
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
                      <p className="text-sm text-gray-600 font-medium">
                        Send us an email
                      </p>
                      <p className="text-base md:text-lg font-bold text-gray-900">
                        info@fasterq.in
                      </p>
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
                    <span className="text-gray-600 font-medium">
                      Monday - Friday
                    </span>
                    <span className="font-bold text-gray-900">
                      9:00 AM - 6:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Saturday</span>
                    <span className="font-bold text-gray-900">
                      10:00 AM - 4:00 PM
                    </span>
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
                <div
                  className="absolute bottom-0 right-1/4 w-48 md:w-64 h-48 md:h-64 bg-white rounded-full blur-3xl animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Need Immediate Assistance?
                </h3>
                <p className="text-lg md:text-xl mb-8 text-white/90">
                  Our sales team is ready to help you choose the perfect plan
                  for your business
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
                    href="https://wa.me/919798288748?text=Hi%20there!%20I%20just%20visited%20your%20site%20and%20wanted%20to%20connect."
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
