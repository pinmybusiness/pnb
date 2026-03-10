'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Edit,
  UserPlus,
  Loader,
  Save,
  X,
  UserCheck // Add this icon for Assign Plan
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/apiClient';
import { formatDateWithSuffix } from '@/utils/dateFormat';
import AddTeamMemberModal from '../team/AddTeamMemberModal';

// 🔹 Import Roles + Helpers (same as first component)
import { ROLES } from '@/constants/roles';
import { getRoleLabel, isRootAdmin } from '@/constants/roleHelpers';

const Card = ({ className = '', children }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className = '', ...props }) => (
  <button
    className={`inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const TeamTab = ({ branchId, teamMembers, setTeamMembers }) => {
  const [teamLoading, setTeamLoading] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  
  // 🔹 ADD THESE STATES FOR ASSIGN PLAN MODAL
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedMemberForPlan, setSelectedMemberForPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  // 🔹 Get current user from localStorage or context
  const [currentUser, setCurrentUser] = useState(null);

  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: '',
  });
  const [addMemberForm, setAddMemberForm] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    role: 6,
    branch: branchId,
  });
  const [editMemberForm, setEditMemberForm] = useState({
    name: '',
    email: '',
    isActive: true,
    role: 8,
  });

  // 🔹 Get current user on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchTeamMembers();
  }, [filters]);

  const fetchTeamMembers = async () => {
    try {
      setTeamLoading(true);
      const res = await apiClient.get(`/api/teams?branch=${branchId}`);

      if (res.data.success) {
        let filteredMembers = res.data.data;

        if (filters.role) {
          filteredMembers = filteredMembers.filter((member) =>
            member.roleName.toLowerCase().includes(filters.role.toLowerCase())
          );
        }

        if (filters.status) {
          filteredMembers = filteredMembers.filter((member) =>
            member.isActive ? filters.status === 'active' : filters.status === 'inactive'
          );
        }

        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredMembers = filteredMembers.filter(
            (member) =>
              member.name.toLowerCase().includes(searchTerm) ||
              member.email.toLowerCase().includes(searchTerm) ||
              member.mobile.includes(searchTerm)
          );
        }

        setTeamMembers(filteredMembers);
      }
    } catch (error) {
      toast.error('Failed to fetch team members');
      console.error('Fetch team error:', error);
    } finally {
      setTeamLoading(false);
    }
  };

  // 🔹 ADD THIS FUNCTION - OPEN ASSIGN PLAN MODAL
  const openAssignPlanModal = async (memberId) => {
    setSelectedMemberForPlan(memberId);
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

  // 🔹 ADD THIS FUNCTION - ASSIGN PLAN TO MEMBER
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
        }
      );

      if (res.data.success) {
        toast.success('Plan assigned successfully!');
        setShowAssignModal(false);
        setSelectedPlan('');
        setSelectedMemberForPlan(null);
      } else {
        toast.error(res.data.message || 'Failed to assign plan');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign plan');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const res = await apiClient.post('/api/auth/team-register', addMemberForm);

      if (res.data.success) {
        toast.success('Team member added successfully');
        setShowAddMemberModal(false);
        setAddMemberForm({
          name: '',
          mobile: '',
          email: '',
          password: '',
          role: 8,
          branch: branchId,
        });
        fetchTeamMembers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add team member');
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditMember = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await apiClient.put(`/api/teams/${selectedMember._id}`, editMemberForm);

      if (res.data.success) {
        toast.success('Team member updated successfully');
        setShowEditMemberModal(false);
        setSelectedMember(null);
        fetchTeamMembers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update team member');
    } finally {
      setEditLoading(false);
    }
  };

  const openEditModal = (member) => {
    setSelectedMember(member);
    setEditMemberForm({
      name: member.name,
      email: member.email,
      isActive: member.isActive,
      role: member.role,
    });
    setShowEditMemberModal(true);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRoleDisplayName = (roleNumber) => {
    const roleMap = {
      0: 'Company Admin',
      1: 'Company CRM',
      2: 'Company Team',
      3: 'Restaurant Admin',
      4: 'Restaurant Manager',
      5: 'Restaurant Team',
      6: 'Branch Admin',
      7: 'Branch Team Manager',
      8: 'Branch Staff',
    };
    return roleMap[roleNumber] || 'Unknown Role';
  };

  const roleOptions = [
    { value: 6, label: 'Branch Manager Admin' },
    { value: 7, label: 'Branch Team Manager' },
    { value: 8, label: 'Branch Staff' },
  ];

  // 🔹 Check if current user is Root Admin (same logic as first component)
  const isCurrentUserRootAdmin = currentUser && isRootAdmin(currentUser.role);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
            <p className="text-gray-500 text-sm">Manage your branch team members and their roles</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAddMemberModal(true)} className="rounded-lg text-sm">
              <UserPlus className="h-4 w-4 mr-1" />
              Add Member
            </Button>
          </div>
        </div>

        {teamLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Team Member
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Join Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamMembers.length > 0 ? (
                    teamMembers.map((member) => (
                      <tr key={member._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center border border-soft font-medium">
                              {member.name?.charAt(0) || 'U'}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {member.name || 'Unknown User'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{getRoleDisplayName(member.role)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.mobile}</div>
                          {member.email && (
                            <div className="text-sm text-gray-500">{member.email}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              member.isActive
                            )}`}
                          >
                            {member.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateWithSuffix(member.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(member)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Edit Member"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            
                            {/* 🔹 ADD ASSIGN PLAN BUTTON HERE - Same logic as first component */}
                            { member.role === ROLES.BRANCH_TEAM && (
                              <button
                                onClick={() => openAssignPlanModal(member._id)}
                                className="text-orange-600 hover:text-orange-900 p-1"
                                title="Assign Plan"
                              >
                                <UserCheck className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center">
                        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">No team members found for this branch</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Add team members to get started
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {teamMembers.length > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{' '}
                  <span className="font-medium">{teamMembers.length}</span> of{' '}
                  <span className="font-medium">{teamMembers.length}</span> results
                </p>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <AddTeamMemberModal
          isOpen={showAddMemberModal}
          branchId={branchId}
          onClose={() => setShowAddMemberModal(false)}
          onSuccess={() => {
            toast.success('Team member added successfully');
            fetchTeamMembers();
          }}
        />
      )}

      {/* Edit Member Modal */}
      {showEditMemberModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Team Member</h3>
              <button
                onClick={() => setShowEditMemberModal(false)}
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
                  value={editMemberForm.name}
                  onChange={(e) => setEditMemberForm({ ...editMemberForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editMemberForm.email}
                  onChange={(e) => setEditMemberForm({ ...editMemberForm, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={editMemberForm.role}
                  onChange={(e) =>
                    setEditMemberForm({
                      ...editMemberForm,
                      role: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editMemberForm.isActive}
                  onChange={(e) =>
                    setEditMemberForm({ ...editMemberForm, isActive: e.target.value === 'true' })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditMemberModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                  {editLoading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin inline mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1 inline" />
                      Update Member
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔹 ADD ASSIGN PLAN MODAL - Same as first component */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
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
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                >
                  <option value="">Select a plan</option>
                  {plans.map((plan) => (
                    <option key={plan._id} value={plan._id}>
                      {plan.serviceId?.name || 'Unknown Service'} — {plan.name} — ₹{plan.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedPlan('');
                    setSelectedMemberForPlan(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={assignPlanToMember}
                  disabled={assignLoading || !selectedPlan}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {assignLoading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin inline mr-2" />
                      Assigning...
                    </>
                  ) : (
                    'Assign Plan'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamTab;