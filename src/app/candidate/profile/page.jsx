import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authService } from "@/services/authService";
import CandidateProfileForm from "@/components/csr/CandidateProfileForm";

export default async function CandidateProfilePage() {
  const token = cookies().get("token")?.value;
  let initialProfile = null;
  let userId = null;
  let isAuthenticated = false;
  let error = null;

  if (!token) {
    redirect("/login");
  }

  try {
    const response = await authService.getMe(token);
    if (response.success && response.data.role === 10) {
      isAuthenticated = true;
      userId = response.data._id;
      initialProfile = {
        firstName: response.data.candidateProfile?.firstName || (response.data.name ? response.data.name.split(" ")[0] : ""),
        lastName: response.data.candidateProfile?.lastName || (response.data.name ? response.data.name.split(" ").slice(1).join(" ") : ""),
        jobStatus: response.data.candidateProfile?.jobStatus || "Open to Opportunities",
        dateOfBirth: response.data.candidateProfile?.dateOfBirth
          ? new Date(response.data.candidateProfile.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: response.data.candidateProfile?.gender || "",
        mobileNumber: {
          countryCode: response.data.candidateProfile?.mobileNumber?.countryCode || "+91",
          number: response.data.candidateProfile?.mobileNumber?.number || "",
        },
        address: {
          city: response.data.candidateProfile?.address?.city || "",
        },
        skills: response.data.candidateProfile?.skills || [],
        newSkill: "",
        newSkillProficiency: "Intermediate",
        languages: response.data.candidateProfile?.languages || [],
        newLanguage: "",
        newLanguageProficiency: "Intermediate",
        experience: response.data.candidateProfile?.experience || [],
        preferences: {
          preferredLocations: response.data.candidateProfile?.preferredLocations || [],
          newLocation: "",
          preferredCategories: response.data.candidateProfile?.preferredJobRoles || [],
          newCategory: "",
          preferredOpportunityTypes: response.data.candidateProfile?.preferredOpportunityTypes || [],
        },
      };
    } else {
      error = "Invalid user or no candidate profile found.";
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
    error = "Failed to load profile. Please try again.";
  }

  return (
    <CandidateProfileForm
      initialProfile={initialProfile}
      userId={userId}
      isAuthenticated={isAuthenticated}
      initialError={error}
      token={token}
    />
  );
}