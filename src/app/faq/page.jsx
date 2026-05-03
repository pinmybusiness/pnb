'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { SITE } from '@/lib/tools';

const FAQ_JSON_LD_BUILDER = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.flatMap((s) =>
    s.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    }))
  ),
});

const FAQS = [
  { category: 'General', items: [
    { q: 'Are all the tools really free?',       a: "Yes - 100% free forever. No hidden fees, no premium paywalls. We're supported by advertising." },
    { q: 'Do I need to create an account?',      a: 'No. Zero signup required. Open any tool and start using it immediately - no email, no password, nothing.' },
    { q: 'Is my data safe?',                     a: 'All tools run 100% in your browser. We never send your data to any server. Nothing is stored or tracked.' },
    { q: 'Do the tools work on mobile?',         a: 'Yes! Every tool is fully responsive and works great on phones, tablets, and desktops.' },
  ]},
  { category: 'WhatsApp Link Generator', items: [
    { q: 'What is a WhatsApp link?',             a: 'A wa.me link opens WhatsApp directly to a chat with a specific number - optionally with a pre-filled message.' },
    { q: 'Which countries are supported?',       a: 'All countries. We include 30+ country codes and you can enter any valid international number.' },
    { q: 'Does the message get sent automatically?', a: 'No - the message is pre-filled in the compose box. The user can edit it before sending.' },
  ]},
  { category: 'QR Code Generator', items: [
    { q: 'What can I encode in a QR code?',      a: 'URLs, text, phone numbers, email addresses, Wi-Fi credentials, vCard contact info - any text-based content.' },
    { q: 'What format is the download?',         a: 'PNG, at your chosen size from 128×128 up to 512×512 pixels - suitable for print and digital.' },
    { q: 'Can I customize colors?',              a: 'Yes! Choose any foreground (dots) and background color using the color pickers.' },
  ]},
  { category: 'Invoice Generator', items: [
    { q: 'How do I save as PDF?',                a: "Click \"Print / Save as PDF\", then select \"Save as PDF\" in your browser's print dialog." },
    { q: 'Which currencies are supported?',      a: 'We support 18 major global currencies including USD, EUR, GBP, INR, AED, SGD, and more.' },
    { q: 'Is my invoice data saved?',            a: 'No. Everything stays in your browser tab. Refreshing starts fresh. Save the PDF to keep a copy.' },
  ]},
  { category: 'Password Generator', items: [
    { q: 'Are the passwords truly random?',      a: "Yes - we use the browser's built-in crypto.getRandomValues() API, which is cryptographically secure." },
    { q: 'Are passwords sent anywhere?',         a: 'Never. All generation happens locally in your browser. We have zero visibility into what you generate.' },
    { q: "What's the maximum length?",           a: 'Up to 64 characters. We recommend at least 16 characters with mixed types for strong security.' },
  ]},
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 py-4 text-left">
        <span className="text-sm font-semibold text-slate-900">{q}</span>
        <ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-4 text-sm text-slate-600 leading-relaxed pr-6">{a}</p>}
    </div>
  );
}

export default function FAQPage() {
  const jsonLd = FAQ_JSON_LD_BUILDER(FAQS);
  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100 mb-4 uppercase tracking-wider">FAQ</span>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-600">Everything you need to know about {SITE.name} and our free tools.</p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        {FAQS.map((s) => (
          <div key={s.category} className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">{s.category}</h2>
            {s.items.map((item) => <FAQItem key={item.q} {...item} />)}
          </div>
        ))}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Still have a question?</h2>
          <p className="text-indigo-200 mb-5 text-sm">We&apos;re happy to help. We&apos;ll respond within 24 hours.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/contact" className="px-5 py-2.5 bg-white text-indigo-600 font-semibold rounded-xl text-sm hover:bg-indigo-50 transition-colors">Contact Us</Link>
            <Link href="/tools"   className="px-5 py-2.5 bg-white/20 text-white font-semibold rounded-xl text-sm hover:bg-white/30 transition-colors">Try Our Tools</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
