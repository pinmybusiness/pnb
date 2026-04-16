import Link from 'next/link';
import { SITE, TOOLS } from '@/lib/tools';
import { Zap, Shield, Globe, Heart } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description: `Learn about ${SITE.name} - our mission to provide free, privacy-first business tools for entrepreneurs worldwide.`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Built for the world&apos;s small businesses
          </h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            {SITE.name} is a collection of free, instant business tools designed to save
            entrepreneurs time and money - with zero strings attached.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Mission */}
        <section>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Our Mission</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            Small businesses and freelancers power the global economy - but they&apos;re often
            underserved by expensive, bloated software that requires subscriptions, accounts,
            and lengthy onboarding.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed mb-4">
            We built {SITE.name} on a simple belief: the most useful tools should be free,
            fast, and accessible to everyone - from a freelancer in Lagos to a bakery owner
            in Portland to a startup in Singapore.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            Every tool on our platform runs entirely in your browser. No accounts. No data
            collection. No fees. Just tools that work.
          </p>
        </section>

        {/* Values */}
        <section>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Zap,    title: 'Speed First',         desc: 'Every tool loads instantly. No spinners, no loading screens - your time is valuable.' },
              { icon: Shield, title: 'Privacy by Design',   desc: 'All processing happens in your browser. We have zero access to what you create.' },
              { icon: Globe,  title: 'Built for Everyone',  desc: "International phone formats, global currencies, multiple languages - we're truly global." },
              { icon: Heart,  title: 'Free Forever',        desc: 'Core tools will always be free. Our model is built on advertising, not subscriptions.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 shrink-0">
                  <Icon size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                  <p className="text-sm text-slate-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tools summary */}
        <section>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-8">What We&apos;ve Built</h2>
          <div className="space-y-3">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={tool.href}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all group"
                >
                  <span className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${tool.gradient}`}>
                    <Icon size={18} className="text-white" />
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {tool.name}
                    </p>
                    <p className="text-sm text-slate-500">{tool.tagline}</p>
                  </div>
                  <span className="text-sm font-medium text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Try it →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">Have a tool idea?</h2>
          <p className="text-indigo-200 mb-6">
            We&apos;re always building. Tell us what tool would help your business most.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Get in Touch
          </Link>
        </section>
      </div>
    </div>
  );
}
