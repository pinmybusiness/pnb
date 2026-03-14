'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Edit,
  ArrowLeft,
  Settings,
  X,
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/apiClient';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import TeamTab from '@/components/BranchView/TeamTab';
import SettingsTab from '@/components/BranchView/SettingsTab';

const Button = ({ children, className = '', ...props }) => (
  <button
    className={`inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const BranchView = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id;

  // Initialize activeTab from URL query parameter or default to 'overview'
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'team');
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);

  // Fetch branch data
  useEffect(() => {
    const fetchBranch = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/api/branches/${id}`);
        setBranch(res.data.data);
      } catch (error) {
        toast.error('Failed to fetch branch details');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBranch();
    }
  }, [id]);

  // Update URL when activeTab changes
  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (activeTab !== currentTab) {
      router.push(`/dashboard/branches/${id}?tab=${activeTab}`, { scroll: false });
    }
  }, [activeTab, id, router, searchParams]);

  const handleCancelBranch = async () => {
    router.push('/dashboard/branches');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Branch not found</h2>
        <p className="text-gray-500 mt-2">The branch you're looking for doesn't exist.</p>
        <Link href="/dashboard/branches" className="mt-4 inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to branches
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link href="/dashboard/branches" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to branches
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{branch.name}</h1>
            <h1 className="text-2xl font-bold text-gray-900">({branch.parentRestaurant.name})</h1>
            <StatusBadge status={branch.status?.current} />
          </div>
          <p className="text-gray-500">{branch.location?.address}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/dashboard/branches/${id}/edit`)}
            className="rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Branch
          </Button>
          <button
            onClick={handleCancelBranch}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <X className="h-5 w-5 mr-1" />
            Cancel
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'team', name: 'Team', icon: Users },
            { id: 'settings', name: 'Settings', icon: Settings },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 text-sm font-medium border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'team' && <TeamTab branchId={id} teamMembers={teamMembers} setTeamMembers={setTeamMembers} />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
};

export default BranchView;