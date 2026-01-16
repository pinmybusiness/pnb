'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { Loader2, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

// 🔹 Status color styles
const statusColors = {
  1: 'bg-yellow-100 text-yellow-800', // Pending
  2: 'bg-green-100 text-green-800',   // Active
  3: 'bg-gray-200 text-gray-700',     // Expired
  4: 'bg-red-100 text-red-800'        // Cancelled
};

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // ✅ Fetch all subscriptions
  const fetchAllSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/services/subscriptions/all');
      setSubscriptions(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSubscriptions();
  }, []);

  // ✅ Update status
  const updateStatus = async (subscriptionId, newStatus) => {
    try {
      await apiClient.put('/api/services/subscriptions/status', {
        subscriptionId,
        status: newStatus,
      });
      toast.success('Status updated successfully');
      setSubscriptions((prev) =>
        prev.map((s) =>
          s._id === subscriptionId ? { ...s, status: parseInt(newStatus) } : s
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  // ✅ Search filter
  const filteredSubs = subscriptions.filter((sub) => {
    const name = sub.userId?.name?.toLowerCase() || '';
    const service = sub.serviceId?.name?.toLowerCase() || '';
    const plan = sub.planId?.name?.toLowerCase() || '';
    return (
      name.includes(search.toLowerCase()) ||
      service.includes(search.toLowerCase()) ||
      plan.includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6 animate-fade-in">
      {/* 🔹 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Subscriptions</h1>
          <p className="text-gray-500 text-sm">Manage all user service subscriptions</p>
        </div>
        <button
          onClick={fetchAllSubscriptions}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          Refresh
        </button>
      </div>

      {/* 🔹 Search */}
      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search by user, service, or plan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* 🔹 Table */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Start</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expire</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading subscriptions...
                  </div>
                </td>
              </tr>
            ) : filteredSubs.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-500">
                  No subscriptions found
                </td>
              </tr>
            ) : (
              filteredSubs.map((sub) => (
                <tr key={sub._id} className="hover:bg-gray-50">
                  {/* User */}
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {sub.userId?.name || '—'}
                    <div className="text-xs text-gray-500">{sub.userId?.mobile || sub.userId?.email}</div>
                  </td>

                  {/* Service */}
                  <td className="px-4 py-3 text-sm">{sub.serviceId?.name || '—'}</td>

                  {/* Plan */}
                  <td className="px-4 py-3 text-sm">{sub.planId?.name || '—'}</td>

                  {/* Price */}
                  <td className="px-4 py-3 text-sm">₹{sub.amount || sub.planId?.price || 0}</td>

                  {/* Start */}
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : '—'}
                  </td>

                  {/* Expire */}
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {sub.expireDate ? new Date(sub.expireDate).toLocaleDateString() : '—'}
                  </td>

                  {/* 🔹 Editable Status Dropdown */}
                  <td className="px-4 py-3">
                    <select
                      value={sub.status}
                      onChange={(e) => updateStatus(sub._id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-md border cursor-pointer ${
                        sub.status === 2
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : sub.status === 1
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                          : sub.status === 3
                          ? 'bg-gray-100 text-gray-700 border-gray-300'
                          : 'bg-red-100 text-red-800 border-red-300'
                      }`}
                    >
                      <option value="1">Pending</option>
                      <option value="2">Active</option>
                      <option value="3">Expired</option>
                      <option value="4">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
