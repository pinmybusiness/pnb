"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Award, Briefcase, ChevronDown } from "lucide-react";
import { OpportunityCard } from "@/components/opportunity/OpportunityCard";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import FilterSidebar from "../opportunity/FilterSidebar";

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
    filters.baseWorkTypeSlug, // Ensure slug-based filters trigger fetch
  ]);

  useEffect(() => {
    filterOpportunities();
  }, [opportunities]);

// src/components/csr/OpportunitiesContent.jsx (only fetchOpportunities function updated; rest remains same)
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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 md:p-8 mb-8 md:mb-12 shadow-sm">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug md:leading-tight">
              {pageTitle}
            </h1>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-700 px-2">
              Explore opportunities across{" "}
              <span className="font-medium">Kitchen, Service, Management, Marketing, Delivery</span>{" "}
              and more. Kickstart your career in the food & hospitality industry today.
            </p>
            <div className="mt-6 sm:mt-8 relative max-w-md sm:max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="block w-full pl-12 pr-4 py-3 sm:py-4 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm text-sm sm:text-base"
                placeholder="Search by role, skills, or location..."
              />
            </div>
            {(!isAuthenticated && !token) && (
              <div className="mt-5 sm:mt-6 inline-flex items-center bg-white border border-orange-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-orange-700 shadow-sm">
                <Award className="w-4 h-4 mr-2" />
                Create a free account to apply and track your applications
              </div>
            )}
          </div>
          <div className="absolute right-3 sm:right-6 top-3 sm:top-6 hidden md:block opacity-10 text-orange-500">
            <Briefcase className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            handleFilterChange={handleFilterChange}
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
              <div className="text-sm text-gray-500 flex items-center">
                <span className="mr-2">Sort by:</span>
                <div className="relative">
                  <select
                    className="pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 appearance-none"
                  >
                    <option>Most Recent</option>
                    <option>Highest Stipend</option>
                    <option>Nearest Location</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
            {loading || appliedLoading ? (
              <div className="grid grid-cols-1 gap-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-6 animate-pulse border border-gray-100">
                    <div className="flex space-x-4">
                      <div className="rounded-lg bg-gray-200 h-14 w-14"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredOpportunities.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredOpportunities.map((opportunity) => (
                    <OpportunityCard
                      key={opportunity._id}
                      opportunity={opportunity}
                      appliedOpportunities={appliedOpportunities}
                      isAuthenticated={isAuthenticated || !!token}
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