import Link from 'next/link';
import { ArrowUpRight, MessageCircle, FileText, Star } from 'lucide-react';

function FauxQR() {
  // Stylised QR-like pattern. Three corner markers + a curated cell pattern.
  const cells = [
    '0001110001110001110000',
    '0111111101111111110000',
    '0100010100100010100000',
    '0101110100101110100000',
    '0101110100101110100000',
    '0100010100100010100000',
    '0111111101111111110000',
    '0000000000000000000000',
    '0010110011010100100000',
    '0111001011001100110000',
    '0001100100110011010000',
    '0110010101001100100000',
    '0100110010110011010000',
    '0010001100010110100000',
    '0000000001011001100000',
    '0111111100110100100000',
    '0100010100110011010000',
    '0101110101011001110000',
    '0101110100110100100000',
    '0100010101011001100000',
    '0111111101001100110000',
  ];
  return (
    <div className="grid grid-cols-[repeat(21,1fr)] gap-[2px] w-full h-full">
      {cells.flatMap((row, r) =>
        row.split('').slice(0, 21).map((c, i) => (
          <span
            key={`${r}-${i}`}
            className={c === '1' ? 'bg-slate-900 rounded-[1px]' : 'bg-transparent'}
          />
        ))
      )}
    </div>
  );
}

function QRCard() {
  return (
    <div
      className="absolute right-0 top-0 w-[280px] rounded-2xl bg-white border border-slate-200/80 p-5 shadow-2xl shadow-slate-950/40"
      style={{ transform: 'rotate(3deg)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.12em]">QR Generator</p>
          <p className="text-[12px] text-slate-500 mt-0.5">pinmybusiness.com</p>
        </div>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Ready</span>
      </div>
      <div className="aspect-square w-full rounded-xl bg-slate-50 border border-slate-100 p-4 mb-4">
        <FauxQR />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-slate-900 border border-white" />
          <span className="w-4 h-4 rounded-full bg-white border border-slate-300" />
        </div>
        <span className="text-[11px] font-semibold text-indigo-600">Download PNG ↓</span>
      </div>
    </div>
  );
}

function WhatsAppCard() {
  return (
    <div
      className="absolute right-[160px] top-[210px] w-[300px] rounded-2xl bg-white border border-slate-200/80 p-5 shadow-2xl shadow-slate-950/40"
      style={{ transform: 'rotate(-4deg)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
          <MessageCircle size={13} className="text-white" strokeWidth={2.5} />
        </span>
        <p className="text-[12px] font-bold text-slate-900">WhatsApp Link</p>
      </div>
      <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 mb-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Your link</p>
        <p className="text-[12px] font-mono text-slate-700 truncate">wa.me/14155552671?text=...</p>
      </div>
      <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2">
        <p className="text-[11px] text-emerald-800 leading-tight">
          &ldquo;Hi! I&apos;m interested in your services.&rdquo;
        </p>
      </div>
    </div>
  );
}

function InvoiceCard() {
  return (
    <div
      className="absolute right-[40px] top-[440px] w-[340px] rounded-2xl bg-white border border-slate-200/80 p-5 shadow-2xl shadow-slate-950/40"
      style={{ transform: 'rotate(2deg)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.12em]">Invoice #1042</p>
          <p className="text-[14px] font-bold text-slate-900 mt-0.5">$2,450.00</p>
        </div>
        <span className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
          <FileText size={15} className="text-amber-600" strokeWidth={1.75} />
        </span>
      </div>
      <div className="space-y-2 mb-4">
        {[
          { label: 'Brand identity design', amount: '$1,200' },
          { label: 'Website mockups (3 pages)', amount: '$950' },
          { label: 'Sales tax (10%)', amount: '$300' },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between text-[12px]">
            <span className="text-slate-600">{row.label}</span>
            <span className="font-semibold text-slate-900 tabular-nums">{row.amount}</span>
          </div>
        ))}
      </div>
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] text-slate-400">Due in 14 days</span>
        <span className="text-[11px] font-semibold text-indigo-600">Print / PDF →</span>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Mesh gradient background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 10%, rgba(99,102,241,0.35) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 0%, rgba(217,70,239,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 60%, rgba(124,58,237,0.25) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 0% 80%, rgba(56,189,248,0.12) 0%, transparent 60%)
          `,
        }}
      />
      {/* Fine grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 100%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-24 lg:pb-32">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left: copy */}
          <div className="lg:col-span-7 lg:pr-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-7 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="flex items-center gap-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} size={9} className="text-amber-400 fill-amber-400" />
                ))}
              </span>
              <span className="text-[12px] font-medium text-slate-300">
                Trusted by small businesses in the US, UK & 50+ countries
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-black text-white tracking-[-0.04em] leading-[0.98] mb-6"
              style={{ fontSize: 'clamp(44px, 7vw, 92px)' }}
            >
              The free toolkit
              <br />
              your business
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #c4b5fd 0%, #818cf8 35%, #f0abfc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                actually needs.
              </span>
            </h1>

            {/* Sub */}
            <p className="text-[18px] sm:text-[19px] text-slate-300 leading-[1.55] mb-10 max-w-xl font-normal">
              QR codes, WhatsApp links, invoices, email signatures, and password generators.
              All free. All instant. All private. No accounts, no upsells, no catch.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-12">
              <Link
                href="/tools"
                className="inline-flex items-center gap-1.5 px-7 py-3.5 text-[15px] font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
              >
                Open a Tool
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 px-6 py-3.5 text-[14.5px] font-semibold text-slate-300 hover:text-white rounded-xl border border-white/10 hover:border-white/20 transition-all"
              >
                See how it works →
              </Link>
            </div>

            {/* Stats strip */}
            <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-8 border-t border-white/10">
              {[
                { val: '5',   label: 'Free tools' },
                { val: '0',   label: 'Accounts ever' },
                { val: '$0',  label: 'Cost forever' },
                { val: '50+', label: 'Countries' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-[26px] font-black text-white tracking-tight tabular-nums leading-none">{s.val}</div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-[0.12em] mt-1.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: product preview cards */}
          <div className="lg:col-span-5 relative h-[680px] hidden lg:block">
            <div className="relative w-full h-full">
              <QRCard />
              <WhatsAppCard />
              <InvoiceCard />
              {/* Glow under stack */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none -z-10"
                style={{
                  background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(139,92,246,0.25) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
              />
            </div>
          </div>

          {/* Mobile: simplified preview */}
          <div className="lg:hidden flex justify-center">
            <div className="relative w-full max-w-sm h-[420px]">
              <div className="absolute inset-x-4 top-0 rounded-2xl bg-white p-5 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">QR Generator</p>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Ready</span>
                </div>
                <div className="aspect-square w-full rounded-xl bg-slate-50 p-3 mb-3">
                  <FauxQR />
                </div>
                <p className="text-[11px] text-center font-semibold text-indigo-600">Download PNG ↓</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
