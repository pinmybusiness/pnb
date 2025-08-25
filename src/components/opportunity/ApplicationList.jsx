import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  Clock4
} from 'lucide-react';

const ApplicationList = ({ applications, opportunityId, onApplicationUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState({});

  const statusColors = {
    applied: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    shortlisted: 'bg-purple-100 text-purple-800',
    interview_scheduled: 'bg-indigo-100 text-indigo-800',
    rejected: 'bg-red-100 text-red-800',
    accepted: 'bg-green-100 text-green-800',
    withdrawn: 'bg-gray-100 text-gray-800',
    completed: 'bg-green-100 text-green-800'
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return CheckCircle;
      case 'rejected': return XCircle;
      case 'interview_scheduled': return Calendar;
      default: return Clock4;
    }
  };

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div key={application._id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-semibold text-dark">
                {application.candidate?.name || 'Unknown Candidate'}
              </h4>
              <p className="text-sm text-gray-500">{application.candidate?.email}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[application.status]}`}>
              {application.status.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{new Date(application.appliedAt).toLocaleDateString()}</span>
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
            <button className="text-sm text-primary hover:text-primary/80">
              View Profile
            </button>
            <button className="text-sm text-primary hover:text-primary/80">
              View Resume
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationList;