"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Award, Briefcase, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import FilterSidebar from "../opportunity/FilterSidebar";
import JobCard from "../opportunity/JobCard";
import JobCardSkeleton from "../opportunity/JobCardSkeleton";

export default function OpportunitiesContent({
  initialOpportunities,
  initialAppliedOpportunities,
  isAuthenticated: initialIsAuthenticated,
  pageTitle,
  initialFilters,
  currentPage = 1,
  totalPages = 1,
  basePath = "/jobs",
}) {
  const { token } = useSelector((state) => state.auth);
  const [opportunities, setOpportunities] = useState(initialOpportunities || []);
  const [filteredOpportunities, setFilteredOpportunities] = useState(initialOpportunities || []);
  const [loading, setLoading] = useState(false);
  const [appliedOpportunities, setAppliedOpportunities] = useState(new Set(initialAppliedOpportunities || []));
  const [appliedLoading, setAppliedLoading] = useState(false);
  const [filters, setFilters] = useState({
    opportunityType: "",
    location: "",
    minStipend: "",
    search: "",
    baseSearch: "", // From slug (city)
    baseWorkTypeSlug: "", // From slug (role)
    ...initialFilters,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !initialAppliedOpportunities.length) {
      fetchAppliedOpportunities();
    }
  }, [isAuthenticated, initialAppliedOpportunities]);

  useEffect(() => {
    if (!loading) {
      fetchOpportunities();
    }
  }, [
    filters.opportunityType,
    filters.minStipend,
    filters.search,
    filters.location,
    currentPage,
    filters.baseSearch,
    filters.baseWorkTypeSlug,
  ]);

  useEffect(() => {
    filterOpportunities();
  }, [opportunities]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const { opportunityType, minStipend, search, location, baseSearch, baseWorkTypeSlug } = filters;
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public?limit=20&page=${currentPage}`;

      const params = new URLSearchParams();
      if (opportunityType) params.append("opportunityType", opportunityType);
      if (minStipend) params.append("minStipend", minStipend);

      // Combine search sources to avoid duplicates
      let effectiveSearch = '';
      if (baseSearch) effectiveSearch += baseSearch;
      if (location && location !== baseSearch) {
        effectiveSearch += (effectiveSearch ? ' ' : '') + location;
      }
      if (search && search !== baseWorkTypeSlug) {
        effectiveSearch += (effectiveSearch ? ' ' : '') + search;
      }
      if (effectiveSearch) {
        params.append("search", effectiveSearch.trim());
      }

      if (baseWorkTypeSlug) params.append("workTypeSlug", baseWorkTypeSlug);

      if (params.toString()) url += `&${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setOpportunities(data.data);
        setFilteredOpportunities(data.data);
      } else {
        console.error("Failed to fetch opportunities:", data.message);
        toast.error(data.message || "Failed to fetch opportunities");
      }
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      toast.error("Error fetching opportunities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedOpportunities = async () => {
    try {
      setAppliedLoading(true);
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
      const data = await response.json();
      if (data.success) {
        const appliedIds = data.data.map((app) => app.opportunity._id);
        setAppliedOpportunities(new Set(appliedIds));
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Error fetching applications. Please try again.");
    } finally {
      setAppliedLoading(false);
    }
  };

  const filterOpportunities = () => {
    let results = [...opportunities];

    if (filters.opportunityType) {
      results = results.filter((opportunity) => opportunity.opportunityType === parseInt(filters.opportunityType));
    }

    if (filters.minStipend) {
      results = results.filter((opportunity) =>
        (opportunity.opportunityType === 1 && opportunity.compensation?.stipendAmount >= parseInt(filters.minStipend)) ||
        (opportunity.opportunityType === 0 && opportunity.compensation?.minAmount >= parseInt(filters.minStipend))
      );
    }

    if (filters.search && !filters.baseWorkTypeSlug) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(
        (opportunity) =>
          opportunity.title.toLowerCase().includes(searchTerm) ||
          opportunity.description.toLowerCase().includes(searchTerm) ||
          opportunity.branch?.name.toLowerCase().includes(searchTerm) ||
          opportunity.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.location && !filters.baseSearch) {
      const locationTerm = filters.location.toLowerCase();
      results = results.filter(
        (opportunity) =>
          opportunity.branch?.address?.toLowerCase().includes(locationTerm) ||
          opportunity.branch?.location?.city?.name.toLowerCase().includes(locationTerm) ||
          opportunity.branch?.location?.state?.toLowerCase().includes(locationTerm)
      );
    }

    setFilteredOpportunities(results);
  };

  const clearFilters = () => {
    setFilters({
      opportunityType: "",
      location: filters.baseSearch || "",
      minStipend: "",
      search: filters.baseWorkTypeSlug || "",
      baseSearch: filters.baseSearch || "",
      baseWorkTypeSlug: filters.baseWorkTypeSlug || "",
    });
    router.push("/jobs");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            setFilters={setFilters} // Pass setFilters instead of handleFilterChange
            clearFilters={clearFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          {/* Opportunities List */}
          <div className="w-full lg:flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
              <h2 className="!text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
                {filteredOpportunities.length} Opportunities Available
              </h2>
            </div>
            {loading || appliedLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                 <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredOpportunities.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredOpportunities.map((opportunity) => (
                    <JobCard
                      key={opportunity._id}
                      opportunity={opportunity}
                      appliedOpportunities={appliedOpportunities}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <a
                        key={i + 1}
                        href={`${basePath}?page=${i + 1}`}
                        className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                      >
                        {i + 1}
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your search filters to find more opportunities.</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}