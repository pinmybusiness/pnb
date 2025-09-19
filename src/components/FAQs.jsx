// src/components/FAQs.jsx
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQs({ faqs }) {
  const [expanded, setExpanded] = useState(null);

  const toggleFAQ = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="max-w-full mx-auto px-4 pb-12">
      <h2 className="my-6">
        Frequently Asked Questions
      </h2>
      <div className="divide-y divide-gray-200">
        {faqs.map((faq, index) => (
          <div key={index}>
            <button
              className="w-full flex justify-between items-center px-5 py-4 text-left focus:outline-none hover:bg-orange-100 transition"
              onClick={() => toggleFAQ(index)}
            >
              <span
                className={`text-base  ${
                  expanded === index ? "font-semibold" : "font-medium"
                }`}
              >
                Q. {faq.question}
              </span>
              {expanded === index ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {expanded === index && (
              <div className="px-5 pb-4">
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
