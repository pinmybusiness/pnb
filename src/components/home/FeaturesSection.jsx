import { Monitor, Zap, Globe, Lock } from 'lucide-react';

const FEATURES = [
  {
    icon: Monitor,
    number: '01',
    title: 'Everything runs in your browser',
    body: 'No server. No database. No cloud storage. Every tool runs 100% locally in your browser tab — your data never touches our servers, period.',
  },
  {
    icon: Zap,
    number: '02',
    title: 'Instant results, zero friction',
    body: 'Open a tool, fill in your details, get your output. No tutorials, no onboarding emails, no loading spinners. Under 10 seconds to first result.',
  },
  {
    icon: Globe,
    number: '03',
    title: 'Built for global businesses',
    body: '33 international phone codes, 18 currencies, multi-language input. Whether you\'re in New York or New Delhi, these tools work exactly as expected.',
  },
  {
    icon: Lock,
    number: '04',
    title: 'Free forever — not a trial',
    body: 'These aren\'t "freemium" tools with a paywall two steps in. Every feature is fully available with no upgrade prompts, no locked outputs, no time limits.',
  },
];

const AUDIENCE = [
  {
    label: 'Freelancers & consultants',
    desc: 'Send professional invoices, share a WhatsApp link, and create a branded email signature in minutes.',
  },
  {
    label: 'Retail & local businesses',
    desc: 'Generate QR codes for menus, print materials, and in-store displays — no design skills needed.',
  },
  {
    label: 'Online sellers & creators',
    desc: 'Add WhatsApp buttons to your Shopify store, Etsy shop, or Instagram bio to drive direct conversations.',
  },
  {
    label: 'Agencies & consultants',
    desc: 'Spin up QR codes, invoices, and signatures for clients without logging into 4 different paid tools.',
  },
];

export default function FeaturesSection() {
  return (
    <>
      {/* Why it works — dark section */}
      <section className="py-28 bg-slate-900">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Why it works
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.1] mb-4">
              Designed around how{' '}
              <span className="gradient-text">you actually work.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Most business software assumes you have time to learn, a team to support you,
              and a budget. These tools assume none of those things.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.number}
                  className="group relative rounded-2xl p-8 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={18} className="text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-black tracking-widest text-slate-600 uppercase">
                          {f.number}
                        </span>
                        <div className="h-px flex-1 bg-white/5" />
                      </div>
                      <h3 className="text-[17px] font-bold text-white mb-2 leading-snug">{f.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{f.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who it's for — white section */}
      <section className="py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="section-label mb-6 inline-flex">Who it&apos;s for</span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-4">
              Built for US{' '}
              <span className="gradient-text-dark">small businesses.</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              32 million small businesses in the US. Most can&apos;t afford $50/month per tool.
              These are free — so you can focus on building your business.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AUDIENCE.map((item, i) => (
              <div
                key={item.label}
                className="group p-7 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-black text-indigo-600">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900">{item.label}</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed pl-9">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
