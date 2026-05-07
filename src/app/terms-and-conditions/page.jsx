import { SITE } from '@/lib/tools';
import { FileText } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service',
  description: `Terms of Service for ${SITE.name} - the rules for using our free business tools.`,
  alternates: { canonical: '/terms-and-conditions' },
  openGraph: {
    title: `Terms of Service | ${SITE.name}`,
    description: `Terms of Service for ${SITE.name}.`,
    url: `${SITE.url}/terms-and-conditions`,
  },
};

const UPDATED = 'May 1, 2026';

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8 fade-up">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-500/10 border border-indigo-400/25">
              <FileText size={15} className="text-indigo-300" />
            </span>
            <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-[0.14em]">Legal</span>
          </div>
          <h1 className="text-[28px] sm:text-[36px] font-semibold text-white tracking-[-0.025em] mb-2">
            Terms of Service
          </h1>
          <p className="text-[12.5px] text-slate-500">Last updated: {UPDATED}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8 py-10">
        <div className="rounded-xl surface p-7 sm:p-8 space-y-7 fade-up">
          {[
            { title: '1. Acceptance of Terms', content: `By accessing and using ${SITE.name} (${SITE.url}), you accept and agree to be bound by these Terms of Service.` },
            { title: '2. Description of Service', content: `${SITE.name} provides free, browser-based business tools including a WhatsApp Link Generator, QR Code Generator, Invoice Generator, Email Signature Generator, and Password Generator.` },
            { title: '3. Use of Tools', content: `You may use our tools for personal and commercial purposes. You agree not to:\n• Use the tools for illegal or harmful purposes\n• Attempt to reverse-engineer or misuse our platform\n• Use automated bots to abuse the service\n• Generate content that violates applicable laws` },
            { title: '4. Intellectual Property', content: `The ${SITE.name} website, branding, and code are owned by ${SITE.name}. The content you create using our tools belongs entirely to you.` },
            { title: '5. Disclaimer of Warranties', content: `Our tools are provided "as is" without warranty of any kind. Use is at your own risk.` },
            { title: '6. Limitation of Liability', content: `${SITE.name} shall not be liable for any indirect, incidental, or consequential damages.` },
            { title: '7. Advertising', content: `${SITE.name} may display third-party advertisements to support the free service.` },
            { title: '8. Changes to Terms', content: `We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance.` },
            { title: '9. Contact', content: `For questions, please contact us at hello@${SITE.domain}` },
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
