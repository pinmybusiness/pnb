// pages/branch/profile.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { MapPin, Store, Clock } from 'lucide-react';
import BranchForm from '@/components/BranchForm';
import { useSelector } from 'react-redux';

const BranchProfile = () => {
  const router = useRouter();
    const { user, token } = useSelector((state) => state.auth);
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const branchId = user?.branch

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        // Fetch branch details
        const branchResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/branches/${branchId}`);
        setBranch(branchResponse.data.data);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch branch details');
      } finally {
        setLoading(false);
      }
    };

    fetchBranch();
  }, [router]);

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    toast.success('Branch updated successfully');
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
                <p className="text-sm font-medium text-gray-700">Parent Restaurant</p>
                <p className="text-gray-900">{branch.parentRestaurant?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Status</p>
                <p className="text-gray-900">
                  {branch.status.current.replace('_', ' ')} {branch.status.reason ? `(${branch.status.reason.replace('_', ' ')})` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              Location Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Address</p>
                <p className="text-gray-900">{branch.location.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">City</p>
                <p className="text-gray-900">{branch.location.city}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">State</p>
                <p className="text-gray-900">{branch.location.state}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Postal Code</p>
                <p className="text-gray-900">{branch.location.postalCode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Country</p>
                <p className="text-gray-900">{branch.location.country}</p>
              </div>
            </div>
          </div>

          {/* Trial Information */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Free Trial
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Trial Active</p>
                <p className="text-gray-900">{branch.trial.isActive ? 'Yes' : 'No'}</p>
              </div>
              {branch.trial.isActive && (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Start Date</p>
                    <p className="text-gray-900">{new Date(branch.trial.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">End Date</p>
                    <p className="text-gray-900">{new Date(branch.trial.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Extended Days</p>
                    <p className="text-gray-900">{branch.trial.extendedDays || 0}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
            >
              Edit Branch
            </button>
          </div>
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