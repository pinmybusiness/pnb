import { authService } from "@/services/authService";
import { makeStore } from "@/store";
import { Providers } from "../providers";
import OpportunitiesContent from "@/components/csr/OpportunitiesContent";

// Server Component (Root)
export default async function StudentOpportunitiesPage() {
  const store = makeStore();
  let initialReduxState = {};
  let opportunities = [];
  let appliedOpportunities = [];
  let isAuthenticated = false;
  let hasProfile = false;

  // Fetch opportunities
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public?limit=20`;
    const response = await fetch(url, { cache: "no-store" }); // Avoid caching for fresh data
    const data = await response.json();
    if (data.success) {
      opportunities = data.data;
    }
  } catch (error) {
    console.error("Error fetching opportunities:", error);
  }

  // Fetch applied opportunities if authenticated
  if (isAuthenticated) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        appliedOpportunities = data.data.map((app) => app.opportunity._id);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  }

  initialReduxState = store.getState();

  return (
    <Providers initialReduxState={initialReduxState}>
      <OpportunitiesContent
        initialOpportunities={opportunities}
        initialAppliedOpportunities={appliedOpportunities}
        isAuthenticated={isAuthenticated}
        // hasProfile={hasProfile}
      />
    </Providers>
  );
}

