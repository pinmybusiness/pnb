"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Upload, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';

export default function ApplyOpportunity() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [opportunity, setOpportunity] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (id) fetchOpportunity();
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities/public/${id}`
      );
      const data = await response.json();
      if (data.success) setOpportunity(data.data);
    } catch (error) {
      console.error('Error fetching opportunity:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          opportunityId: id,
          coverLetter: coverLetter
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.message || 'Application failed');
      }
    } catch (error) {
      alert('Application failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Your application for {opportunity?.title} has been submitted successfully.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/jobs" 
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Browse More Opportunities
              </Link>
              <Link 
                href="/applications" 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View My Applications
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link 
          href={`/opportunities/public/${id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Opportunity
        </Link>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Apply for Opportunity</h1>
          <p className="text-gray-600 mb-6">{opportunity?.title} at {opportunity?.branch?.name}</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Why are you interested in this opportunity? What skills and experience do you bring?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  We'll use the resume from your student profile
                </p>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Update Resume in Profile
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}