import { Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:
      "Genuinely the cleanest QR code generator I've used. No watermark, no signup, just a real PNG I can drop into my menu PDFs. Saved me a $19/month subscription.",
    name: 'Sarah Mitchell',
    role: 'Owner, Brick Lane Coffee Co.',
    location: 'London, UK',
    initials: 'SM',
    color: 'from-rose-400 to-rose-500',
  },
  {
    quote:
      "Used the WhatsApp link tool for my Etsy shop's contact button. Took 30 seconds. The fact that it just works without me handing over my email is a refreshing change.",
    name: 'Marcus Chen',
    role: 'Freelance Designer',
    location: 'Brooklyn, NY',
    initials: 'MC',
    color: 'from-indigo-400 to-violet-500',
  },
  {
    quote:
      "Sent invoices to two clients last week using their generator. The output looks professional, prints to PDF cleanly, and I didn't have to learn another piece of accounting software.",
    name: 'Emma Whitfield',
    role: 'Wedding Photographer',
    location: 'Manchester, UK',
    initials: 'EW',
    color: 'from-amber-400 to-orange-500',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 sm:py-32 bg-slate-950 relative overflow-hidden">
      {/* Mesh gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 30% 0%, rgba(99,102,241,0.20) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 100%, rgba(124,58,237,0.18) 0%, transparent 60%)
          `,
        }}
      />
      {/* Grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-[0.14em] mb-4">
            From real businesses
          </p>
          <h2 className="text-[36px] sm:text-[52px] font-black text-white tracking-[-0.04em] leading-[1.02] mb-5">
            Used by founders who{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #c4b5fd 0%, #818cf8 35%, #f0abfc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              get things done.
            </span>
          </h2>
          <p className="text-[16.5px] text-slate-400 leading-[1.55]">
            Small business owners across the US and UK use these tools every week — for menus, invoices, QR signage, customer chat, and more.
          </p>
        </div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="relative rounded-3xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm p-7 sm:p-8 hover:bg-white/[0.06] hover:border-white/[0.14] transition-all duration-200"
            >
              <Quote size={22} className="text-indigo-400/70 mb-5" strokeWidth={1.5} />
              <blockquote className="text-[15px] text-slate-200 leading-[1.65] mb-7">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-6 border-t border-white/[0.08]">
                <span
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-[12.5px] font-black text-white shrink-0`}
                >
                  {t.initials}
                </span>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-bold text-white truncate">{t.name}</p>
                  <p className="text-[11.5px] text-slate-400 truncate">
                    {t.role} · {t.location}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-16 pt-10 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-center">
          {[
            'No telemetry',
            'No tracking pixels',
            'No data leaves your browser',
            'GDPR-friendly by design',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[12.5px] text-slate-400 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
