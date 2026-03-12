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

// 🔹 Reusable components (same as original design)
const Card = ({ className = "", children }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
    {...props}
  />
);

const Table = ({ children }) => <table className="min-w-full">{children}</table>;
const TableHeader = ({ children }) => <thead className="bg-gray-50">{children}</thead>;
const TableBody = ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>;
const TableRow = ({ children, className = "" }) => <tr className={className}>{children}</tr>;
const TableHead = ({ children, className = "", ...props }) => (
  <th
    scope="col"
    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${className}`}
    {...props}
  >
    {children}
  </th>
);
const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${className}`}>{children}</td>
);

// Role Filter Component - Updated for branch users
const RoleFilter = ({ selectedRole, onRoleChange, roles, isBranchUser }) => {
  return (
    <select
      value={selectedRole}
      onChange={(e) => onRoleChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-w-[180px]"
    >
      <option value="all">All Roles</option>
      {roles.map((role) => (
        <option key={role.value} value={role.value}>
          {role.label}
        </option>
      ))}
    </select>
  );
};

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

  // 🔹 Check if current user is branch user
  const isBranchUser = checkBranchUser(user?.role);

  // 🔹 Role options based on user type
  const roleOptions = useMemo(() => {
    // Agar user branch user hai (role 6,7,8)
    if (isBranchUser) {
      // Sirf branch ke roles dikhao
      return [
        { value: ROLES.BRANCH_ADMIN.toString(), label: 'Admin' },
        { value: ROLES.BRANCH_MANAGER.toString(), label: 'Team Manager' },
        { value: ROLES.BRANCH_TEAM.toString(), label: 'Team Member' }
      ];
    }
    
    // Organization users ke liye (role 3,4,5)
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
    
    // Root admin ke liye (role 0,1,2) - saare roles dikhao
    return [
      { value: ROLES.SUPER_ADMIN.toString(), label: 'Super Admin' },
      { value: ROLES.ADMIN.toString(), label: 'Company CRM Admin' },
      { value: ROLES.ADMIN_TEAM.toString(), label: 'Company Team' },
      { value: ROLES.ORGANIZATION_ADMIN.toString(), label: 'Organization Admin' },
      { value: ROLES.ORGANIZATION_MANAGER.toString(), label: 'Organization Manager' },
      { value: ROLES.ORGANIZATION_TEAM.toString(), label: 'Organization Team' },
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
      setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on search
    }, 1000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm]);

  // Reset page when role filter changes
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [selectedRole]);

  // Assign plan modal states
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
        fetchTeamMembers(pagination.page); // Refresh current page
      } else {
        toast.error(res.data.message || 'Failed to assign plan');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign plan');
    }
  };

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
      
      const responseData = res.data;
      
      if (responseData.data && Array.isArray(responseData.data)) {
        setTeamMembers(responseData.data);
        setPagination({
          page: responseData.pagination?.page || pageNum,
          limit: responseData.pagination?.limit || pagination.limit,
          total: responseData.pagination?.total || responseData.data.length,
          pages: responseData.pagination?.totalPages || 1,
          hasMore: responseData.pagination?.hasMore || false
        });
      } else {
        // If API doesn't support pagination yet, handle client-side
        setTeamMembers(responseData.data || []);
        setPagination(prev => ({
          ...prev,
          total: responseData.data?.length || 0,
          pages: Math.ceil((responseData.data?.length || 0) / prev.limit),
          hasMore: prev.page < Math.ceil((responseData.data?.length || 0) / prev.limit)
        }));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers(1);
  }, [debouncedSearch, selectedRole]);

  // Handle Page Change
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > pagination.pages || loading) return;
    fetchTeamMembers(newPage);
  }, [pagination.pages, loading]);

  // Filter + sort (client-side sorting only)
  const filteredAndSortedMembers = useMemo(() => {
    let members = [...teamMembers];

    // Apply role filter (if not already filtered by API)
    if (selectedRole !== 'all') {
      members = members.filter(m => m.role.toString() === selectedRole);
    }

    // Apply search filter (if not already filtered by API)
    if (debouncedSearch) {
      members = members.filter(member =>
        member.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        member.mobile?.includes(debouncedSearch)
      );
    }

    // Apply sorting
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
  }, [teamMembers, selectedRole, debouncedSearch, sortBy, sortOrder]);

  // Get current page data for display (if API doesn't support pagination)
  const currentPageMembers = useMemo(() => {
    if (pagination.pages > 1 && !pagination.hasMore) {
      // Client-side pagination fallback
      const start = (pagination.page - 1) * pagination.limit;
      const end = start + pagination.limit;
      return filteredAndSortedMembers.slice(start, end);
    }
    return filteredAndSortedMembers;
  }, [filteredAndSortedMembers, pagination.page, pagination.limit, pagination.pages, pagination.hasMore]);

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
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters = searchTerm || selectedRole !== 'all';

  // Stats
  const roleStats = {
    total: pagination.total,
  };

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 md:p-8">

      {/* Header */}
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
          <Button onClick={() => fetchTeamMembers(pagination.page)} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : "Refresh"}
          </Button>

          <Link href="/dashboard/teams/add">
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Team
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Members" value={roleStats.total} icon={Users} />
      </div>

      {/* Filters */}
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

          {/* Role Filter - Updated with user-specific roles */}
          <RoleFilter
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            roles={roleOptions}
            isBranchUser={isBranchUser}
          />

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="px-3 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 bg-white"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Assign Plan Modal */}
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

      {/* Team Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('name')}>
                <div className="flex items-center gap-2">
                  Name <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>

              <TableHead>Mobile</TableHead>

              {!isBranchUser && <TableHead>Organization</TableHead>}
              {!isBranchUser && <TableHead>Branch</TableHead>}

              <TableHead onClick={() => handleSort('role')}>
                <div className="flex items-center gap-2">
                  Role <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>

              <TableHead>Team Manager</TableHead>

              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading team members...
                  </div>
                </TableCell>
              </TableRow>
            ) : currentPageMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
                  <p className="text-sm text-gray-500">
                    {hasActiveFilters 
                      ? "Try adjusting your search or filters" 
                      : "Get started by adding your first team member"}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              currentPageMembers.map((member) => (
                <TableRow key={member._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                        {member.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="font-medium">{member.name || '—'}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{member.mobile || '—'}</TableCell>

                  {!isBranchUser && (
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {member.restaurant?.name || '—'}
                      </div>
                    </TableCell>
                  )}

                  {!isBranchUser && (
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {member.branch?.name || '—'}
                      </div>
                    </TableCell>
                  )}

                  <TableCell>
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {getRoleLabel(member.role)}
                    </span>
                  </TableCell>

                  <TableCell>
                    {member.manager?.name ? (
                      <div className="text-sm">
                        <div className="font-medium">{member.manager.name}</div>
                        <div className="text-gray-500 text-xs">{member.manager.mobile}</div>
                      </div>
                    ) : (
                      '—'
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">

                      {/* Edit Button */}
                      {canEditTeamMember(user) && (
                        <button
                          onClick={() => router.push(`/dashboard/teams/${member._id}/edit`)}
                          className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-md transition-colors"
                          title="Edit Team Member"
                        >
                          <Pen className="h-4 w-4" />
                        </button>
                      )}

                      {/* Assign plan only for BRANCH_TEAM */}
                      {isRootAdmin(user.role) && member.role === ROLES.BRANCH_TEAM && (
                        <button
                          onClick={() => openAssignPlanModal(member._id)}
                          className="p-2 text-orange-600 hover:text-white hover:bg-orange-500 rounded-md transition-colors"
                          title="Assign Plan"
                        >
                          <UserPlus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

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
    </div>
  );
};

export default Teams;