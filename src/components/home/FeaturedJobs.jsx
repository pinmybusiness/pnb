'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Bookmark, Briefcase, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { getOpportunityTypeText, getInternshipTypeText, getDurationText, getStipendText, getBenefitsText } from '@/utils/opportunity';
import CtaButton from '../CtaButton';
import JobCard from '../opportunity/JobCard';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // const cardVariants = {
  //   hidden: { opacity: 0, y: 50 },
  //   show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  // };

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
               <JobCard
                key={opportunity._id}
                opportunity={opportunity}
                // cardVariants={cardVariants}
              />
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