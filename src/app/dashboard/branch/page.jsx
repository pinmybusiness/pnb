// src/app/dashboard/branch/page.jsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import apiClient from "@/lib/apiClient";
import { MapPin, Store, Clock } from 'lucide-react';
import BranchForm from '@/components/BranchForm';
import { useSelector } from 'react-redux';

const BranchProfile = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const branchId = user?.branch;
  const canEdit = user && [6, 7, 8].includes(user.role);
  console.log("branch", branch)
  useEffect(() => {
    if (!branchId) {
      toast.error('No branch associated with this user');
      setLoading(false);
      return;
    }

    const fetchBranch = async () => {
      try {
        const response = await apiClient.get(`/api/branches/${branchId}`);
        setBranch(response.data.data);
        // Temporary logging to inspect branch data
        console.log('Branch data:', response.data.data);
      } catch (error) {
        console.error('Fetch error:', error);
        const message =
          error.response?.status === 403
            ? 'Access denied to this branch'
            : error.response?.status === 404
            ? 'Branch not found'
            : error.response?.data?.message || 'Failed to fetch branch details';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBranch();
  }, [branchId]);

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    router.refresh();
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!branch) {
    return <div className="text-center py-10 text-red-500">No branch data available</div>;
  }

  // Helper function to format status and reason
  const formatStatus = (value) => {
    if (typeof value === 'string') {
      return value.replace('_', ' ');
    }
    return value?.toString() || 'N/A'; // Fallback for non-strings
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Branch Profile</h1>

      {!isEditing ? (
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          {/* Branch Details */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Store className="h-5 w-5 mr-2 text-primary" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Branch Name</p>
                <p className="text-gray-900">{branch.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Parent Organization</p>
                <p className="text-gray-900">{branch.parentRestaurant?.name || 'N/A'}</p>
              </div>
              {/* <div>
                <p className="text-sm font-medium text-gray-700">Status</p>
                <p className="text-gray-900">
                  {formatStatus(branch.statusText)} {branch.statusReason ? `(${formatStatus(branch.statusReason)})` : ''}
                </p>
              </div> */}
            </div>
          </div>

          {/* Location Information */}
          {/* <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Location Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Address</p>
                <p className="text-gray-900">{branch.location?.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">City</p>
                <p className="text-gray-900">{branch.location?.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">State</p>
                <p className="text-gray-900">{branch.location?.state || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Postal Code</p>
                <p className="text-gray-900">{branch.location?.postalCode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Country</p>
                <p className="text-gray-900">{branch.location?.country || 'N/A'}</p>
              </div>
            </div>
          </div> */}

          {/* Trial Information */}
          {/* <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Free Trial
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Trial Active</p>
                <p className="text-gray-900">{branch.trial?.isActive ? 'Yes' : 'No'}</p>
              </div>
              {branch.trial?.isActive && (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Start Date</p>
                    <p className="text-gray-900">
                      {branch.trial.startDate
                        ? new Date(branch.trial.startDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">End Date</p>
                    <p className="text-gray-900">
                      {branch.trial.endDate
                        ? new Date(branch.trial.endDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Extended Days</p>
                    <p className="text-gray-900">{branch.trial.extendedDays || 0}</p>
                  </div>
                </>
              )}
            </div>
          </div> */}

          {/* Edit Button */}
         {canEdit && (
          <div className="flex flex-col md:flex-row gap-4  md:justify-between md:items-center mt-6">
            
            {/* Change Password Button */}
            <button
              onClick={() => router.push('/dashboard/profile/change-password')}
              className="px-4 py-2 border border-primary text-primary rounded-md shadow-sm text-sm font-medium hover:bg-primary hover:text-white transition"
            >
              Change Password
            </button>

            {/* Edit Branch Button */}
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
            >
              Edit
            </button>

          </div>
        )}

        </div>
      ) : (
        <BranchForm
          branchId={branch._id}
          onSuccess={handleUpdateSuccess}
          onClose={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default BranchProfile;