"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
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
  initialPagination,
  basePath = "/jobs",
}) {
  const { token } = useSelector((state) => state.auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [opportunities, setOpportunities] = useState(initialOpportunities || []);
  const [pagination, setPagination] = useState(initialPagination || { 
    current: 1, 
    total: 1, 
    totalRecords: 0 
  });
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialPagination?.current < initialPagination?.total);
  const [currentPage, setCurrentPage] = useState(initialPagination?.current || 1);
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
  
  const observer = useRef();
  const lastOpportunityRef = useCallback((node) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
        loadMoreOpportunities();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  useEffect(() => {
    if (isAuthenticated && !initialAppliedOpportunities.length) {
      fetchAppliedOpportunities();
    }
  }, [isAuthenticated, initialAppliedOpportunities]);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
    setHasMore(true);
    fetchOpportunities(true);
  }, [
    filters.opportunityType,
    filters.minStipend,
    filters.search,
    filters.location,
    filters.baseSearch,
    filters.baseWorkTypeSlug,
  ]);

  const fetchOpportunities = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const { opportunityType, minStipend, search, location, baseSearch, baseWorkTypeSlug } = filters;
      const pageToFetch = reset ? 1 : currentPage + 1;
      
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public?limit=12&page=${pageToFetch}`;

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
        if (reset) {
          setOpportunities(data.data);
          setPagination(data.pagination);
        } else {
          setOpportunities(prev => [...prev, ...data.data]);
        }
        
        setCurrentPage(pageToFetch);
        setHasMore(pageToFetch < data.pagination.total);
      } else {
        console.error("Failed to fetch opportunities:", data.message);
        toast.error(data.message || "Failed to fetch opportunities");
      }
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      toast.error("Error fetching opportunities. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreOpportunities = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchOpportunities(false);
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

  const clearFilters = () => {
    setFilters({
      opportunityType: "",
      location: "",
      minStipend: "",
      search: "",
      baseSearch: "",
      baseWorkTypeSlug: "",
    });
    // Update URL without page reload
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('page');
    router.push(`${basePath}?${newSearchParams.toString()}`, { scroll: false });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Update URL params for shareable links
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    
    // Remove page param when filters change
    newSearchParams.delete('page');
    
    router.push(`${basePath}?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            handleFilterChange={handleFilterChange} // Pass the handler
            clearFilters={clearFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          {/* Opportunities List */}
          <div className="w-full lg:flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
              <h2 className="!text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
                {pagination.totalRecords > 0 
                  ? `${pagination.totalRecords} Opportunities Available` 
                  : 'No Opportunities Found'
                }
              </h2>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                 <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : opportunities.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {opportunities.map((opportunity, index) => (
                    <div 
                      key={opportunity._id} 
                      ref={index === opportunities.length - 1 ? lastOpportunityRef : null}
                    >
                      <JobCard
                        opportunity={opportunity}
                        appliedOpportunities={appliedOpportunities}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Loading more indicator */}
                {loadingMore && (
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2].map((i) => (
                      <JobCardSkeleton key={i} />
                    ))}
                  </div>
                )}
                
                {/* No more results */}
                {/* {!hasMore && opportunities.length > 0 && (
                  <div className="mt-8 text-center text-gray-500">
                    You've reached the end of the list
                  </div>
                )} */}
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