'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useSelector } from 'react-redux';

export default function MySubscriptions() {
  const [subs, setSubs] = useState([]);
  const { user, token } = useSelector((state) => state.auth);

  const userId = user._id;

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await api.get(`/api/services/my/${userId}`);
        setSubs(res.data.data);
      } catch (err) { console.error(err); }
    };
    fetchSubs();
  }, []);

  return (
    <div>
      <h1>My Subscriptions</h1>
      {subs.map(sub => (
        <div key={sub._id} className="border p-3 mb-2 rounded">
          <p>Service: {sub.serviceId.name}</p>
          <p>Plan: {sub.planId.name}</p>
          <p>Status: {sub.status}</p>
          <p>Expire Date: {new Date(sub.expireDate).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
