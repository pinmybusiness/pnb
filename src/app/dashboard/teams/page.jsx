'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import apiClient from "@/lib/apiClient";
import {
  Loader2,
  Users,
  Search,
  UserPlus,
  ArrowUpDown,
  Eye,
  Pen,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import KPICard from '@/components/ui/KPICard';
import Pagination from '@/components/ui/Pagination';

// 🔹 Import Roles + Helpers
import { 
  canEditTeamMember, 
  isBranchUser as checkBranchUser, 
  getRoleLabel, 
  isRootAdmin,
  isOrganizationUser,
  ROLES,
} from '@/constants/teamRoleHelpers';
import { Card, Input } from '@/components/ui';

// ... existing UI components

const Teams = () => {
  const router = useRouter();
  const { user, token } = useSelector((state) => state.auth);

  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasMore: false
  });

  const isBranchUser = checkBranchUser(user?.role);

  // Role options based on user type
  const roleOptions = useMemo(() => {
    if (isBranchUser) {
      return [
        { value: ROLES.BRANCH_ADMIN.toString(), label: 'Admin' },
        { value: ROLES.BRANCH_MANAGER.toString(), label: 'Team Manager' },
        { value: ROLES.BRANCH_TEAM.toString(), label: 'Team Member' }
      ];
    }
    
    if (isOrganizationUser(user?.role)) {
      return [
        { value: ROLES.ORGANIZATION_ADMIN.toString(), label: 'Organization Admin' },
        { value: ROLES.ORGANIZATION_MANAGER.toString(), label: 'Organization Manager' },
        { value: ROLES.ORGANIZATION_TEAM.toString(), label: 'Organization Team' },
        { value: ROLES.BRANCH_ADMIN.toString(), label: 'Branch Admin' },
        { value: ROLES.BRANCH_MANAGER.toString(), label: 'Branch Manager' },
        { value: ROLES.BRANCH_TEAM.toString(), label: 'Branch Team' }
      ];
    }
    
    return [
      { value: ROLES.SUPER_ADMIN.toString(), label: 'Super Admin' },
      { value: ROLES.ADMIN.toString(), label: 'Company CRM Admin' },
      { value: ROLES.ADMIN_TEAM.toString(), label: 'Company Team' },
      // { value: ROLES.ORGANIZATION_ADMIN.toString(), label: 'Organization Admin' },
      // { value: ROLES.ORGANIZATION_MANAGER.toString(), label: 'Organization Manager' },
      // { value: ROLES.ORGANIZATION_TEAM.toString(), label: 'Organization Team' },
      { value: ROLES.BRANCH_ADMIN.toString(), label: 'Branch Admin' },
      { value: ROLES.BRANCH_MANAGER.toString(), label: 'Branch Manager' },
      { value: ROLES.BRANCH_TEAM.toString(), label: 'Branch Team' }
    ];
  }, [isBranchUser, user?.role]);

  // Debounce timer ref
  const debounceTimerRef = useRef(null);

  // Debounced Search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 1000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    } else {
      fetchTeamMembers(1);
    }
  }, [debouncedSearch, selectedRole]);

  const fetchTeamMembers = async (pageNum = 1) => {
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        limit: pagination.limit,
        search: debouncedSearch,
        role: selectedRole !== 'all' ? selectedRole : undefined
      };

      const res = await apiClient.get(`/api/teams`, { params });
      
      if (res.data.success) {
        setTeamMembers(res.data.data);
        setPagination({
          page: res.data.pagination.page,
          limit: res.data.pagination.limit,
          total: res.data.pagination.total,
          pages: res.data.pagination.totalPages,
          hasMore: res.data.pagination.hasMore
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  // Handle Page Change
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > pagination.pages || loading) return;
    fetchTeamMembers(newPage);
  }, [pagination.pages, loading]);

  // Only sorting - no filtering (API already filtered)
  const sortedMembers = useMemo(() => {
    if (!teamMembers.length) return [];
    
    const members = [...teamMembers];
    members.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'role':
          aValue = getRoleLabel(a.role);
          bValue = getRoleLabel(b.role);
          break;
        default:
          return 0;
      }
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
    
    return members;
  }, [teamMembers, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedRole('all');
  };

  const hasActiveFilters = searchTerm || selectedRole !== 'all';

  // Assign plan modal states (unchanged)
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');

  const openAssignPlanModal = async (memberId) => {
    setSelectedMember(memberId);
    setShowAssignModal(true);

    if (plans.length === 0) {
      try {
        const res = await apiClient.get('/api/services/plans');
        setPlans(res.data.data || []);
      } catch (err) {
        toast.error('Failed to load plans');
      }
    }
  };

  const assignPlanToMember = async () => {
    if (!selectedPlan || !selectedMember) {
      toast.error('Please select a plan');
      return;
    }

    try {
      const res = await apiClient.post('/api/services/subscribe', {
          userId: selectedMember,
          planId: selectedPlan,
          addons: [],
        }
      );

      if (res.data.success) {
        toast.success('Plan assigned successfully!');
        setShowAssignModal(false);
        fetchTeamMembers(pagination.page);
      } else {
        toast.error(res.data.message || 'Failed to assign plan');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign plan');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 md:p-8">
      {/* Header - unchanged */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-500">
            {isBranchUser 
              ? "Manage your branch team members" 
              : "Manage team members across all branches"}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => fetchTeamMembers(pagination.page)}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </button>

          <Link href="/dashboard/teams/add">
            <button className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Team
            </button>
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Members" value={pagination.total} icon={Users} />
      </div>

      {/* Filters - unchanged */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-w-[180px]"
          >
            <option value="all">All Roles</option>
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md bg-white"
            >
              Clear Filters
            </button>
          )}
        </div>
      </Card>

      {/* Team Table */}
      <Card>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                onClick={() => handleSort('name')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  Name <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              {!isBranchUser && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
              )}
              {!isBranchUser && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
              )}
              <th
                onClick={() => handleSort('role')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  Role <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team Manager
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Call
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading team members...
                  </div>
                </td>
              </tr>
            ) : sortedMembers.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
                  <p className="text-sm text-gray-500">
                    {hasActiveFilters 
                      ? "Try adjusting your search or filters" 
                      : "Get started by adding your first team member"}
                  </p>
                </td>
              </tr>
            ) : (
              sortedMembers.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                        {member.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U'}
                      </div>
                      <div className="font-medium">{member.name || '—'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.mobile || '—'}
                  </td>
                  {!isBranchUser && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="max-w-[200px] truncate">
                        {member.restaurant?.name || '—'}
                      </div>
                    </td>
                  )}
                  {!isBranchUser && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="max-w-[200px] truncate">
                        {member.branch?.name || '—'}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {getRoleLabel(member.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.manager?.name ? (
                      <div className="text-sm">
                        <div className="font-medium">{member.manager.name}</div>
                        <div className="text-gray-500 text-xs">{member.manager.mobile}</div>
                      </div>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.role === 8 ? (
                      member.lastCallTime ? (
                        <div className="text-sm">
                          <div className="text-gray-900">{new Date(member.lastCallTime).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                          <div className="text-gray-500 text-xs">{new Date(member.lastCallTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                        </div>
                      ) : <span className="text-xs text-gray-400">No calls yet</span>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {canEditTeamMember(user) && (
                        <button
                          onClick={() => router.push(`/dashboard/teams/${member._id}/edit`)}
                          className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-md transition-colors"
                          title="Edit Team Member"
                        >
                          <Pen className="h-4 w-4" />
                        </button>
                      )}

                      {isRootAdmin(user?.role) && member.role === ROLES.BRANCH_TEAM && (
                        <button
                          onClick={() => openAssignPlanModal(member._id)}
                          className="p-2 text-orange-600 hover:text-white hover:bg-orange-500 rounded-md transition-colors"
                          title="Assign Plan"
                        >
                          <UserPlus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && pagination.total > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              loading={loading}
              itemsLabel="team members"
              showItemsCount={true}
              showPageInfo={true}
            />
          </div>
        )}
      </Card>

      {/* Assign Plan Modal - unchanged */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-semibold mb-3">Assign Plan</h2>
            <select
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              <option value="">Select Plan</option>
              {plans.map((plan) => (
                <option key={plan._id} value={plan._id}>
                  {plan.serviceId?.name || 'Unknown Service'} — {plan.name} — ₹{plan.price}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={assignPlanToMember}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;