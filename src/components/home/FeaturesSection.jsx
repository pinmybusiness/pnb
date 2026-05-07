import { Sparkles, Lock, Globe2, Gauge } from 'lucide-react';

const FEATURES = [
  {
    icon: Gauge,
    title: 'Instant, every time',
    body: 'Open a tool, get your output, close the tab. Most users hit their first result in under 10 seconds.',
  },
  {
    icon: Lock,
    title: 'Truly private',
    body: 'Every tool runs in your browser. Your inputs never touch our servers. No tracking, no telemetry.',
  },
  {
    icon: Globe2,
    title: 'Built for the world',
    body: '33 international phone codes. 18 currencies including USD, GBP, EUR, CAD, AUD.',
  },
  {
    icon: Sparkles,
    title: 'Free forever',
    body: 'Not freemium. Not a 14-day trial. Every tool is fully featured, no upgrade prompts.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 sm:mb-12 fade-up">
          <p className="section-label mb-4">Why it works</p>
          <h2 className="text-[26px] sm:text-[34px] font-semibold text-white tracking-[-0.02em] leading-[1.15] mb-4">
            Built for people who don&apos;t have time for software.
          </h2>
          <p className="text-[15px] text-slate-400 leading-[1.65]">
            Most business tools assume you have time to learn, a team to support you, and a budget to spend. We assume none of those things.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`rounded-xl surface card-hover p-5 fade-up delay-${i + 1}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-500/10 border border-indigo-400/25">
                    <Icon size={16} className="text-indigo-300" strokeWidth={1.75} />
                  </span>
                  <h3 className="text-[15px] font-semibold text-white tracking-tight">
                    {f.title}
                  </h3>
                </div>
                <p className="text-[13.5px] text-slate-400 leading-[1.65]">{f.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
