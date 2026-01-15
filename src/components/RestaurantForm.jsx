'use client';
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import apiClient from "@/lib/apiClient";
import { 
  Store, 
  MapPin, 
  X
} from "lucide-react";

const RestaurantForm = () => {
  const router = useRouter();
  const params = useParams();
  const isEditMode = !!params.id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    contact: {
      email: '',
      phone: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch restaurant data if in edit mode
useEffect(() => {
  if (isEditMode) {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/organizations/${params.id}`);
        const restaurantData = response.data.data;
        
        // Ensure contact object exists
        setFormData({
          ...restaurantData,
          contact: restaurantData.contact || { email: '', phone: '' }
        });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch restaurant');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurant();
  }
}, [isEditMode, params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [name]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    // if (!formData.location.address) newErrors.address = 'Address is required';
    // if (!formData.location.city) newErrors.city = 'City is required';
    
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
      };

      if (isEditMode) {
        await apiClient.put(`/api/organizations/${params.id}`, submissionData);
        toast.success('Organization updated successfully!');
      } else {
        await apiClient.post('/api/organizations', submissionData);
        toast.success('Organization created successfully!');
      }
      
      router.push('/dashboard/organizations');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Organization' : 'Add New Organization'}
          </h1>
          <p className="text-gray-500">
            {isEditMode ? 'Update Organization details' : 'Create a new Organization'}
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/organizations')}
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
                Organization Name *
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
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                Logo URL
              </label>
              <input
                type="text"
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://example.com/logo.png"
              />
            </div>

            {/* <div className="md:col-span-2">
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
                placeholder="Brief description about the Organization"
              />
            </div> */}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary" />
            Contact Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.contact?.phone || ''}
                onChange={handleContactChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="9876543210"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.contact?.email || ''}
                onChange={handleContactChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="email@example.com"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard/organizations')}
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
              'Update Organization'
            ) : (
              'Create Organization'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantForm;