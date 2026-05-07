const TESTIMONIALS = [
  {
    quote:
      "Genuinely the cleanest QR code generator I've used. No watermark, no signup, just a real PNG I can drop into my menu PDFs.",
    name: 'Sarah Mitchell',
    role: 'Brick Lane Coffee Co.',
    location: 'London, UK',
    initials: 'SM',
  },
  {
    quote:
      "Used the WhatsApp link tool for my Etsy shop's contact button. Took 30 seconds. The fact that it just works without me handing over my email is refreshing.",
    name: 'Marcus Chen',
    role: 'Freelance Designer',
    location: 'Brooklyn, NY',
    initials: 'MC',
  },
  {
    quote:
      "Sent invoices to two clients last week using their generator. Output looks professional, prints to PDF cleanly, no accounting software needed.",
    name: 'Emma Whitfield',
    role: 'Wedding Photographer',
    location: 'Manchester, UK',
    initials: 'EW',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20 border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 sm:mb-12 fade-up">
          <p className="section-label mb-4">From real businesses</p>
          <h2 className="text-[26px] sm:text-[34px] font-semibold text-white tracking-[-0.02em] leading-[1.15] mb-4">
            Used by founders who get things done.
          </h2>
          <p className="text-[15px] text-slate-400 leading-[1.65]">
            Small business owners across the US and UK use these tools every week - for menus, invoices, QR signage, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={t.name}
              className={`rounded-xl surface p-5 fade-up delay-${i + 1}`}
            >
              <blockquote className="text-[14px] text-slate-200 leading-[1.7] mb-5">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-4 border-t border-white/[0.05]">
                <span className="w-8 h-8 rounded-full bg-indigo-500/15 border border-indigo-400/25 flex items-center justify-center text-[11px] font-semibold text-indigo-200 shrink-0">
                  {t.initials}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-white truncate">{t.name}</p>
                  <p className="text-[11.5px] text-slate-500 truncate">
                    {t.role} · {t.location}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
