import { SITE } from '@/lib/tools';
import { Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${SITE.name} - how we handle (or rather, don't handle) your data.`,
  alternates: { canonical: '/privacy-policy' },
};

const UPDATED = 'January 1, 2025';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
              <Shield size={18} className="text-indigo-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-slate-500">Last updated: {UPDATED}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8">
          <p className="text-sm font-semibold text-indigo-800">
            TL;DR - {SITE.name} does not collect, store, or transmit your personal data. All tools
            run entirely in your browser. We have no access to anything you create or enter.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-8 prose prose-slate max-w-none">
          {[
            {
              title: '1. Information We Collect',
              content: `${SITE.name} is designed as a privacy-first platform. Our tools (WhatsApp Link Generator, QR Code Generator, Invoice Generator, Email Signature Generator, and Password Generator) operate entirely within your web browser. We do not collect, store, process, or transmit any data you enter into these tools.\n\nWe may collect anonymous, non-personal analytics data such as page views and general usage patterns through privacy-respecting analytics tools. This data cannot be used to identify you.`,
            },
            {
              title: '2. Cookies',
              content: `We use minimal cookies necessary for the website to function. We do not use tracking cookies or third-party advertising cookies that follow you across the web. If we use Google AdSense in the future, it may set cookies for ad personalization - you can opt out via Google's ad settings.`,
            },
            {
              title: '3. Third-Party Services',
              content: `We may use the following third-party services:\n• Google Fonts (for typography) - loads font files from Google's CDN\n• Google Analytics (if enabled) - anonymous page view data only\n• Google AdSense (future) - for displaying relevant advertisements\n\nEach of these services has their own privacy policy. We encourage you to review them.`,
            },
            {
              title: '4. Data Security',
              content: `Since we do not collect personal data, there is minimal security risk. All tool functionality runs client-side in your browser, meaning your data never leaves your device. We serve our website over HTTPS to ensure a secure connection.`,
            },
            {
              title: '5. Children\'s Privacy',
              content: `${SITE.name} is not directed at children under 13. We do not knowingly collect data from children. If you believe a child has provided us with personal information, please contact us so we can address it.`,
            },
            {
              title: '6. Changes to This Policy',
              content: `We may update this Privacy Policy from time to time. We will update the "Last updated" date at the top of this page when we do. Continued use of ${SITE.name} after changes constitutes acceptance of the updated policy.`,
            },
            {
              title: '7. Contact Us',
              content: `If you have any questions about this Privacy Policy, please contact us at hello@${SITE.domain}`,
            },
          ].map(({ title, content }) => (
            <section key={title}>
              <h2 className="text-base font-bold text-slate-900 mb-3">{title}</h2>
              <div className="space-y-2">
                {content.split('\n').map((para, i) => (
                  <p key={i} className="text-sm text-slate-600 leading-relaxed">{para}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
