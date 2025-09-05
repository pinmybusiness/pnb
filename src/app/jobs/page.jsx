"use client";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import {
  Search, Filter, MapPin, Calendar, Clock, DollarSign,
  BookOpen, X, ChevronDown, Building, Award, Users,
  CheckCircle, ExternalLink, Briefcase, FileText
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { OpportunityCard } from "@/components/opportunity/OpportunityCard";
import { getDurationText, getStipendText } from "@/utils/opportunity";
import ApplicationModal from "@/components/opportunity/ApplicationModal";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function StudentOpportunitiesPage() {
  const { user, token } = useSelector((state) => state.auth);
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedOpportunities, setAppliedOpportunities] = useState(new Set());
  const [appliedLoading, setAppliedLoading] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    opportunityType: "",
    location: "",
    durationUnit: "",
    minStipend: "",
    search: "",
    longitude: "",
    latitude: "",
    maxDistance: "5000"
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [useGeolocation, setUseGeolocation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initialize = async () => {
      await checkAuth();
      await fetchOpportunities();
      setLoading(false);
    };
    initialize();
  }, []);

  useEffect(() => {
    if (isAuthenticated && hasProfile) {
      fetchAppliedOpportunities();
    }
  }, [isAuthenticated, hasProfile]);

  useEffect(() => {
    if (!loading) {
      fetchOpportunities();
    }
  }, [filters.latitude, filters.longitude, filters.maxDistance, filters.category, filters.opportunityType, filters.durationUnit, filters.minStipend, filters.search]);

  useEffect(() => {
    filterOpportunities();
  }, [filters, opportunities]);

  const checkAuth = async () => {
    setIsAuthenticated(!!token);
    if (token) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success && data.data.role === 10) {
          setHasProfile(!!data.data.candidateProfile?.mobileNumber);
        } else {
          setHasProfile(false);
        }
      } catch (err) {
        console.error("Error checking profile:", err);
        setIsAuthenticated(false);
        setHasProfile(false);
      }
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFilters((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          setUseGeolocation(true);
          toast.success("Location retrieved successfully!");
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Unable to retrieve location. Please enter manually.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const fetchOpportunities = async () => {
    try {
      const { latitude, longitude, maxDistance, category, opportunityType, durationUnit, minStipend, search } = filters;
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public?limit=20`;
      
      if (useGeolocation && latitude && longitude) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public/nearby?limit=20&latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}`;
      } else {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (opportunityType) params.append("opportunityType", opportunityType);
        if (durationUnit) params.append("durationUnit", durationUnit);
        if (minStipend) params.append("minStipend", minStipend);
        if (search) params.append("search", search);
        if (params.toString()) url += `&${params.toString()}`;
      }

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
        setHasProfile(false);
        return;
      }
      const data = await response.json();
      if (data.success) {
        const appliedIds = data.data.map((app) => app.opportunity._id);
        setAppliedOpportunities(new Set(appliedIds));
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setAppliedLoading(false);
    }
  };

  const filterOpportunities = () => {
    let results = [...opportunities];
    
    if (!useGeolocation && filters.location) {
      results = results.filter(
        (opportunity) =>
          opportunity.branch?.address?.toLowerCase().includes(filters.location.toLowerCase()) ||
          opportunity.branch?.location?.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
          opportunity.branch?.location?.state?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.category) {
      results = results.filter((opportunity) => opportunity.category === filters.category);
    }
    if (filters.opportunityType) {
      results = results.filter((opportunity) => opportunity.opportunityType === filters.opportunityType);
    }
    if (filters.durationUnit) {
      results = results.filter((opportunity) => opportunity.durationUnit === filters.durationUnit);
    }
    if (filters.minStipend) {
      results = results.filter((opportunity) => opportunity.stipend?.amount >= parseInt(filters.minStipend));
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(
        (opportunity) =>
          opportunity.title.toLowerCase().includes(searchTerm) ||
          opportunity.description.toLowerCase().includes(searchTerm) ||
          opportunity.branch?.name.toLowerCase().includes(searchTerm) ||
          opportunity.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }
    setFilteredOpportunities(results);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      opportunityType: "",
      location: "",
      durationUnit: "",
      minStipend: "",
      search: "",
      longitude: "",
      latitude: "",
      maxDistance: "5000"
    });
    setUseGeolocation(false);
  };

  const handleApply = (opportunity) => {
    if (!isAuthenticated) {
      toast.error("Please login to apply for opportunities");
      router.push("/login");
      return;
    }
    if (user?.role !== 10) {
      toast.error("Only users can apply for opportunities");
      return;
    }
    if (!hasProfile) {
      toast.error("Please complete your candidate profile before applying");
      router.push("/candidate-profile");
      return;
    }
    setSelectedOpportunity(opportunity);
    setCoverLetter("");
    setResume(null);
    setShowApplicationModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResume(file);
    } else {
      toast.error("Please upload a PDF file.");
    }
  };

  const submitApplication = async () => {
    try {
      if (!token) {
        toast.error("Please login to apply");
        router.push("/login");
        return;
      }

      const formData = new FormData();
      formData.append("opportunityId", selectedOpportunity._id);
      formData.append("coverLetter", coverLetter);
      if (resume) {
        formData.append("resume", resume);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setHasProfile(false);
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      const data = await response.json();
      if (data.success) {
        setAppliedOpportunities((prev) => new Set([...prev, selectedOpportunity._id]));
        setShowApplicationModal(false);
        toast.success(`Application submitted for ${selectedOpportunity.title}!`);
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Application error:", error);
      toast.error("Error submitting application. Please try again.");
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      <Header activeLink="/jobs" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 md:p-8 mb-8 md:mb-12 shadow-sm">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug md:leading-tight">
              Restaurant & Hospitality <span className="text-orange-600">Opportunities</span>
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
            {!isAuthenticated && (
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
          {/* Filters Sidebar - Desktop */}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Find Nearby Opportunities</label>
                  <button
                    onClick={getUserLocation}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 font-medium shadow-sm mb-3"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Use My Location
                  </button>
                  {useGeolocation && (
                    <div className="relative rounded-lg shadow-sm">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Distance (meters)</label>
                      <input
                        type="number"
                        value={filters.maxDistance}
                        onChange={(e) => handleFilterChange("maxDistance", e.target.value)}
                        className="block w-full pl-3 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 transition-colors duration-200"
                        placeholder="Max distance (e.g., 5000)"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => handleFilterChange("location", e.target.value)}
                      disabled={useGeolocation}
                      className={`block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 transition-colors duration-200 ${useGeolocation ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="City or area"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="relative">
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange("category", e.target.value)}
                      className="block w-full pl-3 pr-10 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 appearance-none transition-colors duration-200"
                    >
                      <option value="">All Categories</option>
                      <option value="Kitchen Helper">Kitchen Helper</option>
                      <option value="Service Staff">Service Staff</option>
                      <option value="Management Trainee">Management Trainee</option>
                      <option value="Marketing Assistant">Marketing Assistant</option>
                      <option value="Events Coordinator">Events Coordinator</option>
                      <option value="Delivery Helper">Delivery Helper</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <ChevronDown className="h-4 w-4" />
                    </div>
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
                      <option value="internship">Internship</option>
                      <option value="job">Job</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <div className="relative">
                    <select
                      value={filters.durationUnit}
                      onChange={(e) => handleFilterChange("durationUnit", e.target.value)}
                      className="block w-full pl-3 pr-10 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 appearance-none transition-colors duration-200"
                    >
                      <option value="">Any Duration</option>
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
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

          {/* Mobile Filter Button and Modal */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 hover:bg-gray-50 font-medium shadow-sm"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              {Object.values(filters).some((value) => value !== "") && (
                <span className="ml-2 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {Object.values(filters).filter((value) => value !== "").length}
                </span>
              )}
            </button>
            {showFilters && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
                <div className="bg-white rounded-t-2xl p-6 w-full max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Find Nearby Opportunities</label>
                      <button
                        onClick={getUserLocation}
                        className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 font-medium shadow-sm mb-3"
                      >
                        <MapPin className="h-5 w-5 mr-2" />
                        Use My Location
                      </button>
                      {useGeolocation && (
                        <div className="relative rounded-lg shadow-sm">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Max Distance (meters)</label>
                          <input
                            type="number"
                            value={filters.maxDistance}
                            onChange={(e) => handleFilterChange("maxDistance", e.target.value)}
                            className="block w-full pl-3 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 transition-colors duration-200"
                            placeholder="Max distance (e.g., 5000)"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <div className="relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={filters.location}
                          onChange={(e) => handleFilterChange("location", e.target.value)}
                          disabled={useGeolocation}
                          className={`block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 transition-colors duration-200 ${useGeolocation ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder="City or area"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <div className="relative">
                        <select
                          value={filters.category}
                          onChange={(e) => handleFilterChange("category", e.target.value)}
                          className="block w-full pl-3 pr-10 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 appearance-none transition-colors duration-200"
                        >
                          <option value="">All Categories</option>
                          <option value="Kitchen Helper">Kitchen Helper</option>
                          <option value="Service Staff">Service Staff</option>
                          <option value="Management Trainee">Management Trainee</option>
                          <option value="Marketing Assistant">Marketing Assistant</option>
                          <option value="Events Coordinator">Events Coordinator</option>
                          <option value="Delivery Helper">Delivery Helper</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                          <ChevronDown className="h-4 w-4" />
                        </div>
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
                          <option value="internship">Internship</option>
                          <option value="job">Job</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <div className="relative">
                        <select
                          value={filters.durationUnit}
                          onChange={(e) => handleFilterChange("durationUnit", e.target.value)}
                          className="block w-full pl-3 pr-10 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50 appearance-none transition-colors duration-200"
                        >
                          <option value="">Any Duration</option>
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                          <option value="months">Months</option>
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
          </div>

          {/* Opportunities List */}
          <div className="w-full lg:flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
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
                <div className="grid grid-cols-1 gap-5">
                  {filteredOpportunities.map((opportunity) => (
                    <OpportunityCard
                      key={opportunity._id}
                      opportunity={opportunity}
                      appliedOpportunities={appliedOpportunities}
                      isAuthenticated={isAuthenticated}
                      handleApply={handleApply}
                      userLat={filters.latitude} // Pass latitude
                      userLon={filters.longitude} // Pass longitude
                    />
                  ))}
                </div>
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

      {/* Application Modal */}
      <ApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        opportunity={selectedOpportunity}
        coverLetter={coverLetter}
        setCoverLetter={setCoverLetter}
        resume={resume}
        setResume={setResume}
        onSubmit={submitApplication}
      />
    </div>
  );
}