import Breadcrumbs from "@/components/blog/Breadcrumbs";
import Sidebar from "@/components/blog/Sidebar";
import Tabs from "@/components/blog/Tabs";
import FAQs from "@/components/blog/FAQs";
import { formatDateWithSuffix } from "@/utils/dateFormat";
import { Calendar, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { getReadingTime } from "@/utils/readingTime";
import { getStructuredData } from "@/utils/structuredData";

// DYNAMIC SETTINGS FOR FRESH DATA
export const dynamic = "force-dynamic";
export const revalidate = 0;

const API = process.env.NEXT_PUBLIC_API_BLOG_BASE_URL;
const WEBSITE = process.env.NEXT_PUBLIC_WEBSITE_ID;

// -------------------------
//  SEO METADATA
// -------------------------
export async function generateMetadata({ params }) {
  const slug = params.slug.join("/");

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
//  MAIN PAGE
// -------------------------
export default async function Page({ params }) {
  const slug = params.slug.join("/");

  const res = await fetch(
    `${API}/api/get-article?slug=${slug}&website=${WEBSITE}`,
    { cache: "no-store" }
  );

  if (!res.ok) return notFound();
  const data = await res.json();

  if (!data.article) return notFound();

  const post = data.article;
  const parts = slug.split("/");
  const category = parts[0];

  const structuredData = getStructuredData(data.article, data.comments.meta,  data.faqs);


  return (
    <>

    {/* BlogPosting Schema */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.blogPosting) }}
    />
    
    {/* FAQ Schema (only if exists) */}
    {structuredData.faqPage && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faqPage) }}
      />
    )}

      {/* HERO SECTION */}
      <div className="-mt-5 bg-gradient-to-br from-[#FFF5EC] via-orange-50/60 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-14">
          
          <Breadcrumbs parts={parts} />

          {/* HEADER */}
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-2 bg-[#FF5211] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                {category.replace(/-/g, " ")}
              </span>

              <span className="text-sm text-gray-600">{post.views} views</span>
            </div>

            <h1 className="main-content mb-4 leading-tight">
              {post.heading_one}
            </h1>

            <p className="main-content mb-6 leading-relaxed">
              {post.description}
            </p>

            {/* META */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm pb-6">
            <div className="flex items-center gap-3">
            
            {/* Avatar */}
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

            {/* Author Text */}
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
        <Tabs slug={slug} pathname={`/${slug}`} />

      {/* PAGE BODY */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 pt-12">


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ------- MAIN CONTENT ------- */}
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

              {/* READ MORE / CTA */}
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

          {/* ------- SIDEBAR ------- */}
          {/* <div className="lg:col-span-4">
            <Sidebar slug={slug} />
          </div> */}
        </div>
      </div>

        
    </>
  );
}
