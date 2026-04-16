import Link from 'next/link';
import { TOOLS, SITE } from '@/lib/tools';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Free Business Tools',
  description: `Browse all ${TOOLS.length} free online tools from ${SITE.name}. No signup, no fees, instant results.`,
  alternates: { canonical: '/tools' },
};

export default function ToolsIndexPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100 mb-4 uppercase tracking-wider">
            Free Tools
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            All Free Business Tools
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            {TOOLS.length} tools for small businesses, freelancers, and creators.
            No signup required.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.slug}
                href={tool.href}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all tool-card"
              >
                <div className="flex items-start justify-between mb-5">
                  <span
                    className={cn(
                      'flex items-center justify-center w-12 h-12 rounded-xl shadow-md',
                      `bg-gradient-to-br ${tool.gradient}`
                    )}
                  >
                    <Icon size={22} className="text-white" />
                  </span>
                  <span
                    className={cn(
                      'px-2.5 py-1 text-xs font-semibold rounded-full',
                      tool.bgLight,
                      tool.textColor
                    )}
                  >
                    {tool.badge}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {tool.name}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-4">
                  {tool.description}
                </p>
                <div className="flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:gap-2 transition-all">
                  Use for free <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
