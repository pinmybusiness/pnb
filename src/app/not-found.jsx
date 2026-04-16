import Link from 'next/link';
import { Home, ArrowRight, Zap } from 'lucide-react';
import { TOOLS } from '@/lib/tools';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 */}
        <h1 className="text-[120px] font-black leading-none gradient-text mb-4">404</h1>

        <h2 className="text-2xl font-bold text-slate-900 mb-3">Page not found</h2>
        <p className="text-slate-600 mb-8 max-w-sm mx-auto">
          Sorry, we couldn&apos;t find that page. It may have moved or been removed.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-200 transition-all"
          >
            <Home size={15} /> Back to Home
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <Zap size={15} /> Try Free Tools
          </Link>
        </div>

        {/* Quick links to tools */}
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Popular Tools
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {TOOLS.slice(0, 4).map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.slug}
                href={tool.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all"
              >
                <Icon size={12} /> {tool.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
