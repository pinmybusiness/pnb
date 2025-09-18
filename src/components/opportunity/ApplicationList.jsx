import { useState } from 'react';
import { 
  Mail, 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  Clock4,
} from 'lucide-react';
import { formatDateWithSuffix } from '@/utils/dateFormat';
import { useRouter } from 'next/navigation';
import StatusBadge from '../ui/StatusBadge';
import { getStatusText } from '@/utils/application';

const ApplicationList = ({ applications, opportunityId, onApplicationUpdate }) => {
  const router = useRouter();

  const statusColors = {
    Applied: 'bg-blue-100 text-blue-800',
    Shortlisted: 'bg-purple-100 text-purple-800',
    Rejected: 'bg-red-100 text-red-800',
    Interview: 'bg-indigo-100 text-indigo-800',
    Offer: 'bg-yellow-100 text-yellow-800',
    Hired: 'bg-green-100 text-green-800',
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Hired':
      case 'Offer':
        return CheckCircle;
      case 'Rejected':
        return XCircle;
      case 'Interview':
        return Calendar;
      default:
        return Clock4;
    }
  };

  const handleViewProfile = (userId) => {
    // Navigate to the candidate profile page with userId
    router.push(`/dashboard/candidate/${userId}`);
  };

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div key={application._id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">
                {application.candidate?.name || 'Unknown Candidate'}
              </h4>
              <p className="text-sm text-gray-500">{application.candidate?.mobile}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[application.status] || 'bg-gray-100 text-gray-800'}`}>
              <StatusBadge status={getStatusText(application.status)} />
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{formatDateWithSuffix(application.appliedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{new Date(application.appliedAt).toLocaleTimeString()}</span>
            </div>
          </div>

          {application.coverLetter && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 line-clamp-2">
                {application.coverLetter}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => handleViewProfile(application.candidate._id)}
              className="text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              View Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationList;