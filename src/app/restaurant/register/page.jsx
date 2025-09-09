'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { MapPin, Navigation, X, Store, Phone, Lock } from 'lucide-react';
import Select from 'react-select';
import { loginUser } from '@/store/authThunks';

const OwnerBranchForm = ({ branchId, onSuccess, onClose }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, token, role, error } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    name: '', // User's name
    mobile: '',
    email: '',
    password: '',
    restaurantId: '',
    restaurantName: '',
    branchName: '',
    branchAddress: '',
    branchCity: '', // Will store City _id
    branchState: '',
    branchPostalCode: '',
    branchCountry: 'India',
    branchCoordinates: [0, 0] // [longitude, latitude]
  });

  // Function to generate a random, unique email
  const generateRandomEmail = () => {
    const randomString = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    return `user_${randomString}@example.com`;
  };

  // Redirect on successful login
  useEffect(() => {
    if (token && user && role && !branchId) {
      console.log('Login successful, redirecting to /dashboard');
      if (onSuccess) onSuccess();
      router.push('/dashboard');
    }
  }, [user, token, role, onSuccess, router, branchId]);

  // Fetch restaurants and cities (and branch data if editing)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch restaurants
        const restaurantsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`);
        setRestaurants(restaurantsRes.data.data);

        // Fetch all cities
        const citiesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cities`);
        setCities(citiesRes.data.data);

        // Fetch branch data if branchId is provided
        if (branchId) {
          const branchRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/branches/${branchId}`);
          const branchData = branchRes.data.data;

          setFormData({
            name: '',
            mobile: '',
            email: '',
            password: '',
            restaurantId: branchData.parentRestaurant?._id || '',
            restaurantName: '',
            branchName: branchData.name || '',
            branchAddress: branchData.location?.address || '',
            branchCity: branchData.cityDetails?._id || '', // Use City _id
            branchState: branchData.cityDetails?.stateName || '',
            branchPostalCode: branchData.location?.postalCode || '',
            branchCountry: branchData.cityDetails?.countryName || 'India',
            branchCoordinates: branchData.location?.coordinates || [0, 0]
          });

          // Validate city against fetched cities
          if (branchData.cityDetails?._id) {
            const cityExists = citiesRes.data.data.some(
              (city) => city._id === branchData.cityDetails._id
            );
            if (!cityExists) {
              toast.error(
                `Warning: City "${branchData.cityDetails.name}" is not valid. Please select a valid city.`
              );
            }
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
    if (name === 'mobile') {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, '') }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle city selection
  const handleCityChange = (selected) => {
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        branchCity: selected._id, // Store City _id
        branchState: selected.stateName,
        branchCountry: selected.countryName,
        branchCoordinates: selected.coordinates || [0, 0]
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        branchCity: '',
        branchState: '',
        branchCountry: 'India',
        branchCoordinates: [0, 0]
      }));
    }
  };

  // Handle coordinate changes
  const handleCoordinateChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      branchCoordinates:
        name === 'longitude'
          ? [parseFloat(value) || 0, prev.branchCoordinates[1]]
          : [prev.branchCoordinates[0], parseFloat(value) || 0]
    }));
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
    } else {
      // Update mode
      if (!formData.branchName || !formData.branchAddress || !formData.branchCity) {
        toast.error('Please fill all required branch fields');
        setLoading(false);
        return;
      }
    }

    // Validate city
    if (formData.branchCity) {
      const selectedCity = cities.find((city) => city._id === formData.branchCity);
      if (!selectedCity || selectedCity.stateName !== formData.branchState || selectedCity.countryName !== formData.branchCountry) {
        toast.error(`Invalid city selected`);
        setLoading(false);
        return;
      }
    }

    // Prepare payload
    const payload = branchId
      ? {
          name: formData.branchName,
          parentRestaurant: formData.restaurantId,
          location: {
            address: formData.branchAddress,
            city: formData.branchCity, // City _id
            state: formData.branchState,
            postalCode: formData.branchPostalCode || undefined,
            country: formData.branchCountry,
            coordinates: formData.branchCoordinates[0] !== 0 && formData.branchCoordinates[1] !== 0 ? formData.branchCoordinates : undefined
          }
        }
      : {
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email || generateRandomEmail(),
          password: formData.password,
          restaurantId: formData.restaurantId || undefined,
          restaurantName: formData.restaurantName || undefined,
          branchName: formData.branchName,
          branchAddress: formData.branchAddress,
          branchCity: formData.branchCity, // City _id
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
        await dispatch(loginUser({ mobile: formData.mobile, password: formData.password, rememberMe: false })).unwrap();
        toast.success('Registration and login successful!');
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

  // Prepare city options for dropdown
  const cityOptions = cities.map((city) => ({
    value: city.name,
    label: `${city.name}, ${city.stateName}`, // Show city and state in dropdown
    _id: city._id,
    stateName: city.stateName,
    countryName: city.countryName,
    coordinates: city.coordinates
  }));

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-dark text-center sm:text-left">
            {branchId ? 'Complete Branch Profile' : 'Register Branch'}
          </h1>
          <p className="text-gray-500 text-sm sm:text-base text-center sm:text-left">
            {branchId ? 'Update your branch details' : 'Create an account and register your branch'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center text-gray-600 hover:text-dark mt-2 sm:mt-0 w-full sm:w-auto px-4 py-2 border border-soft rounded-lg text-sm font-medium bg-white hover:bg-gray-50"
        >
          <X className="h-5 w-5 mr-1" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* User Information (only for registration) */}
        {!branchId && (
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <h2 className="text-lg font-medium text-dark mb-4 flex items-center">
              <Store className="h-5 w-5 mr-2 text-primary" />
              User Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Full Name *</label>
                <div className="flex items-center border border-soft rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="flex-1 px-2 py-2 focus:outline-none text-sm"
                    required
                    maxLength={100}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Mobile Number *</label>
                <div className="flex items-center border border-soft rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="mobile"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="flex-1 px-2 py-2 focus:outline-none text-sm"
                    required
                    placeholder="9876543210"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Email (Optional)</label>
                <div className="flex items-center border border-soft rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="flex-1 px-2 py-2 focus:outline-none text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Password *</label>
                <div className="flex items-center border border-soft rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="flex-1 px-2 py-2 focus:outline-none text-sm"
                    required
                    minLength={6}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Branch Information */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-medium text-dark mb-4 flex items-center">
            <Store className="h-5 w-5 mr-2 text-primary" />
            Branch Information
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                        {!branchId && (
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Restaurant</label>
                <div className="flex items-center border border-soft rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                  <select
                    name="restaurantId"
                    value={formData.restaurantId}
                    onChange={handleChange}
                    className="flex-1 px-2 py-2 focus:outline-none text-sm"
                  >
                    <option value="">Select Existing Restaurant</option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant._id} value={restaurant._id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-dark mb-1">Branch Name *</label>
              <div className="flex items-center border border-soft rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                <input
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  className="flex-1 px-2 py-2 focus:outline-none text-sm"
                  required
                  maxLength={100}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-medium text-dark mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary" />
            Location Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Address *</label>
              <div className="flex items-center border border-soft rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                <input
                  type="text"
                  name="branchAddress"
                  value={formData.branchAddress}
                  onChange={handleChange}
                  className="flex-1 px-2 py-2 focus:outline-none text-sm"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">City *</label>
                <Select
                  options={cityOptions}
                  value={cityOptions.find((option) => option._id === formData.branchCity) || null}
                  onChange={handleCityChange}
                  placeholder="Search and select a city"
                  isClearable
                  isSearchable
                  required
                  className="w-full text-sm"
                  classNamePrefix="select"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Postal Code</label>
                <div className="flex items-center border border-soft rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                  <input
                    type="text"
                    name="branchPostalCode"
                    value={formData.branchPostalCode}
                    onChange={handleChange}
                    className="flex-1 px-2 py-2 focus:outline-none text-sm"
                    placeholder="Postal code"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Latitude</label>
                <div className="flex items-center border border-soft rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                  <input
                    type="number"
                    name="latitude"
                    value={formData.branchCoordinates[1]}
                    onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
                    className="flex-1 px-2 py-2 focus:outline-none text-sm"
                    placeholder="Latitude"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Longitude</label>
                <div className="flex items-center border border-soft rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                  <input
                    type="number"
                    name="longitude"
                    value={formData.branchCoordinates[0]}
                    onChange={(e) => handleCoordinateChange('longitude', e.target.value)}
                    className="flex-1 px-2 py-2 focus:outline-none text-sm"
                    placeholder="Longitude"
                  />
                </div>
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-soft shadow-sm text-sm font-medium text-dark bg-white hover:bg-gray-50 rounded-lg mt-4"
              >
                <Navigation className="h-5 w-5 mr-2 text-primary" />
                Get Current Location
              </button>
            </div>
          </div>
        </div>

        {/* Submit/Cancel Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto bg-primary text-white py-3 px-2 rounded-lg text-sm font-medium transition-all ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            {loading ? 'Processing...' : branchId ? 'Update Branch' : 'Register Branch'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border border-soft rounded-lg shadow-sm text-sm font-medium text-dark bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default OwnerBranchForm;