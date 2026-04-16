'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { TOOLS } from '@/lib/tools';
import { cn } from '@/lib/utils';

export default function ToolsGrid() {
  return (
    <section className="py-28 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-label mb-6 inline-flex">5 Free Tools</span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-4">
            Everything you need,{' '}
            <span className="gradient-text-dark">nothing you don&apos;t.</span>
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            No subscriptions. No accounts. No BS. Open a tool, get your output, close the tab.
          </p>
        </div>

        {/* Tool cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.slug}
                href={tool.href}
                className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-100 transition-all duration-200 overflow-hidden"
              >
                {/* Subtle hover bg */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-50/0 group-hover:from-indigo-50/40 group-hover:to-violet-50/20 transition-all duration-300 pointer-events-none" />

                <div className="relative flex flex-col flex-1">
                  {/* Icon */}
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br',
                    tool.gradient
                  )}>
                    <Icon size={22} className="text-white" strokeWidth={1.75} />
                  </div>

                  {/* Badge */}
                  <span className={cn(
                    'absolute top-0 right-0 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full',
                    tool.bgLight, tool.textColor
                  )}>
                    {tool.badge}
                  </span>

                  {/* Text */}
                  <h3 className="text-[17px] font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-6">
                    {tool.tagline}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
                    Use for free
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Coming soon */}
          <div className="flex flex-col rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-5">
              <span className="text-xl font-black text-slate-300">+</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Coming soon</p>
            <h3 className="text-[17px] font-bold text-slate-400 mb-2">More Tools</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Business card generator, bio link builder, contract templates.
            </p>
          </div>
        </div>

        {/* Bottom trust bar */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
          {[
            '0 accounts ever required',
            'Data never leaves your browser',
            '$0 forever — not a trial',
            'Works in every country',
          ].map((item) => (
            <span key={item} className="flex items-center gap-2 text-sm text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
