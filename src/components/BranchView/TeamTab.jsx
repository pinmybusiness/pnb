'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Users,
  Edit,
  UserPlus,
  Loader,
  Save,
  X,
  UserCheck,
  Search,
  ArrowUpDown,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/apiClient';
import { formatDateWithSuffix } from '@/utils/dateFormat';
import AddTeamMemberModal from '../team/AddTeamMemberModal';
import Pagination from '@/components/ui/Pagination'; // Reuse your Pagination component

// UI Components (similar to your CallTracking style)
const Card = ({ className = '', children }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseClasses = 'inline-flex items-center px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Badge Component (like your StatusBadge)
const RoleBadge = ({ role }) => {
  const roleStyles = {
    6: 'bg-purple-100 text-purple-800', // Branch Admin
    7: 'bg-blue-100 text-blue-800',     // Branch Team Manager
    8: 'bg-green-100 text-green-800',   // Branch Staff
  };
  
  const roleLabels = {
    6: 'Branch Admin',
    7: 'Branch Manager',
    8: 'Branch Staff',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleStyles[role] || 'bg-gray-100 text-gray-800'}`}>
      {roleLabels[role] || 'Unknown'}
    </span>
  );
};

// Status Badge (like your DirectionBadge)
const StatusBadge = ({ isActive }) => {
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
      isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
};

// Avatar Component (like your CallerDisplay)
const Avatar = ({ name }) => {
  const initial = name?.charAt(0) || 'U';
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
  const colorIndex = (name?.length || 0) % colors.length;
  
  return (
    <div className={`h-8 w-8 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white font-medium text-sm`}>
      {initial.toUpperCase()}
    </div>
  );
};

const TeamTab = ({ branchId }) => {
  // ========== STATE MANAGEMENT (like your CallTracking) ==========
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedMemberForPlan, setSelectedMemberForPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  
  // Pagination State (like your CallTracking)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasMore: false
  });

  // Edit Form State
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    isActive: true,
    role: 8,
  });

  // Refs
  const debounceTimerRef = useRef(null);

  // ========== FILTER OPTIONS (like your answeredOptions) ==========
  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: '6', label: 'Branch Admin' },
    { value: '7', label: 'Branch Manager' },
    { value: '8', label: 'Branch Staff' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  // ========== DATA MAPPING (like your mapCallData) ==========
  const mapTeamMemberData = useCallback((member) => {
    return {
      id: member._id,
      name: member.name || 'Unknown User',
      email: member.email || '',
      mobile: member.mobile || '',
      role: member.role,
      isActive: member.isActive,
      createdAt: member.createdAt,
      branch: member.branch,
      manager: member.managerId,
    };
  }, []);

  // ========== DEBOUNCED SEARCH (like your handleSearchChange) ==========
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, 500); // 500ms debounce
  }, []);

  // ========== SORT HANDLER (like your handleSort) ==========
  const handleSort = useCallback((key) => {
    if (sortBy === key) {
      setSortOrder(order => order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  }, [sortBy]);

  // ========== FETCH TEAM MEMBERS (like your fetchCalls) ==========
  const fetchTeamMembers = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      
      const params = {
        page: pageNum,
        limit: pagination.limit,
        search: debouncedSearchTerm,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sortBy,
        sortOrder,
      };

      const response = await apiClient.get(`/api/teams/branch/${branchId}`, { params });
      
      const { data: membersData, pagination: paginationInfo } = response.data;
      const mappedMembers = membersData.map(mapTeamMemberData);

      setTeamMembers(mappedMembers);
      
      setPagination({
        page: paginationInfo.page,
        limit: paginationInfo.limit,
        total: paginationInfo.total,
        pages: paginationInfo.totalPages,
        hasMore: paginationInfo.hasMore
      });

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch team members');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [branchId, debouncedSearchTerm, roleFilter, statusFilter, sortBy, sortOrder, pagination.limit, mapTeamMemberData]);

  // ========== FETCH PLANS FOR ASSIGN MODAL ==========
  const fetchPlans = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/services/plans');
      setPlans(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load plans');
    }
  }, []);

  // ========== ASSIGN PLAN ==========
  const assignPlanToMember = async () => {
    if (!selectedPlan || !selectedMemberForPlan) {
      toast.error('Please select a plan');
      return;
    }

    setAssignLoading(true);
    try {
      const res = await apiClient.post('/api/services/subscribe', {
        userId: selectedMemberForPlan,
        planId: selectedPlan,
        addons: [],
      });

      if (res.data.success) {
        toast.success('Plan assigned successfully!');
        setShowAssignModal(false);
        setSelectedPlan('');
        setSelectedMemberForPlan(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign plan');
    } finally {
      setAssignLoading(false);
    }
  };

  // ========== EDIT MEMBER ==========
  const handleEditMember = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.put(`/api/teams/${selectedMember.id}`, editForm);
      
      if (res.data.success) {
        toast.success('Team member updated successfully');
        setShowEditModal(false);
        setSelectedMember(null);
        fetchTeamMembers(pagination.page);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update team member');
    }
  };

  // ========== OPEN EDIT MODAL ==========
  const openEditModal = (member) => {
    setSelectedMember(member);
    setEditForm({
      name: member.name,
      email: member.email,
      isActive: member.isActive,
      role: member.role,
    });
    setShowEditModal(true);
  };

  // ========== OPEN ASSIGN MODAL ==========
  const openAssignModal = async (memberId) => {
    setSelectedMemberForPlan(memberId);
    setShowAssignModal(true);
    
    if (plans.length === 0) {
      await fetchPlans();
    }
  };

  // ========== PAGE CHANGE HANDLER (like your handlePageChange) ==========
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > pagination.pages || loading) return;
    fetchTeamMembers(newPage);
  }, [pagination.pages, loading, fetchTeamMembers]);

  // ========== EFFECTS (like your CallTracking) ==========
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    fetchTeamMembers(1); // Reset to page 1 when filters change
  }, [debouncedSearchTerm, roleFilter, statusFilter, sortBy, sortOrder]);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Total Teams <span className="text-gray-500 font-normal">({pagination.total})</span></h2>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Filters Section (like your CallTracking filters) */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, email or mobile..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Team Members Table/Cards */}
      <Card>
        {loading && pagination.page === 1 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-sm text-gray-500">Loading team members…</span>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      onClick={() => handleSort('name')} 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        Team Member
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th 
                      onClick={() => handleSort('createdAt')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        Join Date
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar name={member.name} />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {member.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RoleBadge role={member.role} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{member.mobile}</div>
                        {member.email && (
                          <div className="text-sm text-gray-500">{member.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge isActive={member.isActive} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateWithSuffix(member.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(member)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit Member"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          {member.role === 8 && ( // Branch Staff
                            <button
                              onClick={() => openAssignModal(member.id)}
                              className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50"
                              title="Assign Plan"
                            >
                              <UserCheck className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-2 p-2">
              {teamMembers.map((member) => (
                <Card key={member.id} className="p-4">
                  <div className="space-y-3">
                    {/* Header with Avatar and Name */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar name={member.name} />
                        <div>
                          <div className="font-medium text-gray-900">{member.name}</div>
                          <div className="text-xs text-gray-500">{member.mobile}</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditModal(member)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {member.role === 8 && (
                          <button
                            onClick={() => openAssignModal(member.id)}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-xs text-gray-500">Role</div>
                        <RoleBadge role={member.role} />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Status</div>
                        <StatusBadge isActive={member.isActive} />
                      </div>
                      {member.email && (
                        <div className="col-span-2">
                          <div className="text-xs text-gray-500">Email</div>
                          <div className="text-sm text-gray-900 truncate">{member.email}</div>
                        </div>
                      )}
                      <div className="col-span-2">
                        <div className="text-xs text-gray-500">Joined</div>
                        <div className="text-sm text-gray-900">{formatDateWithSuffix(member.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* No Data State (like your CallTracking) */}
        {teamMembers.length === 0 && !loading && (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
            <p className="text-sm text-gray-500">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Add your first team member to get started'}
            </p>
          </div>
        )}
      </Card>

      {/* Pagination - Reusing your Pagination component */}
      {teamMembers.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={loading}
          itemsLabel="team members"
          showItemsCount={true}
          showPageInfo={true}
          className="mt-4"
        />
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <AddTeamMemberModal
          isOpen={showAddModal}
          branchId={branchId}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            toast.success('Team member added successfully');
            fetchTeamMembers(1);
          }}
        />
      )}

      {/* Edit Member Modal */}
      {showEditModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <Card className="max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Team Member</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value={6}>Branch Admin</option>
                  <option value={7}>Branch Manager</option>
                  <option value={8}>Branch Staff</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.isActive}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'true' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Update
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Assign Plan Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <Card className="max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Assign Plan</h3>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedPlan('');
                  setSelectedMemberForPlan(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Plan
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                >
                  <option value="">Select a plan</option>
                  {plans.map((plan) => (
                    <option key={plan._id} value={plan._id}>
                      {plan.serviceId?.name || 'Unknown'} — {plan.name} — ₹{plan.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedPlan('');
                    setSelectedMemberForPlan(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={assignPlanToMember}
                  disabled={assignLoading || !selectedPlan}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  {assignLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Assigning...
                    </>
                  ) : (
                    'Assign Plan'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeamTab; 