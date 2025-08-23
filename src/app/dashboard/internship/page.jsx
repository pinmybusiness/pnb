'use client';
import { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  DollarSign, 
  Star, 
  TrendingUp, 
  ArrowUpDown, 
  Eye, 
  Edit, 
  Clock,
  Users,
  Calendar,
  MapPin,
  Filter,
  X
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import KPICard from "@/components/ui/KPICard";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";

const Internships = () => {
  const router = useRouter();
  const { user, token } = useSelector((state) => state.auth);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch internships for the user's branch
  useEffect(() => {
    const fetchInternships = async () => {
      if (!token || !user) return;

      try {
        setLoading(true);
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/internships`;
        
        // Add branch filter for branch users
        if (user.branch) {
          url += `?branch=${user.branch}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setInternships(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch internships");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [token, user]);

  const categories = [
    'kitchen', 'service', 'management', 'marketing', 'events', 'delivery', 'other'
  ];

  const internshipTypes = [
    'daily', 'weekly', 'weekend', 'part_time', 'full_time'
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending Approval" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "closed", label: "Closed" },
    { value: "completed", label: "Completed" }
  ];

  const filteredAndSortedInternships = internships
    .filter(internship => {
      const matchesSearch =
        internship.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || internship.status?.toLowerCase() === statusFilter.toLowerCase();

      const matchesCategory =
        categoryFilter === "all" || internship.category === categoryFilter;

      const matchesType =
        typeFilter === "all" || internship.internshipType === typeFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "title":
          aValue = a.title || '';
          bValue = b.title || '';
          break;
        case "category":
          aValue = a.category || '';
          bValue = b.category || '';
          break;
        case "status":
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case "positions":
          aValue = a.positions?.total || 0;
          bValue = b.positions?.total || 0;
          break;
        case "stipend":
          aValue = a.stipend?.amount || 0;
          bValue = b.stipend?.amount || 0;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "deadline":
          aValue = new Date(a.deadline);
          bValue = new Date(b.deadline);
          break;
        default:
          return 0;
      }

      if (aValue instanceof Date) {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
      if (typeof aValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const calculateKPIs = () => {
    if (internships.length === 0) return { 
      total: 0, 
      active: 0, 
      totalPositions: 0, 
      filledPositions: 0,
      avgStipend: 0 
    };
    
    const active = internships.filter(i => i.status === 'approved').length;
    const totalPositions = internships.reduce((sum, i) => sum + (i.positions?.total || 0), 0);
    const filledPositions = internships.reduce((sum, i) => sum + (i.positions?.filled || 0), 0);
    const avgStipend = internships.reduce((sum, i) => sum + (i.stipend?.amount || 0), 0) / internships.length;
    
    return {
      total: internships.length,
      active,
      totalPositions,
      filledPositions,
      avgStipend: Math.round(avgStipend)
    };
  };

  const kpiData = calculateKPIs();

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type) => {
    const typeMap = {
      daily: 'Daily',
      weekly: 'Weekly',
      weekend: 'Weekend',
      part_time: 'Part Time',
      full_time: 'Full Time'
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Internship Management</h1>
          <p className="text-gray-500">Manage internships for your branch</p>
        </div>
        <Link href='/dashboard/internship/add'>
          <Button className="rounded-lg bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Internship
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <KPICard 
          title="Total Internships" 
          value={kpiData.total} 
          icon={TrendingUp}
          className="bg-primary-light border-primary"
        />
        <KPICard 
          title="Active" 
          value={kpiData.active} 
          icon={Users}
          className="bg-green-light border-green-custom"
        />
        <KPICard 
          title="Total Positions" 
          value={kpiData.totalPositions} 
          icon={Users}
        />
        <KPICard 
          title="Filled Positions" 
          value={kpiData.filledPositions} 
          icon={Users}
          className="bg-blue-50 border-blue-200"
        />
        <KPICard 
          title="Avg Stipend" 
          value={`₹${kpiData.avgStipend}`} 
          icon={DollarSign}
          className="bg-amber-50 border-amber-200"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-soft p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-soft rounded-md hover:bg-gray-light"
          >
            <Filter className="h-4 w-4" />
            Filters
            {showFilters ? <X className="h-4 w-4" /> : null}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-gray-light rounded-md">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Types</option>
                {internshipTypes.map(type => (
                  <option key={type} value={type}>
                    {getTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Internships Table */}
      <div className="bg-white rounded-lg border border-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-light">
              <tr>
                <th 
                  onClick={() => handleSort("title")} 
                  className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Title
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort("category")} 
                  className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Category
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                  Type
                </th>
                <th 
                  onClick={() => handleSort("positions")} 
                  className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Positions
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort("stipend")} 
                  className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Stipend
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort("status")} 
                  className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort("deadline")} 
                  className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Deadline
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-soft">
              {filteredAndSortedInternships.map((internship) => (
                <tr key={internship._id} className="hover:bg-gray-light">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-dark">{internship.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {internship.description.substring(0, 60)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary">
                      {internship.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {getTypeLabel(internship.internshipType)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {internship.positions?.filled || 0}/{internship.positions?.total || 0}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-primary h-1.5 rounded-full" 
                        style={{ 
                          width: `${((internship.positions?.filled || 0) / (internship.positions?.total || 1)) * 100}%` 
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-custom" />
                      <span className="font-medium text-dark">
                        ₹{internship.stipend?.amount || 0}
                      </span>
                      <span className="text-sm text-gray-500">/{internship.stipend?.paymentType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(internship.status)}`}>
                      {internship.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(internship.deadline).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.ceil((new Date(internship.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days left
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/internships/${internship._id}`)}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/dashboard/internships/${internship._id}/edit`)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedInternships.length === 0 && (
          <div className="p-12 text-center">
            <div className="h-12 w-12 text-gray-400 mx-auto mb-4">
              <TrendingUp className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-dark mb-2">No internships found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first internship"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Button component
const Button = ({ children, className = "", ...props }) => (
  <button
    className={`inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Internships;