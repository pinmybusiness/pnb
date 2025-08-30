"use client";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Clock, Building, Users, CheckCircle, ExternalLink, Briefcase } from "lucide-react";
import { formatDateWithSuffix } from "@/utils/dateFormat";
import { getDurationText, getStipendText } from "@/utils/opportunity";

export const OpportunityCard = ({ opportunity, appliedOpportunities, isAuthenticated, hasProfile, handleApply }) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-100 flex items-center justify-center border border-orange-100 shadow-sm">
              <Building className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">{opportunity.title}</h3>
              {opportunity.branch?.name && (
                <div className="text-sm sm:text-base font-medium text-gray-700">{opportunity.branch.name}</div>
              )}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600 font-medium">
                {opportunity.branch?.location?.city && (
                  <span className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-red-500" />
                    {opportunity.branch.location.city}
                  </span>
                )}
                <span>{getStipendText(opportunity.stipend)}</span>
                {opportunity.duration && (
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-gray-500" />
                    {getDurationText(opportunity)}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {opportunity.opportunityType && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {opportunity.opportunityType.charAt(0).toUpperCase() + opportunity.opportunityType.slice(1)}
                  </span>
                )}
                {opportunity.internshipType && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                    <Clock className="w-3 h-3 mr-1" />
                    {opportunity.internshipType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">{opportunity.description}</p>
            </div>
          </div>
        </div>
        <div className="lg:w-44 flex-shrink-0 flex flex-col justify-between">
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center text-gray-500 text-[11px] sm:text-xs justify-end">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
              Starts {formatDateWithSuffix(opportunity.schedule?.startDate)}
            </div>
            <button
              onClick={() => router.push(`/jobs/${opportunity._id}`)}
              className="w-full flex items-center justify-center text-xs sm:text-sm text-orange-700 hover:text-orange-900 font-medium py-2 px-3 rounded-lg border border-orange-200 hover:border-orange-300 bg-orange-50 hover:bg-orange-100 transition"
            >
              View Details
              <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
            </button>
            {appliedOpportunities.has(opportunity._id) ? (
              <div className="w-full flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-green-50 border border-green-100 text-green-700 text-xs sm:text-sm font-medium">
                <CheckCircle className="h-4 w-4 mr-1" />
                Applied
              </div>
            ) : (
              <button
                onClick={() => handleApply(opportunity)}
                className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-lg text-xs sm:text-sm font-medium transition shadow-sm hover:shadow-md"
              >
                {isAuthenticated ? "Apply Now" : "Login to Apply"}
              </button>
            )}
            {opportunity.applications?.length > 0 && (
              <div className="text-center mt-1">
                <span className="inline-flex items-center text-[10px] sm:text-xs text-gray-500 bg-gray-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                  <Users className="h-3 w-3 mr-1" />
                  {opportunity.applications.length} applied
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};