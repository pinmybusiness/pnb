import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TOOLS } from '@/lib/tools';

export default function ToolPageLayout({ tool, children }) {
  const ToolIcon = tool.icon;
  const related = TOOLS.filter((t) => t.slug !== tool.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50/60">

      {/* Tool header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400 hover:text-slate-900 transition-colors mb-6 group"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            All Free Tools
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className={cn(
              'flex items-center justify-center w-12 h-12 rounded-2xl shrink-0',
              tool.bgLight
            )}>
              <ToolIcon size={22} className={tool.textColor} strokeWidth={1.75} />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{tool.name}</h1>
                <span className={cn('text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full', tool.bgLight, tool.textColor)}>
                  Free
                </span>
              </div>
              <p className="text-[14px] text-slate-500">{tool.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* Tool area */}
          <div className="xl:col-span-2">{children}</div>

          {/* Sidebar */}
          <aside className="space-y-5">

            {/* About */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">About this tool</p>
              <p className="text-[13px] text-slate-600 leading-relaxed">{tool.description}</p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                {tool.keywords?.slice(0, 4).map((kw) => (
                  <span key={kw} className="px-2.5 py-1 text-[11px] bg-slate-50 text-slate-500 rounded-full border border-slate-200">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Trust */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Guaranteed</p>
              <ul className="space-y-2">
                {[
                  'Free - no credit card ever',
                  'No account or signup needed',
                  'Zero data stored or transmitted',
                  'Works on desktop and mobile',
                  'Instant results, every time',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[13px] text-slate-600">
                    <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Related tools */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">More Free Tools</p>
              <div className="space-y-1">
                {related.map((t) => {
                  const Icon = t.icon;
                  return (
                    <Link key={t.slug} href={t.href}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                      <span className={cn('flex items-center justify-center w-7 h-7 rounded-lg shrink-0', t.bgLight)}>
                        <Icon size={13} className={t.textColor} />
                      </span>
                      <span className="text-[13px] font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                        {t.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
