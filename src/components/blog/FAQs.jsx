export default function FAQs({ faqs }) {
  return (
    <div className="mt-8 w-full main-content">
      <h2 className="mb-2">
        Frequently Asked Questions
      </h2>

      <div className="divide-y divide-gray-200">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group py-6"
          >
            <summary className="flex justify-between items-start cursor-pointer text-lg font-medium text-gray-800 hover:text-gray-900">
              <span className="pr-6">{faq.question}</span>
              <svg
                className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform mt-1 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="mt-3 text-gray-600 leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
