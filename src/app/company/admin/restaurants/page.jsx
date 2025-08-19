'use client';
import { useState, useEffect } from "react";
import { 
  Store, 
  MapPin, 
  Search, 
  Plus, 
  DollarSign,
  Star,
  ArrowUpDown,
  Eye,
  ChevronDown
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import StatusBadge from "@/components/StatusBadge";
import KPICard from "@/components/KPICard";

const Restaurants = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch restaurants and branches data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch restaurants
        const restaurantsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants`);
        if (!restaurantsRes.ok) throw new Error('Failed to fetch restaurants');
        const restaurantsData = await restaurantsRes.json();
        setRestaurants(restaurantsData.data || []);
        
        // Fetch branches
        const branchesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/branches`);
        if (!branchesRes.ok) throw new Error('Failed to fetch branches');
        const branchesData = await branchesRes.json();
        setBranches(branchesData.data || []);
        
      } catch (err) {
        setError(err.message);
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRestaurantStats = (restaurantId) => {
    const restaurantBranches = branches.filter(b => b.parentRestaurant === restaurantId);
    const activeTrials = restaurantBranches.filter(b => b.trial?.isActive).length;
    
    return {
      branches: restaurantBranches,
      activeTrials
    };
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    const aStats = getRestaurantStats(a._id);
    const bStats = getRestaurantStats(b._id);
    
    let aValue, bValue;
    switch (sortBy) {
      case "name":
        aValue = a.name || '';
        bValue = b.name || '';
        break;
      case "branches":
        aValue = aStats.branches.length;
        bValue = bStats.branches.length;
        break;
      default:
        return 0;
    }

    if (typeof aValue === "string") {
      return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  const filteredRestaurants = sortedRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (restaurant.location?.address || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateKPIs = () => {
    return {
      totalRestaurants: restaurants.length,
      totalBranches: branches.length,
      activeTrials: branches.filter(b => b.trial?.isActive).length
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

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 text-center shadow">
        <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-500 text-2xl">!</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading data</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition mx-auto"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-gray-500">Manage your restaurant partners</p>
        </div>
        <Link href='/company/admin/restaurants/add'>
          <button className="flex items-center bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-primary/90 transition">
            <Plus className="h-4 w-4 mr-2" />
            Add Restaurant
          </button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard 
          title="Total Restaurants" 
          value={kpiData.totalRestaurants} 
          icon={Store}
        />
        <KPICard 
          title="Total Branches" 
          value={kpiData.totalBranches} 
          icon={MapPin}
        />
        <KPICard 
          title="Active Trials" 
          value={kpiData.activeTrials} 
          icon={DollarSign}
        />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>

      {/* Restaurants Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Restaurant
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("branches")}
                >
                  <div className="flex items-center">
                    Branches
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRestaurants.map((restaurant) => {
                const stats = getRestaurantStats(restaurant._id);
                return (
                  <tr key={restaurant._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
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
                          <div className="text-sm text-gray-500 truncate max-w-[200px]">
                            {restaurant.description || 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{restaurant.location?.city || 'N/A'}</div>
                      <div className="text-sm text-gray-500 truncate max-w-[200px]">
                        {restaurant.location?.address || 'No address'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {stats.branches.length} branch{stats.branches.length !== 1 ? 'es' : ''}
                        </span>
                        {stats.activeTrials > 0 && (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            {stats.activeTrials} trial{stats.activeTrials !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={restaurant.status?.current || 'no_status'} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/company/admin/restaurants/${restaurant._id}`}
                        className="text-primary hover:text-primary/80 mr-4"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="p-12 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Store className="h-5 w-5 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first restaurant"}
            </p>
            <Link href='/company/admin/restaurants/add'
              className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Restaurant
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;