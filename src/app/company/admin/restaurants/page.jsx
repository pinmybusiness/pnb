'use client';
import { useState, useEffect } from "react";
import KPICard from "@/components/KPICard";
import StatusBadge from "@/components/StatusBadge";
import { 
  Store, 
  MapPin, 
  Search, 
  Plus, 
  Calendar,
  TrendingUp,
  AlertCircle,
  Clock
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

const Restaurants = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const branchesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/branches`);
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

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (restaurant.location?.address || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRestaurantStats = (restaurantId) => {
    const restaurantBranches = branches.filter(b => b.restaurant === restaurantId || b.parentRestaurant === restaurantId);
    const totalRevenue = restaurantBranches.reduce((sum, b) => sum + (b.revenue || 0), 0);
    const avgRating = restaurantBranches.reduce((sum, b) => sum + (b.avgRating || 0), 0) / restaurantBranches.length || 0;
    const activeTrials = restaurantBranches.filter(b => b.trial?.isActive).length;
    
    return {
      totalRevenue,
      avgRating: avgRating ? avgRating.toFixed(1) : '0.0',
      activeTrials,
      branches: restaurantBranches
    };
  };

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
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
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
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Partners</h1>
          <p className="text-gray-500">Manage your restaurant network and partnerships</p>
        </div>
        <Link href='/company/admin/restaurants/add'>
          <button className="flex items-center bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-primary/90 transition">
            <Plus className="h-4 w-4 mr-2" />
            Add Restaurant
          </button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard 
          title="Total Partners" 
          value={restaurants.length} 
          icon={Store} 
        />
        <KPICard 
          title="Active Branches" 
          value={branches.filter(b => b.status?.current !== 'closed').length} 
          icon={MapPin} 
        />
        <KPICard 
          title="Total Revenue" 
          value={`$${(branches.reduce((sum, b) => sum + (b.revenue || 0), 0) / 1000).toFixed(0)}K`} 
          icon={TrendingUp} 
        />
        <KPICard 
          title="Active Trials" 
          value={branches.filter(b => b.trial?.isActive).length} 
          icon={Calendar} 
        />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Restaurant Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => {
          const stats = getRestaurantStats(restaurant._id);
          return (
            <div key={restaurant._id} className="bg-white rounded-lg p-6 shadow hover:shadow-md transition">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{restaurant.logo || '🍽️'}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                      <p className="text-sm text-gray-500">{restaurant.location?.address}</p>
                    </div>
                  </div>
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {stats.branches.length} branches
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      ${(stats.totalRevenue / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-gray-500">Total Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{stats.avgRating}</p>
                    <p className="text-xs text-gray-500">Avg Rating</p>
                  </div>
                </div>

                {/* Branch Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Branch Status</span>
                    {stats.activeTrials > 0 && (
                      <span className="inline-block border border-gray-300 text-gray-700 text-xs px-2 py-0.5 rounded">
                        {stats.activeTrials} active trial{stats.activeTrials > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stats.branches.map((branch) => (
                      <div key={branch._id} className="flex items-center gap-2">
                        <StatusBadge status={branch.status?.current || 'no_status'} />
                        <span className="text-xs text-gray-500 truncate max-w-[120px]">
                          {branch.name.split(' ').slice(-1)[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Link href={`/company/admin/restaurants/${restaurant._id}`} className="flex-1 border border-gray-300 px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition text-center">
                    View Details
                  </Link>
                  <Link href={`/company/admin/restaurants/${restaurant._id}/branches`} className="flex-1 bg-primary text-white px-3 py-1.5 text-sm rounded hover:bg-primary/90 transition text-center">
                    Manage Branches
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="bg-white rounded-lg p-12 text-center shadow">
          <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first restaurant partner"}
          </p>
          <Link href='/company/admin/restaurants/add'>
            <button className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition mx-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Restaurant
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Restaurants;