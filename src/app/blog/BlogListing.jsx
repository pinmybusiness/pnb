// src/components/blog/BlogListing.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import Pagination from './Pagination';
import companyInfo from '../../../config/companyInfo';
import { ArrowRight, Clock, Calendar } from 'lucide-react';

export default function BlogListing({ posts, currentPage, hasNextPage, totalPages }) {
  // Function to get reading time estimate (optional)
  const getReadingTime = (description) => {
    const wordsPerMinute = 200;
    const wordCount = description?.split(' ').length || 0;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime > 0 ? `${readingTime} min read` : '5 min read';
  };

  // Function to format date (optional - if you have date field)
  const formatDate = (date) => {
    if (!date) return 'Recent';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div>
      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {posts.map((post, index) => (
          <article 
            key={post.id} 
            className="group bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 hover:border-orange-300 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1"
          >
            <Link href={`/${post.slug}`} className="block">
              {/* Image Container */}
              <div className="relative h-56 bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden">
                <Image
                  src={`${companyInfo.website_url}/images/blog/${index+1}.webp`}
                  alt={`Cover image for: ${post.heading_one}`}
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index < 3}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Featured Badge (for first post) */}
                {index === 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#FF5211] to-orange-600 text-white text-xs font-bold rounded-full shadow-lg shadow-orange-500/50">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Featured
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center gap-4 mb-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#FF5211]" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FF5211]" />
                    <span>{getReadingTime(post.description)}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#FF5211] transition-colors duration-300">
                  {post.heading_one}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.description}
                </p>

                {/* Read More Link */}
                <div className="flex items-center gap-2 text-[#FF5211] font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>

              {/* Bottom Accent Line */}
              <div className="h-1 bg-gradient-to-r from-[#FF5211] via-orange-500 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
          </article>
        ))}
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-[#FF5211]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Articles Found</h3>
          <p className="text-gray-600 mb-6">
            Check back soon for new content!
          </p>
        </div>
      )}
      
      {/* Pagination */}
      {posts.length > 0 && (
        <Pagination 
          currentPage={currentPage} 
          hasNextPage={hasNextPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}