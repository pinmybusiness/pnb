import { Sparkles, Lock, Globe2, Gauge } from 'lucide-react';

const FEATURES = [
  {
    icon: Gauge,
    title: 'Instant, every time',
    body: 'Open a tool, get your output, close the tab. Most users hit their first result in under 10 seconds. No tutorials, no onboarding, no spinner.',
  },
  {
    icon: Lock,
    title: 'Truly private by design',
    body: 'Every tool runs in your browser. Your inputs never touch our servers. No analytics on what you create, no telemetry, no tracking.',
  },
  {
    icon: Globe2,
    title: 'Built for the world',
    body: '33 international phone codes. 18 currencies including USD, GBP, EUR, CAD, AUD. Works the same in New York, London, Toronto, Sydney.',
  },
  {
    icon: Sparkles,
    title: 'Free forever — actually',
    body: 'Not freemium. Not a 14-day trial. Every tool is fully featured with no upgrade prompts and no locked exports. Costs covered by simple ads.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Left copy */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start">
            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.14em] mb-4">
              Why it works
            </p>
            <h2 className="text-[36px] sm:text-[52px] font-black text-slate-900 tracking-[-0.04em] leading-[1.02] mb-5">
              Built for people who{' '}
              <span className="gradient-text-dark">don&apos;t have time for software.</span>
            </h2>
            <p className="text-[16.5px] text-slate-600 leading-[1.6] mb-8">
              Most business tools assume you have time to learn, a team to support you, and a budget to spend. PinMyBusiness assumes none of those things — and gets out of your way.
            </p>

            {/* Mini stat block */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
              <p className="text-[28px] font-black text-slate-900 tracking-tight leading-none mb-2">
                &lt; 10s
              </p>
              <p className="text-[13.5px] text-slate-600 leading-snug">
                Median time from landing on a tool to copying or downloading your first output.
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
                  className="group relative rounded-2xl bg-slate-50/70 border border-slate-200/70 p-7 hover:bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/40 transition-all duration-200"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-[10.5px] font-black text-slate-300 tabular-nums">
                      0{i + 1}
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-5 shadow-sm">
                    <Icon size={18} className="text-indigo-600" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-[16.5px] font-bold text-slate-900 mb-2 tracking-tight">
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
