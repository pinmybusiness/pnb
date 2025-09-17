// app/opportunities/[slug]/page.jsx
import { authService } from "@/services/authService";
import { makeStore } from "@/store";
import { Providers } from "../../providers";
import OpportunityDetailContent from "@/components/csr/OpportunityDetailContent";
import { ArrowLeft, User, Phone, Lock, MapPin } from "lucide-react";
import axios from "axios";

// Server Component (Root)
export default async function PublicOpportunityDetail({ params }) {
  const { slug } = params;
  const store = makeStore();
  let initialReduxState = {};
  let opportunity = null;
  let isAuthenticated = false;
  let hasProfile = false;
  let appliedOpportunities = [];
  let cities = [];

  // Check auth status
  // try {
  //   const { cookies } = await import("next/headers");
  //   const token = cookies().get("token")?.value;
  //   if (token) {
  //     // const response = await authService.getMe();
  //     if (response.success) {
  //       store.dispatch({
  //         type: "auth/setCredentials",
  //         payload: { user: response.data.user, token },
  //       });
  //       isAuthenticated = true;
  //       hasProfile = !!response.data.user.profile;
  //     }
  //   }
  // } catch (error) {
  //   console.error("Failed to check auth:", error);
  // }

  // Fetch opportunity
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public/${slug}`, {
      cache: "no-store", // Avoid caching for fresh data
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

  // Fetch applied opportunities if authenticated
  if (isAuthenticated && hasProfile) {
    try {
      const token = store.getState().auth.token; // Get token from Redux state
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

  // Fetch cities for registration form
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cities`, {
      cache: "no-store",
    });
    cities = response.data.data;
  } catch (error) {
    console.error("Error fetching cities:", error);
  }

  initialReduxState = store.getState();

  return (
    <Providers initialReduxState={initialReduxState}>
      <OpportunityDetailContent
        initialOpportunity={opportunity}
        initialAppliedOpportunities={appliedOpportunities}
        isAuthenticated={isAuthenticated}
        hasProfile={hasProfile}
        cities={cities}
      />
    </Providers>
  );
}