export const dynamic = 'force-dynamic';

import { cookies } from "next/headers";
import { authService } from "@/services/authService";
import { Providers } from "../providers";
import OpportunitiesContent from "@/components/csr/OpportunitiesContent";

export default async function OpportunitiesPage() {
  const token = cookies().get("token")?.value;
  let opportunities = [];
  let appliedOpportunities = [];
  let isAuthenticated = false;
  // let hasProfile = false;

  // Fetch public opportunities
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public?limit=20`;
    const response = await fetch(url, { next: { revalidate: 300 } }); // Cache for 5 minutes
    const data = await response.json();
    if (data.success) {
      opportunities = data.data;
    } else {
      console.error("Failed to fetch opportunities:", data.message);
    }
  } catch (error) {
    console.error("Error fetching opportunities:", error);
  }

  // Check authentication and fetch user data
  if (token) {
    try {
      const userData = await authService.getMe(token);
      if (userData.success && userData.data.role === 10) {
        isAuthenticated = true;
        hasProfile = !!userData.data.candidateProfile;

        // Fetch applied opportunities
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 300 }, // Cache for 5 minutes
          });
          const data = await response.json();
          if (data.success) {
            appliedOpportunities = data.data.map((app) => app.opportunity._id);
          } else {
            console.error("Failed to fetch applications:", data.message);
          }
        } catch (error) {
          console.error("Error fetching applications:", error);
        }
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  }

  return (
    <Providers>
      <OpportunitiesContent
        initialOpportunities={opportunities}
        initialAppliedOpportunities={appliedOpportunities}
        isAuthenticated={isAuthenticated}
        // hasProfile={hasProfile}
      />
    </Providers>
  );
}