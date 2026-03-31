'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/apiClient';
import { useParams } from 'next/navigation';
import { STATUS_OPTIONS, STATUS_REASON_MAP } from '@/constants/branchStatus';

const Card = ({ className = '', children }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const SettingsTab = ({ branch }) => {
  const { id } = useParams();

  const [status, setStatus] = useState(branch?.status || 2);
  const [reason, setReason] = useState(branch?.statusReason || 201);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      await apiClient.patch(`/api/branches/${id}/status`, {
        status,
        reason
      });

      toast.success('Status updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const reasons = STATUS_REASON_MAP[status] || [];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Settings className="h-5 w-5 text-gray-600" />
        Branch Settings
      </h2>

      {/* 🔥 STATUS SECTION */}
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => {
              const newStatus = parseInt(e.target.value);
              setStatus(newStatus);

              // auto reset reason
              const defaultReason = STATUS_REASON_MAP[newStatus]?.[0]?.value || null;
              setReason(defaultReason);
            }}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status Reason
          </label>
          <select
            value={reason || ''}
            onChange={(e) => setReason(parseInt(e.target.value))}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            {reasons.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Button */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded-md text-sm font-medium hover:opacity-90"
        >
          {loading ? 'Updating...' : 'Update Status'}
        </button>
      </div>
    </Card>
  );
};

export default SettingsTab;