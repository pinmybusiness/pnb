'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import apiClient from "@/lib/apiClient";
import { ArrowLeft, Save, UserCircle, Phone, Shield, AlertCircle, CheckCircle2, X } from 'lucide-react';

import { ROLES } from '@/constants/roles';
import { canEditTeamMember, getRoleLabel } from '@/constants/roleHelpers';

const EditTeamMember = () => {
  const router = useRouter();
  const { id } = useParams();
  const { user, token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [member, setMember] = useState(null);

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    role: '',
  });

  // 🔹 Fetch member details
  const fetchMember = async () => {
    try {
      const res = await apiClient.get(`/api/teams/${id}`);
      const data = res.data.data;
      setMember(data);

      // 🔒 Permission check
      if (!canEditTeamMember(user)) {
        toast.error('You are not allowed to edit this team member');
        router.replace('/dashboard/teams');
        return;
      }

      setForm({
        name: data.name || '',
        mobile: data.mobile || '',
        role: data.role || '',
      });
    } catch (err) {
      toast.error('Failed to load team member');
      router.replace('/dashboard/teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, []);

  // 🔹 Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await apiClient.put(`/api/teams/${id}`, form);
      
      if (res.data.success) {
        toast.success('Team member updated successfully');
        router.push('/dashboard/teams');
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const roleOptions = [
    { value: ROLES.BRANCH_ADMIN, label: 'Branch Admin', description: 'Manage team members and settings', icon: '👨‍💼' },
    { value: ROLES.BRANCH_TEAM, label: 'Team Member', description: 'Access basic features', icon: '👤' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF5211] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading team member...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-3xl mx-auto py-6">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#FF5211] bg-white hover:bg-orange-50 border-2 border-orange-200 hover:border-orange-300 rounded-xl transition-all duration-300 mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Team</span>
          </button>

          <div className="flex items-center gap-4">
            {/* <div className="w-12 h-12 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <UserCircle className="w-6 h-6 text-white" />
            </div> */}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Edit Team Member</h2>
            <div>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Note</p>
                <p className="text-sm text-blue-800">
                Mobile numbers can’t be changed once assigned. Contact support if needed.
                </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 shadow-xl overflow-hidden">
          
          {/* Form Header */}
          <div className="bg-gradient-to-r from-orange-50 to-white p-6 border-b-2 border-orange-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#FF5211]" />
              Member Information
            </h2>
            <p className="text-sm text-gray-600 mt-1">Update the details below to modify this team member</p>
          </div>

          <div className="p-8 space-y-6">
            
            {/* Name Field */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                {/* <div className="w-8 h-8 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors">
                  <UserCircle className="w-4 h-4 text-[#FF5211]" />
                </div> */}
                Full Name
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter full name"
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 hover:border-orange-300 focus:border-[#FF5211] focus:ring-4 focus:ring-orange-500/10 rounded-xl transition-all duration-300 outline-none text-gray-900 font-medium placeholder:text-gray-400"
                required
              />
            </div>

            {/* Mobile Field (Disabled) */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                {/* <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-gray-400" />
                </div> */}
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.mobile}
                  disabled
                  className="w-full px-4 py-3.5 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="px-3 py-1 bg-gray-200 rounded-full text-xs font-bold text-gray-600">
                    Locked
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-10">Mobile numbers cannot be changed for security reasons</p>
            </div>

            {/* Role Selection (Super Admin Only) */}
            {user.role === ROLES.SUPER_ADMIN && (
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <div className="w-8 h-8 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors">
                    <Shield className="w-4 h-4 text-[#FF5211]" />
                  </div>
                  Role & Permissions
                  <span className="text-red-500">*</span>
                </label>
                
                <div className="space-y-3">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: option.value })}
                      className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                        form.role === option.value
                          ? 'border-[#FF5211] bg-gradient-to-br from-orange-50 to-orange-100/50 shadow-lg shadow-orange-500/20'
                          : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/30'
                      }`}
                    >
                      <div className="text-3xl">{option.icon}</div>
                      <div className="flex-1 text-left">
                        <div className="font-bold text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600 mt-0.5">{option.description}</div>
                      </div>
                      {form.role === option.value && (
                        <div className="w-6 h-6 bg-[#FF5211] rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Role Display (Non-Super Admin) */}
            {user.role !== ROLES.SUPER_ADMIN && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 font-medium">Current Role</div>
                    <div className="text-lg font-bold text-gray-900">{getRoleLabel(member.role)}</div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Form Footer */}
          <div className="bg-gray-50 border-t-2 border-orange-100 p-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 px-6 py-3 text-gray-700 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-all duration-300 font-semibold"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-[#FF5211] to-orange-600 hover:from-[#FF5211] hover:to-orange-700 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 font-semibold"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact <a href="mailto:support@fasterq.in" className="text-[#FF5211] font-semibold hover:underline">info@fasterq.in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditTeamMember;