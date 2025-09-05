'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { MapPin, Navigation, X, Store } from 'lucide-react';
import Select from 'react-select';
import { states, citiesByState } from '../../data';

const OwnerBranchForm = ({ branchId, onSuccess, onClose }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    name: '', // User's name
    mobile: '',
    email: '',
    password: '',
    restaurantId: '',
    restaurantName: '',
    branchName: '',
    branchAddress: '',
    branchCity: '',
    branchState: '',
    branchPostalCode: '',
    branchCountry: 'India',
    branchCoordinates: [0, 0] // [longitude, latitude]
  });

  // Fetch restaurants and branch data (if editing)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch restaurants
        const restaurantsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`);
        setRestaurants(restaurantsRes.data.data);

        // Fetch branch data if branchId is provided
        if (branchId) {
          const branchRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/branches/${branchId}`);
          const branchData = branchRes.data.data;

          setFormData({
            name: '', // Not used for updates
            mobile: '',
            email: '',
            password: '',
            restaurantId: branchData.parentRestaurant?._id || '',
            restaurantName: '',
            branchName: branchData.name || '',
            branchAddress: branchData.location?.address || '',
            branchCity: branchData.location?.city || '',
            branchState: branchData.location?.state || '',
            branchPostalCode: branchData.location?.postalCode || '',
            branchCountry: branchData.location?.country || 'India',
            branchCoordinates: branchData.location?.coordinates || [0, 0]
          });

          if (branchData.location?.city && branchData.location?.state && !citiesByState[branchData.location.state]?.includes(branchData.location.city)) {
            toast.error(`Warning: City "${branchData.location.city}" is not valid for state "${branchData.location.state}". Please select a valid city.`);
          }
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to fetch data');
      }
    };
    fetchData();
  }, [branchId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle location-specific changes
  const handleLocationChange = (name, value) => {
    if (name === 'branchCity' && formData.branchState && !citiesByState[formData.branchState]?.includes(value)) {
      toast.error(`Invalid city "${value}" for state "${formData.branchState}". Please select a valid city.`);
      return;
    }

    if (name === 'latitude' || name === 'longitude') {
      setFormData((prev) => ({
        ...prev,
        branchCoordinates:
          name === 'longitude'
            ? [parseFloat(value) || 0, prev.branchCoordinates[1]]
            : [prev.branchCoordinates[0], parseFloat(value) || 0]
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        branchCity: name === 'branchState' ? '' : name === 'branchCity' ? value : prev.branchCity
      }));
    }
  };

  // Get current location
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            branchCoordinates: [longitude, latitude]
          }));
          toast.success('Location fetched successfully');
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Failed to get location. Please allow location access or enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Client-side validation
    if (!branchId) {
      // Registration mode
      if (!formData.name || !formData.mobile || !formData.password || !formData.branchName || !formData.branchAddress || !formData.branchCity) {
        toast.error('Please fill all required fields');
        setLoading(false);
        return;
      }
      if (!/^\+?[\d\s-]{10,15}$/.test(formData.mobile)) {
        toast.error('Please provide a valid mobile number');
        setLoading(false);
        return;
      }
      if (!formData.restaurantId && !formData.restaurantName) {
        toast.error('Either select a restaurant or provide a new restaurant name');
        setLoading(false);
        return;
      }
    } else {
      // Update mode
      if (!formData.branchName || !formData.branchAddress || !formData.branchCity) {
        toast.error('Please fill all required branch fields');
        setLoading(false);
        return;
      }
    }

    if (formData.branchState && formData.branchCity && !citiesByState[formData.branchState]?.includes(formData.branchCity)) {
      toast.error(`Invalid city "${formData.branchCity}" for state "${formData.branchState}"`);
      setLoading(false);
      return;
    }

    // Prepare payload
    const payload = branchId
      ? {
          name: formData.branchName,
          parentRestaurant: formData.restaurantId,
          location: {
            address: formData.branchAddress,
            city: formData.branchCity,
            state: formData.branchState,
            postalCode: formData.branchPostalCode || undefined,
            country: formData.branchCountry,
            coordinates: formData.branchCoordinates[0] !== 0 && formData.branchCoordinates[1] !== 0 ? formData.branchCoordinates : undefined
          }
        }
      : {
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email || undefined,
          password: formData.password,
          restaurantId: formData.restaurantId || undefined,
          restaurantName: formData.restaurantName || undefined,
          branchName: formData.branchName,
          branchAddress: formData.branchAddress,
          branchCity: formData.branchCity,
          branchState: formData.branchState,
          branchPostalCode: formData.branchPostalCode || undefined,
          branchCountry: formData.branchCountry,
          branchCoordinates: formData.branchCoordinates[0] !== 0 && formData.branchCoordinates[1] !== 0 ? formData.branchCoordinates : undefined
        };

    try {
      let response;
      if (branchId) {
        response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/branches/${branchId}`, payload);
        toast.success('Branch updated successfully');
      } else {
        response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register-branch`, payload);
        const { token, data } = response.data;
        document.cookie = `token=${token}; path=/; max-age=${30 * 24 * 60 * 60}; secure=${process.env.NODE_ENV === 'production'}; samesite=strict`;
        toast.success('Registration successful! You are now logged in.');
        if (data.action === 'renderBranchProfile') {
          router.push(`/branches/${data.branch._id}/complete-profile`);
        } else {
          router.push('/dashboard');
        }
      }

      onSuccess?.();
      onClose?.();
      router.refresh();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Prepare state and city options
  const stateOptions = states.map((state) => ({ value: state, label: state }));
  const cityOptions = formData.branchState
    ? citiesByState[formData.branchState]?.map((city) => ({ value: city, label: city })) || []
    : [];

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {branchId ? 'Complete Branch Profile' : 'Register Branch'}
          </h1>
          <p className="text-gray-500">
            {branchId ? 'Update your branch details' : 'Create an account and register your branch'}
          </p>
        </div>
        <button onClick={onClose} className="flex items-center text-gray-600 hover:text-gray-900">
          <X className="h-5 w-5 mr-1" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Information (only for registration) */}
        {!branchId && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Store className="h-5 w-5 mr-2 text-primary" />
              User Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                  minLength={6}
                />
              </div>
            </div>
          </div>
        )}

        {/* Branch Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Store className="h-5 w-5 mr-2 text-primary" />
            Branch Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name *</label>
              <input
                type="text"
                name="branchName"
                value={formData.branchName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                maxLength={100}
              />
            </div>
            {!branchId && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant</label>
                  <select
                    name="restaurantId"
                    value={formData.restaurantId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Existing Restaurant</option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant._id} value={restaurant._id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Restaurant Name</label>
                  <input
                    type="text"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter new restaurant name if not selecting existing"
                  />
                </div>
              </>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <input
                type="text"
                name="branchAddress"
                value={formData.branchAddress}
                onChange={(e) => handleLocationChange('branchAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <Select
                  options={stateOptions}
                  value={stateOptions.find((option) => option.value === formData.branchState) || null}
                  onChange={(selected) => handleLocationChange('branchState', selected ? selected.value : '')}
                  placeholder="Select State"
                  isClearable
                  isSearchable
                  required
                  className="w-full"
                  classNamePrefix="select"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <Select
                  options={cityOptions}
                  value={cityOptions.find((option) => option.value === formData.branchCity) || null}
                  onChange={(selected) => handleLocationChange('branchCity', selected ? selected.value : '')}
                  placeholder="Select City"
                  isClearable
                  isSearchable
                  isDisabled={!formData.branchState}
                  required
                  className="w-full"
                  classNamePrefix="select"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="branchPostalCode"
                  value={formData.branchPostalCode}
                  onChange={(e) => handleLocationChange('branchPostalCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Postal code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="branchCountry"
                  value={formData.branchCountry}
                  onChange={(e) => handleLocationChange('branchCountry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.branchCoordinates[1]}
                  onChange={(e) => handleLocationChange('latitude', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Latitude"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.branchCoordinates[0]}
                  onChange={(e) => handleLocationChange('longitude', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Longitude"
                />
              </div>
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  className="flex items-center px-4 py-2 border border-gray-300 Phadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Navigation className="h-5 w-5 mr-2 text-primary" />
                  Get Current Location
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit/Cancel Buttons */}
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
            {loading ? 'Processing...' : branchId ? 'Update Branch' : 'Register Branch'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OwnerBranchForm;