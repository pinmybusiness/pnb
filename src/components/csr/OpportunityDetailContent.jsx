"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin, Calendar, Clock, Building, Briefcase, ArrowLeft,
  FileText, CheckCircle, Languages, UserCheck, Gift, Users, Eye,
  Phone, User, Lock, Search,
  IndianRupee
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
import JobCard from "../opportunity/JobCard";
import CtaButton from "../CtaButton";

export default function OpportunityDetailContent({
  initialOpportunity,
  initialAppliedOpportunities,
  isAuthenticated: initialIsAuthenticated,
  hasProfile,
  cities,
}) {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { slug } = params;
  const [opportunity, setOpportunity] = useState(initialOpportunity);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appliedOpportunities, setAppliedOpportunities] = useState(new Set(initialAppliedOpportunities || []));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);
  const [hyderabadJobs, setHyderabadJobs] = useState([]);
  const [hyderabadJobsLoading, setHyderabadJobsLoading] = useState(false);

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
      icon: <User className="w-5 h-5 text-gray-400 mr-2" />,
      validate: (value) => (!value.trim() ? "Full name is required" : ""),
    },
    {
      name: "mobile",
      label: "Mobile Number",
      type: "tel",
      placeholder: "9876543210",
      icon: <Phone className="w-5 h-5 text-gray-400 mr-2" />,
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
      icon: <Lock className="w-5 h-5 text-gray-400 mr-2" />,
      validate: (value) => (value.length < 8 ? "Password must be at least 8 characters long" : ""),
    },
    {
      name: "location",
      label: "City",
      type: "select",
      icon: <MapPin className="w-5 h-5 text-gray-400 mr-2" />,
      options: cities.map((city) => ({
        value: city._id,
        label: `${city.name}, ${city.stateName}`,
        _id: city._id,
      })),
      validate: (value) => (!value ? "Please select a city" : ""),
    },
  ];

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

  useEffect(() => {
    fetchHyderabadJobs();
  }, []);

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
        setIsAuthModalOpen(true);
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

  const fetchHyderabadJobs = async () => {
    try {
      setHyderabadJobsLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public?limit=4&search=Hyderabad`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setHyderabadJobs(data.data);
      } else {
        console.error("Failed to fetch Hyderabad jobs:", data.message);
        toast.error(data.message || "Failed to fetch Hyderabad jobs");
      }
    } catch (error) {
      console.error("Error fetching Hyderabad jobs:", error);
      toast.error("Error fetching Hyderabad jobs. Please try again.");
    } finally {
      setHyderabadJobsLoading(false);
    }
  };

  const submitApplication = async () => {
    try {
      if (!token) {
        router.refresh();
        return;
      }
      if (!opportunity?._id) {
        console.error("Error: opportunity._id is undefined", { opportunity });
        toast.error("Error: Opportunity ID is missing. Please try again.");
        return;
      }

      const applicationData = {
        opportunityId: opportunity._id,
        coverLetter: "",
      };
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
        setIsAuthModalOpen(true);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setAppliedOpportunities((prev) => new Set([...prev, opportunity._id]));
        toast.success(`Application submitted for ${opportunity.title}!`);
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
      setIsAuthModalOpen(true);
      return;
    }
    if (user?.role !== 10) {
      toast.error("Only candidates can apply for opportunities");
      return;
    }

    await submitApplication();
  };

  const handleAuthSuccess = async () => {
    setIsAuthModalOpen(false);
    setIsAuthenticated(true);
    await submitApplication();
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
      handleAuthSuccess();
    } catch (error) {
      console.error("Candidate registration error:", error);
      throw new Error(error || "Candidate registration failed. Please try again.");
    }
  };

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
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-semibold text-gray-900">Opportunity Not Found</h2>
          <p className="text-gray-500">The opportunity you are looking for does not exist.</p>
          <Link href="/jobs" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Opportunities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      {/* Back Button and Title */}
      {/* <div className="flex justify-center py-6">
        <h1 className="text-center">
          {opportunity.title} - {getOpportunityTypeText(opportunity.opportunityType)}
        </h1>
      </div> */}
      <div className="p-6 bg-white/90 max-w-4xl border border-[#EEEEEE] mx-auto space-y-6">
        {/* Opportunity Header */}
        <div className="pb-6 border-b border-gray-200">
          <div className="space-y-6">
            {/* Title + Positions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <span className="text-lg md:text-xl font-semibold text-gray-900">{opportunity.title}</span>
                <Link
                  href={`/restaurant/${opportunity.branch.location?.city?.name.toLowerCase().replace(/\s+/g, "-")}/${opportunity.branch.slug}`}
                  className="block text-sm md:text-md text-gray-500 hover:text-orange-600 font-semibold transition-colors"
                >
                  {opportunity?.branch?.parentRestaurant?.name}
                </Link>
              </div>
              <span className="flex items-center text-sm font-medium text-gray-700">
                <Users className="h-4 w-4 mr-2 " />
                {opportunity.numberOfPeople} Positions
              </span>
            </div>

            <div className="space-y-4">
              {/* Restaurant Info */}
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {opportunity.branch?.name},{"\u00A0"}
                {opportunity.branch?.location?.city?.name ? (
                  <Link
                    href={`/jobs/${opportunity.branch.location.city.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="hover:text-primary"
                  >
                    {opportunity.branch.location.city.name}
                  </Link>
                ) : (
                  "unknown"
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <span className=" text-gray-700 rounded-full text-sm font-medium flex items-center">
                <IndianRupee className="h-4 w-4 mr-1" />
                {getStipendText(opportunity.compensation) || "Not disclosed"}
              </span>
                {opportunity.internshipType !== undefined && (
                  <span className="px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    {getInternshipTypeText(opportunity.internshipType)}
                  </span>
                )}
              </div>

              {/* Stats Section */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{opportunity.applications?.length || 0} Applicants</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  <span>{opportunity.views || 0} Views</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {appliedOpportunities.has(opportunity._id) ? (
                <>
                  <a
                    href={`tel:${opportunity?.branch?.helplineNumber}`}
                    className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    {opportunity?.branch?.helplineNumber}
                  </a>
                  <div className="inline-flex items-center px-6 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-700">Already Applied</span>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Please click the call button below to apply directly.
                  </p>
                  <button
                    onClick={handleApply}
                    className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    {opportunity?.branch?.helplineNumber
                      ? opportunity?.branch?.helplineNumber.slice(0, -3) + 'XXX'
                      : ''}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details and Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(opportunity && (displayBenefits.length > 0)) && (
            <div className="pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-gray-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
                <UserCheck className="h-5 w-5 mr-2 text-green-500" />
                Benefits
              </h3>
              <ul className="space-y-2 text-gray-700">
                {displayBenefits.map((benefit, index) => {
                  const benefitData = benefits.find((b) => b.backendValue === benefit);
                  const Icon = benefitData?.icon || Gift;
                  return (
                    <li key={index} className="flex items-center text-sm text-green-600">
                      <Icon className="h-5 w-5 mr-2" />
                      <span>{benefitData?.label || "Unknown Benefit"}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
              <Calendar className="h-5 w-5 mr-2 text-orange-500" />
              Other Details
            </h3>
            <ul className="space-y-2 text-gray-700">
              {opportunity.schedule?.startDate && (
                <li className="flex justify-between text-sm">
                  <span>Start Date:</span>
                  <span className="font-medium">{formatDateWithSuffix(opportunity.schedule.startDate)}</span>
                </li>
              )}
              {opportunity.schedule?.endDate && (
                <li className="flex justify-between text-sm">
                  <span>End Date:</span>
                  <span className="font-medium">{formatDateWithSuffix(opportunity.schedule.endDate)}</span>
                </li>
              )}
              {opportunity.schedule?.days?.length > 0 && (
                <li>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Working Days:</span>
                    <span className="font-medium">{opportunity.schedule.days.length} days/week</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.schedule.days.map((day, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium capitalize"
                      >
                        {getDayName(day)}
                      </span>
                    ))}
                  </div>
                </li>
              )}
              {opportunity.schedule?.shift !== undefined && (
                <li className="flex justify-between text-sm">
                  <span>Shift:</span>
                  <span className="font-medium">{getShiftText(opportunity.schedule.shift)}</span>
                </li>
              )}
              {opportunity.schedule?.hoursPerDay && (
                <li className="flex justify-between text-sm">
                  <span>Hours Per Day:</span>
                  <span className="font-medium">{opportunity.schedule.hoursPerDay} hours</span>
                </li>
              )}
              {opportunity.duration && (
                <li className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">{getDurationText(opportunity)}</span>
                </li>
              )}
              {opportunity.languages?.required?.length > 0 && (
                <li className="flex justify-between text-sm">
                  <span>Required Languages:</span>
                  <span className="text-gray-700">
                    {opportunity.languages.required.map(lang => getLanguageText(lang, languages)).join("/ ")}
                  </span>
                </li>
              )}
              {opportunity.languages?.preferred?.length > 0 && (
                <li className="flex justify-between text-sm">
                  <span>Preferred Languages:</span>
                  <span className="text-gray-700">
                    {opportunity.languages.preferred.map(lang => getLanguageText(lang, languages)).join(" / ")}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Job Description */}
        {opportunity?.description && (
          <div className="border-b py-6 border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
              <FileText className="h-5 w-5 mr-2 text-orange-500" />
              Job Description
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {opportunity.description || "No description provided."}
            </p>
          </div>
        )}

        {/* Requirements */}
        {opportunity.requirements?.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Requirements</h3>
            <ul className="space-y-2 text-gray-700">
              {opportunity.requirements.map((req, index) => (
                <li key={index} className="flex items-start text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
        {/* Hyderabad Latest Jobs Section */}
        <div className="mt-5 rounded-lg py-6 max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
            <Briefcase className="h-5 w-5 mr-2 text-orange-500" />
            Hyderabad Latest Jobs
          </h2>
          {hyderabadJobsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4 h-40"></div>
              ))}
            </div>
          ) : hyderabadJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {hyderabadJobs.map((job) => (
                <JobCard
                  key={job._id}
                  opportunity={job}
                  appliedOpportunities={appliedOpportunities}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p>No jobs found in Hyderabad at the moment.</p>
            </div>
          )}
          {hyderabadJobs.length > 0 && (
            <div className="mt-6 text-center">
              <CtaButton href="/jobs/hyderabad" text="View More Hyderabad Jobs" size="md" />
            </div>
          )}
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
      )}
    </div>
  );
}