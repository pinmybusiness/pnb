// components/csr/OpportunityDetailContent.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin, Calendar, Clock, Building, Briefcase, ArrowLeft,
  FileText, CheckCircle, Languages, UserCheck, Gift, Users, Eye,
  Phone, User, Lock
} from "lucide-react";
import Link from "next/link";
import { formatDateWithSuffix } from "@/utils/dateFormat";
import {
  getDayName,
  getDurationText,
  getInternshipTypeText,
  getShiftText,
  getStipendText,
  getOpportunityTypeText,
  getPaymentTypeText,
  getLanguageText
} from "@/utils/opportunity";
import { benefits, languages } from "@/data/opportunityData";
import AuthModal from "@/components/auth/AuthModal";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { registerCandidate } from "@/store/authThunks";

export default function OpportunityDetailContent({
  initialOpportunity,
  initialAppliedOpportunities,
  isAuthenticated: initialIsAuthenticated,
  hasProfile,
  cities, // Received from server
}) {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { slug } = params;
  const [opportunity, setOpportunity] = useState(initialOpportunity);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appliedOpportunities, setAppliedOpportunities] = useState(new Set(initialAppliedOpportunities || []));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // State for modal
  const { user, token } = useSelector((state) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);

  // Define formFields and initialFormData here in client component
  const hyderabad = cities.find((city) => city.name === "Hyderabad" && city.stateName === "Telangana");
  const initialFormData = {
    name: "",
    mobile: "",
    password: "",
    location: hyderabad
      ? {
          value: hyderabad._id,
          label: `${hyderabad.name}, ${hyderabad.stateName}`,
          _id: hyderabad._id,
        }
      : null,
  };

  const formFields = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your name",
      icon: <User className="w-5 h-5 text-gray-500 mr-2" />,
      validate: (value) => (!value.trim() ? "Full name is required" : ""),
    },
    {
      name: "mobile",
      label: "Mobile Number",
      type: "tel",
      placeholder: "9876543210",
      icon: <Phone className="w-5 h-5 text-gray-500 mr-2" />,
      prefix: "+91",
      maxLength: 10,
      validate: (value) =>
        !value.match(/^[6-9]\d{9}$/) ? "Please enter a valid 10-digit Indian mobile number starting with 6-9" : "",
      transform: (value) => value.replace(/\D/g, "").slice(0, 10),
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
      icon: <Lock className="w-5 h-5 text-gray-500 mr-2" />,
      validate: (value) => (value.length < 8 ? "Password must be at least 8 characters long" : ""),
    },
    {
      name: "location",
      label: "City",
      type: "select",
      icon: <MapPin className="w-5 h-5 text-gray-500 mr-2" />,
      options: cities.map((city) => ({
        value: city._id,
        label: `${city.name}, ${city.stateName}`,
        _id: city._id,
      })),
      validate: (value) => (!value ? "Please select a city" : ""),
    },
  ];

  // Sync authentication state with Redux after hydration
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user, token]);

  useEffect(() => {
    if (isAuthenticated && !initialAppliedOpportunities.length) {
      fetchAppliedOpportunities();
    }
  }, [isAuthenticated, initialAppliedOpportunities]);

  const fetchAppliedOpportunities = async () => {
    try {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        toast.error("Session expired. Please login again.");
        setIsAuthModalOpen(true); // Open modal instead of redirecting
        return;
      }
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const appliedIds = data.data.map((app) => app.opportunity._id);
          setAppliedOpportunities(new Set(appliedIds));
        }
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Error fetching applications. Please try again.");
    }
  };

  const submitApplication = async () => {
    try {
      if (!token) {
        // setIsAuthModalOpen(true); 
        router.refresh();
        // toast.error("Please login to apply");
        return;
      }
      if (!opportunity?._id) {
        console.error("Error: opportunity._id is undefined", { opportunity });
        toast.error("Error: Opportunity ID is missing. Please try again.");
        return;
      }

      const applicationData = {
        opportunityId: opportunity._id,
        coverLetter: "", // Cover letter is empty as per original logic
      };
      console.log("Submitting application with data:", applicationData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        toast.error("Session expired. Please login again.");
        setIsAuthModalOpen(true); // Open modal instead of redirecting
        return;
      }

      const data = await response.json();
      if (data.success) {
        setAppliedOpportunities((prev) => new Set([...prev, opportunity._id]));
        toast.success(`Application submitted for ${opportunity.title}!`);
        // Trigger helpline call after successful application
        const helplineNumber = opportunity?.branch?.helplineNumber;
        if (helplineNumber) {
          window.location.href = `tel:${helplineNumber}`;
        }
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Application error:", error);
      toast.error("Error submitting application. Please try again.");
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated && !token) {
      toast.error("Please login to apply for this opportunity");
      setIsAuthModalOpen(true); // Open modal instead of redirecting
      return;
    }
    if (user?.role !== 10) {
      toast.error("Only candidates can apply for opportunities");
      return;
    }

    // Directly submit application
    await submitApplication();
  };

  const handleAuthSuccess = async () => {
    setIsAuthModalOpen(false); // Close modal after successful login/register
    setIsAuthenticated(true); // Update authentication state
    await submitApplication(); // Proceed with application submission
  };

  const handleRegisterSubmit = async (formData, dispatch, router) => {
    try {
      await dispatch(
        registerCandidate({
          name: formData.name,
          mobile: formData.mobile,
          password: formData.password,
          location: formData.location?._id,
        })
      ).unwrap();
      toast.success("Registration successful!");
      handleAuthSuccess(); // Trigger application submission after registration
    } catch (error) {
      console.error("Candidate registration error:", error);
      throw new Error(error || "Candidate registration failed. Please try again.");
    }
  };

  // Backward compatibility for old boolean fields
  const displayBenefits = opportunity?.compensation?.benefits || (
    [
      opportunity.compensation?.includesTips && 0,
      opportunity.compensation?.includesFood && 1,
      opportunity.compensation?.includesAccommodation && 2
    ].filter(Boolean)
  );

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Opportunity Not Found</h2>
          <p className="text-gray-600 mb-6">The opportunity you are looking for does not exist.</p>
          <Link href="/jobs" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Opportunities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/jobs" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Opportunities
        </Link>

        {/* Opportunity Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="!text-2xl font-bold text-gray-900 mb-2">{opportunity.title}</h1>
                <Link href={`/restaurant/${opportunity.branch.location?.city?.name.toLowerCase().replace(/\s+/g, "-")}/${opportunity.branch.slug}`}>
                  <h2 className="!text-lg text-gray-700 flex items-center">
                    <Building className="h-4 w-4 mr-2 text-orange-500" />
                    {opportunity?.branch?.parentRestaurant?.name}
                  </h2>
                </Link>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-base font-bold flex items-center self-start">
                <Users className="w-4 h-4 mr-1" />
                {opportunity.numberOfPeople} Open Positions
              </span>
            </div>

            <p className="text-gray-600 flex items-start">
              <MapPin className="h-4 w-4 mr-1 mt-1 text-red-500 flex-shrink-0" />
              <span className="leading-relaxed">{opportunity.branch?.name}, {opportunity.branch?.location?.city?.name}</span>
            </p>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {opportunity.opportunityType !== undefined && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {getOpportunityTypeText(opportunity.opportunityType)}
                  </span>
                )}
                {opportunity.internshipType !== undefined && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {getInternshipTypeText(opportunity.internshipType)}
                  </span>
                )}
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center">
                  {getStipendText(opportunity.compensation)}
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-gray-600 text-sm">
                  <Users className="h-4 w-4 mr-1 text-orange-600" />
                  <span>{opportunity.applications?.length || 0} Applicants</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Eye className="h-4 w-4 mr-1 text-orange-600" />
                  <span>{opportunity.views || 0} Views</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {appliedOpportunities.has(opportunity._id) ? (
                <>
                  <div className="inline-flex items-center px-5 py-2 rounded-lg bg-green-50 border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-semibold text-green-700">Already Applied</span>
                  </div>
                  <a
                    href={`tel:${opportunity?.branch?.helplineNumber}`}
                    className="inline-flex items-center px-6 py-2 bg-[#007A0C] text-white rounded-lg font-semibold hover:bg-green-800 transition"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    {opportunity?.branch?.helplineNumber}
                  </a>
                </>
              ) : (
               <>
               <p className="w-full text-sm text-gray-600 mb-0">
                  Please click the call button below to apply directly.
                </p>
                <button
                  onClick={handleApply}
                  className="inline-flex items-center px-6 py-2 bg-[#007A0C] text-white rounded-lg font-semibold hover:bg-green-800 transition"
                >
                  <Phone className="h-5 w-5 mr-2" /> 
            {opportunity?.branch?.helplineNumber
          ? opportunity?.branch?.helplineNumber.slice(0, -3) + 'XXX'
          : ''}
                  {/* Apply Now */}
                </button>
               </>
              )}
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={handleAuthSuccess}
            formFields={formFields}
            onRegisterSubmit={handleRegisterSubmit}
            cities={cities}
            initialFormData={initialFormData}
          />
        )
        }

        {/* Details and Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(opportunity && (displayBenefits.length > 0 || opportunity.compensation?.paymentType !== undefined)) && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-green-600" />
                Benefits
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {opportunity.compensation?.paymentType !== undefined && (
                  <li className="flex justify-between">
                    <span>Payment Frequency:</span>
                    <span className="font-medium">{getPaymentTypeText(opportunity.compensation.paymentType)}</span>
                  </li>
                )}
                {displayBenefits.map((benefit, index) => {
                  const benefitData = benefits.find((b) => b.backendValue === benefit);
                  const Icon = benefitData?.icon || Gift;
                  return (
                    <li key={index} className="flex items-center text-green-600">
                      <Icon className="h-4 w-4 mr-2" />
                      <span>{benefitData?.label || "Unknown Benefit"}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-orange-600" />
              Other Details
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {opportunity.schedule?.startDate && (
                <li className="flex justify-between">
                  <span>Start Date:</span>
                  <span className="font-medium">{formatDateWithSuffix(opportunity.schedule.startDate)}</span>
                </li>
              )}
              {opportunity.schedule?.endDate && (
                <li className="flex justify-between">
                  <span>End Date:</span>
                  <span className="font-medium">{formatDateWithSuffix(opportunity.schedule.endDate)}</span>
                </li>
              )}
              {opportunity.schedule?.days?.length > 0 && (
                <li>
                  <div className="flex justify-between mb-1">
                    <span>Working Days:</span>
                    <span className="font-medium">{opportunity.schedule.days.length} days/week</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {opportunity.schedule.days.map((day, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium capitalize"
                      >
                        {getDayName(day)}
                      </span>
                    ))}
                  </div>
                </li>
              )}
              {opportunity.schedule?.shift !== undefined && (
                <li className="flex justify-between">
                  <span>Shift:</span>
                  <span className="font-medium">{getShiftText(opportunity.schedule.shift)}</span>
                </li>
              )}
              {opportunity.schedule?.hoursPerDay && (
                <li className="flex justify-between">
                  <span>Hours Per Day:</span>
                  <span className="font-medium">{opportunity.schedule.hoursPerDay} hours</span>
                </li>
              )}
              {opportunity.duration && (
                <li className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{getDurationText(opportunity)}</span>
                </li>
              )}
              {opportunity.languages?.required?.length > 0 && (
                <li className="flex justify-between">
                  <span>Required Languages:</span>
                  <span className="flex gap-2">
                    {opportunity.languages.required.map((lang, index) => (
                      <span key={index} className="px-2 py-1 text-[12px] bg-orange-100 text-orange-700 rounded-full">
                        {getLanguageText(lang, languages)}
                      </span>
                    ))}
                  </span>
                </li>
              )}
              {opportunity.languages?.preferred?.length > 0 && (
                <li className="flex justify-between">
                  <span>Preferred Languages:</span>
                  <span className="flex gap-2">
                    {opportunity.languages.preferred.map((lang, index) => (
                      <span key={index} className="px-2 py-1 text-[12px] bg-orange-100 text-orange-700 rounded-full">
                        {getLanguageText(lang, languages)}
                      </span>
                    ))}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Job Description */}
        {opportunity?.description && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-orange-600" />
              Job Description
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {opportunity.description || "No description provided."}
            </p>
          </div>
        )}

        {/* Requirements */}
        {opportunity.requirements?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <h3 className="text-lg font-semibold mb-4 text-orange-700">Requirements</h3>
            <ul className="space-y-2 text-sm">
              {opportunity.requirements.map((req, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}