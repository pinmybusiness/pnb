// app/job/[slug]/page.jsx
import { authService } from "@/services/authService";
import { makeStore } from "@/store";
import { Providers } from "../../providers";
import OpportunityDetailContent from "@/components/csr/OpportunityDetailContent";
import { ArrowLeft, User, Phone, Lock, MapPin } from "lucide-react";
import axios from "axios";
import sanitizeHtml from 'sanitize-html';
import { generateJobPostingSchema } from '@/utils/jobSchemaUtils';

// Generate dynamic metadata
export async function generateMetadata({ params }) {
  const { slug } = params;
  let opportunity = null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public/${slug}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Opportunity not found");
    const data = await response.json();
    if (data.success) {
      opportunity = data.data;
    } else {
      throw new Error(data.message || "Failed to fetch opportunity");
    }
  } catch (error) {
    console.error("Error fetching opportunity for metadata:", error);
    return {
      title: "Opportunity Not Found | FasterQ.in",
      description: "The opportunity you are looking for does not exist. Explore other jobs on FasterQ.in.",
      alternates: {
        canonical: `https://www.fasterq.in/job/${slug}`,
      },
    };
  }

  const role = opportunity?.title || "Job";
  const city = opportunity?.location?.city || opportunity?.branch?.location?.city?.name || "Unknown City";
  const restaurant = opportunity?.branch?.parentRestaurant?.name || "Unknown Restaurant";

  return {
    title: `${role} Job at ${restaurant} in ${city} | FasterQ.in`,
    description: `Apply for ${role} at ${restaurant} in ${city}. Discover details, salary, and benefits. Join FasterQ.in to get hired quickly.`,
    alternates: {
      canonical: `https://www.fasterq.in/job/${slug}`,
    },
  };
}

export default async function PublicOpportunityDetail({ params }) {
  const { slug } = params;
  const store = makeStore();
  let initialReduxState = {};
  let opportunity = null;
  let isAuthenticated = false;
  let hasProfile = false;
  let appliedOpportunities = [];
  let cities = [];

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public/${slug}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Opportunity not found");
    const data = await response.json();
    if (data.success) {
      opportunity = data.data;
    } else {
      throw new Error(data.message || "Failed to fetch opportunity");
    }
  } catch (error) {
    console.error("Error fetching opportunity:", error);
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Opportunity Not Found</h2>
          <p className="text-gray-600 mb-6">{error.message || "The opportunity you are looking for does not exist."}</p>
          <a
            href="/jobs"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Opportunities
          </a>
        </div>
      </div>
    );
  }

  // Generate JobPosting schema
  const jobSchema = generateJobPostingSchema(opportunity);

  if (isAuthenticated && hasProfile) {
    try {
      const token = store.getState().auth.token;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          appliedOpportunities = data.data.map((app) => app.opportunity._id);
        }
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  }

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cities`, {
      cache: "no-store",
    });
    cities = response.data.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
  }

  initialReduxState = store.getState();

  const role = opportunity?.title || "Job";
  const city = opportunity?.location?.city || opportunity?.branch?.location?.city?.name || "Unknown City";
  const restaurant = opportunity?.branch?.parentRestaurant?.name || "Unknown Restaurant";

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }}
      />
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center py-6 max-w-4xl mx-auto">
          <h1 className="text-center text-3xl font-bold text-gray-900">
            {role} Job in {city} at {restaurant}
          </h1>
        </div>
        <Providers initialReduxState={initialReduxState}>
          <OpportunityDetailContent
            initialOpportunity={opportunity}
            initialAppliedOpportunities={appliedOpportunities}
            isAuthenticated={isAuthenticated}
            hasProfile={hasProfile}
            cities={cities}
          />
        </Providers>
      </div>
    </div>
  );
}