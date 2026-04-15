"use client";

import { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  Search,
  MessageCircle,
  Mail,
  Sparkles,
} from "lucide-react";
import { faqSections } from "./faqData";

export default function FAQClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (sectionId, faqIndex) => {
    const key = `${sectionId}-${faqIndex}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredSections = faqSections
    .map((section) => ({
      ...section,
      faqs: section.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((section) => section.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FF5211] to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Frequently Asked Questions
              </h1>
              <p className="text-white/90 mt-2">
                Find answers to all your questions about FasterQ
              </p>
            </div>
          </div>

          <p className="text-lg text-white/90 leading-relaxed max-w-3xl">
            Quickly find answers to common questions and understand how FasterQ
            works, how your data is handled, and how to get the most out of our
            call insights and privacy-focused features.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Search Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-6 mb-12 shadow-lg">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 hover:border-orange-300 focus:border-[#FF5211] focus:ring-4 focus:ring-orange-500/10 rounded-xl transition-all duration-300 outline-none text-gray-900 font-medium placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 p-6 mb-12 shadow-lg">
          <p className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FF5211]" />
            Jump to a section
          </p>

          <div className="flex flex-wrap gap-3">
            {faqSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-gray-700 hover:text-[#FF5211] font-medium rounded-xl transition-all duration-300 hover:scale-105"
              >
                <span className="text-lg">{section.icon}</span>
                <span className="text-sm">{section.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Sections */}
        {filteredSections.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-[#FF5211]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-600 mb-6">
              Try different keywords or browse all categories above
            </p>
          </div>
        ) : (
          filteredSections.map((section) => (
            <section key={section.id} id={section.id} className="mb-12 scroll-mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 text-2xl">
                  {section.icon}
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-4">
                {section.faqs.map((faq, idx) => {
                  const key = `${section.id}-${idx}`;
                  const isOpen = openItems[key];

                  return (
                    <div
                      key={idx}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 hover:border-orange-300 overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <button
                        onClick={() => toggleItem(section.id, idx)}
                        className="w-full flex items-start justify-between gap-4 p-6 text-left group"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#FF5211] transition-colors duration-300">
                            {faq.question}
                          </h3>
                        </div>

                        <ChevronDown
                          className={`w-6 h-6 text-[#FF5211] flex-shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen
                            ? "max-h-[1000px] opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t-2 border-orange-100 pt-4">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))
        )}

        {/* Contact Support CTA */}
        <div className="bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-3xl p-8 md:p-12 text-center shadow-2xl shadow-orange-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Can't find the answer you're looking for? Our support team is here
              to help!
            </p>

            <a
              href="mailto:info@fasterq.in"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#FF5211] font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
