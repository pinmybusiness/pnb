'use client';

import { MapPin, Clock, Bookmark, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import CtaButton from '../CtaButton';
import { getOpportunityTypeText, getInternshipTypeText, getDurationText, getStipendText } from '@/utils/opportunity';
import { calculatePostedTime } from '@/utils/dateFormat';

export default function JobCard({ opportunity,  cardVariants }) {
  return (
    <motion.div
      key={opportunity._id}
      className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-gray-200 cursor-pointer"
    //   variants={cardVariants}
      whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-gray-900 line-clamp-1">
            {opportunity.title || 'Untitled Opportunity'}
          </h3>
          <p className="text-sm text-gray-600">
            {opportunity?.branch?.restaurantName || 'Unknown Restaurant'}
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
            <Briefcase className="h-4 w-4 text-orange-600" />
          </span>
          <span>{getDurationText(opportunity) || 'Not specified'}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="p-2 rounded-full bg-orange-100">
            <Clock className="h-4 w-4 text-orange-600" />
          </span>
          <span>{getStipendText(opportunity.compensation) || 'Not disclosed'}</span>
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
          text="View Details"
          size="sm"
          showIcon={true}
          className="rounded-full"
        />
      </div>
    </motion.div>
  );
}
