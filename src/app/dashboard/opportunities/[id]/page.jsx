'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  MapPin, 
  Briefcase,
  BookOpen,
  Edit,
  CheckCircle,
  XCircle,
  Clock4,
  UserCheck,
  FileText,
  Building,
  Mail,
  Phone,
  Globe
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useSelector } from 'react-redux';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import ApplicationList from '@/components/opportunity/ApplicationList';

const OpportunityView = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { user, token } = useSelector((state) => state.auth);
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [showApplications, setShowApplications] = useState(false);

  useEffect(() => {
    if (id && token) {
      fetchOpportunity();
      fetchApplications();
    }
  }, [id, token]);

  const fetchOpportunity = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setOpportunity(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      toast.error('Failed to fetch opportunity details');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applications?opportunityId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setApplications(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setOpportunity(prev => ({ ...prev, status: newStatus }));
        toast.success(`Opportunity ${newStatus} successfully`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleApprove = () => handleStatusUpdate('approved');
  const handleReject = () => handleStatusUpdate('rejected');
  const handleClose = () => handleStatusUpdate('closed');

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type) => {
    const typeMap = {
      daily: 'Daily',
      weekly: 'Weekly',
      weekend: 'Weekend',
      part_time: 'Part Time',
      full_time: 'Full Time'
    };
    return typeMap[type] || type;
  };

  const getStipendText = (stipend) => {
    if (!stipend || !stipend.amount) return 'Unpaid';
    
    const paymentTypeMap = {
      'daily': 'per day',
      'weekly': 'per week',
      'monthly': 'per month',
      'after_completion': 'after completion'
    };
    
    const period = paymentTypeMap[stipend.paymentType] || 'per month';
    return `₹${stipend.amount.toLocaleString()} ${period}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilStart = (startDate) => {
    if (!startDate) return null;
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days to start` : 'Started';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-dark mb-4">Opportunity not found</h2>
        <p className="text-gray-500 mb-6">The opportunity you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/dashboard/opportunities')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Opportunities
        </Button>
      </div>
    );
  }

  const canEdit = user.role <= 2 || (user.role >= 6 && user.branch === opportunity.branch?._id);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => router.push('/dashboard/opportunities')}
            className="flex items-center text-gray-600 hover:text-primary mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-dark">Opportunity Details</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {canEdit && (
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/opportunities/${id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          
          {opportunity.status === 'pending' && user.role <= 2 && (
            <>
              <Button variant="success" onClick={handleApprove}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button variant="danger" onClick={handleReject}>
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          )}
          
          {opportunity.status === 'approved' && canEdit && (
            <Button variant="secondary" onClick={handleClose}>
              <XCircle className="h-4 w-4 mr-2" />
              Close
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Opportunity Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(opportunity.status)}`}>
                    {opportunity.status}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {opportunity.opportunityType}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-dark">{opportunity.title}</h2>
                <p className="text-gray-600 mt-1">{opportunity.category}</p>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {getStipendText(opportunity.stipend)}
                </div>
                <div className="text-sm text-gray-500">
                  {getTypeLabel(opportunity.internshipType)}
                </div>
              </div>
            </div>

            {opportunity.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-dark mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{opportunity.description}</p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Positions</p>
                  <p className="font-semibold text-dark">
                    {opportunity.filledPositions || 0} / {opportunity.numberOfPeople}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hours Per Day</p>
                  <p className="font-semibold text-dark">
                    {opportunity.schedule?.hoursPerDay || 8} hours
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-semibold text-dark">
                    {formatDate(opportunity.schedule?.startDate)}
                  </p>
                  {opportunity.schedule?.startDate && (
                    <p className="text-sm text-gray-500">
                      {getDaysUntilStart(opportunity.schedule.startDate)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {opportunity.opportunityType === 'job' ? (
                    <Briefcase className="h-5 w-5 text-gray-600" />
                  ) : (
                    <BookOpen className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold text-dark">
                    {opportunity.duration} {opportunity.durationUnit}
                  </p>
                </div>
              </div>

              {opportunity.schedule?.shift && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Clock4 className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shift</p>
                    <p className="font-semibold text-dark capitalize">
                      {opportunity.schedule.shift}
                    </p>
                  </div>
                </div>
              )}

              {opportunity.schedule?.days && opportunity.schedule.days.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Working Days</p>
                    <p className="font-semibold text-dark">
                      {opportunity.schedule.days.map(day => 
                        day.charAt(0).toUpperCase() + day.slice(1)
                      ).join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Stipend Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-dark mb-3">Compensation & Benefits</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Stipend/Salary</span>
                  <span className="font-semibold text-dark">
                    {getStipendText(opportunity.stipend)}
                  </span>
                </div>
                
                {opportunity.stipend?.includesFood && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Food Provided</span>
                    <span className="text-green-600">Yes</span>
                  </div>
                )}
                
                {opportunity.stipend?.includesAccommodation && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Accommodation</span>
                    <span className="text-green-600">Provided</span>
                  </div>
                )}
                
                {opportunity.stipend?.includesTips && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tips Included</span>
                    <span className="text-green-600">Yes</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Applications Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-dark">Applications</h3>
              <Button
                variant={showApplications ? "secondary" : "primary"}
                onClick={() => setShowApplications(!showApplications)}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                {showApplications ? 'Hide Applications' : `View Applications (${applications.length})`}
              </Button>
            </div>

            {showApplications && (
              <ApplicationList 
                applications={applications} 
                opportunityId={id}
                onApplicationUpdate={fetchApplications}
              />
            )}

            {!showApplications && applications.length > 0 && (
              <div className="text-center py-8">
                <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {applications.length} application{applications.length !== 1 ? 's' : ''} received
                </p>
              </div>
            )}

            {applications.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No applications received yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Branch Information */}
          {opportunity.branch && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-dark mb-4">Branch Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-dark">{opportunity.branch.name}</p>
                    <p className="text-sm text-gray-500">Branch</p>
                  </div>
                </div>

                {opportunity.branch.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-dark">{opportunity.branch.address}</p>
                      {opportunity.branch.location && (
                        <p className="text-sm text-gray-500">{opportunity.branch.location}</p>
                      )}
                    </div>
                  </div>
                )}

                {opportunity.branch.contactEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-dark">{opportunity.branch.contactEmail}</p>
                      <p className="text-sm text-gray-500">Email</p>
                    </div>
                  </div>
                )}

                {opportunity.branch.contactPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-dark">{opportunity.branch.contactPhone}</p>
                      <p className="text-sm text-gray-500">Phone</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Created By */}
          {opportunity.createdBy && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-dark mb-4">Created By</h3>
              <div className="space-y-2">
                <p className="font-medium text-dark">{opportunity.createdBy.name}</p>
                <p className="text-sm text-gray-500">{opportunity.createdBy.email}</p>
                <p className="text-sm text-gray-500">
                  {new Date(opportunity.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-dark mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Views</span>
                <span className="font-semibold text-dark">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Applications</span>
                <span className="font-semibold text-dark">{applications.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Fill Rate</span>
                <span className="font-semibold text-dark">
                  {Math.round(((opportunity.filledPositions || 0) / opportunity.numberOfPeople) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-dark mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => router.push(`/dashboard/opportunities/${id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Opportunity
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => setShowApplications(true)}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                View Applications
              </Button>

              {opportunity.status === 'approved' && (
                <Button
                  variant="secondary"
                  className="w-full justify-center"
                  onClick={handleClose}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Close Opportunity
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityView;