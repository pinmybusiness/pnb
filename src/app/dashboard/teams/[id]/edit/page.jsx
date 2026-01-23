'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import apiClient from "@/lib/apiClient";
import {
  ArrowLeft, Save, UserCircle, Phone, Shield,
  AlertCircle, CheckCircle2, X, Lock
} from 'lucide-react';

import { ROLES } from '@/constants/roles';
import { canEditTeamMember, getRoleLabel } from '@/constants/roleHelpers';

const EditTeamMember = () => {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [member, setMember] = useState(null);

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    role: '',
    password: '' // 🔐 NEW
  });

  // 🔹 Fetch member details
  const fetchMember = async () => {
    try {
      const res = await apiClient.get(`/api/teams/${id}`);
      const data = res.data.data;
      setMember(data);

      if (!canEditTeamMember(user)) {
        toast.error('You are not allowed to edit this team member');
        router.replace('/dashboard/teams');
        return;
      }

      setForm({
        name: data.name || '',
        mobile: data.mobile || '',
        role: data.role || '',
        password: ''
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
      const payload = { ...form };

      // 🔐 If password empty, don't send it
      if (!payload.password) {
        delete payload.password;
      }

      const res = await apiClient.put(`/api/teams/${id}`, payload);

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
    <div className="min-h-screen">
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

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Edit Team Member
          </h2>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Note</p>
              <p className="text-sm text-blue-800">
                Mobile numbers can’t be changed once assigned. Contact support if needed.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 shadow-xl overflow-hidden">

          <div className="bg-gradient-to-r from-orange-50 to-white p-6 border-b-2 border-orange-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#FF5211]" />
              Member Information
            </h2>
          </div>

          <div className="p-8 space-y-6">

            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#FF5211] focus:ring-4 focus:ring-orange-500/10 outline-none"
                required
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                Mobile Number
              </label>
              <input
                type="text"
                value={form.mobile}
                disabled
                className="w-full px-4 py-3.5 bg-gray-100 border-2 border-gray-200 rounded-xl cursor-not-allowed"
              />
            </div>

            {/* 🔐 New Password (Optional) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Lock className="w-4 h-4 text-gray-500" />
                New Password (optional)
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Leave blank to keep existing password"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-[#FF5211] focus:ring-4 focus:ring-orange-500/10 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                If provided, this will reset the user’s password.
              </p>
            </div>

            {/* Role Display */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-600">Current Role</div>
                  <div className="text-lg font-bold text-gray-900">
                    {getRoleLabel(member.role)}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t-2 border-orange-100 p-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-[#FF5211] to-orange-600 text-white rounded-xl font-semibold disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeamMember;
