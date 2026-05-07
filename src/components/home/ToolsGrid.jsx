import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { TOOLS } from '@/lib/tools';
import { cn } from '@/lib/utils';

export default function ToolsGrid() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl mb-10 sm:mb-12 fade-up">
          <p className="section-label mb-4">The toolkit</p>
          <h2 className="text-[26px] sm:text-[34px] font-semibold text-white tracking-[-0.02em] leading-[1.15] mb-4">
            Five tools. <span className="text-slate-400">No subscriptions.</span>
          </h2>
          <p className="text-[15px] text-slate-400 leading-[1.65] max-w-xl">
            Each tool is a tightly focused, single-page utility. Open it, get your output, get on with your day.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.slug}
                href={tool.href}
                className="group relative flex flex-col rounded-xl surface card-hover p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-md border',
                      tool.tintBg,
                      tool.tintBorder
                    )}
                  >
                    <Icon size={18} className={tool.tintText} strokeWidth={1.75} />
                  </span>
                  <ArrowUpRight
                    size={15}
                    className="text-slate-500 group-hover:text-white transition-colors"
                  />
                </div>
                <h3 className="text-[15.5px] font-semibold text-white mb-1.5 tracking-tight">
                  {tool.name}
                </h3>
                <p className="text-[13px] text-slate-400 leading-[1.6] mb-4 flex-1">
                  {tool.tagline}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                  <span className="text-[10.5px] font-medium text-slate-500 uppercase tracking-[0.12em]">
                    {tool.category}
                  </span>
                  <span className={cn('text-[10.5px] font-medium', tool.tintText)}>
                    {tool.badge}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
