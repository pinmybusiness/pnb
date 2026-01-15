'use client';
import { useState, useEffect } from "react";
import { MapPin, Search, Plus, DollarSign, Star, TrendingUp, ArrowUpDown, Eye, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import KPICard from "@/components/ui/KPICard";
import { toast } from "react-hot-toast";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui";
import { useSelector } from "react-redux";
import { useDebounce } from 'use-debounce';

const Branches = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pagination, setPagination] = useState({ current: 1, totalPages: 1, totalRecords: 0 });

  // Map frontend status values to backend numeric values
  const statusMap = {
    "": "", // All statuses
    no_status: 0,
    in_progress: 1,
    partnered: 2,
    closed: 3,
  };

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "no_status", label: "No Status" },
    { value: "in_progress", label: "In Progress" },
    { value: "partnered", label: "Partnered" },
    { value: "closed", label: "Closed" },
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = {
          page: pagination.current,
          limit: 10,
          sort: sortBy,
          order: sortOrder,
          status: statusMap[statusFilter] !== undefined ? statusMap[statusFilter] : undefined,
          search: debouncedSearchTerm || undefined,
        };

        const branchesRes = await apiClient.get('/api/branches', { params });

        setBranches(branchesRes.data.data);
        setPagination({
          current: branchesRes.data.pagination.current,
          totalPages: branchesRes.data.pagination.totalPages,
          totalRecords: branchesRes.data.pagination.totalRecords,
        });
      } catch (error) {
        toast.error("Failed to fetch branches");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortBy, sortOrder, statusFilter, debouncedSearchTerm, pagination.current]);

  const getRestaurantName = (branch) => {
    // Handle both parentRestaurant and parentRestaurantData (from aggregation)
    const restaurant = branch.parentRestaurant || branch.parentRestaurantData;
    return restaurant?.name || "Unknown";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0: return 'bg-gray-100 text-gray-800'; // No Status
      case 1: return 'bg-yellow-100 text-yellow-800'; // In Progress
      case 2: return 'bg-green-100 text-green-800'; // Partnered
      case 3: return 'bg-red-100 text-red-800'; // Closed
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const calculateKPIs = () => {
    if (branches.length === 0) return { totalRevenue: 0, avgFootfall: 0, avgRating: 0 };
    
    const totalRevenue = branches.reduce((sum, branch) => sum + (branch.revenue || 0), 0);
    const avgFootfall = branches.reduce((sum, branch) => sum + (branch.footfall || 0), 0) / branches.length;
    const avgRating = branches.reduce((sum, branch) => sum + (branch.rating || 0), 0) / branches.length;
    
    return {
      totalRevenue,
      avgFootfall: Math.round(avgFootfall),
      avgRating: avgRating.toFixed(1),
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
          <p className="text-gray-500">Monitor and manage all Organization branches</p>
        </div>
        <Link href='/dashboard/branches/add'>
          <Button className="rounded-lg">
            <Plus className="h-4 w-4 mr-2" />
            Add Branch
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Branches" value={pagination.totalRecords} icon={MapPin} />
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
              placeholder="Search branches by name, address, or Organization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination((prev) => ({ ...prev, current: 1 }));
            }}
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
              <TableHead onClick={() => handleSort("Organization")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Organization
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Branch Name
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Location</TableHead>
              <TableHead onClick={() => handleSort("createdAt")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Created At
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Status
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch._id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {getRestaurantName(branch)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{branch.name || 'Unnamed Branch'}</div>
                    <div className="text-sm text-gray-500">
                      {branch.teamsCount || 0} team members
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate" title={branch.location?.address}>
                    {branch.location && branch.location?.city
                      ? `${branch.location?.city?.name}, ${branch.location?.city?.state?.name}`
                      : 'No address'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate" title={branch.createdAt}>
                    {branch.createdAt ? new Date(branch.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <StatusBadge
                      status={branch.statusText}
                      className={`${getStatusColor(branch.status)} text-xs px-2.5 py-0.5`}
                    />
                    {branch.statusReasonText && (
                      <div className="text-xs text-gray-500 max-w-[150px] truncate" title={branch.statusReasonText}>
                        {branch.statusReasonText}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/branches/${branch._id}`)}
                      className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/branches/${branch._id}/edit`)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {branches.length === 0 && (
          <div className="p-12 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first branch"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {branches.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4 p-4">
            <p className="text-sm text-gray-500">
              Showing {branches.length} of {pagination.totalRecords} branches
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPagination((prev) => ({ ...prev, current: prev.current - 1 }))}
                disabled={pagination.current === 1}
                className="px-3 py-1"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600">
                Page {pagination.current} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPagination((prev) => ({ ...prev, current: prev.current + 1 }))}
                disabled={pagination.current === pagination.totalPages}
                className="px-3 py-1"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Branches;