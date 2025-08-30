"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Calendar, MapPin, Briefcase, Star, Languages, Mars, Venus, Transgender, Search, Binoculars, XCircle, Utensils } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";

// Dynamic theme configuration
const theme = {
  primary: "amber-500",
  primaryHover: "amber-600",
  primaryLight: "amber-100",
  primaryLighter: "amber-50",
  primaryBorder: "amber-300",
  primaryBorderHover: "amber-400",
  textPrimary: "amber-700",
  textSecondary: "amber-600",
  textPlaceholder: "amber-400",
  backgroundGradientFrom: "amber-50",
  backgroundGradientTo: "orange-100",
  errorBackground: "red-100",
  errorText: "red-700",
};

export default function CandidateProfilePage() {
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    jobStatus: "Open to Opportunities",
    dateOfBirth: "",
    gender: "",
    mobileNumber: { countryCode: "+91", number: "" },
    address: { city: "" },
    skills: [],
    newSkill: "",
    newSkillProficiency: "Intermediate",
    languages: [],
    newLanguage: "",
    newLanguageProficiency: "Intermediate",
    experience: [],
    preferences: {
      preferredLocations: [],
      newLocation: "",
      preferredCategories: [],
      newCategory: "",
      preferredOpportunityTypes: [],
    },
  });
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showExperience, setShowExperience] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showCustomLanguage, setShowCustomLanguage] = useState(false);
  const [showCustomSkill, setShowCustomSkill] = useState(false);
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const countryCodes = [
    { code: "+91", label: "+91" },
  ];

  const commonLanguages = ["English", "Hindi", "Telugu", "Tamil", "Marathi", "Bengali", "Punjabi"];
  const commonSkills = ["Cooking", "Bartending", "Customer Service", "Food Preparation", "Inventory Management", "Team Leadership", "Event Planning", "Serving"];
  const commonLocations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune"];
  const commonCategories = ["Chef", "Waiter/Waitress", "Kitchen Helper", "Bartender", "Restaurant Manager", "Host/Hostess", "Delivery Staff"];
  const commonOpportunityTypes = ["Full-Time", "Part-Time", "Internship", "OPD"];

  useEffect(() => {
    setIsAuthenticated(!!token);
    if (!token) {
      router.push("/login");
    } else {
      fetchProfile();
    }
  }, [token, router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success && data.data.role === 10 && data.data.candidateProfile) {
        setUserId(data.data._id);
        setProfile({
          firstName: data.data.candidateProfile.firstName || (data.data.name ? data.data.name.split(" ")[0] : ""),
          lastName: data.data.candidateProfile.lastName || (data.data.name ? data.data.name.split(" ").slice(1).join(" ") : ""),
          jobStatus: data.data.candidateProfile.jobStatus || "Open to Opportunities",
          dateOfBirth: data.data.candidateProfile.dateOfBirth
            ? new Date(data.data.candidateProfile.dateOfBirth).toISOString().split("T")[0]
            : "",
          gender: data.data.candidateProfile.gender || "",
          mobileNumber: {
            countryCode: data.data.candidateProfile.mobileNumber?.countryCode || "+91",
            number: data.data.candidateProfile.mobileNumber?.number || "",
          },
          address: {
            city: data.data.candidateProfile.address?.city || "",
          },
          skills: data.data.candidateProfile.skills || [],
          newSkill: "",
          newSkillProficiency: "Intermediate",
          languages: data.data.candidateProfile.languages || [],
          newLanguage: "",
          newLanguageProficiency: "Intermediate",
          experience: data.data.candidateProfile.experience || [],
          preferences: {
            preferredLocations: data.data.candidateProfile.preferredLocations || [],
            newLocation: "",
            preferredCategories: data.data.candidateProfile.preferredJobRoles || [],
            newCategory: "",
            preferredOpportunityTypes: data.data.candidateProfile.preferredOpportunityTypes || [],
          },
        });
        if (data.data.candidateProfile.experience?.length > 0) setShowExperience(true);
        if (data.data.candidateProfile.address?.city) setShowAddress(true);
        if (
          data.data.candidateProfile.preferredLocations?.length > 0 ||
          data.data.candidateProfile.preferredJobRoles?.length > 0 ||
          data.data.candidateProfile.preferredOpportunityTypes?.length > 0
        ) setShowPreferences(true);
      } else {
        setError("Invalid user or no candidate profile found.");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (profile.newSkill.trim()) {
      setProfile((prev) => ({
        ...prev,
        skills: [
          ...prev.skills,
          { name: prev.newSkill.trim(), proficiency: prev.newSkillProficiency },
        ],
        newSkill: "",
        newSkillProficiency: "Intermediate",
      }));
      setShowCustomSkill(false);
    }
  };

  const handleAddSuggestedSkill = (skill) => {
    setProfile((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        { name: skill, proficiency: "Intermediate" },
      ],
    }));
  };

  const handleRemoveSkill = (skillName) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.name !== skillName),
    }));
  };

  const handleAddLanguage = () => {
    if (profile.newLanguage.trim()) {
      setProfile((prev) => ({
        ...prev,
        languages: [
          ...prev.languages,
          { name: prev.newLanguage.trim(), proficiency: prev.newLanguageProficiency },
        ],
        newLanguage: "",
        newLanguageProficiency: "Intermediate",
      }));
      setShowCustomLanguage(false);
    }
  };

  const handleAddSuggestedLanguage = (language) => {
    setProfile((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        { name: language, proficiency: "Intermediate" },
      ],
    }));
  };

  const handleRemoveLanguage = (languageName) => {
    setProfile((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l.name !== languageName),
    }));
  };

  const handleAddLocation = () => {
    if (profile.preferences.newLocation.trim()) {
      setProfile((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          preferredLocations: [
            ...prev.preferences.preferredLocations,
            prev.preferences.newLocation.trim(),
          ],
          newLocation: "",
        },
      }));
      setShowCustomLocation(false);
    }
  };

  const handleAddSuggestedLocation = (location) => {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        preferredLocations: [
          ...prev.preferences.preferredLocations,
          location,
        ],
      },
    }));
  };

  const handleRemoveLocation = (location) => {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        preferredLocations: prev.preferences.preferredLocations.filter((l) => l !== location),
      },
    }));
  };

  const handleAddCategory = () => {
    if (profile.preferences.newCategory.trim()) {
      setProfile((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          preferredCategories: [
            ...prev.preferences.preferredCategories,
            prev.preferences.newCategory.trim(),
          ],
          newCategory: "",
        },
      }));
      setShowCustomCategory(false);
    }
  };

  const handleAddSuggestedCategory = (category) => {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        preferredCategories: [
          ...prev.preferences.preferredCategories,
          category,
        ],
      },
    }));
  };

  const handleRemoveCategory = (category) => {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        preferredCategories: prev.preferences.preferredCategories.filter((c) => c !== category),
      },
    }));
  };

  const handleAddSuggestedOpportunityType = (type) => {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        preferredOpportunityTypes: [
          ...prev.preferences.preferredOpportunityTypes,
          type,
        ],
      },
    }));
  };

  const handleRemoveOpportunityType = (type) => {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        preferredOpportunityTypes: prev.preferences.preferredOpportunityTypes.filter((t) => t !== type),
      },
    }));
  };

  const handleAddExperience = () => {
    setProfile((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", position: "", startDate: "", endDate: "", description: "", current: false },
      ],
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleRemoveExperience = (index) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleAddressChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleMobileNumberChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      mobileNumber: { ...prev.mobileNumber, [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile.firstName.trim()) {
      setError("First name is required.");
      return;
    }
    if (profile.skills.length === 0) {
      setError("Please add at least one skill.");
      return;
    }
    if (!userId) {
      setError("User ID is missing. Please log in again.");
      return;
    }
    if (!profile.dateOfBirth) {
      setError("Date of birth is required.");
      return;
    }
    if (!profile.gender) {
      setError("Gender is required.");
      return;
    }
    if (!profile.mobileNumber.number || !/^\d{7,15}$/.test(profile.mobileNumber.number)) {
      setError("Please enter a valid mobile number (7-15 digits).");
      return;
    }
    if (profile.mobileNumber.countryCode === "+91" && !/^\d{10}$/.test(profile.mobileNumber.number)) {
      setError("Indian mobile numbers must be 10 digits.");
      return;
    }

    try {
      setSubmitting(true);
      const validExperience = profile.experience.filter(
        (exp) => exp.company.trim() && exp.position.trim()
      );
      const payload = {
        userId,
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        jobStatus: profile.jobStatus,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        mobileNumber: profile.mobileNumber,
        address: profile.address,
        skills: profile.skills,
        languages: profile.languages,
        experience: validExperience,
        preferredJobRoles: profile.preferences.preferredCategories,
        preferredLocations: profile.preferences.preferredLocations,
        preferredOpportunityTypes: profile.preferences.preferredOpportunityTypes,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/candidate-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Profile saved!");
        router.push("/jobs");
      } else {
        setError(data.message || "Failed to save profile. Please ensure all fields are valid.");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Error saving profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-b from-${theme.backgroundGradientFrom} to-${theme.backgroundGradientTo} flex items-center justify-center`}>
        <div className="animate-pulse text-gray-600 flex flex-col items-center">
          <Utensils className={`w-12 h-12 text-${theme.textSecondary} mb-4`} />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-${theme.backgroundGradientFrom} to-${theme.backgroundGradientTo} py-8 px-4`}>
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className={`text-2xl font-semibold text-${theme.textPrimary} mb-2 flex items-center`}>
          <Utensils className={`mr-2 text-${theme.textSecondary}`} size={24} /> Complete Your RestoJobs Profile
        </h1>
        <p className={`text-${theme.textSecondary} mb-6 text-sm`}>Showcase your culinary and hospitality skills to top restaurants.</p>

        {error && (
          <div className={`mb-4 p-3 bg-${theme.errorBackground} text-${theme.errorText} rounded-md`}>{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className={`text-lg font-medium text-${theme.textPrimary} mb-4 flex items-center`}>
              <Calendar className={`mr-2 text-${theme.textSecondary}`} size={20} /> Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className={`px-3 py-2 border-b border-${theme.primaryBorder} focus:border-${theme.primary} outline-none text-sm text-gray-700 placeholder-${theme.textPlaceholder} bg-${theme.primaryLighter} rounded-md`}
                placeholder="First Name"
                required
              />
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className={`px-3 py-2 border-b border-${theme.primaryBorder} focus:border-${theme.primary} outline-none text-sm text-gray-700 placeholder-${theme.textPlaceholder} bg-${theme.primaryLighter} rounded-md`}
                placeholder="Last Name (Optional)"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex gap-2">
                <select
                  value={profile.mobileNumber.countryCode}
                  onChange={(e) => handleMobileNumberChange("countryCode", e.target.value)}
                  className={`px-3 py-2 border-b border-${theme.primaryBorder} focus:border-${theme.primary} outline-none text-sm text-gray-700 w-24 bg-${theme.primaryLighter} rounded-md appearance-none`}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={profile.mobileNumber.number}
                  onChange={(e) => handleMobileNumberChange("number", e.target.value)}
                  className={`flex-1 px-3 py-2 border-b border-${theme.primaryBorder} focus:border-${theme.primary} outline-none text-sm text-gray-700 placeholder-${theme.textPlaceholder} bg-${theme.primaryLighter} rounded-md`}
                  placeholder="Mobile Number"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm text-${theme.textPrimary} mb-1`}>Date of Birth</label>
                <input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                  className={`w-full px-3 py-2 border-b border-${theme.primaryBorder} focus:border-${theme.primary} outline-none text-sm text-gray-700 bg-${theme.primaryLighter} rounded-md`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm text-${theme.textPrimary} mb-2`}>Gender</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Male", "Female", "Other"].map((gen) => (
                    <div
                      key={gen}
                      onClick={() => setProfile({ ...profile, gender: gen })}
                      className={`p-3 border rounded-md cursor-pointer text-center text-sm ${profile.gender === gen ? `border-${theme.primary} bg-${theme.primaryLight} text-${theme.textPrimary}` : `border-${theme.primaryBorder} hover:border-${theme.primaryBorderHover} bg-${theme.primaryLighter}`}`}
                    >
                      {gen === "Male" ? (
                        <Mars className={`mx-auto mb-1 text-${theme.textSecondary}`} size={20} />
                      ) : gen === "Female" ? (
                        <Venus className={`mx-auto mb-1 text-${theme.textSecondary}`} size={20} />
                      ) : (
                        <Transgender className={`mx-auto mb-1 text-${theme.textSecondary}`} size={20} />
                      )}
                      {gen}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className={`block text-sm text-${theme.textPrimary} mb-2`}>Job Status</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Open to Opportunities", "Actively Looking", "Not Looking"].map((status) => (
                  <div
                    key={status}
                    onClick={() => setProfile({ ...profile, jobStatus: status })}
                    className={`p-3 border rounded-md cursor-pointer text-center text-sm ${profile.jobStatus === status ? `border-${theme.primary} bg-${theme.primaryLight} text-${theme.textPrimary}` : `border-${theme.primaryBorder} hover:border-${theme.primaryBorderHover} bg-${theme.primaryLighter}`}`}
                  >
                    {status === "Open to Opportunities" ? (
                      <Search className={`mx-auto mb-1 text-${theme.textSecondary}`} size={20} />
                    ) : status === "Actively Looking" ? (
                      <Binoculars className={`mx-auto mb-1 text-${theme.textSecondary}`} size={20} />
                    ) : (
                      <XCircle className={`mx-auto mb-1 text-${theme.textSecondary}`} size={20} />
                    )}
                    {status}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className={`block text-sm text-${theme.textPrimary} mb-1`}>Hometown / Current City (Optional)</label>
              <input
                type="text"
                value={profile.address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                className={`w-full px-3 py-2 border-b border-${theme.primaryBorder} focus:border-${theme.primary} outline-none text-sm text-gray-700 placeholder-${theme.textPlaceholder} bg-${theme.primaryLighter} rounded-md`}
                placeholder="Enter your city"
              />
            </div>
          </div>

          {/* Skills & Languages */}
          <div>
            <h3 className={`text-lg font-medium text-${theme.textPrimary} mb-4 flex items-center`}>
              <Star className={`mr-2 text-${theme.textSecondary}`} size={20} /> Skills & Languages
            </h3>
            <div className="mb-6">
              <label className={`block text-sm text-${theme.textPrimary} mb-2`}>Skills (at least one required)</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills.map((skill, index) => (
                  <div
                    key={index}
                    className={`flex items-center px-3 py-1 bg-${theme.primaryLight} text-${theme.textPrimary} rounded-full text-sm`}
                  >
                    {skill.name} ({skill.proficiency})
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill.name)}
                      className={`ml-2 text-${theme.textSecondary} hover:text-${theme.primaryHover}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              {showCustomSkill && (
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <input
                    type="text"
                    value={profile.newSkill}
                    onChange={(e) => setProfile({ ...profile, newSkill: e.target.value })}
                    className={`flex-grow px-3 py-2 border-b border-${theme.primaryBorder} focus:border-${theme.primary} outline-none text-sm text-gray-700 placeholder-${theme.textPlaceholder} bg-${theme.primaryLighter} rounded-md`}
                    placeholder="Add a skill (e.g., Pastry Making)"
                  />
                  <select
                    value={profile.newSkillProficiency}
                    onChange={(e) => setProfile({ ...profile, newSkillProficiency: e.target.value })}
                    className={`px-3 py-2 border-b border-${theme.primaryBorder} focus:border-${theme.primary} outline-none text-sm text-gray-700 sm:w-32 bg-${theme.primaryLighter} rounded-md appearance-none`}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Expert</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className={`px-4 py-2 bg-${theme.primary} text-white rounded-md hover:bg-${theme.primaryHover} text-sm`}
                  >
                    Add
                  </button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {commonSkills.filter((s) => !profile.skills.some((sk) => sk.name === s)).map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleAddSuggestedSkill(skill)}
                    className={`px-4 py-1 border border-${theme.primaryBorder} rounded-full text-${theme.textPrimary} hover:bg-${theme.primaryLighter} text-sm`}
                  >
                    {skill} +
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowCustomSkill(true)}
                  className={`px-4 py-1 border border-${theme.primaryBorderHover} rounded-full text-${theme.textSecondary} hover:bg-${theme.primaryLight} text-sm`}
                >
                  + Add more skills
                </button>
              </div>
            </div>
            <div>
              <label className={`block text-sm text-${theme.textPrimary} mb-2`}>Languages (Optional)</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.languages.map((language, index) => (
                  <div
                    key={index}
                    className={`flex items-center px-3 py-1 bg-${theme.primaryLight} text-${theme.textPrimary} rounded-full text-sm`}
                  >
                    {language.name} ({language.proficiency})
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(language.name)}
                      className={`ml-2 text-${theme.textSecondary} hover:text-${theme.primaryHover}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              {showCustomLanguage && (
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <input
                    type="text"
                    value={profile.newLanguage}
                    onChange={(e) => setProfile({ ...profile, newLanguage: e.target.value })}
                    className={`flex-grow px-3 py-2 border-b border-${theme.primaryBorder} focus:border-${theme.primary} outline-none text-sm text-gray-700 placeholder-${theme.textPlaceholder} bg-${theme.primaryLighter} rounded-md`}
                    placeholder="Add a language"
                  />
                  <select
                    value={profile.newLanguageProficiency}
                    onChange={(e) => setProfile({ ...profile, newLanguageProficiency: e.target.value })}
                    className={`px-3 py-2 border-b border-${theme.primaryBorder} focus:border-${theme.primary} outline-none text-sm text-gray-700 sm:w-32 bg-${theme.primaryLighter} rounded-md appearance-none`}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Fluent</option>
                    <option>Native</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddLanguage}
                    className={`px-4 py-2 bg-${theme.primary} text-white rounded-md hover:bg-${theme.primaryHover} text-sm`}
                  >
                    Add
                  </button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {commonLanguages.filter((l) => !profile.languages.some((lang) => lang.name === l)).map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => handleAddSuggestedLanguage(language)}
                    className={`px-4 py-1 border border-${theme.primaryBorder} rounded-full text-${theme.textPrimary} hover:bg-${theme.primaryLighter} text-sm`}
                  >
                    {language} +
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowCustomLanguage(true)}
                  className={`px-4 py-1 border border-${theme.primaryBorderHover} rounded-full text-${theme.textSecondary} hover:bg-${theme.primaryLight} text-sm`}
                >
                  + Add more languages
                </button>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div>
            <h3 className={`text-lg font-medium text-${theme.textPrimary} mb-4 flex items-center`}>
              <Briefcase className={`mr-2 text-${theme.textSecondary}`} size={20} /> Work Experience
            </h3>
            {profile.experience.map((exp, index) => (
              <div key={index} className={`p-4 bg-${theme.primaryLighter} rounded-md mb-4`}>
                <div className="flex justify-between items-center mb-3">
                  <h4 className={`text-sm font-medium text-${theme.textPrimary}`}>Experience #{index + 1}</h4>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm text-${theme.textPrimary} mb-1`}>Restaurant/Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                      className={`w-full px-3 py-2 border-b border-${theme.primaryBorder} focus:border-${theme.primary} outline-none text-sm text-gray-700 placeholder-${theme.textPlaceholder} bg-${theme.primaryLighter} rounded-md`}
                      placeholder="Restaurant or company name"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm text-${theme.textPrimary} mb-1`}>Position</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                      className={`w-full px-3 py-2 border-b border-${theme.primaryBorder} focus:border-${theme.primary} outline-none text-sm text-gray-700 placeholder-${theme.textPlaceholder} bg-${theme.primaryLighter} rounded-md`}
                      placeholder="Your position (e.g., Chef, Server)"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm text-${theme.textPrimary} mb-1`}>Start Date</label>
                    <input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                      className={`w-full px-3 py-2 border-b border-${theme.primaryBorder} focus:border-${theme.primary} outline-none text-sm text-gray-700 bg-${theme.primaryLighter} rounded-md`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm text-${theme.textPrimary} mb-1`}>End Date</label>
                    <input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                      className={`w-full px-3 py-2 border-b border-${theme.primaryBorder} focus:border-${theme.primary} outline-none text-sm text-gray-700 bg-${theme.primaryLighter} rounded-md`}
                      disabled={exp.current}
                    />
                    <div className="mt-2 flex items-center">
                      <input
                        type="checkbox"
                        id={`current-${index}`}
                        checked={exp.current}
                        onChange={(e) => handleExperienceChange(index, "current", e.target.checked)}
                        className={`h-4 w-4 text-${theme.primary} focus:ring-${theme.primary} border-${theme.primaryBorder} rounded`}
                      />
                      <label htmlFor={`current-${index}`} className={`ml-2 text-sm text-${theme.textPrimary}`}>
                        Current Job
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className={`block text-sm text-${theme.textPrimary} mb-1`}>Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border border-${theme.primaryBorder} rounded-md focus:ring-2 focus:ring-${theme.primary} text-sm text-gray-700 placeholder-${theme.textPlaceholder} bg-${theme.primaryLighter}`}
                    placeholder="Describe your responsibilities (e.g., Prepared gourmet dishes, Managed service team)"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddExperience}
              className={`w-full py-3 border border-dashed border-${theme.primaryBorder} rounded-md text-${theme.textSecondary} hover:border-${theme.primaryBorderHover} hover:text-${theme.textPrimary} text-sm bg-${theme.primaryLighter}`}
            >
              <Plus size={16} className="inline mr-1" /> Add Restaurant Experience
            </button>
          </div>

          {/* Preferences */}
          <div>
            <h3 className={`text-lg font-medium text-${theme.textPrimary} mb-4 flex items-center`}>
              <MapPin className={`mr-2 text-${theme.textSecondary}`} size={20} /> Job Preferences
            </h3>
            <div className="mb-6">
              <label className={`block text-sm text-${theme.textPrimary} mb-2`}>Preferred Locations</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.preferences.preferredLocations.map((location, index) => (
                  <div
                    key={index}
                    className={`flex items-center px-3 py-1 bg-${theme.primaryLight} text-${theme.textPrimary} rounded-full text-sm`}
                  >
                    <MapPin size={14} className="mr-1" />
                    {location}
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(location)}
                      className={`ml-2 text-${theme.textSecondary} hover:text-${theme.primaryHover}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              {showCustomLocation && (
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <input
                    type="text"
                    value={profile.preferences.newLocation}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        preferences: { ...prev.preferences, newLocation: e.target.value },
                      }))
                    }
                    className={`flex-grow px-3 py-2 border-b border-${theme.primaryBorder} focus:border-${theme.primary} outline-none text-sm text-gray-700 placeholder-${theme.textPlaceholder} bg-${theme.primaryLighter} rounded-md`}
                    placeholder="Add a city (e.g., Goa)"
                  />
                  <button
                    type="button"
                    onClick={handleAddLocation}
                    className={`px-4 py-2 bg-${theme.primary} text-white rounded-md hover:bg-${theme.primaryHover} text-sm`}
                  >
                    Add
                  </button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {commonLocations.filter((l) => !profile.preferences.preferredLocations.includes(l)).map((location) => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => handleAddSuggestedLocation(location)}
                    className={`px-4 py-1 border border-${theme.primaryBorder} rounded-full text-${theme.textPrimary} hover:bg-${theme.primaryLighter} text-sm`}
                  >
                    {location} +
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowCustomLocation(true)}
                  className={`px-4 py-1 border border-${theme.primaryBorderHover} rounded-full text-${theme.textSecondary} hover:bg-${theme.primaryLight} text-sm`}
                >
                  + Add more locations
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label className={`block text-sm text-${theme.textPrimary} mb-2`}>Preferred Job Roles</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.preferences.preferredCategories.map((category, index) => (
                  <div
                    key={index}
                    className={`flex items-center px-3 py-1 bg-${theme.primaryLight} text-${theme.textPrimary} rounded-full text-sm`}
                  >
                    {category}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(category)}
                      className={`ml-2 text-${theme.textSecondary} hover:text-${theme.primaryHover}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              {showCustomCategory && (
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <input
                    type="text"
                    value={profile.preferences.newCategory}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        preferences: { ...prev.preferences, newCategory: e.target.value },
                      }))
                    }
                    className={`flex-grow px-3 py-2 border-b border-${theme.primaryBorder} focus:border-${theme.primary} outline-none text-sm text-gray-700 placeholder-${theme.textPlaceholder} bg-${theme.primaryLighter} rounded-md`}
                    placeholder="Add a job role (e.g., Sous Chef)"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className={`px-4 py-2 bg-${theme.primary} text-white rounded-md hover:bg-${theme.primaryHover} text-sm`}
                  >
                    Add
                  </button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {commonCategories.filter((c) => !profile.preferences.preferredCategories.includes(c)).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleAddSuggestedCategory(category)}
                    className={`px-4 py-1 border border-${theme.primaryBorder} rounded-full text-${theme.textPrimary} hover:bg-${theme.primaryLighter} text-sm`}
                  >
                    {category} +
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowCustomCategory(true)}
                  className={`px-4 py-1 border border-${theme.primaryBorderHover} rounded-full text-${theme.textSecondary} hover:bg-${theme.primaryLight} text-sm`}
                >
                  + Add more job roles
                </button>
              </div>
            </div>
            <div>
              <label className={`block text-sm text-${theme.textPrimary} mb-2`}>Preferred Opportunity Types</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.preferences.preferredOpportunityTypes.map((type, index) => (
                  <div
                    key={index}
                    className={`flex items-center px-3 py-1 bg-${theme.primaryLight} text-${theme.textPrimary} rounded-full text-sm`}
                  >
                    {type}
                    <button
                      type="button"
                      onClick={() => handleRemoveOpportunityType(type)}
                      className={`ml-2 text-${theme.textSecondary} hover:text-${theme.primaryHover}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {commonOpportunityTypes.filter((t) => !profile.preferences.preferredOpportunityTypes.includes(t)).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleAddSuggestedOpportunityType(type)}
                    className={`px-4 py-1 border border-${theme.primaryBorder} rounded-full text-${theme.textPrimary} hover:bg-${theme.primaryLighter} text-sm`}
                  >
                    {type} +
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="gradient"
              disabled={submitting}
              className="text-sm flex items-center px-6 py-3"
            >
              {submitting ? (
                "Saving..."
              ) : (
                <>
                  Save Profile <Utensils size={16} className="ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}