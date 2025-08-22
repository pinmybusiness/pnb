'use client';
import { useState, useEffect } from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Star, 
  Eye, 
  Edit, 
  Trash2,
  ArrowLeft,
  Calendar,
  BarChart3,
  UserCheck,
  Settings,
  ChevronDown,
  ChevronUp,
  Download,
  Filter,
  MoreVertical,
  MessageSquare,
  Mail as MailIcon,
  X,
  Loader,
  Plus,
  Save,
  UserPlus
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatDateWithSuffix } from "@/utils/dateFormat";

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

const BranchView = () => {
  const router = useRouter();
  const params = useParams(); 
  const id = params.id; 
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [teamMembers, setTeamMembers] = useState([]);
  const [showTeamFilters, setShowTeamFilters] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    search: ""
  });

  // Add member form state
  const [addMemberForm, setAddMemberForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    role: 8, // Default to Branch Staff
    branch: id
  });

  // Edit member form state
  const [editMemberForm, setEditMemberForm] = useState({
    name: "",
    email: "",
    isActive: true
  });

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/branches/${id}`);
        setBranch(res.data.data);
      } catch (error) {
        toast.error("Failed to fetch branch details");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBranch();
    }
  }, [id]);

  useEffect(() => {
    if (activeTab === "team" && id) {
      fetchTeamMembers();
    }
  }, [activeTab, id, filters]);

  const fetchTeamMembers = async () => {
    try {
      setTeamLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/teams?branch=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (res.data.success) {
        let filteredMembers = res.data.data;
        
        // Apply filters
        if (filters.role) {
          filteredMembers = filteredMembers.filter(member => 
            member.roleName.toLowerCase().includes(filters.role.toLowerCase())
          );
        }
        
        if (filters.status) {
          filteredMembers = filteredMembers.filter(member => 
            member.isActive ? filters.status === 'active' : filters.status === 'inactive'
          );
        }
        
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredMembers = filteredMembers.filter(member => 
            member.name.toLowerCase().includes(searchTerm) ||
            member.email.toLowerCase().includes(searchTerm) ||
            member.mobile.includes(searchTerm)
          );
        }
        
        setTeamMembers(filteredMembers);
      }
    } catch (error) {
      toast.error("Failed to fetch team members");
      console.error("Fetch team error:", error);
    } finally {
      setTeamLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, addMemberForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.data.success) {
        toast.success("Team member added successfully");
        setShowAddMemberModal(false);
        setAddMemberForm({
          name: "",
          mobile: "",
          email: "",
          password: "",
          role: 8,
          branch: id
        });
        fetchTeamMembers(); // Refresh the team list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add team member");
      console.error("Add member error:", error);
    }
  };

  const handleEditMember = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/teams/${selectedMember._id}`,
        editMemberForm,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (res.data.success) {
        toast.success("Team member updated successfully");
        setShowEditMemberModal(false);
        setSelectedMember(null);
        fetchTeamMembers(); // Refresh the team list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update team member");
      console.error("Edit member error:", error);
    }
  };

  const openEditModal = (member) => {
    setSelectedMember(member);
    setEditMemberForm({
      name: member.name,
      email: member.email,
      isActive: member.isActive
    });
    setShowEditMemberModal(true);
  };

  const handleCancelBranch = async () => {
    router.push("/dashboard/branches");
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getStatusColor = (isActive) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getRoleDisplayName = (roleNumber) => {
    const roleMap = {
      0: 'Company Admin',
      1: 'Company CRM', 
      2: 'Company Team',
      3: 'Restaurant Admin',
      4: 'Restaurant Manager',
      5: 'Restaurant Team',
      6: 'Branch Manager',
      7: 'Branch Team', 
      8: 'Branch Staff'
    };
    return roleMap[roleNumber] || 'Unknown Role';
  };

  const roleOptions = [
    { value: 6, label: 'Branch Manager' },
    { value: 7, label: 'Branch Team' },
    { value: 8, label: 'Branch Staff' }
  ];

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
            { id: "overview", name: "Overview", icon: Eye },
            { id: "performance", name: "Performance", icon: BarChart3 },
            { id: "team", name: "Team", icon: Users },
            { id: "settings", name: "Settings", icon: Settings }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 text-sm font-medium border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {tab.name}
                {tab.id === "team" && (
                  <span className="bg-gray-200 text-gray-700 text-xs font-medium rounded-full px-2 py-0.5">
                    {teamMembers.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status & Quick Actions Card */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h2>
              
              <div className="space-y-6">
                <div>
                  <p className="font-medium mb-2 text-sm text-gray-700">Current Status</p>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={branch.status?.current} />
                    {branch.status?.reason && (
                      <button className="text-xs text-gray-500 hover:text-gray-700 underline" title={branch.status.reason}>
                        View reason
                      </button>
                    )}
                  </div>
                </div>
                
                {branch.trial && (
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                    <p className="font-medium text-blue-800 text-sm mb-1">Trial Status</p>
                    {branch.trial.isActive ? (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-blue-700 font-medium text-sm">Active</span>
                          <span className="bg-blue-200 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            {Math.ceil((new Date(branch.trial.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                          </span>
                        </div>
                        <p className="text-blue-600 text-xs">
                          Started: {new Date(branch.trial.startDate).toLocaleDateString()}
                        </p>
                        <p className="text-blue-600 text-xs">
                          Ends: {new Date(branch.trial.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm">No active trial</p>
                    )}
                  </div>
                )}
                
               </div>
            </Card>
          </div>
        )}

        {activeTab === "performance" && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Performance analytics are coming soon.</p>
              <p className="text-sm">This section will include charts and detailed metrics about branch performance.</p>
            </div>
          </Card>
        )}

        {activeTab === "team" && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
                  <p className="text-gray-500 text-sm">Manage your branch team members and their roles</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowAddMemberModal(true)}
                    className="rounded-lg text-sm"
                  >
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
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Team Member
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Join Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                    <div className="text-sm font-medium text-gray-900">{member.name || 'Unknown User'}</div>
                                    {/* <div className="text-sm text-gray-500">{member.email}</div> */}
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
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.isActive)}`}>
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
                                    className="text-gray-600 hover:text-gray-900 p-1"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
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
                        Showing <span className="font-medium">1</span> to <span className="font-medium">{teamMembers.length}</span> of{' '}
                        <span className="font-medium">{teamMembers.length}</span> results
                      </p>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>
        )}

        {activeTab === "settings" && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Branch Settings</h2>
            <div className="text-center py-12 text-gray-500">
              <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Advanced settings are coming soon.</p>
              <p className="text-sm">This section will include configuration options for this branch.</p>
            </div>
          </Card>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Team Member</h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={addMemberForm.name}
                  onChange={(e) => setAddMemberForm({...addMemberForm, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input
                  type="tel"
                  required
                  value={addMemberForm.mobile}
                  onChange={(e) => setAddMemberForm({...addMemberForm, mobile: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={addMemberForm.email}
                  onChange={(e) => setAddMemberForm({...addMemberForm, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={addMemberForm.password}
                  onChange={(e) => setAddMemberForm({...addMemberForm, password: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={addMemberForm.role}
                  onChange={(e) => setAddMemberForm({...addMemberForm, role: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  <UserPlus className="h-4 w-4 mr-1 inline" />
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditMemberModal && selectedMember && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Team Member</h3>
              <button onClick={() => setShowEditMemberModal(false)} className="text-gray-400 hover:text-gray-600">
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
                  onChange={(e) => setEditMemberForm({...editMemberForm, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editMemberForm.email}
                  onChange={(e) => setEditMemberForm({...editMemberForm, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editMemberForm.isActive}
                  onChange={(e) => setEditMemberForm({...editMemberForm, isActive: e.target.value === 'true'})}
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
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 mr-1 inline" />
                  Update Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchView;