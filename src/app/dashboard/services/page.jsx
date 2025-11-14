'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/api/services');
        setServices(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Available Services</h1>
      {services.map(service => (
        <div key={service._id} className="border p-4 mb-2 rounded">
          <h2>{service.name}</h2>
          <p>{service.description}</p>
          {service.isAddon && <span className="text-sm text-blue-600">Addon</span>}
          <button
            onClick={() => window.location.href = `/dashboard/services/${service._id}`}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
          >
            View Plans
          </button>
        </div>
      ))}
    </div>
  );
}
