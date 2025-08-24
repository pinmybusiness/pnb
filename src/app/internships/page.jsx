"use client"
import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function StudentInternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedInternships, setAppliedInternships] = useState(new Set());
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    location: '',
    duration: '',
    minStipend: '',
    search: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchInternships();
  }, []);

  useEffect(() => {
    filterInternships();
  }, [filters, internships]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  };

  const fetchInternships = async () => {
    try {
      setLoading(true);
      // Call your public internships API (no auth required)
      const response = await fetch(`http://localhost:5000/api/internships/public?limit=20`);
      const data = await response.json();
      
      if (data.success) {
        setInternships(data.data);
        setFilteredInternships(data.data);
        
        // Only fetch applied internships if user is authenticated
        if (isAuthenticated) {
          fetchAppliedInternships();
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching internships:', error);
      setLoading(false);
    }
  };

  const fetchAppliedInternships = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        const appliedIds = data.data.map(app => app.internship._id);
        setAppliedInternships(new Set(appliedIds));
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      if (error.status === 401) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
  };

  const filterInternships = () => {
    let results = [...internships];
    
    if (filters.category) {
      results = results.filter(internship => 
        internship.category === filters.category
      );
    }
    
    if (filters.type) {
      results = results.filter(internship => 
        internship.internshipType === filters.type
      );
    }
    
    if (filters.location) {
      results = results.filter(internship => 
        internship.branch?.address?.toLowerCase().includes(filters.location.toLowerCase()) ||
        internship.restaurant?.address?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.duration) {
      results = results.filter(internship => 
        internship.duration?.unit === filters.duration
      );
    }
    
    if (filters.minStipend) {
      results = results.filter(internship => 
        internship.stipend?.amount >= parseInt(filters.minStipend)
      );
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(internship => 
        internship.title.toLowerCase().includes(searchTerm) ||
        internship.description.toLowerCase().includes(searchTerm) ||
        internship.restaurant?.name.toLowerCase().includes(searchTerm) ||
        internship.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    setFilteredInternships(results);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      type: '',
      location: '',
      duration: '',
      minStipend: '',
      search: ''
    });
  };

  const handleApply = (internship) => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      alert('Please login to apply for internships');
      router.push('/login');
      return;
    }
    
    setSelectedInternship(internship);
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

      const response = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          internshipId: selectedInternship._id,
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
        // Add to applied internships
        setAppliedInternships(prev => new Set([...prev, selectedInternship._id]));
        
        // Close modal
        setShowApplicationModal(false);
        
        // Show success message
        alert(`Application submitted for ${selectedInternship.title}!`);
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
    setAppliedInternships(new Set());
    alert('Logged out successfully');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDaysLeft = (dateString) => {
    const today = new Date();
    const deadline = new Date(dateString);
    const diffTime = deadline - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStipendText = (stipend) => {
    if (!stipend || !stipend.amount) return 'Unpaid';
    
    return `${stipend.currency || '₹'}${stipend.amount.toLocaleString()}/${stipend.period || 'month'}`;
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
 {/* Logo */}
         <Link href='/'>
          <div className="flex items-center">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-gray-900">ListenLift.ai</span>
          </div>
         </Link>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-dark hover:text-primary px-3 py-2">Internships</a>
              {isAuthenticated && (
                <a href="#" className="text-dark hover:text-primary px-3 py-2">My Applications</a>
              )}
              {isAuthenticated ? (
                <button onClick={handleLogout} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                  Logout
                </button>
              ) : (
                <button onClick={handleLogin} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className=" mb-8">
          <h1 className="text-3xl font-bold mb-4">Find Your Daily Internship</h1>
          <p className="text-lg mb-6">Gain real-world experience with top restaurants near you</p>
          
          {!isAuthenticated && (
            <div className="bg-white/20 p-4 rounded-lg mb-4">
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <span>Login to apply for internships and track your applications</span>
              </p>
            </div>
          )}
          
          <div className="relative">
            <input 
              type="text" 
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full p-4 rounded-lg text-dark focus:ring-2 focus:ring-orange border border-soft focus:outline-none"
              placeholder="Search internships by title, restaurant, or location..."
            />
            <button className="absolute right-2 top-2 bg-primary text-white p-2 rounded-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-dark mb-4">Filters</h2>
              
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
                  <select 
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full p-2 border border-soft rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="">All Categories</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="content">Content</option>
                    <option value="culinary">Culinary</option>
                    <option value="management">Management</option>
                  </select>
                </div>
                
                {/* Other filter inputs remain the same */}
                {/* ... */}
              </div>
              
              <button 
                onClick={clearFilters}
                className="w-full mt-6 text-primary hover:text-primary/80 font-medium text-sm"
              >
                Clear all filters
              </button>
            </div>
          </div>

          {/* Internships List */}
          <div className="w-full md:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-dark">
                {filteredInternships.length} Internships Available
              </h2>
              <div className="text-sm text-gray-500">
                Sorted by: <select className="border-none bg-transparent focus:ring-0">
                  <option>Most Recent</option>
                  <option>Highest Stipend</option>
                  <option>Nearest Location</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                    <div className="flex space-x-4">
                      <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredInternships.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredInternships.map((internship) => (
                  <div key={internship._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                              <span className="text-lg font-bold text-primary">
                                {internship.restaurant?.name?.charAt(0) || 'I'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-dark">{internship.title}</h3>
                            <p className="text-gray-600">
                              {internship.restaurant?.name}
                              {internship.branch?.name && ` • ${internship.branch.name}`}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {internship.internshipType || 'Part-time'}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {internship.branch?.address || internship.restaurant?.address || 'Location not specified'}
                              </span>
                              {internship.duration && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  {internship.duration.value} {internship.duration.unit}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:text-right">
                          <div className="text-lg font-bold text-dark">
                            {getStipendText(internship.stipend)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Apply by {formatDate(internship.deadline)}
                          </div>
                        </div>
                      </div>
                      
                      <p className="mt-4 text-gray-600 line-clamp-2">{internship.description}</p>
                      
                      <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <div className="text-sm text-gray-500">
                          {internship.applications && internship.applications.length > 0 && (
                            <span className="inline-flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                              </svg>
                              {internship.applications.length} applications
                            </span>
                          )}
                          {getDaysLeft(internship.deadline) > 0 && (
                            <span className="ml-3 inline-flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              {getDaysLeft(internship.deadline)} days left
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-4 sm:mt-0">
                          {appliedInternships.has(internship._id) ? (
                            <span className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-green-light text-green-custom">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              Applied
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleApply(internship)}
                              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                              {isAuthenticated ? 'Apply Now' : 'Login to Apply'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="mt-4 text-lg font-medium text-dark">No internships found</h3>
                <p className="mt-2 text-gray-500">Try adjusting your search filters to find more opportunities.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedInternship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-dark">Apply for Internship</h3>
                <button 
                  onClick={() => setShowApplicationModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-dark">{selectedInternship.title}</h4>
                <p className="text-gray-600">
                  {selectedInternship.restaurant?.name}
                  {selectedInternship.branch?.name && ` • ${selectedInternship.branch.name}`}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Stipend: {getStipendText(selectedInternship.stipend)}
                </p>
                <p className="text-sm text-gray-500">
                  Duration: {selectedInternship.duration?.value} {selectedInternship.duration?.unit}
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea 
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-soft rounded-md focus:ring-primary focus:border-primary"
                  placeholder="Why are you interested in this internship?"
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume
                </label>
                <div className="flex items-center justify-between p-3 border border-soft rounded-md">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className="text-sm text-gray-600">my_resume.pdf</span>
                  </div>
                  <button className="text-sm text-primary hover:text-primary/80">Change</button>
                </div>
              </div>
              
              <button
                onClick={submitApplication}
                className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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