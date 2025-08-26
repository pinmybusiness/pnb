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
  X,
  Briefcase,
  BookOpen
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import KPICard from "@/components/ui/KPICard";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { formatDateWithSuffix } from "@/utils/dateFormat";

const Opportunities = () => {
  const router = useRouter();
  const { user, token } = useSelector((state) => state.auth);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [opportunityTypeFilter, setOpportunityTypeFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch opportunities for the user's branch
  useEffect(() => {
    const fetchOpportunities = async () => {
      if (!token || !user) return;

      try {
        setLoading(true);
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/opportunities`;
        
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
          setOpportunities(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch opportunities");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [token, user]);

  const categories = [
    'Kitchen Helper', 'Service Staff', 'Management Trainee', 'Marketing Assistant', 
    'Events Coordinator', 'Delivery Helper', 'Other'
  ];

  const opportunityTypes = [
    'internship', 'job'
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

  const filteredAndSortedOpportunities = opportunities
    .filter(opportunity => {
      const matchesSearch =
        opportunity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || opportunity.status?.toLowerCase() === statusFilter.toLowerCase();

      const matchesCategory =
        categoryFilter === "all" || opportunity.category === categoryFilter;

      const matchesOpportunityType =
        opportunityTypeFilter === "all" || opportunity.opportunityType === opportunityTypeFilter;

      const matchesType =
        typeFilter === "all" || opportunity.internshipType === typeFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesOpportunityType && matchesType;
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
        case "numberOfPeople":
          aValue = a.numberOfPeople || 0;
          bValue = b.numberOfPeople || 0;
          break;
        case "stipend":
          aValue = a.stipend?.totalAmount || 0;
          bValue = b.stipend?.totalAmount || 0;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "startDate":
          aValue = new Date(a.schedule?.startDate);
          bValue = new Date(b.schedule?.startDate);
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
    if (opportunities.length === 0) return { 
      total: 0, 
      active: 0, 
      totalPositions: 0, 
      filledPositions: 0,
      avgStipend: 0 
    };
    
    const active = opportunities.filter(i => i.status === 'approved').length;
    const totalPositions = opportunities.reduce((sum, i) => sum + (i.numberOfPeople || 0), 0);
    const filledPositions = opportunities.reduce((sum, i) => sum + (i.filledPositions || 0), 0);
    const avgStipend = opportunities.reduce((sum, i) => sum + (i.stipend?.totalAmount || 0), 0) / opportunities.length;
    
    return {
      total: opportunities.length,
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

  const getOpportunityTypeIcon = (type) => {
    return type === 'job' ? Briefcase : BookOpen;
  };

  const getStipendText = (stipend) => {
    if (!stipend || !stipend.totalAmount) return 'Unpaid';
    
    const paymentTypeMap = {
      'daily': 'day',
      'weekly': 'week',
      'monthly': 'month',
      'after_completion': 'completion'
    };
    
    const period = paymentTypeMap[stipend.paymentType] || 'month';
    return `${stipend.currency || '₹'}${stipend.totalAmount.toLocaleString()}/${period}`;
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
          <h1 className="text-2xl font-bold text-dark">Opportunity Management</h1>
          <p className="text-gray-500">Manage opportunities for your branch</p>
        </div>
       {[6, 7].includes(user?.role) && (
          <Link href="/dashboard/opportunities/add">
            <Button className="rounded-lg bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Opportunity
            </Button>
          </Link>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <KPICard 
          title="Total Opportunities" 
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
              placeholder="Search opportunities..."
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 p-4 bg-gray-light rounded-md">
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
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">Opportunity Type</label>
              <select
                value={opportunityTypeFilter}
                onChange={(e) => setOpportunityTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Types</option>
                {opportunityTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">Work Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-soft rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Work Types</option>
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

      {/* Opportunities Table */}
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
                  onClick={() => handleSort("numberOfPeople")} 
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
                    Stipend/Salary
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
                  onClick={() => handleSort("startDate")} 
                  className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Start Date
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-soft">
              {filteredAndSortedOpportunities.map((opportunity) => {
                const OpportunityTypeIcon = getOpportunityTypeIcon(opportunity.opportunityType);
                return (
                  <tr key={opportunity._id} className="hover:bg-gray-light">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-dark">{opportunity.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {opportunity.description?.substring(0, 60)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-light text-primary">
                        {opportunity.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <OpportunityTypeIcon className="h-4 w-4" />
                        <span className="capitalize">{opportunity.opportunityType}</span>
                        {opportunity.opportunityType === 'internship' && (
                          <>
                            <span>•</span>
                            <span>{getTypeLabel(opportunity.internshipType)}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {opportunity.filledPositions || 0}/{opportunity.numberOfPeople || 0}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-primary h-1.5 rounded-full" 
                          style={{ 
                            width: `${((opportunity.filledPositions || 0) / (opportunity.numberOfPeople || 1)) * 100}%` 
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-custom" />
                        <span className="font-medium text-dark">
                          ₹{opportunity.stipend?.totalAmount || 0}
                        </span>
                        <span className="text-sm text-gray-500">/{opportunity.stipend?.paymentType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(opportunity.status)}`}>
                        {opportunity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {opportunity.schedule?.startDate ? formatDateWithSuffix(opportunity.schedule.startDate) : 'Not set'}
                      </div>
                      {opportunity.schedule?.startDate && (
                        <div className="text-xs text-gray-500">
                          {Math.ceil((new Date(opportunity.schedule.startDate) - new Date()) / (1000 * 60 * 60 * 24))} days to start
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/dashboard/opportunities/${opportunity._id}`)}
                          className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/dashboard/opportunities/${opportunity._id}/edit`)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAndSortedOpportunities.length === 0 && (
          <div className="p-12 text-center">
            <div className="h-12 w-12 text-gray-400 mx-auto mb-4">
              <TrendingUp className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-dark mb-2">No opportunities found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all" || opportunityTypeFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first opportunity"}
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

export default Opportunities;