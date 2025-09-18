import { MapPin, Clock, Users } from 'lucide-react';
import CtaButton from '../CtaButton';
import {
  getOpportunityTypeText,
  getInternshipTypeText,
  getStipendText,
} from '@/utils/opportunity';
import { calculatePostedTime } from '@/utils/dateFormat';

export default function JobCard({ opportunity, appliedOpportunities }) {
  // ✅ Default empty Set if undefined/null
  const appliedSet = appliedOpportunities || new Set();
  const isApplied = appliedSet.has(opportunity._id);

  return (
    <div
      key={opportunity._id}
      className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-200"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <h3 className="line-clamp-1">
            {opportunity.title || 'Untitled Opportunity'}
          </h3>
          {opportunity.branch?.parentRestaurant && (
            <p className="text-sm text-gray-600">
              {opportunity.branch.parentRestaurant.name || 'Unknown Restaurant'}
            </p>
          )}
        </div>

        {/* Applied count */}
        {/* {opportunity.applications?.length > 0 && (
          <div className="w-18 text-center">
            <span className="flex flex-wrap gap-1 p-1 items-center text-[10px] sm:text-xs text-gray-500 bg-gray-50 px-2 rounded-full">
              <span>{opportunity.applications.length} applied</span>
            </span>
          </div>
        )} */}
      </div>

      {/* Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="p-2 rounded-full bg-orange-100">
            <Clock className="h-4 w-4 text-orange-600" />
          </span>
          <span>{getStipendText(opportunity.compensation) || 'Not disclosed'}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="p-2 rounded-full bg-orange-100">
            <MapPin className="h-4 w-4 text-orange-600" />
          </span>
          <span>
            {opportunity.branch?.location?.city
              ? `${opportunity.branch.location.city.name || 'Unknown City'}`
              : 'Unknown Location'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="p-2 rounded-full bg-orange-100">
            <Users className="h-4 w-4 text-orange-600" />
          </span>
          <span>
            {opportunity?.numberOfPeople
              ? `${opportunity.numberOfPeople} ${
                  opportunity.numberOfPeople === 1 ? 'Position' : 'Positions'
                }`
              : 'Not specified'}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {opportunity.opportunityType !== undefined && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
            {getOpportunityTypeText(opportunity.opportunityType)}
          </span>
        )}
        {opportunity.internshipType !== undefined && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            {getInternshipTypeText(opportunity.internshipType)}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">
          Posted {calculatePostedTime(opportunity.createdAt)}
        </span>
        <CtaButton
          href={`/job/${opportunity.slug}`}
          variant={isApplied ? 'outline' : 'filled'}
          text={isApplied ? 'View Details' : 'Apply Now'}
          size="sm"
          showIcon
          className="rounded-full"
        />
      </div>
    </div>
  );
}
