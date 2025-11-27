'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  Loader2,
  Users,
  Search,
  UserPlus,
  ArrowUpDown,
  Eye
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import KPICard from '@/components/ui/KPICard';

// 🔹 Import Roles + Helpers
import { ROLES } from '@/constants/roles';
import { isBranchUser as checkBranchUser, isRootAdmin } from '@/constants/roleHelpers';

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

const Teams = () => {
  const router = useRouter();
  const { user, token } = useSelector((state) => state.auth);

  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // 🔹 Replace hard-coded [6, 7] with helper
  const isBranchUser = checkBranchUser(user?.role);

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
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/services/plans`
        );
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
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/services/subscribe`,
        {
          userId: selectedMember,
          planId: selectedPlan,
          addons: [],
        }
      );

      if (res.data.success) {
        toast.success('Plan assigned successfully!');
        setShowAssignModal(false);
      } else {
        toast.error(res.data.message || 'Failed to assign plan');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign plan');
    }
  };

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/teams`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTeamMembers(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Filter + sort
  const filteredMembers = teamMembers
    .filter(
      (member) =>
        member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.mobile?.includes(searchTerm) ||
        member.roleLabel?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'role':
          aValue = a.roleLabel || '';
          bValue = b.roleLabel || '';
          break;
        default:
          return 0;
      }

      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Stats
  const roleStats = {
    total: teamMembers.length,
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-500">Manage team members across all branches</p>
        </div>

        <div className="flex gap-3">
          <Button onClick={fetchTeamMembers} disabled={loading}>
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
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
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

              {!isBranchUser && <TableHead>Restaurant</TableHead>}
              {!isBranchUser && <TableHead>Branch</TableHead>}

              <TableHead onClick={() => handleSort('role')}>
                <div className="flex items-center gap-2">
                  Role <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>

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
            ) : filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map((member) => (
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

                  <TableCell className="capitalize">
                    {member.roleLabel || '—'}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      {/* <button
                        onClick={() => router.push(`/dashboard/teams/${member._id}`)}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button> */}

                      {/* Assign plan only for BRANCH_TEAM */}
                      {isRootAdmin(user.role) && member.role === ROLES.BRANCH_TEAM && (
                        <button
                          onClick={() => openAssignPlanModal(member._id)}
                          className="p-2 text-orange-600 hover:text-white hover:bg-orange-500 rounded-md"
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
      </Card>
    </div>
  );
};

export default Teams;
