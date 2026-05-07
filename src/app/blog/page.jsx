import Link from 'next/link';
import { SITE } from '@/lib/tools';
import { ArrowRight, Clock } from 'lucide-react';

export const metadata = {
  title: 'Blog - Business tips & tool guides',
  description: `Practical guides, tips, and tutorials for small businesses and freelancers from ${SITE.name}.`,
  alternates: { canonical: '/blog' },
  openGraph: {
    title: `Blog | ${SITE.name}`,
    description: `Practical guides for small businesses and freelancers.`,
    url: `${SITE.url}/blog`,
  },
};

const POSTS = [
  { slug: 'how-to-add-whatsapp-button-to-website',  title: 'How to add a WhatsApp button to your website (2025 guide)', excerpt: 'Adding a WhatsApp contact button is one of the fastest ways to increase conversions. The complete guide with code examples.', category: 'WhatsApp',     readTime: '4 min', date: '2025-01-15', featured: true },
  { slug: 'qr-code-marketing-small-business',       title: 'QR code marketing for small businesses: 10 creative ideas',  excerpt: 'QR codes are back. Learn 10 creative ways to use them to drive traffic, sales, and engagement.',                              category: 'Marketing',    readTime: '6 min', date: '2025-01-10', featured: true },
  { slug: 'how-to-write-a-professional-invoice',    title: 'How to write a professional invoice: complete template guide', excerpt: 'A proper invoice can mean the difference between getting paid on time or chasing clients for months.',                       category: 'Finance',      readTime: '7 min', date: '2025-01-05', featured: false },
  { slug: 'email-signature-best-practices',         title: '7 email signature best practices that look professional',     excerpt: 'Your email signature is seen by every person you email. Make it count with these proven best practices.',                  category: 'Productivity', readTime: '5 min', date: '2024-12-28', featured: false },
  { slug: 'password-security-guide-small-business', title: 'Password security for small businesses: the 2025 guide',      excerpt: '43% of cyberattacks target small businesses. Here\'s how to protect yourself with strong password practices.',              category: 'Security',     readTime: '8 min', date: '2024-12-20', featured: false },
  { slug: 'free-tools-every-freelancer-needs',      title: '12 free online tools every freelancer needs in 2025',         excerpt: "Working solo doesn't mean you can't have professional-grade tools. Here are the best free tools for freelancers.",         category: 'Freelancing',  readTime: '5 min', date: '2024-12-15', featured: false },
];

const CATEGORY_TINTS = {
  WhatsApp:     'text-emerald-300',
  Marketing:    'text-indigo-300',
  Finance:      'text-amber-300',
  Productivity: 'text-sky-300',
  Security:     'text-rose-300',
  Freelancing:  'text-violet-300',
};

export default function BlogPage() {
  const featured = POSTS.filter((p) => p.featured);
  const rest     = POSTS.filter((p) => !p.featured);

  return (
    <div className="min-h-screen">
      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10">
          <p className="section-label mb-4 fade-up">Blog</p>
          <h1 className="text-[32px] sm:text-[44px] font-semibold text-white tracking-[-0.025em] leading-[1.1] mb-3 fade-up delay-1">
            Business tips & tool guides.
          </h1>
          <p className="text-[15.5px] text-slate-400 max-w-xl leading-[1.6] fade-up delay-2">
            Practical guides to help small businesses, freelancers, and creators work smarter.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-12">
        {/* Featured */}
        <div className="mb-12">
          <h2 className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-[0.14em] mb-4">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featured.map((post) => (
              <article key={post.slug} className="rounded-xl surface card-hover p-5 group">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[11px] font-medium ${CATEGORY_TINTS[post.category] ?? 'text-slate-400'}`}>
                    {post.category}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock size={10} /> {post.readTime}
                  </span>
                </div>
                <h3 className="text-[16px] font-semibold text-white mb-2 leading-snug group-hover:text-indigo-200 transition-colors">
                  {post.title}
                </h3>
                <p className="text-[13.5px] text-slate-400 leading-[1.65] mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                  <span className="text-[11.5px] text-slate-500">
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-indigo-300 group-hover:text-white transition-colors">
                    Read <ArrowRight size={12} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* All */}
        <div>
          <h2 className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-[0.14em] mb-4">All posts</h2>
          <div className="space-y-2">
            {rest.map((post) => (
              <article
                key={post.slug}
                className="rounded-xl surface card-hover p-4 group flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={`text-[11px] font-medium ${CATEGORY_TINTS[post.category] ?? 'text-slate-400'}`}>
                      {post.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock size={10} /> {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-[14.5px] font-semibold text-white group-hover:text-indigo-200 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[13px] text-slate-500 mt-1 line-clamp-1">{post.excerpt}</p>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  <span className="text-[11.5px] text-slate-500 hidden sm:block">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-indigo-300 group-hover:text-white transition-colors">
                    Read <ArrowRight size={12} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
