// src/app/blog/page.jsx
import { API_CONFIG } from '../../../config/api';
import { notFound } from 'next/navigation';
import BlogListing from './BlogListing';
import BlogSchema from './BlogSchema';

export async function generateMetadata({ searchParams }) {
  const params = await searchParams; // ✅ Next.js 15 required
  const currentPage = parseInt(params?.page || "1", 10);

  const baseTitle = "Blog | FasterQ Call Tracking Software";
  const title =
    currentPage > 1
      ? `Blog - Page ${currentPage} | FasterQ Call Tracking Software`
      : baseTitle;

  const description =
    "Read expert insights, tips, and updates on SIM-based call tracking, sales productivity, and business growth by FasterQ.";

  const canonicalUrl =
    currentPage > 1
      ? `https://www.fasterq.in/blog?page=${currentPage}`
      : `https://www.fasterq.in/blog`;

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "FasterQ",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}


async function getBlogPosts(page = 1, pageSize = 6) {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getArticles}?website=${API_CONFIG.websiteId}&page=${page}&pageSize=${pageSize}`;
  
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch posts');
    
    const data = await res.json();
    return {
      posts: data.posts || [],
      pagination: data.pagination || {
        totalPosts: data.posts ? data.posts.length : 0,
        totalPages: 1,
        currentPage: page,
        pageSize: pageSize
      }
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { posts: [], totalPosts: 0 };
  }
}

export default async function BlogPage({ searchParams }) {
 const params = await searchParams; // ✅ REQUIRED in Next 15
  const currentPage = parseInt(params?.page || "1", 10);

  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  const { posts, pagination } = await getBlogPosts(currentPage);
  const hasNextPage = pagination ? currentPage < pagination.totalPages : false;

  if (!posts || posts.length === 0) {
    notFound();
  }
  
  return (
    <>
      <BlogSchema posts={posts} />

      {/* Hero Section */}
      <div className="relative -mt-5 bg-gradient-to-br from-orange-50 via-white to-orange-50/30 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold rounded-full mb-6 shadow-lg shadow-orange-500/30">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Our Blog
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5211] to-orange-600">Updates</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Discover the latest tips, insights, and industry trends to help you grow your business and optimize your operations
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">{pagination?.totalPosts || posts.length}</div>
                  <div className="text-sm text-gray-600">Articles</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-gray-900">Weekly</div>
                  <div className="text-sm text-gray-600">Updates</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="bg-gradient-to-br from-white via-orange-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Latest Articles
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {currentPage > 1 ? `Page ${currentPage}` : 'Fresh content for you'}
                </p>
              </div>
            </div>

            {/* Page Indicator */}
            {pagination && pagination.totalPages > 1 && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border-2 border-orange-100 rounded-xl shadow-sm">
                <span className="text-sm font-semibold text-gray-700">Page</span>
                <span className="px-3 py-1 bg-gradient-to-r from-[#FF5211] to-orange-600 text-white text-sm font-bold rounded-lg">
                  {currentPage}
                </span>
                <span className="text-sm text-gray-500">of {pagination.totalPages}</span>
              </div>
            )}
          </div>

          {/* Blog Listing */}
          <BlogListing 
            posts={posts} 
            currentPage={currentPage} 
            hasNextPage={hasNextPage}
            totalPages={pagination?.totalPages}
          />
        </div>
      </div>
    </>
  );
}