'use client';
import { useState, useEffect, useMemo, useCallback } from "react";
import { MapPin, Search, Plus, ArrowUpDown, Eye, Edit, Trash2, X, Filter } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { toast } from "react-hot-toast";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui";
import Pagination from "@/components/ui/Pagination";
import { formatDateWithSuffix } from "@/utils/dateFormat";
import { STATUS_OPTIONS } from "@/constants/branchStatus";

// Filter Bar Component - Exactly like CallRecordings
const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  const statusOptions = [
    { value: "", label: "All Status" },
    ...STATUS_OPTIONS
  ];

  const hasActiveFilters = filters.search !== '' || filters.status !== '';

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search branches by organization..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-10 pr-10 text-sm"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange('search', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="relative min-w-[150px]">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={filters.status}
              onChange={(e) => {
                const val = e.target.value;
                onFilterChange('status', val === "" ? "" : parseInt(val));
              }}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-600 hover:text-gray-900"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

// Status Badge Component
const BranchStatusBadge = ({ status, statusReasonText }) => {
  const statusObj = STATUS_OPTIONS.find(s => s.value === status);

  const getColor = (status) => {
    switch (status) {
      case 1: return "bg-yellow-100 text-yellow-800 border-yellow-200"; // Trial
      case 2: return "bg-blue-100 text-blue-800 border-blue-200"; // Onboarding
      case 3: return "bg-green-100 text-green-800 border-green-200"; // Active
      case 4: return "bg-red-100 text-red-800 border-red-200"; // Closed
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-1">
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getColor(status)}`}>
        {statusObj?.label || "Unknown"}
      </span>

      {statusReasonText && (
        <div className="text-xs text-gray-500 max-w-[150px] truncate" title={statusReasonText}>
          {statusReasonText}
        </div>
      )}
    </div>
  );
};

// Branch Card Component for Mobile
const BranchCard = ({ branch, getRestaurantName, onView, onEdit }) => {
  return (
    <Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{branch.name || 'Unnamed Branch'}</p>
              <p className="text-xs text-gray-500">{getRestaurantName(branch)}</p>
            </div>
          </div>
          <BranchStatusBadge status={branch.status} statusReasonText={branch.statusReasonText} />
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-medium">Contact:</span>
            <span>{branch.helplineNumber || '-'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-medium">Created:</span>
            <span>{branch.createdAt ? formatDateWithSuffix(branch.createdAt) : 'Unknown'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-600 hover:text-primary"
            onClick={() => onView(branch._id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-blue-600 hover:text-blue-700"
            onClick={() => onEdit(branch._id)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Main Component
const Branches = () => {
  const router = useRouter();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', order: 'desc' });
  
  // Pagination State - Exactly like CallRecordings
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasMore: false
  });

  // Debounce timer
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Handle Filter Changes
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      status: ''
    });
    setDebouncedSearch('');
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Debounced Search
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 1000);
    
    setDebounceTimer(timer);
    
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Get Restaurant Name
  const getRestaurantName = useCallback((branch) => {
    const restaurant = branch.parentRestaurant || branch.parentRestaurantData;
    return restaurant?.name || "Unknown";
  }, []);

  // Fetch Branches
  const fetchBranches = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      
      const params = {
        page: pageNum,
        limit: pagination.limit,
        sort: sortConfig.key,
        order: sortConfig.order,
        status: filters.status || undefined,
        search: debouncedSearch || undefined,
      };

      const response = await apiClient.get('/api/branches', { params });
      
      const { data, pagination: responsePagination } = response.data;

      setBranches(data);
      setPagination({
        page: responsePagination.current,
        limit: pagination.limit,
        total: responsePagination.totalRecords,
        pages: responsePagination.totalPages,
        hasMore: responsePagination.current < responsePagination.totalPages
      });

    } catch (error) {
      toast.error("Failed to fetch branches");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [sortConfig, filters.status, debouncedSearch, pagination.limit]);

  // Handle Page Change
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > pagination.pages || loading) return;
    fetchBranches(newPage);
  }, [pagination.pages, loading, fetchBranches]);

  // Handle Sort
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
    }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on sort change
  }, []);

  // Initial Fetch and Filter/Sort Changes
  useEffect(() => {
    fetchBranches(1);
  }, [sortConfig, filters.status, debouncedSearch]);

  // Sort Branches (Client-side sorting for UI consistency)
  const sortedBranches = useMemo(() => {
    if (!branches.length) return [];
    
    return [...branches].sort((a, b) => {
      let aVal, bVal;
      
      switch (sortConfig.key) {
        case 'name':
          aVal = a.name || '';
          bVal = b.name || '';
          break;
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          aVal = a[sortConfig.key];
          bVal = b[sortConfig.key];
      }
      
      if (aVal < bVal) return sortConfig.order === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [branches, sortConfig]);

  const handleView = useCallback((id) => {
    router.push(`/dashboard/branches/${id}`);
  }, [router]);

  const handleEdit = useCallback((id) => {
    router.push(`/dashboard/branches/${id}/edit`);
  }, [router]);

  return (
    <div className="space-y-4 animate-fade-in p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Branch Management</h1>
          <p className="text-sm text-gray-500">Monitor and manage all organization branches</p>
        </div>
        
        <Link href='/dashboard/branches/add'>
          <Button className="rounded-lg">
            <Plus className="h-4 w-4 mr-2" />
            Add Branch
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <FilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Branches Table/Grid */}
      <Card className="overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    Organization (Branch)
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Contact</TableHead>
                <TableHead onClick={() => handleSort('createdAt')} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    Created At
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                  </TableCell>
                </TableRow>
              )}
              {!loading && sortedBranches.map((branch) => (
                <TableRow key={branch._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      <span title={getRestaurantName(branch)}>
                        {getRestaurantName(branch).length > 18
                          ? getRestaurantName(branch).slice(0, 18) + '...'
                          : getRestaurantName(branch)}
                      </span>
                      <span className="text-gray-500"> ({branch.name || 'Unnamed'})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-900">{branch.helplineNumber || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-900">
                      {branch.createdAt ? formatDateWithSuffix(branch.createdAt) : 'Unknown'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <BranchStatusBadge status={branch.status} statusReasonText={branch.statusReasonText} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(branch._id)}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md transition-colors"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(branch._id)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
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
        </div>

        {/* Mobile Grid View */}
        <div className="md:hidden space-y-3 p-3">
          {loading && (
            <div className="py-16 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          {!loading && sortedBranches.map((branch) => (
            <BranchCard 
              key={branch._id} 
              branch={branch}
              getRestaurantName={getRestaurantName}
              onView={handleView}
              onEdit={handleEdit}
            />
          ))}
        </div>

        {/* No Data State */}
        {!loading && sortedBranches.length === 0 && (
          <div className="p-12 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              {filters.search || filters.status
                ? "Try adjusting your search or filter criteria to see more results"
                : "Get started by adding your first branch"}
            </p>
          </div>
        )}
      </Card>

      {/* Pagination - Using common Pagination component */}
      {sortedBranches.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={loading}
          itemsLabel="branches"
          showItemsCount={true}
          showPageInfo={true}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default Branches;