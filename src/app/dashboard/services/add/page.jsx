'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function CreateServicePage() {
  const [form, setForm] = useState({
    name: '',
    key: '',
    description: '',
    isAddon: false,
    parent_service: '',
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🧩 Fetch all existing services for parent dropdown
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
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const createService = async () => {
    if (!form.name || !form.key) {
      toast.error('Please enter service name and key');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/services/create`, form);
      toast.success('Service created successfully 🎉');
      setForm({
        name: '',
        key: '',
        description: '',
        isAddon: false,
        parent_service: form.isAddon ? form.parent_service : null,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create New Service</h1>

      <div className="space-y-4 bg-white p-5 rounded-lg shadow">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Service Name"
          className="w-full border rounded-md p-2"
        />

        <input
          type="text"
          name="key"
          value={form.key}
          onChange={handleChange}
          placeholder="Unique Key (e.g., call_tracking)"
          className="w-full border rounded-md p-2"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Service Description"
          className="w-full border rounded-md p-2"
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isAddon"
            checked={form.isAddon}
            onChange={handleChange}
          />
          <label>Is Addon Service?</label>
        </div>

        {/* 🔹 Parent Service dropdown (only if isAddon is true) */}
        {form.isAddon && (
          <div>
            <label className="block mb-1">Select Parent Service</label>
            <select
              name="parent_service"
              value={form.parent_service || ""}
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
        )}

        <button
          onClick={createService}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
        >
          {loading ? 'Creating...' : 'Create Service'}
        </button>
      </div>
    </div>
  );
}
