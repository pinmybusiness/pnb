'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Bookmark, Briefcase, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { getOpportunityTypeText, getInternshipTypeText, getDurationText, getStipendText, getBenefitsText } from '@/utils/opportunity';
import { benefits } from '@/data/opportunityData';
import CtaButton from '../CtaButton';

export default function FeaturedJobs() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log("opera", opportunities)
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public/latest`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Server returned ${response.status}`);
        }
        
        const { data, success, message } = await response.json();
        
        if (!success) {
          throw new Error(message || 'Failed to fetch opportunities');
        }
        
        setOpportunities(data || []);
      } catch (err) {
        console.error('Fetch opportunities error:', err);
        setError(err.message || 'Failed to load job opportunities');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const calculatePostedTime = (publishedAt) => {
    if (!publishedAt) return 'Recently';
    const now = new Date();
    const postedDate = new Date(publishedAt);
    const diffInMs = now - postedDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
      }
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    return diffInDays === 1 ? 'Yesterday' : `${diffInDays} days ago`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Show loading state
  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 md:mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Discover the Latest Restaurant Jobs <span className="text-orange-600">Across India</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12 md:mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Discover the Latest Restaurant Jobs <span className="text-orange-600">Across India</span>
            </h2>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-red-800 mb-2">Unable to load opportunities</h3>
            <p className="text-red-600 mb-4">{error}</p>
             <CtaButton onClick={() => window.location.reload()} text="Try Again" asButton='true' icon='none' />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FFF5EC] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Discover the Latest Restaurant Jobs <span className="text-orange-600">Across India</span>
          </h2>
        </div>

        {opportunities.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {opportunities.map((opportunity) => (
              <motion.div
                key={opportunity._id}
                className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-gray-200 cursor-pointer"
                variants={cardVariants}
                whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-gray-900 line-clamp-1">
                      {opportunity.title || 'Untitled Opportunity'}
                    </h3>
                    <p className="text-sm text-gray-600">{opportunity?.branch?.restaurantName || 'Unknown Restaurant'}</p>
                  </div>
                  <button
                    className="text-gray-300 hover:text-orange-600 transition-colors"
                    aria-label="Bookmark opportunity"
                  >
                    <Bookmark className="h-6 w-6" />
                  </button>
                </div>

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
                    <span>{getStipendText(opportunity.stipend) || 'Not disclosed'}</span>
                  </div>
                </div>

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
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="text-2xl font-semibold text-gray-600 mb-4">No opportunities available</div>
            <p className="text-gray-500 mb-6">Check back later for new restaurant job opportunities</p>
          </div>
        )}

        <div className="flex justify-center mt-16">
          <CtaButton href="/jobs" text="View All Jobs" />
        </div>
      </div>
    </section>
  ); 
}