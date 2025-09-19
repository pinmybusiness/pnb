// src/app/restaurant/[city]/[slug]/page.jsx
import axios from "axios";
import { notFound } from "next/navigation";
import {
  MapPin,
  Phone,
  Store,
  Navigation,
  ExternalLink,
  Facebook,
  Instagram,
  Globe,
  UtensilsCrossed,
} from "lucide-react";
import Image from "next/image";
import JobCard from "@/components/opportunity/JobCard";
import BranchCTA from "@/components/BranchCTA";
import FAQs from "@/components/FAQs";
import ContentSection from "@/components/ContentSection";
import { getBranchFAQs } from "@/data/faqs";
import { getBranchContent } from "@/data/content";
import sanitizeHtml from 'sanitize-html';
import { generateJobPostingSchema } from '@/utils/jobSchemaUtils';

// Slugify function
const slugify = (str) =>
  str
    ?.toLowerCase()
    ?.trim()
    ?.replace(/\s+/g, "-")
    ?.replace(/[^\w\-]+/g, "")
    ?.replace(/\-\-+/g, "-")
    ?.replace(/^-+|-+$/g, "") || "";

// Detect social platform
const detectSocialPlatform = (url) => {
  if (!url) return null;
  if (url.includes("facebook.com") || url.includes("fb.com")) return "Facebook";
  if (url.includes("instagram.com")) return "Instagram";
  if (url.includes("zomato.com")) return "Zomato";
  if (url.includes("swiggy.com")) return "Swiggy";
  return "Website";
};

// Dynamic metadata
export async function generateMetadata({ params }) {
  const { city, slug } = params || {};
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/branches/slug/${slug}`,
      { cache: "no-store" }
    );
    const branch = response.data.data;

    const branchCitySlug = slugify(branch.location.city?.name || "");
    if (branchCitySlug !== city.toLowerCase()) {
      return {
        title: "Branch Not Found | FasterQ.in",
        description: "The requested branch or city could not be found.",
        alternates: {
          canonical: `https://www.fasterq.in/restaurant/${city}/${slug}`,
        },
      };
    }

    const restaurant = branch.parentRestaurant?.name || "Restaurant";
    const cityName = branch.location.city?.name || city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, ' ');

    return {
      title: `Jobs at ${restaurant}, ${cityName} | FasterQ.in`,
      description: `Explore open positions at ${restaurant} in ${cityName}. Apply for chef, waiter, and steward jobs free on FasterQ.in.`,
      alternates: {
        canonical: `https://www.fasterq.in/restaurant/${slugify(cityName, { lower: true })}/${slug}`,
      },
    };
  } catch {
    return {
      title: "Branch Not Found | FasterQ.in",
      description: "The requested branch or city could not be found.",
      alternates: {
        canonical: `https://www.fasterq.in/restaurant/${city}/${slug}`,
      },
    };
  }
}

export default async function BranchInfoPage({ params }) {
  const { city, slug } = params || {};
  let branch, opportunities;

  // Fetch branch details
  try {
    const branchResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/branches/slug/${slug}`,
      { cache: "no-store" }
    );
    branch = branchResponse.data.data;
  } catch {
    return notFound();
  }

  if (!branch) return notFound();

  const branchCitySlug = slugify(branch.location.city?.name || "");
  if (branchCitySlug !== city.toLowerCase()) return notFound();

  // Fetch opportunities for the branch
  try {
    const opportunitiesResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public/branch/${slug}?page=1&limit=20`,
      { cache: "no-store" }
    );
    opportunities = opportunitiesResponse.data.data || [];
  } catch {
    opportunities = [];
  }

  const formattedAddress = [
    branch.location.address,
    branch.location.city?.name,
    branch.location.city?.state?.name,
    branch.location.postalCode,
    branch.cityDetails?.countryName || "India",
  ]
    .filter(Boolean)
    .join(", ");

  const mapsUrl = `https://www.google.com/maps?q=${branch.location.coordinates[1]},${branch.location.coordinates[0]}`;
  const platformLabel = detectSocialPlatform(branch.socialLink);

  // Capitalize city for display
  const cityName = branch.location.city?.name || city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, ' ');
  const restaurant = branch.parentRestaurant?.name || "Restaurant";

  // Generate FAQs and Content
  const faqs = getBranchFAQs(restaurant, cityName);
  const content = getBranchContent(restaurant, cityName);

  // Generate FAQPage schema
  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": sanitizeHtml(faq.question, { allowedTags: [] }),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": sanitizeHtml(faq.answer, { allowedTags: [] })
      }
    }))
  } : null;

  // Generate JobPosting schemas for ItemList
  const jobSchemas = opportunities.slice(0, 20).map((opp) => generateJobPostingSchema(opp));

  const itemListSchema = opportunities.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": jobSchemas.map((schema, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": schema
    }))
  } : null;

  const schemas = [faqSchema, itemListSchema].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FFF5EC]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="px-4 py-12 text-center">
          {branch.parentRestaurant?.logo ? (
            <Image
              src={branch.parentRestaurant.logo}
              alt={`${branch.parentRestaurant.name} logo`}
              width={80}
              height={80}
              className="rounded-full border-4 border-white shadow-lg mx-auto"
              priority
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center border-4 border-white shadow-lg mx-auto">
              <Store className="h-8 w-8 text-white" />
            </div>
          )}

          <h1 className="mt-4 text-3xl font-bold">Careers at {restaurant}, {cityName}</h1>
          <p className="text-sm sm:text-base text-[#696d7d] flex items-start justify-center gap-2 mt-3">
            <MapPin className="h-4 w-4 text-primary translate-y-[2px]" />
            <span>{formattedAddress}</span>
          </p>
          <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 justify-center items-center">
            {branch.helplineNumber && (
              <a
                href={`tel:${branch.helplineNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-green-50 text-green-700 rounded-full font-semibold shadow-md hover:bg-green-100 transition"
              >
                <Phone className="h-5 w-5 mr-2" />
                {branch.helplineNumber}
              </a>
            )}

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-white text-primary rounded-full font-semibold shadow-md hover:bg-gray-100 transition"
            >
              <Navigation className="h-5 w-5 mr-2" />
              Get Directions
            </a>

            {branch.socialLink && (
              <a
                href={branch.socialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-50 text-blue-700 rounded-full font-semibold hover:bg-blue-100 transition"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Visit on {platformLabel}
              </a>
            )}
          </div>
        </div>

        {/* Opportunities Section */}
        <div className="max-w-4xl mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold mb-6">Job Openings</h2>
          {opportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {opportunities.map((opportunity) => (
                <JobCard key={opportunity._id} opportunity={opportunity} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">
              No current openings at this branch.
            </p>
          )}
        </div>

        {/* FAQs Section */}
        <FAQs faqs={faqs} />

        {/* Content Section */}
        <ContentSection content={content} />

        {/* CTA Section for Restaurant Owners */}
        {/* <BranchCTA /> */}
      </div>
    </div>
  );
}