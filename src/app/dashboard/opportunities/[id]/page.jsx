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
  Languages,
  Utensils,
  Home
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  getOpportunityTypeText,
  getInternshipTypeText,
  getStipendText,
  getPaymentTypeText,
  getLanguageText,
  getDayName,
  getShiftText,
  getDurationText,
  getStatusText
} from '@/utils/opportunity';
import { benefits, languages } from '@/data/opportunityData';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import ApplicationList from '@/components/opportunity/ApplicationList';
import { formatDateWithSuffix } from '@/utils/dateFormat';

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
            Authorization: `Bearer ${token}`,
          },
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
            Authorization: `Bearer ${token}`,
          },
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOpportunity((prev) => ({ ...prev, status: newStatus }));
        toast.success(`Opportunity ${getStatusText(newStatus)} successfully`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleApprove = () => handleStatusUpdate(2); // 2 = approved
  const handleReject = () => handleStatusUpdate(3); // 3 = rejected
  const handleClose = () => handleStatusUpdate(4); // 4 = closed

  const getStatusColor = (status) => {
    switch (status) {
      case 0: return 'bg-gray-100 text-gray-800';
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-green-100 text-green-800';
      case 3: return 'bg-red-100 text-red-800';
      case 4: return 'bg-purple-100 text-purple-800';
      case 5: return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      <div className="text-center py-12 px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-dark mb-4">Opportunity not found</h2>
        <p className="text-sm text-gray-500 mb-6">The opportunity you're looking for doesn't exist.</p>
        <Button
          onClick={() => router.push('/dashboard/opportunities')}
          className="px-4 py-2 text-sm"
          aria-label="Back to opportunities"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Opportunities
        </Button>
      </div>
    );
  }

  const displayBenefits = opportunity.stipend?.benefits || [
    opportunity.stipend?.includesTips && 0,
    opportunity.stipend?.includesFood && 1,
    opportunity.stipend?.includesAccommodation && 2,
  ].filter(Boolean);

  const canEdit = user.role <= 2 || (user.role >= 6 && user.branch === opportunity.branch?._id);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard/opportunities')}
            className="p-2 text-gray-600 hover:text-primary rounded-md"
            aria-label="Back to opportunities"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-dark">Opportunity Details</h1>
            <p className="text-sm text-gray-500">View and manage opportunity</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {canEdit && (
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/opportunities/${id}/edit`)}
              className="px-4 py-2 text-sm"
              aria-label="Edit opportunity"
            >
              <Edit className="h-5 w-5 mr-2" />
              Edit
            </Button>
          )}
          {opportunity.status === 1 && user.role <= 2 && (
            <>
              <Button
                variant="success"
                onClick={handleApprove}
                className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white"
                aria-label="Approve opportunity"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Approve
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white"
                aria-label="Reject opportunity"
              >
                <XCircle className="h-5 w-5 mr-2" />
                Reject
              </Button>
            </>
          )}
          {opportunity.status === 2 && canEdit && (
            <Button
              variant="secondary"
              onClick={handleClose}
              className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white"
              aria-label="Close opportunity"
            >
              <XCircle className="h-5 w-5 mr-2" />
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Opportunity Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <StatusBadge
                    status={getStatusText(opportunity.status)}
                    className={`${getStatusColor(opportunity.status)} text-xs sm:text-sm px-2.5 py-0.5`}
                  />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                    {getOpportunityTypeText(opportunity.opportunityType)}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-dark">{opportunity.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{opportunity?.workType?.name ?? 'Unknown Work Type'}</p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-lg sm:text-xl font-bold text-primary">{getStipendText(opportunity.stipend)}</div>
                <div className="text-xs sm:text-sm text-gray-500">{getInternshipTypeText(opportunity.internshipType)}</div>
              </div>
            </div>

            {opportunity.description && (
              <div className="mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-dark mb-2">Description</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-4 sm:line-clamp-none">
                  {opportunity.description}
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Positions</p>
                  <p className="text-sm font-semibold text-dark">
                    {opportunity.filledPositions || 0} / {opportunity.numberOfPeople}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hours Per Day</p>
                  <p className="text-sm font-semibold text-dark">
                    {opportunity.schedule?.hoursPerDay || 8} hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="text-sm font-semibold text-dark">
                    {formatDateWithSuffix(opportunity.schedule?.startDate) || 'Not set'}
                  </p>
                  {opportunity.schedule?.startDate && (
                    <p className="text-xs text-gray-500">{getDaysUntilStart(opportunity.schedule.startDate)}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {opportunity.opportunityType === 0 ? (
                    <Briefcase className="h-5 w-5 text-gray-600" />
                  ) : (
                    <BookOpen className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-semibold text-dark">{getDurationText(opportunity)}</p>
                </div>
              </div>

              {opportunity.schedule?.shift !== undefined && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Clock4 className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Shift</p>
                    <p className="text-sm font-semibold text-dark">{getShiftText(opportunity.schedule.shift)}</p>
                  </div>
                </div>
              )}

              {opportunity.schedule?.days?.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Working Days</p>
                    <p className="text-sm font-semibold text-dark">
                      {opportunity.schedule.days.map((day) => getDayName(day)).join(', ')}
                    </p>
                  </div>
                </div>
              )}

              {(opportunity.internshipType === 3 || opportunity.internshipType === 4) &&
                opportunity.specificDays && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Specific Days</p>
                      <p className="text-sm font-semibold text-dark">
                        {opportunity.specificDays.map((day) => getDayName(day)).join(', ')}
                      </p>
                    </div>
                  </div>
                )}

              {opportunity.languages && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Languages className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Languages</p>
                    <div className="space-y-1">
                      {opportunity.languages.required?.length > 0 && (
                        <p className="text-sm text-dark">
                          <span className="font-semibold">Required: </span>
                          {opportunity.languages.required.map((lang) => getLanguageText(lang, languages)).join(', ')}
                        </p>
                      )}
                      {opportunity.languages.preferred?.length > 0 && (
                        <p className="text-sm text-dark">
                          <span className="font-semibold">Preferred: </span>
                          {opportunity.languages.preferred.map((lang) => getLanguageText(lang, languages)).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Compensation & Benefits */}
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h3 className="text-base sm:text-lg font-semibold text-dark mb-3">Compensation & Benefits</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Stipend/Salary</span>
                  <span className="font-semibold text-dark">{getStipendText(opportunity.stipend)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">PaymentыгFrequency</span>
                  <span className="font-semibold text-dark">
                    {getPaymentTypeText(opportunity.stipend?.paymentType)}
                  </span>
                </div>
                {displayBenefits.length > 0 ? (
                  displayBenefits.map((benefit, index) => {
                    const benefitData = benefits.find((b) => b.backendValue === benefit);
                    const Icon = benefitData?.icon === 'Utensils' ? Utensils : benefitData?.icon === 'Home' ? Home : DollarSign;
                    return (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-600">{benefitData?.label || 'Unknown Benefit'}</span>
                        <span className="text-green-600">
                          <Icon className="h-4 w-4 inline mr-1" />
                          Yes
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Additional Benefits</span>
                    <span className="text-gray-500">None</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Applications Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-dark">Applications</h3>
              <Button
                variant={showApplications ? 'secondary' : 'primary'}
                onClick={() => setShowApplications(!showApplications)}
                className="px-4 py-2 text-sm"
                aria-label={showApplications ? 'Hide applications' : 'View applications'}
              >
                <UserCheck className="h-5 w-5 mr-2" />
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
              <div className="text-center py-6">
                <UserCheck className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  {applications.length} application{applications.length !== 1 ? 's' : ''} received
                </p>
              </div>
            )}

            {applications.length === 0 && (
              <div className="text-center py-6">
                <FileText className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No applications received yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Branch Information */}
          {opportunity.branch && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-dark mb-3">Branch Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-dark">{opportunity.branch.name}</p>
                    <p className="text-xs text-gray-500">Branch</p>
                  </div>
                </div>
                {opportunity.branch.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-dark">{opportunity.branch.address}</p>
                      {opportunity.branch.location && (
                        <p className="text-xs text-gray-500">{opportunity.branch.location}</p>
                      )}
                    </div>
                  </div>
                )}
                {opportunity.branch.contactEmail && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-dark">{opportunity.branch.contactEmail}</p>
                      <p className="text-xs text-gray-500">Email</p>
                    </div>
                  </div>
                )}
                {opportunity.branch.contactPhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-dark">{opportunity.branch.contactPhone}</p>
                      <p className="text-xs text-gray-500">Phone</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Created By */}
          {opportunity.createdBy && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-dark mb-3">Created By</h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-dark">{opportunity.createdBy.name}</p>
                <p className="text-xs text-gray-500">Phone: {opportunity.createdBy.mobile}</p>
                <p className="text-xs text-gray-500">{formatDateWithSuffix(opportunity.createdAt)}</p>
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold text-dark mb-3">Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Views</span>
                <span className="font-semibold text-dark">{opportunity.views || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Applications</span>
                <span className="font-semibold text-dark">{applications.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Fill Rate</span>
                <span className="font-semibold text-dark">
                  {Math.round(
                    ((opportunity.filledPositions || 0) / (opportunity.numberOfPeople || 1)) * 100
                  )}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold text-dark mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full py-2 text-sm"
                onClick={() => router.push(`/dashboard/opportunities/${id}/edit`)}
                aria-label="Edit opportunity"
              >
                <Edit className="h-5 w-5 mr-2" />
                Edit Opportunity
              </Button>
              <Button
                variant="outline"
                className="w-full py-2 text-sm"
                onClick={() => setShowApplications(true)}
                aria-label="View applications"
              >
                <UserCheck className="h-5 w-5 mr-2" />
                View Applications
              </Button>
              {opportunity.status === 2 && (
                <Button
                  variant="secondary"
                  className="w-full py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleClose}
                  aria-label="Close opportunity"
                >
                  <XCircle className="h-5 w-5 mr-2" />
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