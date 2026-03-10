'use client';

import { useState } from 'react';
import { X, Eye, EyeOff, Loader, UserPlus } from 'lucide-react';

const AddTeamMemberModal = ({
  isOpen,
  onClose,
  branchId,
  onSuccess,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    role: 8,
    branch: branchId,
  });

  if (!isOpen) return null;

  const roleOptions = [
    { value: 6, label: 'Admin' },
    { value: 7, label: 'Branch Team Manager' },
    { value: 8, label: 'Branch Staff' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await import('@/lib/apiClient').then(m =>
        m.default.post('/api/auth/team-register', form)
      );

      if (res.data.success) {
        onSuccess();
        onClose();
        setForm({
          name: '',
          mobile: '',
          email: '',
          password: '',
          role: 8,
          branch: branchId,
        });
      }
    } catch (err) {
      import('react-hot-toast').then(t =>
        t.toast.error(err.response?.data?.message || 'Failed to add member')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-3">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Add Team Member
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            required
            placeholder="Full Name"
            className="w-full rounded-lg border border-gray-400 px-4 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* Mobile */}
          <input
            required
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{10}"
            maxLength={10}
            placeholder="Mobile (10 digit)"
            className="w-full rounded-lg border border-gray-400 px-4 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            value={form.mobile}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
              setForm({ ...form, mobile: value });
            }}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email (optional)"
            className="w-full rounded-lg border border-gray-400 px-4 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              className="w-full rounded-lg border border-gray-400 px-4 py-2.5 pr-10 text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              value={form.password}
              onChange={(e) => {
                const value = e.target.value.replace(/\s/g, '');
                setForm({ ...form, password: value });
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Role */}
          <select
            className="w-full rounded-lg border border-gray-400 px-4 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: Number(e.target.value) })}
          >
            {roleOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          {/* Actions */}
          <div className="flex gap-3 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-400 py-2.5 text-sm
                text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-primary py-2.5 text-sm text-white
                hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader className="inline mr-2 h-4 w-4 animate-spin" />
                  Adding…
                </>
              ) : (
                <>
                  <UserPlus className="inline mr-2 h-4 w-4" />
                  Add Member
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeamMemberModal;
