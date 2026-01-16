'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { toast } from 'react-hot-toast';
import { Package, DollarSign, Calendar, Tag, List, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CreatePlanPage() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    serviceId: '',
    name: '',
    price: '',
    durationDays: '',
    billing_cycle: 1,
    features: '',
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch all services for dropdown
  const fetchServices = async () => {
    try {
      const res = await apiClient.get('/api/services');
      setServices(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load services');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const createPlan = async () => {
    if (!form.serviceId || !form.name || !form.durationDays) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/api/services/plans/create', {
        ...form,
        features: form.features
          ? form.features.split(',').map((f) => f.trim()).filter((f) => f)
          : [],
      });
      toast.success('Plan created successfully 🎉');
      setForm({
        serviceId: '',
        name: '',
        price: '',
        durationDays: '',
        billing_cycle: 1,
        features: '',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create plan');
    } finally {
      setLoading(false);
    }
  };

  const billingCycleOptions = [
    { value: 1, label: 'Monthly', icon: '📅' },
    { value: 2, label: 'Yearly', icon: '🗓️' },
    { value: 3, label: 'One-time', icon: '💳' },
    { value: 4, label: 'Trial', icon: '🎁' },
  ];

  return (
    <div className="">
      {/* Header */}
      <div className="bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/services"
              className="w-10 h-10 flex items-center justify-center bg-white hover:bg-orange-50 border-2 border-orange-200 hover:border-orange-300 rounded-xl transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-[#FF5211] group-hover:-translate-x-1 transition-all duration-300" />
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF5211] to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Plan</h1>
                <p className="text-sm text-gray-600">Add a new pricing plan to your service</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-orange-100 shadow-xl overflow-hidden">
          <div className="p-8 space-y-6">
            
            {/* Select Service */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <div className="w-8 h-8 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors">
                  <Package className="w-4 h-4 text-[#FF5211]" />
                </div>
                Select Service
                <span className="text-red-500">*</span>
              </label>
              <select
                name="serviceId"
                value={form.serviceId}
                onChange={handleChange}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 hover:border-orange-300 focus:border-[#FF5211] focus:ring-4 focus:ring-orange-500/10 rounded-xl transition-all duration-300 outline-none text-gray-900 font-medium"
              >
                <option value="">Choose a service...</option>
                {services.map((srv) => (
                  <option key={srv._id} value={srv._id}>
                    {srv.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Plan Name */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <div className="w-8 h-8 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors">
                  <Tag className="w-4 h-4 text-[#FF5211]" />
                </div>
                Plan Name
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., Monthly Premium, 6-Month Basic"
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 hover:border-orange-300 focus:border-[#FF5211] focus:ring-4 focus:ring-orange-500/10 rounded-xl transition-all duration-300 outline-none text-gray-900 font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Grid: Price + Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <div className="w-8 h-8 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors">
                    <DollarSign className="w-4 h-4 text-[#FF5211]" />
                  </div>
                  Price (₹)
                  {form.billing_cycle !== 4 && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="499"
                  disabled={form.billing_cycle === 4}
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 hover:border-orange-300 focus:border-[#FF5211] focus:ring-4 focus:ring-orange-500/10 rounded-xl transition-all duration-300 outline-none text-gray-900 font-medium placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {form.billing_cycle === 4 && (
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Trial plans are free
                  </p>
                )}
              </div>

              {/* Duration */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <div className="w-8 h-8 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors">
                    <Calendar className="w-4 h-4 text-[#FF5211]" />
                  </div>
                  Duration (Days)
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="durationDays"
                  value={form.durationDays}
                  onChange={handleChange}
                  placeholder="30"
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 hover:border-orange-300 focus:border-[#FF5211] focus:ring-4 focus:ring-orange-500/10 rounded-xl transition-all duration-300 outline-none text-gray-900 font-medium placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Billing Cycle */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <div className="w-8 h-8 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors">
                  <Package className="w-4 h-4 text-[#FF5211]" />
                </div>
                Billing Cycle
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {billingCycleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm({ ...form, billing_cycle: option.value })}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                      form.billing_cycle === option.value
                        ? 'border-[#FF5211] bg-gradient-to-br from-orange-50 to-orange-100/50 shadow-lg shadow-orange-500/20'
                        : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/30'
                    }`}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-semibold text-sm text-gray-900">{option.label}</div>
                    {form.billing_cycle === option.value && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#FF5211] rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <div className="w-8 h-8 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center transition-colors">
                  <List className="w-4 h-4 text-[#FF5211]" />
                </div>
                Features
              </label>
              <textarea
                name="features"
                value={form.features}
                onChange={handleChange}
                placeholder="e.g., Unlimited calls, 24/7 Support, Advanced Analytics"
                rows={4}
                className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 hover:border-orange-300 focus:border-[#FF5211] focus:ring-4 focus:ring-orange-500/10 rounded-xl transition-all duration-300 outline-none text-gray-900 font-medium placeholder:text-gray-400 resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">Separate each feature with a comma</p>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex gap-3">
              <button
                onClick={createPlan}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-base font-bold text-white bg-gradient-to-r from-[#FF5211] to-orange-600 hover:from-[#FF5211] hover:to-orange-700 rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Plan...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Create Plan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Pro Tip</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Create multiple plans with different durations and pricing to give your customers more options. Trial plans are great for attracting new users!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}