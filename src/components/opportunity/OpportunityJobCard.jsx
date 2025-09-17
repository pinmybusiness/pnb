import { useRouter } from "next/navigation";
import { MapPin, Clock, Bookmark, Users, CheckCircle, Briefcase, Calendar } from "lucide-react";
import { getOpportunityTypeText, getInternshipTypeText, getStipendText, getDurationText } from "@/utils/opportunity";
import { calculatePostedTime } from "@/utils/dateFormat";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function OpportunityJobCard({ 
  opportunity, 
  appliedOpportunities, 
  isAuthenticated, 
  userLat, 
  userLon,
  handleApply 
}) {
  const router = useRouter();
  
  // Determine if this is a job or opportunity based on available properties
  const isJob = opportunity.type === 'job' || opportunity.hasOwnProperty('jobType');
  
  let distance = null;
  if (userLat && userLon && opportunity.branch?.location?.coordinates) {
    const [jobLon, jobLat] = opportunity.branch.location.coordinates;
    distance = calculateDistance(parseFloat(userLat), parseFloat(userLon), jobLat, jobLon);
  }

  const handleButtonClick = () => {
    if (appliedOpportunities.has(opportunity._id)) {
      router.push(`/${isJob ? 'job' : 'opportunity'}/${opportunity?.slug}`);
    } else {
      if (isAuthenticated) {
        handleApply(opportunity._id);
      } else {
        router.push(`/${isJob ? 'job' : 'opportunity'}/${opportunity?.slug}`);
      }
    }
  };

  // Get appropriate text based on whether it's a job or opportunity
  const getTypeText = () => {
    if (isJob) {
      return opportunity.jobType || "Full-time";
    }
    return getOpportunityTypeText(opportunity.opportunityType);
  };

  const getDurationInfo = () => {
    if (isJob) {
      return opportunity.employmentType || "Permanent";
    }
    return getDurationText(opportunity);
  };

  const getCompensationText = () => {
    if (isJob) {
      return opportunity.salary 
        ? `₹${opportunity.salary.min.toLocaleString()} - ₹${opportunity.salary.max.toLocaleString()}`
        : "Salary not specified";
    }
    return getStipendText(opportunity.compensation);
  };

  const getPositionsText = () => {
    if (isJob) {
      return opportunity.vacancies 
        ? `${opportunity.vacancies} ${opportunity.vacancies === 1 ? 'Position' : 'Positions'}`
        : 'Not specified';
    }
    return opportunity?.numberOfPeople
      ? `${opportunity.numberOfPeople} ${opportunity.numberOfPeople === 1 ? 'Position' : 'Positions'}`
      : 'Not specified';
  };

  return (
    <div
      key={opportunity._id}
      className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-200"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-gray-900 line-clamp-1">
            {opportunity.title || 'Untitled Opportunity'}
          </h3>
          <p className="text-sm text-gray-600">
            {opportunity?.branch?.parentRestaurant?.name || opportunity?.branch?.restaurantName || 'Unknown Restaurant'}
          </p>
        </div>
        <button
          className="text-gray-300 hover:text-orange-600 transition-colors"
          aria-label="Bookmark opportunity"
        >
          <Bookmark className="h-6 w-6" />
        </button>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="p-2 rounded-full bg-orange-100">
            <Clock className="h-4 w-4 text-orange-600" />
          </span>
          <span>{getCompensationText()}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="p-2 rounded-full bg-orange-100">
            <MapPin className="h-4 w-4 text-orange-600" />
          </span>
          <span>
            {opportunity.branch?.location?.city
              ? `${opportunity.branch.location.city.name || 'Unknown City'}`
              : 'Unknown Location'}
            {distance !== null && ` • ${distance.toFixed(1)} km away`}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="p-2 rounded-full bg-orange-100">
            <Users className="h-4 w-4 text-orange-600" />
          </span>
          <span>{getPositionsText()}</span>
        </div>

        {opportunity.duration && (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="p-2 rounded-full bg-orange-100">
              <Calendar className="h-4 w-4 text-orange-600" />
            </span>
            <span>{getDurationInfo()}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
          {getTypeText()}
        </span>
        {!isJob && opportunity.internshipType !== undefined && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            {getInternshipTypeText(opportunity.internshipType)}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">
          Posted {calculatePostedTime(opportunity.createdAt)}
          {opportunity.applications?.length > 0 && (
            <> • <span className="inline-flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {opportunity.applications.length} applied
            </span></>
          )}
        </span>
        
        <button
          onClick={handleButtonClick}
          className={`py-2 px-5 rounded-full text-sm font-medium transition shadow-sm hover:shadow-md flex items-center gap-1 ${
            appliedOpportunities.has(opportunity._id)
              ? "text-orange-700 hover:text-orange-900 border border-orange-200 hover:border-orange-300 bg-orange-50 hover:bg-orange-100"
              : "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
          }`}
        >
          {appliedOpportunities.has(opportunity._id) ? (
            <>
              <CheckCircle className="h-4 w-4 mr-1 text-green-700" />
              View Details
            </>
          ) : (
            isAuthenticated ? "Apply Now" : "Login to Apply"
          )}
        </button>
      </div>
    </div>
  );
}