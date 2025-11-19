import {
  Book,
  ArrowRight,
  FileText,
  Clock,
  TrendingUp,
  Home
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }) {
  const API = process.env.NEXT_PUBLIC_API_BLOG_BASE_URL;
  const WEBSITE = process.env.NEXT_PUBLIC_WEBSITE_ID;

  const category = params.category;

  // GET all article slugs
  const res = await fetch(
    `${API}/api/get-website-articles-slug?website=${WEBSITE}`,
    { cache: "no-store" }
  );

  const data = await res.json();

  if (!data?.posts) {
    return <div>No articles found</div>;
  }

  // FILTER articles inside category folder
  const articles = data.posts.filter((p) =>
    p.slug.startsWith(`${category}/`)
  );

  // ❌ No Articles → Beautiful Empty State
  if (articles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/20 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Book className="w-10 h-10 text-[#FF5211]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3 capitalize">
            {category.replace(/-/g, " ")}
          </h1>
          <p className="text-gray-600 mb-6">
            No articles found in this category yet. Check back soon!
          </p>

          <a
            href="/"
            className="inline-flex items-center gap-2 bg-[#FF5211] text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-all hover:scale-105"
          >
            <span>Back to Home</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  // ✔ ARTICLES AVAILABLE → FULL UI
  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <div className="bg-gradient-to-br from-[#FFF5EC] via-orange-50/60 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <div className="max-w-4xl">

            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center gap-2 text-sm">
                <li>
                  <a href="/" className="flex items-center gap-2 text-gray-600 hover:text-[#FF5211] transition-colors group">
                    <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Home</span>
                  </a>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-[#FF5211] font-semibold capitalize">
                  {category.replace(/-/g, " ")}
                </li>
              </ol>
            </nav>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FF5211] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
              <Book className="w-4 h-4" />
              Category
            </div>

            {/* TITLE */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 capitalize leading-tight">
              {category.replace(/-/g, " ")}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Explore all topics and guides related to {category.replace(/-/g, " ")}.{" "}
              {articles.length} article{articles.length !== 1 ? "s" : ""} available.
            </p>

            {/* STATS */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <FileText className="w-5 h-5 text-[#FF5211]" />
                <span className="font-semibold">{articles.length} Articles</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <TrendingUp className="w-5 h-5 text-[#FF5211]" />
                <span className="font-semibold">Regularly Updated</span>
              </div>
              {/* <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5 text-[#FF5211]" />
                <span className="font-semibold">5–10 min reads</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* ARTICLES GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {articles.map((article, index) => {
            const title = article.slug.split("/").pop().replace(/-/g, " ");

            return (
              <a
                key={index}
                href={`/${article.slug}`}
                className="group relative bg-white rounded-2xl border-2 border-gray-100 p-6 hover:border-[#FF5211]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5211]/0 to-orange-500/0 group-hover:from-[#FF5211]/5 group-hover:to-orange-500/5 rounded-2xl transition-all duration-500"></div>

                <div className="relative">
                  {/* Number Badge */}
                  {/* <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    {index + 1}
                  </div> */}

                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6 text-[#FF5211]" />
                  </div>

                  {/* Title */}
                  <h2 className="text-lg font-bold text-gray-900 mb-3 capitalize leading-tight group-hover:text-[#FF5211] transition-colors">
                    {title}
                  </h2>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    {/* <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>5 min read</span>
                    </div> */}
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Popular</span>
                    </div>
                  </div>

                  {/* Read More */}
                  <div className="flex items-center gap-2 text-[#FF5211] font-semibold text-sm">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF5211] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl"></div>
              </a>
            );
          })}

        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-[#FF5211] via-orange-600 to-orange-700 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
              Reach out to our team and we’ll help you find the right resources.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-[#FF5211] px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                <span>Contact Support</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              {/* <a
                href="/"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
              >
                <span>Browse All Categories</span>
              </a> */}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
