'use client';
import { useState, useEffect } from "react";
import { MapPin, Search, Plus, DollarSign, Star, TrendingUp, ArrowUpDown, Eye, Edit, Trash2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import KPICard from "@/components/KPICard";
import { toast } from "react-hot-toast";
import axios from "axios";
import BranchForm from "@/components/BranchForm";
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

const Input = ({ className = "", ...props }) => (
  <input
    className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
    {...props}
  />
);

const Badge = ({ children, variant = "secondary", className = "" }) => {
  const variantClasses = {
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800",
    outline: "border border-gray-300 text-gray-800",
  };
  return (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-md ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Table = ({ children }) => <table className="min-w-full">{children}</table>;
const TableHeader = ({ children }) => <thead className="bg-gray-50">{children}</thead>;
const TableBody = ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>;
const TableRow = ({ children, className = "" }) => <tr className={className}>{children}</tr>;
const TableHead = ({ children, className = "", ...props }) => (
  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`} {...props}>
    {children}
  </th>
);
const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${className}`}>{children}</td>
);

const Branches = () => {
  const router = useRouter();
  const [branches, setBranches] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showForm, setShowForm] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);

  // Fetch data from API
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const branchesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/branches`);
      
      // Safely process branches data
      const processedBranches = branchesRes.data.data.map(branch => {
        return {
          ...branch,
          status: typeof branch.status === 'string' 
            ? { current: branch.status, reason: '' }
            : branch.status
        };
      });
      
      setBranches(processedBranches);
    } catch (error) {
      toast.error("Failed to fetch branches");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(r => r._id === restaurantId);
    return restaurant ? restaurant.name : "Unknown";
  };

  const handleDeleteBranch = async (branchId) => {
    if (!confirm("Are you sure you want to delete this branch?")) return;
    
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${branchId}`);
      setBranches(branches.filter(branch => branch._id !== branchId));
      toast.success("Branch deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete branch");
    }
  };

  const handleUpdateStatus = async (branchId, status) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${branchId}/status`, {
        status,
        reason: "Updated via admin panel"
      });
      
      setBranches(branches.map(branch => 
        branch._id === branchId 
          ? { ...branch, status: { current: status, reason: "Updated via admin panel" } } 
          : branch
      ));
      
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/branches`);
      setBranches(res.data.data);
    } catch (error) {
      toast.error("Failed to refresh branches");
    }
  };

  const filteredAndSortedBranches = branches
    .filter(branch => {
      const matchesSearch =
        branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.location?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getRestaurantName(branch.parentRestaurant)?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || branch.status?.current?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "name":
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case "restaurant":
          aValue = getRestaurantName(a.parentRestaurant) || '';
          bValue = getRestaurantName(b.parentRestaurant) || '';
          break;
        case "status":
          aValue = a.status?.current || '';
          bValue = b.status?.current || '';
          break;
        case "revenue":
          aValue = a.revenue || 0;
          bValue = b.revenue || 0;
          break;
        case "footfall":
          aValue = a.footfall || 0;
          bValue = b.footfall || 0;
          break;
        case "rating":
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        default:
          return 0;
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

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "partnered", label: "Partnered" },
    { value: "in_progress", label: "In Progress" },
    { value: "closed", label: "Closed" },
  ];

  const calculateKPIs = () => {
    if (branches.length === 0) return { totalRevenue: 0, avgFootfall: 0, avgRating: 0 };
    
    const totalRevenue = branches.reduce((sum, branch) => sum + (branch.revenue || 0), 0);
    const avgFootfall = branches.reduce((sum, branch) => sum + (branch.footfall || 0), 0) / branches.length;
    const avgRating = branches.reduce((sum, branch) => sum + (branch.rating || 0), 0) / branches.length;
    
    return {
      totalRevenue,
      avgFootfall: Math.round(avgFootfall),
      avgRating: avgRating.toFixed(1)
    };
  };

  const kpiData = calculateKPIs();

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
          <h1 className="text-2xl font-bold text-gray-900">Branch Management</h1>
          <p className="text-gray-500">Monitor and manage all restaurant branches</p>
        </div>
        <Link href='/company/admin/branches/add'>
        <Button 
          className="rounded-lg" 
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Branch
        </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Branches" value={branches.length} icon={MapPin} />
        <KPICard 
          title="Avg Revenue" 
          value={branches.length > 0 ? `$${(kpiData.totalRevenue / branches.length / 1000).toFixed(0)}K` : '$0K'} 
          icon={DollarSign} 
        />
        <KPICard 
          title="Avg Footfall" 
          value={branches.length > 0 ? kpiData.avgFootfall.toLocaleString() : '0'} 
          icon={TrendingUp} 
        />
        <KPICard 
          title="Avg Rating" 
          value={branches.length > 0 ? kpiData.avgRating : '0.0'} 
          icon={Star} 
        />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search branches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Branches Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Branch Name
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("restaurant")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Restaurant
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Location</TableHead>
              <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Status
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Trial Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedBranches.map((branch) => (
              <TableRow key={branch._id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <div className="font-medium">{branch.name || 'Unnamed Branch'}</div>
                    <div className="text-sm text-gray-500">
                      {branch.teamCount || 0} team members
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {getRestaurantName(branch.parentRestaurant)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate" title={branch.location?.address}>
                    {branch.location?.address || 'No address'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <StatusBadge status={branch.status?.current} />
                    {branch.status?.reason && (
                      <div className="text-xs text-gray-500 max-w-[150px] truncate" title={branch.status.reason}>
                        {branch.status.reason}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {branch.trial?.isActive ? (
                    <Badge variant={branch.trial.daysLeft <= 7 ? "destructive" : "secondary"}>
                      {Math.max(0, Math.ceil((new Date(branch.trial.endDate) - new Date()) / (1000 * 60 * 60 * 24)))} days left
                    </Badge>
                  ) : (
                    <Badge variant="outline">No trial</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/company/admin/branches/${branch._id}`)}
                      className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {/* <button
                      onClick={() => {
                        setSelectedBranch(branch);
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredAndSortedBranches.length === 0 && (
          <div className="p-12 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first branch"}
            </p>
          </div>
        )}
      </Card>     
    </div>
  );
};

export default Branches;