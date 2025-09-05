"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, Bookmark, ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// These helper functions are from your original code.
// Make sure the file paths are correct in your project.
import { getDurationText, getStipendText } from "@/utils/opportunity";
import CtaButton from "../CtaButton";

export default function FeaturedJobs() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public/latest`);
        if (!response.ok) {
          throw new Error("Failed to fetch opportunities");
        }
        const { data } = await response.json();
        setOpportunities(data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch opportunities error:", err);
        setError("Failed to load job opportunities");
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const calculatePostedTime = (publishedAt) => {
    if (!publishedAt) return "Recently posted";
    const now = new Date();
    const postedDate = new Date(publishedAt);
    const diffInMs = now - postedDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays <= 0 ? "Today" : `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
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

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-lg text-gray-600">
          Loading opportunities...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-lg text-red-600">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FFF5EC] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Latest <span className="text-orange-600">Job Openings</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover top restaurant jobs across India, updated daily for you.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {opportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity._id}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 border border-gray-200 cursor-pointer"
              variants={cardVariants}
              whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-900 line-clamp-1">
                    {opportunity.title || "Untitled Opportunity"}
                  </h3>
                  <p className="text-sm text-gray-600">{opportunity.branch?.name || "Unknown Company"}</p>
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
                    {opportunity.branch?.location
                      ? `${opportunity.branch.location.city || "Unknown City"}, ${opportunity.branch.location.state || "Unknown State"}`
                      : "Unknown Location"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="p-2 rounded-full bg-orange-100">
                    <Briefcase className="h-4 w-4 text-orange-600" />
                  </span>
                  <span>{getDurationText(opportunity) || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="p-2 rounded-full bg-orange-100">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </span>
                  <span>{getStipendText(opportunity.stipend) || "Not disclosed"}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {opportunity.opportunityType && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
                    {opportunity.opportunityType.charAt(0).toUpperCase() + opportunity.opportunityType.slice(1)}
                  </span>
                )}
                {opportunity.internshipType && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {opportunity.internshipType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Posted {calculatePostedTime(opportunity.publishedAt)}
                </span>
                <CtaButton
                  href={`/jobs/${opportunity._id}`}
                  text="View Details"
                  size="sm"          // matches text-sm and smaller padding
                  showIcon={true}    // arrow icon
                  className="rounded-full" // override border-radius to full
                />

              </div>
            </motion.div>
          ))}
          {opportunities.length === 0 && (
            <div className="text-lg text-gray-600 col-span-full text-center py-10">
              No opportunities available at the moment.
            </div>
          )}
        </motion.div>

         {/* CTA Button */}
          <div className="flex justify-center mt-16">
            <CtaButton href="/jobs" text="View All Jobs" />
          </div>
      </div>
    </section>
  );
}