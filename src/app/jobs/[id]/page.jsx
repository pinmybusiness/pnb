"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin, Calendar, Clock, DollarSign, Building, Briefcase, ArrowLeft,
  FileText, CheckCircle, Languages, UserCheck, Gift, Utensils, Home, Users,
  X, Eye
} from "lucide-react";
import Header from "@/components/Header";
import Link from "next/link";
import { formatDateWithSuffix } from "@/utils/dateFormat";
import { getCategoryText, getDayName, getDurationText, getInternshipTypeText, getShiftText, getStipendText } from "@/utils/opportunity";
import ApplicationModal from "@/components/opportunity/ApplicationModal";

export default function PublicOpportunityDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [appliedOpportunities, setAppliedOpportunities] = useState(new Set());
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  console.log("oper", opportunity?._id);

  useEffect(() => {
    checkAuth();
    if (id) fetchOpportunity();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppliedOpportunities();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    if (token) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success && data.data.role === 10) {
          setHasProfile(!!data.data.candidateProfile);
        }
      } catch (err) {
        console.error("Error checking profile:", err);
      }
    }
  };

  const fetchOpportunity = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public/${id}`);
      if (!response.ok) throw new Error("Opportunity not found");
      const data = await response.json();
      if (data.success) {
        console.log("Fetched opportunity:", data.data); // Log for debugging
        setOpportunity(data.data);
      } else {
        setError(data.message || "Failed to fetch opportunity");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedOpportunities = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const appliedIds = data.data.map((app) => app.opportunity._id);
          setAppliedOpportunities(new Set(appliedIds));
        }
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      alert("Please login to apply for this opportunity");
      router.push("/login");
      return;
    }
    if (!hasProfile) {
      alert("Please complete your candidate profile before applying");
      router.push("/candidate-profile");
      return;
    }
    setShowApplicationModal(true);
  };

  const submitApplication = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to apply");
        router.push("/login");
        return;
      }
      if (!opportunity?._id) {
        console.error("Error: opportunity._id is undefined");
        alert("Error: Opportunity ID is missing. Please try again.");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          opportunityId: opportunity._id,
          coverLetter,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        alert("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setAppliedOpportunities((prev) => new Set([...prev, opportunity._id]));
        setShowApplicationModal(false);
        alert(`Application submitted for ${opportunity.title}!`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Application error:", error);
      alert("Error submitting application. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Opportunity Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The opportunity you are looking for does not exist."}</p>
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

  return (
    <div className="min-h-screen bg-orange-50">
      <Header activeLink="/jobs" />
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
                <h1 className="text-lg font-bold text-gray-900 mb-2">{opportunity.title}</h1>
                <p className="text-gray-700 flex items-center">
                  <Building className="h-4 w-4 mr-2 text-orange-500" />
                  {opportunity.branch?.name}
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
              {/* <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-base font-bold flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {opportunity.views || 0} Views
              </span> */}
            </div>
              <p className="text-gray-600 flex items-start md:max-w-[80%]">
                <MapPin className="h-4 w-4 md:h-4 md:w-4 mr-1 mt-1.5 text-red-500 flex-shrink-0" />
                <span className="leading-relaxed">{opportunity.branch?.location?.address}</span>
              </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {opportunity.opportunityType && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  {opportunity.opportunityType === "internship" ? "Internship" : "Job"}
                </span>
              )}
              {/* {opportunity.category && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                  {getCategoryText(opportunity.category)}
                </span>
              )} */}
              {opportunity.internshipType && (
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
              {!appliedOpportunities.has(opportunity._id) ? (
                <button
                  onClick={handleApply}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 shadow-md transition"
                >
                  {isAuthenticated ? "Apply Now" : "Login to Apply"}
                </button>
              ) : (
                <div className="inline-flex items-center px-6 py-3 rounded-lg bg-green-50 border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-semibold text-green-700">Already Applied</span>
                </div>
              )}
              <div className="flex items-center text-gray-600 text-sm">
                <Users className="h-4 w-4 mr-1 text-orange-600" />
                <span>{opportunity.applications.length || 0} Applicants</span>
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
              <li className="flex justify-between">
                <span>Start Date:</span>
                <span className="font-medium">{formatDateWithSuffix(opportunity.schedule?.startDate)}</span>
              </li>
              {opportunity.schedule?.endDate && (
                <li className="flex justify-between">
                  <span>End Date:</span>
                  <span className="font-medium">{formatDateWithSuffix(opportunity.schedule.endDate)}</span>
                </li>
              )}
              {opportunity.schedule?.days && opportunity.schedule.days.length > 0 && (
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
              {opportunity.schedule?.shift && (
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
                  <span className="font-medium">{opportunity.duration} {opportunity.durationUnit}</span>
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
              {opportunity.stipend?.paymentType && (
                <li className="flex justify-between">
                  <span>Payment Frequency:</span>
                  <span className="font-medium capitalize">{opportunity.stipend.paymentType.replace(/_/g, " ")}</span>
                </li>
              )}
              {opportunity.stipend?.includesFood && (
                <li className="flex items-center text-green-600">
                  <Utensils className="h-4 w-4 mr-2" />
                  <span>Food Provided</span>
                </li>
              )}
              {opportunity.stipend?.includesAccommodation && (
                <li className="flex items-center text-green-600">
                  <Home className="h-4 w-4 mr-2" />
                  <span>Accommodation Provided</span>
                </li>
              )}
              {opportunity.stipend?.includesTips && (
                <li className="flex items-center text-green-600">
                  <Gift className="h-4 w-4 mr-2" />
                  <span>Tips Included</span>
                </li>
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
                        {lang}
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
                        {lang}
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
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{opportunity.description}</p>
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