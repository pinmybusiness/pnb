'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { MapPin, Navigation, X, Store, Phone, Link } from 'lucide-react';
import Select from 'react-select';

const BranchForm = ({ branchId, onSuccess, onClose }) => {
  const router = useRouter();
  const params = useParams();
  const effectiveBranchId = branchId || params.id;
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    parentRestaurant: '',
    location: {
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      coordinates: [0, 0]
    },
    helplineNumber: '',
    socialLink: ''
  });

  useEffect(() => {
    console.log('BranchForm mounted', new Date().toISOString());
    const fetchData = async () => {
      try {
        const restaurantsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`);
        setRestaurants(restaurantsRes.data.data);

        const citiesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cities`);
        setCities(citiesRes.data.data);

        if (effectiveBranchId) {
          const branchRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/branches/${effectiveBranchId}`);
          const branchData = branchRes.data.data;

          const cityExists = branchData.cityDetails?._id
            ? citiesRes.data.data.some((city) => city._id === branchData.cityDetails._id)
            : false;

          setFormData({
            name: branchData.name || '',
            parentRestaurant: branchData.parentRestaurant?._id || '',
            location: {
              address: branchData.location?.address || '',
              city: cityExists ? branchData.cityDetails?._id || '' : '',
              state: cityExists ? branchData.cityDetails?.stateName || '' : '',
              postalCode: branchData.location?.postalCode || '',
              country: cityExists ? branchData.cityDetails?.countryName || 'India' : 'India',
              coordinates: branchData.location?.coordinates || [0, 0]
            },
            helplineNumber: branchData.helplineNumber || '',
            socialLink: branchData.socialLink || ''
          });

          if (branchData.cityDetails?._id && !cityExists) {
            toast.error(
              `Warning: City "${branchData.cityDetails.name}" is not valid. Please select a valid city.`,
              { id: 'city-warning' }
            );
          }
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to fetch data', { id: 'fetch-error' });
      }
    };
    fetchData();
    return () => console.log('BranchForm unmounted', new Date().toISOString());
  }, [effectiveBranchId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'helplineNumber') {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, '') }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRestaurantChange = (selected) => {
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        parentRestaurant: selected._id
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        parentRestaurant: ''
      }));
    }
  };

  const handleCityChange = (selected) => {
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          city: selected._id,
          state: selected.stateName,
          country: selected.countryName,
          coordinates: selected.coordinates || [0, 0]
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          city: '',
          state: '',
          country: 'India',
          coordinates: [0, 0]
        }
      }));
    }
  };

  const handleCoordinateChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        coordinates:
          name === 'longitude'
            ? [parseFloat(value) || 0, prev.location.coordinates[1]]
            : [prev.location.coordinates[0], parseFloat(value) || 0]
      }
    }));
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: [longitude, latitude]
            }
          }));
          toast.success('Location fetched successfully', { id: 'location-fetch' });
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Failed to get location. Please allow location access or enter manually.', { id: 'location-error' });
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser', { id: 'location-error' });
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (loading) {
        console.log('Submission blocked: already loading');
        return;
      }
      setLoading(true);
      console.log('handleSubmit called', new Date().toISOString());

      if (!cities.length) {
        toast.error('No cities available. Please try again later.', { id: 'cities-error' });
        setLoading(false);
        return;
      }

      if (!formData.name || !formData.location.address || !formData.location.city) {
        toast.error('Please fill all required branch fields', { id: 'fields-error' });
        setLoading(false);
        return;
      }

      if (!effectiveBranchId && !formData.parentRestaurant) {
        toast.error('Please select a parent restaurant', { id: 'restaurant-error' });
        setLoading(false);
        return;
      }

      if (formData.location.city) {
        const selectedCity = cities.find((city) => city._id === formData.location.city);
        if (!selectedCity) {
          toast.error('Invalid city selected: City not found', { id: 'city-error' });
          setLoading(false);
          return;
        }
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            state: selectedCity.stateName,
            country: selectedCity.countryName
          }
        }));
      }

      const [longitude, latitude] = formData.location.coordinates;
      if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
        toast.error('Invalid coordinates: Longitude must be between -180 and 180, latitude between -90 and 90.', {
          id: 'coordinates-error'
        });
        setLoading(false);
        return;
      }

      // Validate helpline number
      if (formData.helplineNumber && !/^\+?[\d\s-]{10,15}$/.test(formData.helplineNumber)) {
        toast.error('Please provide a valid helpline number', { id: 'helpline-error' });
        setLoading(false);
        return;
      }

      // Validate social link (Zomato)
      // if (formData.socialLink && !/^https?:\/\/(www\.)?zomato\.com\/.+$/.test(formData.socialLink)) {
      //   toast.error('Please provide a valid Zomato link', { id: 'social-link-error' });
      //   setLoading(false);
      //   return;
      // }

      const payload = {
        name: formData.name,
        parentRestaurant: formData.parentRestaurant || undefined,
        location: {
          address: formData.location.address,
          city: formData.location.city,
          state: formData.location.state,
          postalCode: formData.location.postalCode || undefined,
          country: formData.location.country,
          coordinates: formData.location.coordinates[0] !== 0 && formData.location.coordinates[1] !== 0 ? formData.location.coordinates : undefined
        },
        helplineNumber: formData.helplineNumber || undefined,
        socialLink: formData.socialLink || undefined
      };

      try {
        if (effectiveBranchId) {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/branches/${effectiveBranchId}`, payload);
          console.log('Showing update toast');
          toast.success('Branch updated successfully', { id: 'branch-update' });
        } else {
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/branches`, payload);
          console.log('Showing create toast');
          toast.success('Branch created successfully', { id: 'branch-create' });
        }
        console.log('onSuccess called');
        onSuccess?.();
        console.log('onClose called');
        onClose?.();
      } catch (error) {
        console.error('Submit error:', error);
        toast.error(error.response?.data?.message || 'Something went wrong', { id: 'branch-error' });
      } finally {
        setLoading(false);
      }
    },
    [loading, cities, formData, effectiveBranchId, onSuccess, onClose]
  );

  const restaurantOptions = restaurants.map((restaurant) => ({
    value: restaurant.name,
    label: restaurant.name,
    _id: restaurant._id
  }));

  const cityOptions = cities.map((city) => ({
    value: city.name,
    label: `${city.name}, ${city.stateName}`,
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
            {effectiveBranchId ? 'Edit Branch' : 'Create Branch'}
          </h1>
          <p className="text-gray-500 text-sm sm:text-base text-center sm:text-left">
            {effectiveBranchId ? 'Update your branch details' : 'Create a new branch'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center text-gray-600 hover:text-gray-900 mt-2 sm:mt-0"
        >
          <X className="h-5 w-5 mr-1" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-medium text-dark mb-4 flex items-center">
            <Store className="h-5 w-5 mr-2 text-primary" />
            Branch Information
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                        <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Restaurant {effectiveBranchId ? '' : '*'}
              </label>
              {effectiveBranchId ? (
                <div className="flex items-center border border-soft rounded-lg bg-gray-100">
                  <input
                    type="text"
                    value={
                      restaurants.find((r) => r._id === formData.parentRestaurant)?.name || 'Loading...'
                    }
                    className="flex-1 px-2 py-2 text-sm bg-transparent focus:outline-none"
                    disabled
                  />
                </div>
              ) : (
                <Select
                  options={restaurantOptions}
                  value={restaurantOptions.find((option) => option._id === formData.parentRestaurant) || null}
                  onChange={handleRestaurantChange}
                  placeholder="Search and select a restaurant"
                  isClearable
                  isSearchable
                  className="w-full text-sm"
                  classNamePrefix="select"
                  required
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Branch Name *</label>
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
              <label className="block text-sm font-medium text-dark mb-1">Helpline Number</label>
              <div className="flex items-center border border-soft rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                <Phone className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="helplineNumber"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.helplineNumber}
                  onChange={handleChange}
                  className="flex-1 px-2 py-2 focus:outline-none text-sm"
                  placeholder="9876543210"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1">Social Link</label>
              <div className="flex items-center border border-soft rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                <Link className="w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  name="socialLink"
                  value={formData.socialLink}
                  onChange={handleChange}
                  className="flex-1 px-2 py-2 focus:outline-none text-sm"
                  placeholder="https://www.zomato.com/..."
                />
              </div>
            </div>
          </div>
        </div>

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
                  name="address"
                  value={formData.location.address}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    location: { ...prev.location, address: e.target.value }
                  }))}
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
                  value={cityOptions.find((option) => option._id === formData.location.city) || null}
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
                    name="postalCode"
                    value={formData.location.postalCode}
                    onChange={(e) => setFormData((prev) => ({
                      ...prev,
                      location: { ...prev.location, postalCode: e.target.value }
                    }))}
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
                    value={formData.location.coordinates[1]}
                    onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
                    className="flex-1 px-2 py-2 focus:outline-none text-sm"
                    placeholder="Latitude"
                    step="any"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Longitude</label>
                <div className="flex items-center border border-soft rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                  <input
                    type="number"
                    name="longitude"
                    value={formData.location.coordinates[0]}
                    onChange={(e) => handleCoordinateChange('longitude', e.target.value)}
                    className="flex-1 px-2 py-2 focus:outline-none text-sm"
                    placeholder="Longitude"
                    step="any"
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

        <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            type="submit"
            disabled={loading || !cities.length}
            onClick={() => console.log('Submit button clicked', new Date().toISOString())}
            className={`w-full sm:w-auto bg-primary text-white py-3 px-2 rounded-lg text-sm font-medium transition-all ${
              loading || !cities.length ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          >
            {loading ? 'Processing...' : effectiveBranchId ? 'Update Branch' : 'Create Branch'}
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

export default BranchForm;