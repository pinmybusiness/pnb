"use client";
import { MapPin, Filter, DollarSign, ChevronDown, X, Search } from "lucide-react";

export default function FilterSidebar({
  filters,
  setFilters, // Add setFilters to update state directly
  clearFilters,
  showFilters,
  setShowFilters,
}) {
  // Move handleFilterChange from OpportunitiesContent to here
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 hover:bg-gray-50 font-medium shadow-sm"
        >
          <Filter className="h-5 w-5 mr-2" />
          Filters
          {Object.values(filters).filter((value) => value && value !== filters.baseSearch && value !== filters.baseWorkTypeSlug).length > 0 && (
            <span className="ml-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {Object.values(filters).filter((value) => value && value !== filters.baseSearch && value !== filters.baseWorkTypeSlug).length}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-80">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              Clear all
            </button>
          </div>
          <div className="space-y-6">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={filters.search || filters.baseWorkTypeSlug || ""}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  disabled={filters.baseWorkTypeSlug}
                  className={`block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 transition-colors duration-200 ${filters.baseWorkTypeSlug ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Search by role, skills"
                />
                {filters.baseWorkTypeSlug && (
                  <p className="pl-2 text-xs text-gray-500">Role set to {filters.baseWorkTypeSlug} from URL</p>
                )}
              </div>
            </div>
            {/* Location Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={filters.location || filters.baseSearch || ""}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  disabled={filters.baseSearch}
                  className={`block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 transition-colors duration-200 ${filters.baseSearch ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="City or area"
                />
                {filters.baseSearch && (
                  <p className="pl-2 text-xs text-gray-500">Location set to {filters.baseSearch} from URL</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Opportunity Type</label>
              <div className="relative">
                <select
                  value={filters.opportunityType}
                  onChange={(e) => handleFilterChange("opportunityType", e.target.value)}
                  className="block w-full pl-3 pr-10 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 appearance-none transition-colors duration-200"
                >
                  <option value="">All Types</option>
                  <option value="0">Job</option>
                  <option value="1">Internship</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stipend</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={filters.minStipend}
                  onChange={(e) => handleFilterChange("minStipend", e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 transition-colors duration-200"
                  placeholder="Minimum amount"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white rounded-t-2xl p-6 w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-6">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={filters.search || filters.baseWorkTypeSlug || ""}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    disabled={filters.baseWorkTypeSlug}
                    className={`block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 transition-colors duration-200 ${filters.baseWorkTypeSlug ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Search by role, skills, or location"
                  />
                  {filters.baseWorkTypeSlug && (
                    <p className="mt-1 text-xs text-gray-500">Role set to {filters.baseWorkTypeSlug} from URL</p>
                  )}
                </div>
              </div>
              {/* Location Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={filters.location || filters.baseSearch || ""}
                    onChange={(e) => handleFilterChange("location", e.target.value)}
                    disabled={filters.baseSearch}
                    className={`block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 transition-colors duration-200 ${filters.baseSearch ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="City or area"
                  />
                  {filters.baseSearch && (
                    <p className="mt-1 text-xs text-gray-500">Location set to {filters.baseSearch} from URL</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opportunity Type</label>
                <div className="relative">
                  <select
                    value={filters.opportunityType}
                    onChange={(e) => handleFilterChange("opportunityType", e.target.value)}
                    className="block w-full pl-3 pr-10 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 appearance-none transition-colors duration-200"
                  >
                    <option value="">All Types</option>
                    <option value="0">Job</option>
                    <option value="1">Internship</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stipend</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={filters.minStipend}
                    onChange={(e) => handleFilterChange("minStipend", e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 transition-colors duration-200"
                    placeholder="Minimum amount"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(false)}
              className="mt-6 w-full py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
}