// components/BranchForm.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  X,
  MapPin,
  Navigation,
  Store
} from 'lucide-react';
import Select from 'react-select';
import { states, citiesByState } from '../data';

const BranchForm = ({ branchId, onSuccess, onClose }) => {
  const router = useRouter();
  const params = useParams(); // Get params from URL
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);

  // Use branchId from props if provided, otherwise fall back to params.id
  const effectiveBranchId = branchId || params.id;

  const [formData, setFormData] = useState({
    name: '',
    parentRestaurant: '',
    location: {
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      coordinates: [0, 0] // [longitude, latitude]
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`);
        setRestaurants(restaurantsRes.data.data);

        if (effectiveBranchId) {
          const branchRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/branches/${effectiveBranchId}`);
          const branchData = branchRes.data.data;

          console.log('Branch data received:', branchData);

          const parentRestaurantId = branchData.parentRestaurant?._id || branchData.parentRestaurant || '';
          const fetchedState = branchData.location?.state || '';
          const fetchedCity = branchData.location?.city || '';
          const validCity = fetchedState && citiesByState[fetchedState]?.includes(fetchedCity) ? fetchedCity : '';

          setFormData({
            name: branchData.name || '',
            parentRestaurant: parentRestaurantId,
            location: {
              address: branchData.location?.address || '',
              city: validCity,
              state: fetchedState,
              postalCode: branchData.location?.postalCode || '',
              country: branchData.location?.country || 'India',
              coordinates: branchData.location?.coordinates || [0, 0]
            }
          });

          if (fetchedCity && !validCity) {
            console.warn(`City "${fetchedCity}" not found in state "${fetchedState}"`);
            toast.error(`Warning: City "${fetchedCity}" is not valid for state "${fetchedState}". Please select a valid city.`);
          }
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch data');
      }
    };

    fetchData();
  }, [effectiveBranchId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (name, value) => {
    console.log(`Location change: ${name} = ${value}`);

    if (name === 'city' && formData.location.state && !citiesByState[formData.location.state]?.includes(value)) {
      console.warn(`Invalid city "${value}" for state "${formData.location.state}"`);
      toast.error(`Invalid city "${value}" for state "${formData.location.state}". Please select a valid city.`);
      return;
    }

    if (name === 'latitude' || name === 'longitude') {
      const coordinates = [...formData.location.coordinates];
      if (name === 'longitude') {
        coordinates[0] = parseFloat(value) || 0;
      } else if (name === 'latitude') {
        coordinates[1] = parseFloat(value) || 0;
      }
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
          city: name === 'state' ? '' : (name === 'city' ? value : prev.location.city)
        }
      }));
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: [longitude, latitude]
            }
          }));
          toast.success('Current location fetched successfully');
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Failed to fetch current location. Please ensure location services are enabled.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.location.state && formData.location.city && !citiesByState[formData.location.state]?.includes(formData.location.city)) {
        toast.error(`Invalid city "${formData.location.city}" for state "${formData.location.state}"`);
        setLoading(false);
        return;
      }

      // Validate coordinates
      const [longitude, latitude] = formData.location.coordinates;
      if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
        toast.error('Invalid coordinates: Longitude must be between -180 and 180, latitude between -90 and 90.');
        setLoading(false);
        return;
      }

      // Only include fields that branch staff can update
      const payload = {
        name: formData.name,
        location: formData.location
      };

      console.log('Submitting payload:', payload);

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/branches/${effectiveBranchId}`, payload);
      toast.success('Branch updated successfully');
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

  const getSelectedRestaurantName = () => {
    if (!formData.parentRestaurant) return '';
    const restaurant = restaurants.find(r => r._id === formData.parentRestaurant);
    return restaurant ? restaurant.name : 'Loading...';
  };

  const stateOptions = states.map(state => ({ value: state, label: state }));
  const cityOptions = formData.location.state
    ? citiesByState[formData.location.state]?.map(city => ({ value: city, label: city })) || []
    : [];

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Branch
          </h1>
          <p className="text-gray-500">
            Update your branch details
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Restaurant
              </label>
              <input
                type="text"
                value={getSelectedRestaurantName()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                disabled
              />
            </div>
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
                onChange={(e) => handleLocationChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <Select
                  options={stateOptions}
                  value={stateOptions.find(option => option.value === formData.location.state) || null}
                  onChange={(selected) => handleLocationChange('state', selected ? selected.value : '')}
                  placeholder="Select State"
                  isClearable
                  isSearchable
                  required
                  className="w-full"
                  classNamePrefix="select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <Select
                  options={cityOptions}
                  value={cityOptions.find(option => option.value === formData.location.city) || null}
                  onChange={(selected) => handleLocationChange('city', selected ? selected.value : '')}
                  placeholder="Select City"
                  isClearable
                  isSearchable
                  isDisabled={!formData.location.state}
                  required
                  className="w-full"
                  classNamePrefix="select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.location.postalCode}
                  onChange={(e) => handleLocationChange('postalCode', e.target.value)}
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
                  onChange={(e) => handleLocationChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.location.coordinates[1]}
                  onChange={(e) => handleLocationChange('latitude', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Latitude"
                  step="any"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.location.coordinates[0]}
                  onChange={(e) => handleLocationChange('longitude', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Longitude"
                  step="any"
                />
              </div>

              <div className="col-span-2">
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Navigation className="h-5 w-5 mr-2 text-primary" />
                  Get Current Location
                </button>
              </div>
            </div>
          </div>
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
            {loading ? 'Processing...' : 'Update Branch'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BranchForm; 