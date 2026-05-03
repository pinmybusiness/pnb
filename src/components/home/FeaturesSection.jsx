import { Sparkles, Lock, Globe2, Gauge } from 'lucide-react';

const FEATURES = [
  {
    icon: Gauge,
    title: 'Instant, every time',
    body: 'Open a tool, get your output, close the tab. Most users get to their first result in under 10 seconds — no tutorials, no onboarding.',
  },
  {
    icon: Lock,
    title: 'Truly private by design',
    body: 'Every tool runs entirely in your browser. Your data never touches our servers. No tracking, no analytics on what you create.',
  },
  {
    icon: Globe2,
    title: 'Built for the world',
    body: '33 international phone codes, 18 currencies including USD, GBP, and EUR. Whether you operate in New York, London, or Toronto — everything works.',
  },
  {
    icon: Sparkles,
    title: 'Free forever — actually',
    body: 'Not freemium. Not a 14-day trial. Every tool is fully featured, with no upgrade prompts and no locked exports. Costs are covered by simple advertising.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Left copy */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.14em] mb-4">
              Why founders choose us
            </p>
            <h2 className="text-[34px] sm:text-[44px] font-black text-slate-900 tracking-[-0.035em] leading-[1.05] mb-5">
              Built for people who{' '}
              <span className="gradient-text-dark">don&apos;t have time for software.</span>
            </h2>
            <p className="text-[16.5px] text-slate-600 leading-[1.6] mb-8">
              Most business tools assume you have time to learn, a team to support you, and a budget to spend. PinMyBusiness assumes none of those things — and gets out of your way.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {['#a78bfa', '#818cf8', '#60a5fa'].map((c) => (
                  <span
                    key={c}
                    className="w-8 h-8 rounded-full border-2 border-white"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <p className="text-[13.5px] text-slate-600 leading-tight">
                <span className="font-semibold text-slate-900">Founders, freelancers,</span><br />
                and small business owners
              </p>
            </div>
          </div>

          {/* Right grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group relative rounded-2xl bg-slate-50/50 border border-slate-200/70 p-7 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-[10.5px] font-black text-slate-300 tabular-nums">
                      0{i + 1}
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-5">
                    <Icon size={17} className="text-indigo-600" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-[16px] font-bold text-slate-900 mb-2 tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-[13.5px] text-slate-600 leading-[1.6]">
                    {f.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
