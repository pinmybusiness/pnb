import { ChevronDown, HelpCircle, Check, CircleQuestionMark } from "lucide-react";

export default function FAQWidget({ faqs = [], title, subtitle, showCTA = true }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <>
      {/* JSON-LD Schema */}
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-white via-gray-50 to-orange-50/20 relative overflow-hidden">
        
        {/* Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-1/4 w-64 h-64 bg-[#FF5211] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-orange-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block px-5 py-2 bg-white/80 text-[#FF5211] rounded-full text-sm font-bold mb-4 border border-[#FF5211]/20 shadow-sm">
              ❓ Got Questions?
            </span>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {title || (
                <>
                  Frequently Asked{" "}
                  <span className="bg-gradient-to-r from-[#FF5211] to-orange-600 bg-clip-text text-transparent">
                    Questions
                  </span>
                </>
              )}
            </h2>

            {subtitle && (
              <p className="text-gray-600 text-base md:text-lg">
                {subtitle}
              </p>
            )}
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-2xl border-2 border-gray-100 transition-all duration-300 overflow-hidden"
              >
                <summary className="cursor-pointer list-none p-5 md:p-6 flex items-center justify-between gap-4">
                  
                  <div className="flex items-start gap-4 flex-1">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#FF5211]/10 to-orange-100/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-[#FF5211] font-bold text-lg">Q</span>
                    </div>

                    <h3 className="font-bold text-base md:text-lg">
                      {faq.q}
                    </h3>
                  </div>

                  <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                </summary>

                <div className="px-6 pb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-[#FF5211]/20 to-transparent mb-4"></div>
                  <p className="text-gray-600 text-sm md:text-base pl-12">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>

         
        </div>
      </section>
    </>
  );
}