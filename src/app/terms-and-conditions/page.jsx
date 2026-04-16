import { SITE } from '@/lib/tools';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service',
  description: `Terms of Service for ${SITE.name} - the rules for using our free business tools.`,
  alternates: { canonical: '/terms-and-conditions' },
};

const UPDATED = 'January 1, 2025';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100">
              <FileText size={18} className="text-indigo-600" />
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-slate-500">Last updated: {UPDATED}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-8">
          {[
            {
              title: '1. Acceptance of Terms',
              content: `By accessing and using ${SITE.name} (${SITE.url}), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.`,
            },
            {
              title: '2. Description of Service',
              content: `${SITE.name} provides free, browser-based business tools including a WhatsApp Link Generator, QR Code Generator, Invoice Generator, Email Signature Generator, and Password Generator. All tools are provided free of charge and operate entirely within your web browser.`,
            },
            {
              title: '3. Use of Tools',
              content: `You may use our tools for personal and commercial purposes. You agree not to:\n• Use the tools for illegal or harmful purposes\n• Attempt to reverse-engineer or misuse our platform\n• Use automated bots or scrapers to abuse the service\n• Generate content that violates any applicable laws`,
            },
            {
              title: '4. Intellectual Property',
              content: `The ${SITE.name} website, branding, and underlying code are owned by ${SITE.name}. The content you create using our tools (invoices, QR codes, signatures, links) belongs entirely to you. We claim no ownership over anything you generate.`,
            },
            {
              title: '5. Disclaimer of Warranties',
              content: `Our tools are provided "as is" without warranty of any kind. We do not guarantee that the service will be uninterrupted, error-free, or suitable for any particular purpose. Use of our tools is at your own risk.`,
            },
            {
              title: '6. Limitation of Liability',
              content: `${SITE.name} shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service. This includes, but is not limited to, loss of data, business interruption, or financial loss.`,
            },
            {
              title: '7. Advertising',
              content: `${SITE.name} may display third-party advertisements to support the free service. These ads are served by third-party networks and are subject to their own terms and privacy policies.`,
            },
            {
              title: '8. Changes to Terms',
              content: `We reserve the right to modify these terms at any time. Continued use of ${SITE.name} after any changes constitutes acceptance of the new terms. The "Last updated" date will be revised accordingly.`,
            },
            {
              title: '9. Contact',
              content: `For questions about these Terms of Service, please contact us at hello@${SITE.domain}`,
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
