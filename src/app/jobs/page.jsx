"use client";
import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { 
  Search, Filter, MapPin, Calendar, Clock, DollarSign, 
  BookOpen, X, ChevronDown, Building, Award, Users, 
  CheckCircle, ExternalLink, Briefcase
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import { OpportunityCard } from '@/components/opportunity/OpportunityCard';
import { getDurationText, getStipendText } from '@/utils/opportunity';

const inter = Inter({ subsets: ['latin'] });

export default function StudentOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedOpportunities, setAppliedOpportunities] = useState(new Set());
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    opportunityType: '',
    location: '',
    durationUnit: '',
    minStipend: '',
    search: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchOpportunities();
  }, []);

  useEffect(() => {
    filterOpportunities();
  }, [filters, opportunities]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  };

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public?limit=20`);
      const data = await response.json();
      
      if (data.success) {
        setOpportunities(data.data);
        setFilteredOpportunities(data.data);
        
        if (isAuthenticated) {
          fetchAppliedOpportunities();
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      setLoading(false);
    }
  };

  const fetchAppliedOpportunities = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        const appliedIds = data.data.map(app => app.opportunity._id);
        setAppliedOpportunities(new Set(appliedIds));
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      if (error.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
  };

  const filterOpportunities = () => {
    let results = [...opportunities];
    
    if (filters.category) {
      results = results.filter(opportunity => 
        opportunity.category === filters.category
      );
    }
    
    if (filters.opportunityType) {
      results = results.filter(opportunity => 
        opportunity.opportunityType === filters.opportunityType
      );
    }
    
      results = results.filter(opportunity => 
        opportunity.branch?.address?.toLowerCase().includes(filters.location.toLowerCase()) ||
        opportunity.branch?.location?.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
        opportunity.branch?.location?.state?.toLowerCase().includes(filters.location.toLowerCase())
      );

    
    if (filters.durationUnit) {
      results = results.filter(opportunity => 
        opportunity.durationUnit === filters.durationUnit
      );
    }
    
    if (filters.minStipend) {
      results = results.filter(opportunity => 
        opportunity.stipend?.amount >= parseInt(filters.minStipend)
      );
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(opportunity => 
        opportunity.title.toLowerCase().includes(searchTerm) ||
        opportunity.description.toLowerCase().includes(searchTerm) ||
        opportunity.branch?.name.toLowerCase().includes(searchTerm) ||
        opportunity.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    setFilteredOpportunities(results);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      opportunityType: '',
      location: '',
      durationUnit: '',
      minStipend: '',
      search: ''
    });
  };

  const handleApply = (opportunity) => {
    if (!isAuthenticated) {
      alert('Please login to apply for opportunities');
      router.push('/login');
      return;
    }
    
    setSelectedOpportunity(opportunity);
    setCoverLetter('');
    setShowApplicationModal(true);
  };

  const submitApplication = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to apply');
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          opportunityId: selectedOpportunity._id,
          coverLetter: coverLetter
        })
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        alert('Session expired. Please login again.');
        router.push('/login');
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAppliedOpportunities(prev => new Set([...prev, selectedOpportunity._id]));
        setShowApplicationModal(false);
        alert(`Application submitted for ${selectedOpportunity.title}!`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Application error:', error);
      alert('Error submitting application. Please try again.');
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setAppliedOpportunities(new Set());
    alert('Logged out successfully');
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      'internship': 'bg-blue-50 text-blue-700 border border-blue-200',
      'job': 'bg-green-50 text-green-700 border border-green-200',
      'daily': 'bg-purple-50 text-purple-700 border border-purple-200',
      'weekly': 'bg-orange-50 text-orange-700 border border-orange-200',
      'weekend': 'bg-pink-50 text-pink-700 border border-pink-200',
      'full_time': 'bg-red-50 text-red-700 border border-red-200',
      'part_time': 'bg-indigo-50 text-indigo-700 border border-indigo-200'
    };
    return colors[type] || 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      <Header activeLink="/jobs"  />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Culinary Opportunities</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find internships and jobs with top restaurants and culinary establishments
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Search by title, skills, or location..."
            />
          </div>
          
          {!isAuthenticated && (
            <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100 max-w-2xl mx-auto">
              <p className="flex items-center justify-center text-blue-700 text-sm">
                <Award className="w-4 h-4 mr-2" />
                <span>Create an account to apply for opportunities and track your applications</span>
              </p>
            </div>
          )}
        </div>


        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block lg:w-80">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="relative">
                    <select 
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="block w-full pl-3 pr-10 py-3 text-base border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 appearance-none"
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
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opportunity Type</label>
                  <div className="relative">
                    <select 
                      value={filters.opportunityType}
                      onChange={(e) => handleFilterChange('opportunityType', e.target.value)}
                      className="block w-full pl-3 pr-10 py-3 text-base border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 appearance-none"
                    >
                      <option value="">All Types</option>
                      <option value="internship">Internship</option>
                      <option value="job">Job</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
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
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                      placeholder="City or area"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <div className="relative">
                    <select 
                      value={filters.durationUnit}
                      onChange={(e) => handleFilterChange('durationUnit', e.target.value)}
                      className="block w-full pl-3 pr-10 py-3 text-base border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 appearance-none"
                    >
                      <option value="">Any Duration</option>
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
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
                      onChange={(e) => handleFilterChange('minStipend', e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                      placeholder="Minimum amount"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 hover:bg-gray-50 font-medium shadow-sm"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              {Object.values(filters).some(value => value !== '') && (
                <span className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {Object.values(filters).filter(value => value !== '').length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <div className="flex items-center">
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium mr-3"
                  >
                    Clear all
                  </button>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Mobile filter inputs (same as desktop but mobile optimized) */}
                {/* ... */}
              </div>
            </div>
          )}

          {/* Opportunities List */}
          <div className="w-full lg:flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
                {filteredOpportunities.length} Opportunities Available
              </h2>
              <div className="text-sm text-gray-500 flex items-center">
                <span className="mr-2">Sort by:</span>
                <div className="relative">
                  <select className="pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 appearance-none">
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

            {loading ? (
              <div className="grid grid-cols-1 gap-5">
                {[1, 2, 3].map(i => (
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
                  <OpportunityCard key={opportunity._id} opportunity={opportunity} appliedOpportunities ={appliedOpportunities} isAuthenticated={isAuthenticated} />
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Apply for Opportunity</h3>
                <button 
                  onClick={() => setShowApplicationModal(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900">{selectedOpportunity.title}</h4>
                <p className="text-gray-600 text-sm">
                  {selectedOpportunity.branch?.name}
                  {selectedOpportunity.branch?.location && ` • ${selectedOpportunity.branch.location}`}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <span className="font-medium mr-1">Stipend:</span>
                    {getStipendText(selectedOpportunity.stipend)}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-1">Duration:</span>
                    {getDurationText(selectedOpportunity)}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-1">Type:</span>
                    {selectedOpportunity.opportunityType}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-1">Schedule:</span>
                    {selectedOpportunity.internshipType}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea 
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Why are you interested in this opportunity?"
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume
                </label>
                <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-gray-50">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">my_resume.pdf</span>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-800">Change</button>
                </div>
                <p className="mt-1 text-xs text-gray-500">We'll use the resume from your profile</p>
              </div>
              
              <button
                onClick={submitApplication}
                className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}