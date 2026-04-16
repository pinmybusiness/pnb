import Link from 'next/link';
import { SITE, TOOLS } from '@/lib/tools';
import { ArrowRight, Clock } from 'lucide-react';

export const metadata = {
  title: 'Blog - Business Tips & Tool Guides',
  description: `Practical guides, tips, and tutorials for small businesses and freelancers from ${SITE.name}.`,
  alternates: { canonical: '/blog' },
};

const POSTS = [
  {
    slug: 'how-to-add-whatsapp-button-to-website',
    title: 'How to Add a WhatsApp Button to Your Website (2024 Guide)',
    excerpt:
      'Adding a WhatsApp contact button is one of the fastest ways to increase conversions. Here\'s the complete guide with code examples.',
    category: 'WhatsApp',
    readTime: '4 min read',
    date: '2024-01-15',
    featured: true,
  },
  {
    slug: 'qr-code-marketing-small-business',
    title: 'QR Code Marketing for Small Businesses: 10 Creative Ideas',
    excerpt:
      'QR codes are back - and smarter than ever. Learn 10 creative ways to use QR codes to drive traffic, sales, and engagement.',
    category: 'Marketing',
    readTime: '6 min read',
    date: '2024-01-10',
    featured: true,
  },
  {
    slug: 'how-to-write-a-professional-invoice',
    title: 'How to Write a Professional Invoice: Complete Template Guide',
    excerpt:
      'A proper invoice can mean the difference between getting paid on time or chasing clients for months. This guide covers everything.',
    category: 'Finance',
    readTime: '7 min read',
    date: '2024-01-05',
    featured: false,
  },
  {
    slug: 'email-signature-best-practices',
    title: '7 Email Signature Best Practices That Make You Look Professional',
    excerpt:
      'Your email signature is seen by every person you email. Make it count with these proven best practices.',
    category: 'Productivity',
    readTime: '5 min read',
    date: '2023-12-28',
    featured: false,
  },
  {
    slug: 'password-security-guide-small-business',
    title: 'Password Security for Small Businesses: The Complete 2024 Guide',
    excerpt:
      '43% of cyberattacks target small businesses. Here\'s how to protect yourself with strong password practices.',
    category: 'Security',
    readTime: '8 min read',
    date: '2023-12-20',
    featured: false,
  },
  {
    slug: 'free-tools-every-freelancer-needs',
    title: '12 Free Online Tools Every Freelancer Needs in 2024',
    excerpt:
      'Working solo doesn\'t mean you can\'t have professional-grade tools. Here are the best free tools for freelancers.',
    category: 'Freelancing',
    readTime: '5 min read',
    date: '2023-12-15',
    featured: false,
  },
];

const CATEGORY_COLORS = {
  WhatsApp:    'bg-emerald-100 text-emerald-700',
  Marketing:   'bg-indigo-100 text-indigo-700',
  Finance:     'bg-amber-100 text-amber-700',
  Productivity:'bg-sky-100 text-sky-700',
  Security:    'bg-rose-100 text-rose-700',
  Freelancing: 'bg-violet-100 text-violet-700',
};

export default function BlogPage() {
  const featured = POSTS.filter((p) => p.featured);
  const rest     = POSTS.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100 mb-4 uppercase tracking-wider">
            Blog
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Business Tips & Tool Guides
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Practical guides to help small businesses, freelancers, and creators work smarter.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured posts */}
        <div className="mb-12">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all tool-card group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full ${CATEGORY_COLORS[post.category] ?? 'bg-slate-100 text-slate-700'}`}
                  >
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={11} /> {post.readTime}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:gap-2 transition-all">
                    Read more <ArrowRight size={13} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* All posts */}
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">All Posts</h2>
          <div className="space-y-4">
            {rest.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-200 hover:shadow-md transition-all group flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${CATEGORY_COLORS[post.category] ?? 'bg-slate-100 text-slate-700'}`}
                    >
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={11} /> {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-1">{post.excerpt}</p>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  <span className="text-xs text-slate-400 hidden sm:block">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:gap-2 transition-all">
                    Read <ArrowRight size={13} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* CTA to tools */}
        <div className="mt-16 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">
            Try our free tools while you&apos;re here
          </h2>
          <p className="text-indigo-200 mb-6 max-w-md mx-auto">
            Everything you read about - WhatsApp links, QR codes, invoices - available free, right now.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {TOOLS.slice(0, 3).map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={tool.href}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-xl transition-all backdrop-blur-sm"
                >
                  <Icon size={14} />
                  {tool.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
