// app/faq/page.jsx
import FAQClient, { faqSections } from "./FAQClient";

export const metadata = {
  title: "FAQs | FasterQ Call Tracking Software Questions & Answers",
  description:
    "Find answers to common questions about FasterQ, including features, call history, recording, privacy, security, billing, and troubleshooting.",
  alternates: {
    canonical: "https://www.fasterq.in/faq",
  },
};

function buildFaqSchema(sections) {
  const allFaqs = sections.flatMap((s) => s.faqs);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export default function FAQPage() {
  const schema = buildFaqSchema(faqSections);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <FAQClient />
    </>
  );
}
