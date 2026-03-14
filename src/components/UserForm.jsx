'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/apiClient';
import { 
  User, 
  X, 
  Building 
} from 'lucide-react';
import { useSelector } from 'react-redux';

const roleOptions = [
  { value: 7, label: 'Manager', scope: 'branch' },
  { value: 8, label: 'Team Member', scope: 'branch' },
];

const UserForm = ({ onSuccess, onClose, restaurants = [], branches = [] }) => {

  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    role: 8,
    restaurant: '',
    branch: user?.branch || ''
  });

  const [errors, setErrors] = useState({});

  // Auto adjust based on creator role
  useEffect(() => {

    if (!user) return;

    if (user.role === 6) {
      setFormData(prev => ({
        ...prev,
        branch: user.branch || '',
        role: 8
      }));
    }

    if (user.role === 7) {
      setFormData(prev => ({
        ...prev,
        branch: user.branch || '',
        role: 8
      }));
    }

  }, [user]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {

    const newErrors = {};

    if (!formData.name.trim())
      newErrors.name = 'Name is required';

    if (!formData.mobile.trim())
      newErrors.mobile = 'Mobile is required';

    if (!formData.password)
      newErrors.password = 'Password is required';

    if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    if (!formData.branch && formData.role >= 6)
      newErrors.branch = 'Branch is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {

      const response = await apiClient.post('/api/auth/register', formData);

      toast.success('User created successfully!');

      onSuccess?.(response.data.data);

      onClose?.();

    } catch (error) {

      toast.error(error.response?.data?.message || 'Failed to create user');

    } finally {

      setLoading(false);

    }
  };

  const filteredBranches = formData.restaurant
    ? branches.filter(branch => branch.parentRestaurant === formData.restaurant)
    : [];

  const showRoleSection = user?.role !== 7;

  const roleOptionsFiltered =
    user?.role === 6
      ? roleOptions
      : roleOptions.filter(r => r.value === 8);

  return (

    <div className="max-w-6xl mx-auto p-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New User
          </h1>
          <p className="text-gray-500">
            Fill in the details to create a new user account
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

        {/* Basic Info */}
        <div className="bg-white shadow rounded-lg p-6">

          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-primary" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Name */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John Doe"
              />

              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name}
                </p>
              )}

            </div>

            {/* Mobile */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number *
              </label>

              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.mobile ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="9876543210"
              />

              {errors.mobile && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.mobile}
                </p>
              )}

            </div>

            {/* Email */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="user@example.com"
              />

            </div>

            {/* Password */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter password"
              />

              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password}
                </p>
              )}

            </div>

          </div>

        </div>

        {/* Role & Assignment */}
        {showRoleSection && (

          <div className="bg-white shadow rounded-lg p-6">

            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2 text-primary" />
              Role & Assignment
            </h2>

            {/* Role */}
            <div className="mb-4">

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >

                {roleOptionsFiltered.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}

              </select>

            </div>



          </div>

        )}

        {/* Buttons */}
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
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>

        </div>

      </form>

    </div>

  );
};

export default UserForm;