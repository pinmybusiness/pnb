'use client';
import { useState, useEffect } from "react";
import { Store, Search, Plus, DollarSign, Star, TrendingUp, ArrowUpDown, Eye, Edit, Trash2 } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import KPICard from "@/components/ui/KPICard";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, Button, Input, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui";

const Restaurants = () => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const restaurantsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`);
        const branchesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/branches`);
        
        setRestaurants(restaurantsRes.data.data || []);
        setBranches(branchesRes.data.data || []);
      } catch (error) {
        toast.error("Failed to fetch data");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getRestaurantStats = (restaurantId) => {
    const restaurantBranches = branches.filter(branch => 
      branch.parentRestaurant?._id === restaurantId || branch.parentRestaurant === restaurantId
    );
    
    const activeTrials = restaurantBranches.filter(branch => branch.trial?.isActive).length;
    
    return {
      branches: restaurantBranches.length,
      activeTrials
    };
  };

  const handleUpdateStatus = async (restaurantId, status) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurantId}/status`, {
        status,
        reason: "Updated via admin panel"
      });
      
      setRestaurants(restaurants.map(restaurant => 
        restaurant._id === restaurantId 
          ? { ...restaurant, status: { current: status, reason: "Updated via admin panel" } } 
          : restaurant
      ));
      
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const filteredAndSortedRestaurants = restaurants
    .filter(restaurant => {
      const matchesSearch =
        restaurant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.contact?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.contact?.phone?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || restaurant.status?.current?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "name":
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case "branches":
          aValue = getRestaurantStats(a._id).branches;
          bValue = getRestaurantStats(b._id).branches;
          break;
        case "status":
          aValue = a.status?.current || '';
          bValue = b.status?.current || '';
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
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const calculateKPIs = () => {
    if (restaurants.length === 0) return { totalRestaurants: 0, totalBranches: 0, activeTrials: 0 };
    
    const totalRestaurants = restaurants.length;
    const totalBranches = branches.length;
    const activeTrials = branches.filter(branch => branch.trial?.isActive).length;
    
    return {
      totalRestaurants,
      totalBranches,
      activeTrials
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
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Management</h1>
          <p className="text-gray-500">Monitor and manage all restaurants</p>
        </div>
        <Link href='/dashboard/restaurants/add'>
          <Button className="rounded-lg">
            <Plus className="h-4 w-4 mr-2" />
            Add Restaurant
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total Restaurants" value={kpiData.totalRestaurants} icon={Store} />
        <KPICard title="Total Branches" value={kpiData.totalBranches} icon={TrendingUp} />
        <KPICard title="Active Trials" value={kpiData.activeTrials} icon={DollarSign} />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search restaurants..."
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

      {/* Restaurants Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Restaurant Name
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead onClick={() => handleSort("branches")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Branches
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
            {filteredAndSortedRestaurants.map((restaurant) => {
              const stats = getRestaurantStats(restaurant._id);
              return (
                <TableRow key={restaurant._id} className="hover:bg-gray-50">
                  <TableCell>
                     <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                          {restaurant.logo ? (
                            <Image
                              src={restaurant.logo}
                              alt={restaurant.name}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <Store className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>

                        </div>
                      </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm text-gray-900">{restaurant.contact?.phone || 'No phone'}</div>
                      <div className="text-sm text-gray-500 truncate max-w-[200px]">
                        {restaurant.contact?.email || 'No email'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{stats.branches} branch{stats.branches !== 1 ? 'es' : ''}</div>
                      {stats.activeTrials > 0 && (
                        <Badge variant="secondary">
                          {stats.activeTrials} active trial{stats.activeTrials !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <StatusBadge status={restaurant.status?.current || (restaurant.isActive ? 'active' : 'inactive')} />
                      {restaurant.status?.reason && (
                        <div className="text-xs text-gray-500 max-w-[150px] truncate" title={restaurant.status.reason}>
                          {restaurant.status.reason}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {/* <button
                        onClick={() => router.push(`/dashboard/restaurants/${restaurant._id}`)}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button> */}
                      <button
                        onClick={() => router.push(`/dashboard/restaurants/${restaurant._id}`)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredAndSortedRestaurants.length === 0 && (
          <div className="p-12 text-center">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first restaurant"}
            </p>
          </div>
        )}
      </Card>     
    </div>
  );
};

export default Restaurants;