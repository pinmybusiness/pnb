"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin, Calendar, Clock, DollarSign, Building, Briefcase, ArrowLeft,
  FileText, CheckCircle, Languages, UserCheck, Gift, Utensils, Home, Users,
  X, Eye
} from "lucide-react";
import Link from "next/link";
import { formatDateWithSuffix } from "@/utils/dateFormat";
import {
  getCategoryText,
  getDayName,
  getDurationText,
  getInternshipTypeText,
  getShiftText,
  getStipendText,
  getOpportunityTypeText,
  getPaymentTypeText,
  getBenefitsText,
  getLanguageText
} from "@/utils/opportunity";
import { benefits, languages } from "@/data/opportunityData";
import ApplicationModal from "@/components/opportunity/ApplicationModal";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

export default function OpportunityDetailContent({
  initialOpportunity,
  initialAppliedOpportunities,
  isAuthenticated: initialIsAuthenticated,
  hasProfile,
}) {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  const [opportunity, setOpportunity] = useState(initialOpportunity);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appliedOpportunities, setAppliedOpportunities] = useState(new Set(initialAppliedOpportunities || []));
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const { user, token } = useSelector((state) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);

  // Sync authentication state with Redux after hydration
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    console.log("Redux auth state:", { user, token });
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
        router.push("/login");
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

  const handleApply = () => {
    if (!isAuthenticated && !token) {
      toast.error("Please login to apply for this opportunity");
      router.push("/login");
      return;
    }
    if (user?.role !== 10) {
      toast.error("Only candidates can apply for opportunities");
      return;
    }
    setShowApplicationModal(true);
  };

  const submitApplication = async () => {
    try {
      if (!token) {
        toast.error("Please login to apply");
        router.push("/login");
        return;
      }
      if (!opportunity?._id) {
        console.error("Error: opportunity._id is undefined", { opportunity });
        toast.error("Error: Opportunity ID is missing. Please try again.");
        return;
      }

      const applicationData = {
        opportunityId: opportunity._id,
        coverLetter: coverLetter || "",
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
        router.push("/login");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setAppliedOpportunities((prev) => new Set([...prev, opportunity._id]));
        setShowApplicationModal(false);
        toast.success(`Application submitted for ${opportunity.title}!`);
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Application error:", error);
      toast.error("Error submitting application. Please try again.");
    }
  };

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Opportunity Not Found</h2>
          <p className="text-gray-600 mb-6">The opportunity you are looking for does not exist.</p>
          <Link
            href="/jobs"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Opportunities
          </Link>
        </div>
      </div>
    );
  }

  // Backward compatibility for old boolean fields
  const displayBenefits = opportunity.stipend?.benefits || (
    [
      opportunity.stipend?.includesTips && 0,
      opportunity.stipend?.includesFood && 1,
      opportunity.stipend?.includesAccommodation && 2
    ].filter(Boolean)
  );

  return (
    <div className="min-h-screen bg-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Link
          href="/jobs"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Opportunities
        </Link>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="!text-xl font-bold text-gray-900 mb-2">{opportunity.title}</h1>
                <p className="text-gray-700 flex items-center">
                  <Building className="h-4 w-4 mr-2 text-orange-500" />
                  {opportunity?.branch?.parentRestaurant?.name}
                </p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center border border-orange-100">
                  <Building className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-base font-bold flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {opportunity.numberOfPeople} Open Positions
              </span>
            </div>
            <p className="text-gray-600 flex items-start md:max-w-[80%]">
              <MapPin className="h-4 w-4 md:h-4 md:w-4 mr-1 mt-1.5 text-red-500 flex-shrink-0" />
              <span className="leading-relaxed">{opportunity.branch?.location?.address}</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
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
                {getStipendText(opportunity.stipend)}
              </span>
            </div>
            <div className="flex items-center gap-4 flex-wrap mt-4">
              {appliedOpportunities.has(opportunity._id) ? (
                <div className="inline-flex items-center px-6 py-3 rounded-lg bg-green-50 border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-semibold text-green-700">Already Applied</span>
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 shadow-md transition"
                >
                  {isAuthenticated || token ? "Apply Now" : "Login to Apply"}
                </button>
              )}
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-orange-600" />
              Schedule
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
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <UserCheck className="h-5 w-5 mr-2 text-green-600" />
              Benefits
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {opportunity.stipend?.paymentType !== undefined && (
                <li className="flex justify-between">
                  <span>Payment Frequency:</span>
                  <span className="font-medium">{getPaymentTypeText(opportunity.stipend.paymentType)}</span>
                </li>
              )}
              {displayBenefits.length > 0 ? (
                displayBenefits.map((benefit, index) => {
                  const benefitData = benefits.find((b) => b.backendValue === benefit);
                  const Icon = benefitData?.icon || Gift;
                  return (
                    <li key={index} className="flex items-center text-green-600">
                      <Icon className="h-4 w-4 mr-2" />
                      <span>{benefitData?.label || "Unknown Benefit"}</span>
                    </li>
                  );
                })
              ) : (
                <li className="text-gray-500">No additional benefits</li>
              )}
            </ul>
          </div>
        </div>
        {opportunity.languages && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Languages className="h-5 w-5 mr-2 text-orange-600" />
              Language Requirements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {opportunity.languages.required?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-gray-700">Required Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.languages.required.map((lang, index) => (
                      <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                        {getLanguageText(lang, languages)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {opportunity.languages.preferred?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-gray-700">Preferred Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.languages.preferred.map((lang, index) => (
                      <span key={index} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full">
                        {getLanguageText(lang, languages)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-orange-600" />
            Job Description
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {opportunity.description || "No description provided."}
          </p>
        </div>
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
      {showApplicationModal && (
        <ApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          opportunity={opportunity}
          coverLetter={coverLetter}
          setCoverLetter={setCoverLetter}
          onSubmit={submitApplication}
        />
      )}
    </div>
  );
}