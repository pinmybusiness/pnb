import { SITE } from '@/lib/tools';
import { Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${SITE.name} - how we handle (or rather, don't handle) your data.`,
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    title: `Privacy Policy | ${SITE.name}`,
    description: `Privacy Policy for ${SITE.name}.`,
    url: `${SITE.url}/privacy-policy`,
  },
};

const UPDATED = 'May 1, 2026';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8 fade-up">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-500/10 border border-indigo-400/25">
              <Shield size={15} className="text-indigo-300" />
            </span>
            <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-[0.14em]">Legal</span>
          </div>
          <h1 className="text-[28px] sm:text-[36px] font-semibold text-white tracking-[-0.025em] mb-2">
            Privacy Policy
          </h1>
          <p className="text-[12.5px] text-slate-500">Last updated: {UPDATED}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8 py-10">
        <div className="rounded-xl bg-indigo-500/[0.06] border border-indigo-400/20 p-5 mb-6 fade-up">
          <p className="text-[13.5px] font-medium text-indigo-100 leading-[1.7]">
            <span className="text-indigo-300 font-semibold">TL;DR -</span> {SITE.name} does not collect, store, or transmit your personal data. All tools
            run entirely in your browser.
          </p>
        </div>

        <div className="rounded-xl surface p-7 sm:p-8 space-y-7 fade-up delay-1">
          {[
            { title: '1. Information We Collect', content: `${SITE.name} is designed as a privacy-first platform. Our tools (WhatsApp Link Generator, QR Code Generator, Invoice Generator, Email Signature Generator, and Password Generator) operate entirely within your web browser. We do not collect, store, process, or transmit any data you enter into these tools.\n\nWe may collect anonymous, non-personal analytics data such as page views and general usage patterns through privacy-respecting analytics tools.` },
            { title: '2. Cookies', content: `We use minimal cookies necessary for the website to function. We do not use tracking cookies or third-party advertising cookies that follow you across the web.` },
            { title: '3. Third-Party Services', content: `We may use the following:\n• Google Fonts (for typography)\n• Google Analytics (anonymous page views only)\n• Google AdSense (future, for ads)\n\nEach of these has their own privacy policy.` },
            { title: '4. Data Security', content: `Since we do not collect personal data, there is minimal security risk. All tool functionality runs client-side. We serve our website over HTTPS.` },
            { title: "5. Children's Privacy", content: `${SITE.name} is not directed at children under 13. We do not knowingly collect data from children.` },
            { title: '6. Changes to This Policy', content: `We may update this Privacy Policy from time to time. We will update the "Last updated" date when we do.` },
            { title: '7. Contact Us', content: `If you have any questions, please contact us at hello@${SITE.domain}` },
          ].map(({ title, content }) => (
            <section key={title}>
              <h2 className="text-[14.5px] font-semibold text-white mb-2.5">{title}</h2>
              <div className="space-y-2">
                {content.split('\n').map((para, i) => (
                  <p key={i} className="text-[13.5px] text-slate-400 leading-[1.75]">{para}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
