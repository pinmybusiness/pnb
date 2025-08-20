// components/UserForm.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axios from 'axios';

import { 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Building, 
  MapPin, 
  ChevronDown, 
  X 
} from 'lucide-react';

const roleOptions = [
  { value: 0, label: 'Company Admin', scope: 'company' },
  { value: 1, label: 'Company CRM', scope: 'company' },
  { value: 2, label: 'Company Team', scope: 'company' },
  { value: 3, label: 'Restaurant Admin', scope: 'restaurant' },
  { value: 4, label: 'Restaurant Manager', scope: 'restaurant' },
  { value: 5, label: 'Restaurant Team', scope: 'restaurant' },
  { value: 6, label: 'Branch Manager', scope: 'branch' },
  { value: 7, label: 'Branch Team', scope: 'branch' },
  { value: 8, label: 'Branch Staff', scope: 'branch' },
];

const UserForm = ({ onSuccess, onClose, restaurants = [], branches = [] }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    role: 8,
    restaurant: '',
    branch: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleSelect = (roleValue) => {
    setFormData(prev => ({
      ...prev,
      role: roleValue,
      restaurant: roleValue >= 3 && roleValue <= 5 ? prev.restaurant : '',
      branch: roleValue >= 6 ? prev.branch : ''
    }));
    setShowRoleDropdown(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (formData.role >= 3 && formData.role <= 5 && !formData.restaurant) {
      newErrors.restaurant = 'Restaurant is required for this role';
    }
    if (formData.role >= 6 && !formData.branch) {
      newErrors.branch = 'Branch is required for this role';
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
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', formData);
      toast.success('User created successfully!');
      if (onSuccess) onSuccess(response.data.data);
      onClose?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedRoleLabel = () => {
    const role = roleOptions.find(r => r.value === formData.role);
    return role ? role.label : 'Select Role';
  };

  const filteredBranches = formData.restaurant
    ? branches.filter(branch => branch.parentRestaurant === formData.restaurant)
    : [];

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
          <p className="text-gray-500">Fill in the details to create a new user account</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="+91 9876543210"
              />
              {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter password"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
          </div>
        </div>

        {/* Role & Assignments */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Building className="h-5 w-5 mr-2 text-primary" />
            Role & Assignment
          </h2>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md"
              >
                <span>{getSelectedRoleLabel()}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              {showRoleDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {roleOptions.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => handleRoleSelect(role.value)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between"
                    >
                      <span>{role.label}</span>
                      <span className="text-xs text-gray-500 capitalize">{role.scope}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Restaurant (conditional) */}
          {(formData.role >= 3 && formData.role <= 5) && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant *</label>
              <select
                name="restaurant"
                value={formData.restaurant}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.restaurant ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Restaurant</option>
                {restaurants.map((rest) => (
                  <option key={rest._id} value={rest._id}>{rest.name}</option>
                ))}
              </select>
              {errors.restaurant && <p className="mt-1 text-sm text-red-600">{errors.restaurant}</p>}
            </div>
          )}

          {/* Branch (conditional) */}
          {formData.role >= 6 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.branch ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Branch</option>
                {filteredBranches.map((branch) => (
                  <option key={branch._id} value={branch._id}>{branch.name}</option>
                ))}
              </select>
              {errors.branch && <p className="mt-1 text-sm text-red-600">{errors.branch}</p>}
            </div>
          )}
        </div>

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
