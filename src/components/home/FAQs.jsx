import { ChevronDown, HelpCircle, Check, CircleQuestionMark } from "lucide-react";

const faqs = [
  {
    q: "What is call tracking software?",
    a: "Call tracking software automatically records and logs all inbound and outbound calls made by your sales team. It helps you monitor performance, capture leads, and sync call data with your CRM.",
  },
  {
    q: "How does your call tracking software work?",
    a: "Our app runs in the background on your team's phones and tracks SIM, GSM, and WhatsApp calls in real time. Each call is automatically logged with duration, number, and recording (if enabled) - no VoIP or number change required.",
  },
  {
    q: "Can I record both incoming and outgoing calls?",
    a: "Yes. On supported Android devices, our app records both sides of SIM and WhatsApp calls. For iOS, call recording is limited by Apple's privacy rules.",
  },
  {
    q: "Does this support Indian mobile networks?",
    a: "Yes. The software works with all major Indian carriers like Jio, Airtel, Vi, and BSNL. You can continue using your existing mobile numbers.",
  },
  {
    q: "Is the data and recording storage secure?",
    a: "Absolutely. All data is encrypted and stored securely in the cloud. Only authorized team members can access recordings and logs.",
  },
  {
    q: "Can I integrate it with my CRM?",
    a: "Yes. We offer native and API integrations for popular CRMs like Salesforce, HubSpot, LeadSquared, and Zoho. Calls, notes, and recordings are auto-logged to the right contacts.",
  },
  {
    q: "Do I need a special number or SIM card?",
    a: "No. You can keep using your existing SIM and phone number. Our system works in the background without changing your setup.",
  },
  {
    q: "How can this help my sales team?",
    a: "It gives complete visibility into sales calls - helping managers monitor productivity, improve conversions, and coach teams using real call data and analytics.",
  },
  {
    q: "What about compliance and privacy in India?",
    a: "We comply with Indian data privacy laws and telecom regulations. Call recording and tracking are done with user consent and secure storage.",
  },
];

export default function FAQs() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a,
      },
    })),
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-white via-gray-50 to-orange-50/20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-1/4 w-64 md:w-72 h-64 md:h-72 bg-[#FF5211] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/4 w-64 md:w-80 h-64 md:h-80 bg-orange-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16" data-animate="fade-up">
            <span className="inline-block px-5 py-2 bg-white/80 backdrop-blur-sm text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
              ❓ Got Questions?
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg px-4">
              Everything you need to know about FasterQ
            </p>
          </div>

          {/* FAQ Accordion using <details> */}
          <div className="space-y-4" data-stagger-parent data-stagger="0.06" data-stagger-duration="0.5" data-stagger-offset="20">
            {faqs.map((faq, index) => (
              <div key={index} data-stagger-item>
                <details
                  className="group bg-white rounded-2xl border-2 border-gray-100 transition-all duration-300 overflow-hidden"
                >
                  <summary className="cursor-pointer list-none p-5 md:p-6 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3 md:gap-4 flex-1">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br transition-all duration-300 group-open:bg-gradient-to-br from-[#FF5211] to-orange-600">
                        <CircleQuestionMark className="w-5 h-5 text-white group-open:hidden " />
                        <Check className="w-5 h-5 text-white hidden group-open:inline-block" strokeWidth={3} />
                      </div>
                      <h3 className="font-bold text-base md:text-lg transition-colors">
                        {faq.q}
                      </h3>
                    </div>
                    <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-5 md:px-6 pb-5 md:pb-6 pt-2">
                    <div className="h-px bg-gradient-to-r from-transparent via-[#FF5211]/20 to-transparent mb-4"></div>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base pl-12 md:pl-14">
                      {faq.a}
                    </p>
                  </div>
                </details>
              </div>
            ))}
          </div>

          {/* Contact Support CTA */}
          <div className="mt-12 md:mt-16">
            <div className="bg-gradient-to-r from-orange-50 via-orange-100/50 to-orange-50 rounded-3xl p-8 md:p-10 border-2 border-[#FF5211]/20 shadow-lg text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5211]/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-400/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-2xl mb-4 shadow-lg">
                  <HelpCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Still have questions?
                </h3>
                <p className="text-gray-600 mb-6 text-base md:text-lg max-w-xl mx-auto">
                  Our team is here to help you get started and answer any questions you may have
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="bg-gradient-to-r from-[#FF5211] to-orange-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-2xl transition-all hover:scale-105 inline-flex items-center justify-center gap-2 group"
                  >
                    <span>Start for ₹99/month</span>
                    <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                  <a
                    href="tel:+919798288748"
                    className="bg-white text-[#FF5211] px-8 py-4 rounded-full font-bold border-2 border-[#FF5211]/20 hover:border-[#FF5211] hover:shadow-xl transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
                  >
                    <span>📞</span>
                    <span>Call Us</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              💡 <span className="font-semibold">Tip:</span> Click on any question to see the answer
            </p>
          </div> */}
        </div>
      </section>
    </>
  );
}
