"use client";

import { ArrowRight, Clock } from "lucide-react";
import { useMemo } from "react";

export default function LatestBlogs({
  articles = [],
  pageSize = 3,
  heading = "Latest Articles & Insights",
  showCTAButton = true,
  ctaHref = "/blog",
}) {
  // Shuffle image indices
  const imageIndices = useMemo(() => {
    const count = Math.min(articles.length, pageSize);
    const arr = Array.from({ length: 5 }, (_, i) => i + 1);
    return arr.sort(() => Math.random() - 0.5).slice(0, count);
  }, [articles, pageSize]);

  const displayArticles = articles.slice(0, pageSize);

  if (displayArticles.length === 0) {
    return null;
  }

  return (
    <section className="">
      {/* <div className="max-w-7xl mx-auto px-4 md:px-6"> */}
        {/* Header */}
        {/* <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-[#FF5211] rounded-full text-xs font-bold uppercase tracking-wide mb-4">
            Blog
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {heading}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest tips, guides, and insights
          </p>
        </div> */}

        {/* Blog Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayArticles.map((article, index) => (
            <a
              href={`/${article.slug}`}
              key={article.slug}
              className="group block bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#FF5211]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-200 to-gray-100">
                <img
                  src={`/images/blog/${imageIndices[index] || 1}.webp`}
                  alt={article.imageAlt || article.heading_one}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta */}
                {/* <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Clock className="w-3 h-3" />
                  <span>5 min read</span>
                </div> */}

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#FF5211] transition-colors">
                  {article.heading_one}
                </h3>

                {/* Read More Link */}
                <div className="flex items-center gap-2 text-[#FF5211] font-semibold text-sm">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA Button */}
        {/* {showCTAButton && (
          <div className="text-center mt-12">
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF5211] to-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all hover:scale-105 group"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        )} */}
      {/* </div> */}
    </section>
  );
}