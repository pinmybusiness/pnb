import Link from 'next/link';
import { Home, ArrowRight } from 'lucide-react';
import { TOOLS } from '@/lib/tools';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <div className="max-w-md w-full text-center">
        <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.14em] mb-3 fade-up">
          Error 404
        </p>
        <h1 className="text-[32px] sm:text-[40px] font-semibold text-white tracking-[-0.025em] mb-3 fade-up delay-1">
          Page not found.
        </h1>
        <p className="text-[14.5px] text-slate-400 mb-7 fade-up delay-2">
          Sorry, we couldn&apos;t find that page. It may have moved or been removed.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 justify-center mb-10 fade-up delay-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-[14px] font-medium text-white bg-indigo-500 hover:bg-indigo-400 rounded-md transition-colors"
          >
            <Home size={14} /> Back home
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-[14px] font-medium text-slate-300 hover:text-white border border-white/10 hover:border-white/25 rounded-md transition-colors"
          >
            Browse tools
            <ArrowRight size={14} />
          </Link>
        </div>

        <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-[0.14em] mb-3">
          Popular tools
        </p>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {TOOLS.slice(0, 4).map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.slug}
                href={tool.href}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded-full border border-white/[0.08] bg-white/[0.02] text-slate-300 hover:bg-white/[0.05] hover:border-white/15 hover:text-white transition-colors"
              >
                <Icon size={11} className={tool.tintText} /> {tool.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
