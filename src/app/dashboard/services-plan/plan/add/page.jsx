'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/services`);
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
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/services/plans/create`, {
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

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create New Plan</h1>

      <div className="space-y-4 bg-white p-5 rounded-lg shadow">
        {/* Select Service */}
        <div>
          <label className="block mb-1">Select Service</label>
          <select
            name="serviceId"
            value={form.serviceId}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value="">Select Service</option>
            {services.map((srv) => (
              <option key={srv._id} value={srv._id}>
                {srv.name}
              </option>
            ))}
          </select>
        </div>

        {/* Plan Name */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Plan Name (e.g., Monthly, 6-Month)"
          className="w-full border rounded-md p-2"
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Plan Price (e.g., 499)"
          disabled={form.billing_cycle === 4} // Disable if trial
          className="w-full border rounded-md p-2"
        />

        {/* Duration */}
        <input
          type="number"
          name="durationDays"
          value={form.durationDays}
          onChange={handleChange}
          placeholder="Duration (in days)"
          className="w-full border rounded-md p-2"
        />

        {/* Billing Cycle */}
        <div className="flex items-center gap-2">
          <label>Billing Cycle:</label>
          <select
            name="billing_cycle"
            value={form.billing_cycle}
            onChange={handleChange}
            className="border rounded-md p-2"
          >
            <option value={1}>Monthly</option>
            <option value={2}>Yearly</option>
            <option value={3}>One-time</option>
            <option value={4}>Trial</option>
          </select>
        </div>

        {/* Features */}
        <textarea
          name="features"
          value={form.features}
          onChange={handleChange}
          placeholder="Enter features (comma separated)"
          className="w-full border rounded-md p-2"
        />

        {/* Button */}
        <button
          onClick={createPlan}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
        >
          {loading ? 'Creating...' : 'Create Plan'}
        </button>
      </div>
    </div>
  );
}
