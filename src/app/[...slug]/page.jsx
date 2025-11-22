import Breadcrumbs from "@/components/blog/Breadcrumbs";
import Sidebar from "@/components/blog/Sidebar";
import Tabs from "@/components/blog/Tabs";
import FAQs from "@/components/blog/FAQs";
import { formatDateWithSuffix } from "@/utils/dateFormat";
import { Calendar, Clock } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { getReadingTime } from "@/utils/readingTime";
import { getStructuredData } from "@/utils/structuredData";
import LatestBlogs from "@/components/blog/LatestBlogs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const API = process.env.NEXT_PUBLIC_API_BLOG_BASE_URL;
const WEBSITE = process.env.NEXT_PUBLIC_WEBSITE_ID;

// Fetch latest articles from the API
const response = await fetch(
  `${API}/api/get-latest-website-articles?website=${WEBSITE}`,
  { cache: "no-store" }
);
const { latest_articles } = await response.json();
const latestSixArticles = latest_articles.slice(0, 6);

// -------------------------
//  SEO METADATA
// -------------------------
export async function generateMetadata({ params }) {
  // Await params first
  const { slug: slugArray } = await params;
  const slug = slugArray.join("/");

  const res = await fetch(
    `${API}/api/get-article?slug=${slug}&website=${WEBSITE}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  if (!data.article) return {};

  return {
    title: data.article.title,
    description: data.article.description,
    openGraph: {
      title: data.article.title,
      description: data.article.description,
      url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/${slug}`,
    },
  };
}

// -------------------------
//  REDIRECTION CHECK FUNCTION
// -------------------------
async function checkRedirection(slug) {
  try {
    const redirectRes = await fetch(
      `${API}/api/check-redirect?url=${slug}&website=${WEBSITE}`,
      { 
        cache: "no-store",
        timeout: 10000 // Note: fetch timeout not directly supported, use AbortController if needed
      }
    );

    if (redirectRes.ok) {
      const redirectData = await redirectRes.json();
      const redirectStatus = parseInt(redirectData.statusCode);
      const redirectUrl = redirectData.redirectUrl;

      // If valid redirect found
      if (redirectUrl && (redirectStatus === 301 || redirectStatus === 302)) {
        return {
          shouldRedirect: true,
          status: redirectStatus,
          url: redirectUrl.startsWith('/') ? redirectUrl : `/${redirectUrl}`
        };
      }
    }
  } catch (err) {
    console.error("[Redirect Check Error]:", err);
  }

  return { shouldRedirect: false };
}

// -------------------------
//  MAIN PAGE
// -------------------------
export default async function Page({ params }) {
  // Await params first, then use its properties
  const { slug: slugArray } = await params;
  const slug = slugArray.join("/");

  // First check for redirection
  const redirection = await checkRedirection(slug);
  if (redirection.shouldRedirect) {
    redirect(redirection.url);
  }

  // Check if post is category post or direct post
  const isCategoryPost = slugArray.length > 1;

  // category only if slug has folder
  const category = isCategoryPost ? slugArray[0] : null;

  // Main post slug
  const postSlug = isCategoryPost ? slugArray[1] : slugArray[0];

  // Fetch data
  const res = await fetch(
    `${API}/api/get-article?slug=${slug}&website=${WEBSITE}`,
    { cache: "no-store" }
  );

  // If article not found, check redirection again (in case API returns different response)
  if (!res.ok) {
    const redirectionRetry = await checkRedirection(slug);
    if (redirectionRetry.shouldRedirect) {
      redirect(redirectionRetry.url);
    }
    return notFound();
  }

  const data = await res.json();

  // If article not found in data, check redirection
  if (!data.article) {
    const redirectionRetry = await checkRedirection(slug);
    if (redirectionRetry.shouldRedirect) {
      redirect(redirectionRetry.url);
    }
    return notFound();
  }

  const post = data.article;
  const parts = slugArray;

  const structuredData = getStructuredData(
    data.article,
    data.comments?.meta,
    data.faqs
  );

  return (
    <>
      {/* BLOG SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.blogPosting),
        }}
      />

      {structuredData.faqPage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.faqPage),
          }}
        />
      )}

      {/* HERO SECTION */}
      <div className="-mt-5 bg-gradient-to-br from-[#FFF5EC] via-orange-50/60 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-14">

          {/* Breadcrumbs */}
          <Breadcrumbs parts={parts} />

          <div className="max-w-4xl">
            {/* Category + Views */}
            <div className="flex items-center gap-3 mb-4">

              {/* Category Badge (only for category posts) */}
              {category && (
                <span className="inline-flex items-center gap-2 bg-[#FF5211] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                  {category.replace(/-/g, " ")}
                </span>
              )}

              <span className="text-sm text-gray-600">{post.views} views</span>
            </div>

            {/* Title */}
            <h1 className="main-content mb-4 leading-tight">
              {post.heading_one}
            </h1>

            {/* Description */}
            <p className="main-content mb-6 leading-relaxed">
              {post.description}
            </p>

            {/* META INFO */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm pb-6">

              {/* Author */}
              <div className="flex items-center gap-3">
                {post.author_avatar ? (
                  <img
                    src={post.author_avatar}
                    alt={post.author_username}
                    className="w-10 h-10 rounded-full object-cover border-2 border-orange-500 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                    {post.author_username
                      ? post.author_username.charAt(0).toUpperCase()
                      : "T"}
                  </div>
                )}

                <div>
                  <p className="font-semibold text-gray-900 capitalize">
                    {post.author_username || "Trackly Team"}
                  </p>
                  <p className="text-gray-500 text-xs">Content Team</p>
                </div>
              </div>

              <div className="hidden md:block w-px h-8 bg-gray-300"></div>

              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-[#FF5211]" />
                <span>{formatDateWithSuffix(post.updated_on)}</span>
              </div>

              <div className="hidden md:block w-px h-8 bg-gray-300"></div>

              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-[#FF5211]" />
                <span>{getReadingTime(post.content || "")} read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <Tabs slug={slug} category={category} pathname={`/${slug}`} />

      {/* PAGE BODY */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* MAIN CONTENT */}
          <div className="lg:col-span-8">
            <article className="bg-white">
              <div className="main-content">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>

              {/* FAQs */}
              {data.faqs && data.faqs.length > 0 && (
                <div className="mt-2">
                  <FAQs faqs={data.faqs} />
                </div>
              )}

              {/* CTA */}
              <div className="mt-10 bg-gradient-to-br from-[#FF5211] via-orange-600 to-orange-700 rounded-3xl p-10 text-white text-center relative overflow-hidden">
                <h3 className="text-2xl md:text-3xl font-bold mb-3 z-10 relative">
                  Ready to Transform Your Sales?
                </h3>
                <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                  Join 200+ businesses using Trackly to track calls and close more deals.
                </p>

                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-[#FF5211] px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
                >
                  Get Started for ₹99/month
                </a>
              </div>
            </article>
          </div>

          {/* SIDEBAR (optional) */}
          {/* <div className="lg:col-span-4">
            <Sidebar slug={slug} />
          </div> */}
        </div>

        {/* LATEST BLOGS SECTION */}
        <div className="mt-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
            You May Also Like
          </h2>

          <LatestBlogs
            articles={latestSixArticles.map((item) => ({
              slug: item.slug,
              heading_one: item.heading_one,
              imageAlt: item.imageAlt,
            }))}
            pageSize={6}
            heading="You May Also Like"
            headingAlign="left"
            showCTAButton={true}
            ctaHref="/blog"
            showBackground={false}
          />
        </div>
      </div>
    </>
  );
}