'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';

export default function ServiceDetail() {
  const { id } = useParams();
  const [plans, setPlans] = useState([]);
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get('/api/services');
        const s = res.data.data.find(s => s._id === id);
        setService(s);
      } catch (err) { console.error(err); }
    };

    const fetchPlans = async () => {
      try {
        const res = await api.get(`/api/services/plans/${id}`);
        setPlans(res.data.data);
      } catch (err) { console.error(err); }
    };

    fetchService();
    fetchPlans();
  }, [id]);

  const handleSubscribe = async (planId) => {
    const userId = 'your-user-id'; // replace with auth logic
    try {
      const res = await api.post('/api/services/subscribe', { userId, planId });
      alert('Subscribed successfully!');
    } catch (err) {
      console.error(err);
      alert('Subscription failed');
    }
  };

  if (!service) return <p>Loading service...</p>;

  return (
    <div>
      <h1>{service.name}</h1>
      <p>{service.description}</p>

      <h2>Plans</h2>
      {plans.map(plan => (
        <div key={plan._id} className="border p-3 mb-2 rounded">
          <p><strong>{plan.name}</strong> - ${plan.price}</p>
          <p>Duration: {plan.durationDays} days</p>
          <button
            onClick={() => handleSubscribe(plan._id)}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Subscribe
          </button>
        </div>
      ))}
    </div>
  );
}
