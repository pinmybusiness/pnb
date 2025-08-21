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
  X
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

const BranchView = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [teamMembers, setTeamMembers] = useState([]);
  const [showTeamFilters, setShowTeamFilters] = useState(false);

  // Mock team members data
  const mockTeamMembers = [
    {
      _id: "1",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "+91 9876543210",
      role: "Branch Manager",
      status: "active",
      joinDate: "2024-01-15",
      avatar: "/avatars/rajesh.jpg"
    },
    {
      _id: "2",
      name: "Priya Singh",
      email: "priya.singh@example.com",
      phone: "+91 8765432109",
      role: "Assistant Manager",
      status: "active",
      joinDate: "2024-02-20",
      avatar: "/avatars/priya.jpg"
    },
    {
      _id: "3",
      name: "Amit Sharma",
      email: "amit.sharma@example.com",
      phone: "+91 7654321098",
      role: "Head Chef",
      status: "active",
      joinDate: "2023-11-05",
      avatar: "/avatars/amit.jpg"
    },
    {
      _id: "4",
      name: "Sneha Gupta",
      email: "sneha.gupta@example.com",
      phone: "+91 6543210987",
      role: "Cashier",
      status: "on_leave",
      joinDate: "2024-03-10",
      avatar: "/avatars/sneha.jpg"
    },
    {
      _id: "5",
      name: "Vikram Patel",
      email: "vikram.patel@example.com",
      phone: "+91 9432109876",
      role: "Waiter",
      status: "active",
      joinDate: "2024-04-22",
      avatar: "/avatars/vikram.jpg"
    }
  ];

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/branches/${id}`);
        setBranch(res.data.data);
        // Set mock team members
        setTeamMembers(mockTeamMembers);
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

  const handleCancelBranch = async () => {
      router.push("/company/admin/branches");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "on_leave": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
        <Link href="/company/admin/branches" className="mt-4 inline-flex items-center text-primary hover:underline">
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
          <Link href="/company/admin/branches" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2">
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
            onClick={() => router.push(`/company/admin/branches/${id}/edit`)}
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
                  <button 
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center"
                    onClick={() => setShowTeamFilters(!showTeamFilters)}
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    Filters
                    {showTeamFilters ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                  </button>
                  <Button className="rounded-lg text-sm">
                    <UserCheck className="h-4 w-4 mr-1" />
                    Add Member
                  </Button>
                </div>
              </div>

              {showTeamFilters && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option value="">All Roles</option>
                      <option value="manager">Manager</option>
                      <option value="chef">Chef</option>
                      <option value="cashier">Cashier</option>
                      <option value="waiter">Waiter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                      <option value="">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="on_leave">On Leave</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input 
                      type="text" 
                      placeholder="Search team members..." 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              )}

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
                    {teamMembers.map((member) => (
                      <tr key={member._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center border border-soft font-medium">
                              {member.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.role}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status)}`}>
                            {member.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(member.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button className="text-gray-600 hover:text-gray-900 p-1">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{teamMembers.length}</span> of{' '}
                  <span className="font-medium">{teamMembers.length}</span> results
                </p>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
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
    </div>
  );
};

export default BranchView;