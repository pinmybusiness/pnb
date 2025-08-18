'use client';
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import { 
  Store, 
  MapPin, 
  ChevronDown, 
  X, 
  Clock,
  Check,
  AlertCircle
} from "lucide-react";

const statusOptions = [
  { value: 'no_status', label: 'No Status', color: 'bg-gray-500' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'partnered', label: 'Partnered', color: 'bg-green-500' },
  { value: 'closed', label: 'Closed', color: 'bg-red-500' },
];

const RestaurantForm = () => {
  const router = useRouter();
  const params = useParams();
  const isEditMode = !!params.id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    // phone: '',
    // email: '',
    // website: '',
    logo: '',
    isBranch: false,
    parentRestaurant: '',
    status: { current: 'no_status', reason: '', updatedAt: new Date() },
    // trial: {
    //   isActive: false,
    //   startDate: null,
    //   endDate: null,
    // },
    location: {
      type: 'Point',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      coordinates: [0, 0]
    }
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showTrialForm, setShowTrialForm] = useState(false);
  const [trialDays, setTrialDays] = useState(14);
  const [parentRestaurants, setParentRestaurants] = useState([]);

  // Create Axios instance
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
  });

  // Add request interceptor for auth token
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Fetch restaurant data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchRestaurant = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/api/restaurants/${params.id}`);
          const { data } = response.data;
          
          setFormData({
            ...data,
            status: data.status || { current: 'no_status', reason: '', updatedAt: new Date() },
            trial: data.trial || {
              isActive: false,
              startDate: null,
              endDate: null,
            }
          });
          
          if (data.trial?.isActive) {
            setShowTrialForm(true);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to fetch restaurant data');
        } finally {
          setLoading(false);
        }
      };
      
      fetchRestaurant();
    }
  }, [isEditMode, params.id]);

  // Fetch parent restaurants for branch selection
  useEffect(() => {
    if (formData.isBranch) {
      const fetchParentRestaurants = async () => {
        try {
          const response = await api.get('/api/restaurants');
          const { data } = response.data;
          setParentRestaurants(data);
        } catch (error) {
          toast.error(error.response?.data?.message || 'Failed to fetch parent restaurants');
        }
      };
      
      fetchParentRestaurants();
    }
  }, [formData.isBranch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleTrialToggle = () => {
    if (!showTrialForm) {
      setFormData(prev => ({
        ...prev,
        trial: {
          isActive: true,
          startDate: new Date(),
          endDate: new Date(Date.now() + trialDays * 86400000)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        trial: {
          isActive: false,
          startDate: null,
          endDate: null
        }
      }));
    }
    setShowTrialForm(!showTrialForm);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.location.address) newErrors.address = 'Address is required';
    if (!formData.location.city) newErrors.city = 'City is required';
    // if (!formData.phone) newErrors.phone = 'Phone is required';
    if (formData.isBranch && !formData.parentRestaurant) {
      newErrors.parentRestaurant = 'Parent restaurant is required for branches';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    try {
      setLoading(true);
      
      const submissionData = {
        ...formData,
        location: {
          ...formData.location,
          coordinates: formData.location.coordinates.map(Number)
        }
      };

      if (isEditMode) {
        await api.put(`/api/restaurants/${params.id}`, submissionData);
        toast.success('Restaurant updated successfully!');
      } else {
        await api.post('/api/restaurants', submissionData);
        toast.success('Restaurant created successfully!');
      }
      
      router.push('/company/admin/restaurants');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrial = async () => {
    try {
      setLoading(true);
      
      const response = await api.post(`/api/restaurants/${params.id}/trial`, { days: trialDays });
      
      setFormData(prev => ({
        ...prev,
        trial: response.data.data.trial
      }));
      toast.success('Trial started successfully!');
      setShowTrialForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start trial');
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
            {isEditMode ? 'Edit Restaurant' : 'Add New Restaurant'}
          </h1>
          <p className="text-gray-500">
            {isEditMode ? 'Update restaurant details' : 'Create a new restaurant partner'}
          </p>
        </div>
        <button
          onClick={() => router.push('/company/admin/restaurants')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <X className="h-5 w-5 mr-1" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Store className="h-5 w-5 mr-2 text-primary" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g. Spice Garden"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

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

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Brief description about the restaurant"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary" />
            Location Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.location.address}
                onChange={handleLocationChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Street address"
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.location.city}
                onChange={handleLocationChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="City name"
              />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.location.state}
                onChange={handleLocationChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="State"
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
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.location.country}
                onChange={handleLocationChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Country"
              />
            </div>
          </div>
        </div>

        {/* <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="+91 9876543210"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="contact@restaurant.com"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://restaurant.com"
              />
            </div>
          </div>
        </div> */}

        {/* <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            Additional Settings
          </h2>

          <div className="space-y-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isBranch"
                name="isBranch"
                checked={formData.isBranch}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  isBranch: e.target.checked,
                  parentRestaurant: e.target.checked ? prev.parentRestaurant : ''
                }))}
                className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <label htmlFor="isBranch" className="ml-2 block text-sm text-gray-700">
                This is a branch location
              </label>
            </div>

            {formData.isBranch && (
              <div>
                <label htmlFor="parentRestaurant" className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Restaurant *
                </label>
                <select
                  id="parentRestaurant"
                  name="parentRestaurant"
                  value={formData.parentRestaurant}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.parentRestaurant ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select parent restaurant</option>
                  {parentRestaurants.map(restaurant => (
                    <option key={restaurant._id} value={restaurant._id}>
                      {restaurant.name}
                    </option>
                  ))}
                </select>
                {errors.parentRestaurant && (
                  <p className="mt-1 text-sm text-red-600">{errors.parentRestaurant}</p>
                )}
              </div>
            )}

            {isEditMode && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Free Trial</h3>
                      <p className="text-sm text-gray-500">
                        {formData.trial?.isActive ? (
                          formData.trial.endDate ? (
                            `Active until ${new Date(formData.trial.endDate).toLocaleDateString()}`
                          ) : (
                            'Active (no end date)'
                          )
                        ) : (
                          'Not active'
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {!formData.trial?.isActive ? (
                    <button
                      type="button"
                      onClick={() => setShowTrialForm(true)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary hover:bg-primary/90"
                    >
                      Start Trial
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        trial: {
                          isActive: false,
                          startDate: null,
                          endDate: null
                        }
                      }))}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      End Trial
                    </button>
                  )}
                </div>

                {showTrialForm && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-4">
                      <div>
                        <label htmlFor="trialDays" className="block text-sm font-medium text-gray-700 mb-1">
                          Trial Duration (days)
                        </label>
                        <input
                          type="number"
                          id="trialDays"
                          min="1"
                          max="30"
                          value={trialDays}
                          onChange={(e) => setTrialDays(parseInt(e.target.value))}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleStartTrial}
                        className="self-end inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-primary hover:bg-primary/90"
                      >
                        Confirm Trial
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowTrialForm(false)}
                        className="self-end inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div> */}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/company/admin/restaurants')}
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
            ) : isEditMode ? (
              'Update Restaurant'
            ) : (
              'Create Restaurant'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantForm;