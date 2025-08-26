'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import OpportunityForm from '@/components/opportunity/OpportunityForm';

export default function EditOpportunityPage() {
  const params = useParams();
  const { id } = params;
  const { token } = useSelector((state) => state.auth);
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setOpportunity(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching opportunity:', error);
        toast.error('Failed to fetch opportunity details');
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchOpportunity();
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-dark mb-4">Opportunity not found</h2>
        <p className="text-gray-500">The opportunity you're trying to edit doesn't exist.</p>
      </div>
    );
  }

  return <OpportunityForm editData={opportunity} />;
}