import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { TOOLS } from '@/lib/tools';
import { cn } from '@/lib/utils';

export default function ToolsGrid() {
  return (
    <section className="py-24 sm:py-32 bg-slate-50/60 border-y border-slate-100">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="max-w-2xl mb-14 sm:mb-16">
          <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.14em] mb-4">
            What we build
          </p>
          <h2 className="text-[34px] sm:text-[44px] font-black text-slate-900 tracking-[-0.035em] leading-[1.05] mb-5">
            Five tools.{' '}
            <span className="gradient-text-dark">Zero friction.</span>
          </h2>
          <p className="text-[16.5px] text-slate-600 leading-[1.55] max-w-xl">
            Built for the moments when you just need something done — not another subscription, not another login, not another sales call.
          </p>
        </div>

        {/* Tool cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.slug}
                href={tool.href}
                className="group relative flex flex-col rounded-2xl bg-white border border-slate-200/80 p-7 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={cn(
                    'w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br',
                    tool.gradient
                  )}>
                    <Icon size={20} className="text-white" strokeWidth={1.75} />
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-slate-300 group-hover:text-slate-900 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-200"
                  />
                </div>

                <h3 className="text-[17px] font-bold text-slate-900 mb-2 tracking-tight">
                  {tool.name}
                </h3>
                <p className="text-[14px] text-slate-600 leading-[1.55] mb-6 flex-1">
                  {tool.tagline}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider">
                    {tool.category}
                  </span>
                  <span className={cn(
                    'text-[11px] font-semibold px-2 py-0.5 rounded-full',
                    tool.bgLight, tool.textColor
                  )}>
                    {tool.badge}
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Coming soon */}
          <div className="flex flex-col rounded-2xl border border-dashed border-slate-300 bg-white/40 p-7">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-6">
              <span className="text-[18px] font-black text-slate-400">+</span>
            </div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">
              Coming soon
            </p>
            <h3 className="text-[17px] font-bold text-slate-500 mb-2 tracking-tight">
              More tools, on the way
            </h3>
            <p className="text-[14px] text-slate-500 leading-[1.55]">
              Bio link builder · contract templates · business card generator. Same rules: free, instant, private.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
