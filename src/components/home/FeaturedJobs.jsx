import CtaButton from '../CtaButton';
import JobCard from '../opportunity/JobCard';
import JobCardSkeleton from '../opportunity/JobCardSkeleton';
import { generateJobPostingSchema } from '@/utils/jobSchemaUtils';
import sanitizeHtml from 'sanitize-html';

async function getOpportunities() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public/latest`,
      { cache: 'no-store' } // hamesha fresh data
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Server returned ${res.status}`);
    }

    const { data, success, message } = await res.json();
    if (!success) {
      throw new Error(message || 'Failed to fetch opportunities');
    }

    return { opportunities: data || [], error: null };
  } catch (err) {
    return { opportunities: [], error: err.message || 'Failed to load job opportunities' };
  }
}

export default async function FeaturedJobs() {
  const { opportunities, error } = await getOpportunities();

  // Generate JobPosting schemas for ItemList
  const jobSchemas = opportunities.slice(0, 3).map((opp) => generateJobPostingSchema(opp));

  const itemListSchema = opportunities.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": jobSchemas.map((schema, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": schema
    }))
  } : null;

  return (
    <section className="bg-[#FFF5EC] py-16 sm:py-24">
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Discover the Latest Restaurant Jobs{' '}
            <span className="text-orange-600">Across India</span>
          </h2>
        </div>

        {/* Error State */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">Unable to load opportunities</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <CtaButton
              href="/jobs"
              text="Try Again"
              asButton="true"
              icon="none"
            />
          </div>
        ) : null}

        {/* Loading Skeleton (SSR me bhi dikhega jab tak data aa nahi raha) */}
        {!error && opportunities.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <JobCardSkeleton key={item} />
            ))}
          </div>
        ) : null}

        {/* Opportunities */}
        {opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {opportunities.map((opportunity) => (
              <JobCard key={opportunity._id} opportunity={opportunity} />
            ))}
          </div>
        ) : null}

        {/* Empty State (no error, no opportunities) */}
        {!error && opportunities.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-2xl font-semibold text-gray-600 mb-4">
              No opportunities available
            </div>
            <p className="text-gray-500 mb-6">
              Check back later for new restaurant job opportunities
            </p>
          </div>
        ) : null}

        {/* CTA */}
        <div className="flex justify-center mt-16">
          <CtaButton href="/jobs" text="View All Jobs" />
        </div>
      </div>
    </section>
  );
}