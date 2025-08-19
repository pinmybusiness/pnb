'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";
import axios from "axios";
import { 
  X, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  User, 
  Calendar, 
  Info, 
  Store,
  ChevronDown
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const statusOptions = [
  { value: 'no_status', label: 'No Status', color: 'bg-gray-500' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'partnered', label: 'Partnered', color: 'bg-green-500' },
  { value: 'closed', label: 'Closed', color: 'bg-red-500' },
];

const statusReasons = {
  no_status: [],
  in_progress: ['under_review', 'documents_pending'],
  partnered: ['active', 'trial'],
  closed: ['non_payment', 'violation', 'owner_request']
};

const BranchForm = ({ onSuccess, onClose }) => {
  const router = useRouter();
  const params = useParams();
  const branchId = params.id; // Get ID from URL params
  const parentId = params.parentId; // Get parent restaurant ID if available

  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

 const [formData, setFormData] = useState({
    name: '',
    parentRestaurant: parentId || '',
    location: {
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      coordinates: [0, 0]
    },
    status: {
      current: 'no_status',
      reason: '',
      updatedAt: new Date()
    },
    trial: {
      isActive: false,
      startDate: null,
      endDate: null,
      extendedDays: 0
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch parent restaurants list
        const restaurantsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`);
        setRestaurants(restaurantsRes.data.data);

        // If in edit mode (branchId exists), fetch branch data
        if (branchId) {
          const branchRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${branchId}`);
          const branchData = branchRes.data.data;
          
          setFormData({
            ...branchData,
            trial: branchData.trial || {
              isActive: false,
              startDate: null,
              endDate: null,
              extendedDays: 0
            }
          });

          // Fetch teams for this branch
          const teamsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/teams?branch=${branchId}`);
          setTeams(teamsRes.data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch data");
      }
    };
    
    fetchData();
  }, [branchId, parentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value
      }
    }));
  };

  const handleStatusChange = (status) => {
    setFormData(prev => ({
      ...prev,
      status: {
        current: status.value,
        reason: '',
        updatedAt: new Date()
      }
    }));
    setShowStatusDropdown(false);
  };

  const handleReasonChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      status: {
        ...prev.status,
        reason: value
      }
    }));
  };

  const handleTrialToggle = (e) => {
    const isActive = e.target.checked;
    setFormData(prev => ({
      ...prev,
      trial: {
        ...prev.trial,
        isActive,
        startDate: isActive ? new Date() : null,
        endDate: isActive ? new Date(Date.now() + 14 * 86400000) : null,
        extendedDays: 0
      }
    }));
  };

 const handleTrialDaysChange = (days) => {
    setFormData(prev => {
      if (!prev.trial.startDate || !(prev.trial.startDate instanceof Date)) {
        return prev;
      }

      // Ensure minimum 1 day but allow keeping original duration
      const newDays = days < 1 ? 1 : days;
      const standardTrialDays = 14; // Default trial period
      
      return {
        ...prev,
        trial: {
          ...prev.trial,
          endDate: new Date(prev.trial.startDate.getTime() + newDays * 86400000),
          extendedDays: newDays > standardTrialDays ? newDays - standardTrialDays : 0
        }
      };
    });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        parentRestaurant: formData.parentRestaurant
      };

      if (branchId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/branches/${branchId}`, payload);
        toast.success("Branch updated successfully");
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/branches`, payload);
        toast.success("Branch created successfully");
      }

      onSuccess?.();
      onClose?.();
      router.refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : 'bg-gray-500';
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : 'Unknown';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {branchId ? 'Edit Branch' : 'Add New Branch'}
          </h1>
          <p className="text-gray-500">
            {branchId ? 'Update branch details' : 'Create a new branch location'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <X className="h-5 w-5 mr-1" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Store className="h-5 w-5 mr-2 text-primary" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                maxLength={100}
              />
            </div>

            {!parentId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Restaurant *
                </label>
                <select
                  name="parentRestaurant"
                  value={formData.parentRestaurant}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Restaurant</option>
                  {restaurants.filter(r => !r.isBranch).map(restaurant => (
                    <option key={restaurant._id} value={restaurant._id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className={`w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md ${showStatusDropdown ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className="flex items-center">
                    <span className={`h-3 w-3 rounded-full mr-2 ${getStatusColor(formData.status.current)}`}></span>
                    <span>{getStatusLabel(formData.status.current)}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                
                {showStatusDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-200">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleStatusChange(option)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                      >
                        <span className={`h-3 w-3 rounded-full mr-2 ${option.color}`}></span>
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {formData.status.current !== 'no_status' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status Reason *
                </label>
                <select
                  value={formData.status.reason}
                  onChange={handleReasonChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Reason</option>
                  {statusReasons[formData.status.current]?.map(option => (
                    <option key={option} value={option}>
                      {option.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary" />
            Location Information
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.location.address}
                onChange={handleLocationChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.location.city}
                  onChange={handleLocationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.location.state}
                  onChange={handleLocationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.location.postalCode}
                onChange={handleLocationChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Postal code"
              />
            </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.location.country}
                  onChange={handleLocationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

  {/* Trial Section */}
  <div className="bg-white shadow rounded-lg p-6">
    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
      <Clock className="h-5 w-5 mr-2 text-primary" />
      Free Trial
    </h2>

    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.trial.isActive}
          onChange={handleTrialToggle}
          className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Enable Free Trial
        </label>
      </div>
      
      {formData.trial.isActive && formData.trial.endDate && (
        <div className="text-sm text-gray-500">
          {formData.trial.extendedDays > 0 ? (
            `Extended by ${formData.trial.extendedDays} days (${new Date(formData.trial.endDate).toLocaleDateString()})`
          ) : (
            `Standard 14-day trial (${new Date(formData.trial.endDate).toLocaleDateString()})`
          )}
        </div>
      )}
    </div>

    {formData.trial.isActive && (
      <div className="mt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <DatePicker
              selected={formData.trial.startDate ? new Date(formData.trial.startDate) : null}
              onChange={(date) => {
                if (!date) return;
                const currentDuration = formData.trial.endDate 
                  ? (formData.trial.endDate - formData.trial.startDate) / 86400000
                  : 14;
                setFormData(prev => ({
                  ...prev,
                  trial: {
                    ...prev.trial,
                    startDate: date,
                    endDate: new Date(date.getTime() + currentDuration * 86400000)
                  }
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <DatePicker
              selected={formData.trial.endDate ? new Date(formData.trial.endDate) : null}
              onChange={(date) => {
                if (!date || !formData.trial.startDate) return;
                const days = Math.round((date - formData.trial.startDate) / 86400000);
                handleTrialDaysChange(days);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
              minDate={formData.trial.startDate ? new Date(formData.trial.startDate) : null}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trial Duration
          </label>
          <div className="flex gap-2 items-center">
            <div className="flex gap-2">
              {[7, 14, 30].map(days => (
                <button
                  type="button"
                  key={days}
                  onClick={() => handleTrialDaysChange(days)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    formData.trial.startDate && formData.trial.endDate &&
                    Math.round((formData.trial.endDate - formData.trial.startDate) / 86400000) === days
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {days} days
                </button>
              ))}
            </div>
            <div className="relative flex-1">
              <input
                type="number"
                value={
                  formData.trial.startDate && formData.trial.endDate
                    ? Math.round((formData.trial.endDate - formData.trial.startDate) / 86400000)
                    : 14
                }
                onChange={(e) => {
                  const days = parseInt(e.target.value);
                  if (!isNaN(days)) {
                    handleTrialDaysChange(days);
                  }
                }}
                className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                min="1"
              />
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {formData.trial.extendedDays > 0 ? (
              <span className="text-green-600">
                Trial extended by {formData.trial.extendedDays} days beyond standard period
              </span>
            ) : (
              <span>Standard 14-day trial period</span>
            )}
          </div>
        </div>
      </div>
    )}
  </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {loading ? (
              'Processing...'
            ) : branchId ? (
              'Update Branch'
            ) : (
              'Create Branch'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BranchForm;