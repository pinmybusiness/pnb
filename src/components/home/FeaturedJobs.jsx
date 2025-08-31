"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, Bookmark, ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";
import { getDurationText, getStipendText } from "@/utils/opportunity";

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

  // Helper function to calculate "posted" time
  const calculatePostedTime = (publishedAt) => {
    if (!publishedAt) return "Recently posted";
    const now = new Date();
    const postedDate = new Date(publishedAt);
    const diffInMs = now - postedDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays <= 0 ? "Today" : `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  if (loading) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-gray-600 text-center">Loading opportunities...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-red-600 text-center">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Heading */}
        <div className="mb-16 text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight animate-slide-in">
            Latest <span className="text-orange-600 relative">
              Job Openings
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-orange-600/50 rounded-full animate-scale-in" />
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-lg animate-slide-in" style={{ animationDelay: "0.2s" }}>
            Discover top restaurant jobs across India, updated daily for you.
          </p>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opportunity, index) => (
            <div
              key={opportunity._id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100"
            >
              {/* Header: Title, Company, Bookmark */}
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                    {opportunity.title || "Untitled Opportunity"}
                  </h3>
                  <p className="text-sm text-gray-600">{opportunity.branch?.name || "Unknown Company"}</p>
                </div>
                <button
                  className="text-gray-400 hover:text-orange-600 transition-colors"
                  aria-label="Bookmark opportunity"
                >
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>

              {/* Meta Information */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <span>
                    {opportunity.branch?.location
                      ? `${opportunity.branch.location.city || "Unknown City"}, ${opportunity.branch.location.state || "Unknown State"}`
                      : "Unknown Location"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>{getDurationText(opportunity) || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Briefcase className="h-4 w-4 text-orange-500" />
                  <span>{getStipendText(opportunity.stipend) || "Not disclosed"}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {opportunity.opportunityType && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                    {opportunity.opportunityType.charAt(0).toUpperCase() + opportunity.opportunityType.slice(1)}
                  </span>
                )}
                {opportunity.internshipType && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    {opportunity.internshipType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                )}
              </div>

              {/* Footer: Posted Time and CTA */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Posted {calculatePostedTime(opportunity.publishedAt)}
                </span>
                <Link
                  href={`/jobs/${opportunity._id}`}
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors"
                >
                  View Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
          {opportunities.length === 0 && (
            <p className="text-lg text-gray-600 col-span-full text-center">
              No opportunities available at the moment.
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12">
          <Link
            href="/jobs"
            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white text-base font-medium rounded-md hover:bg-orange-700 hover:shadow-lg transition-all"
          >
            View All Jobs
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}