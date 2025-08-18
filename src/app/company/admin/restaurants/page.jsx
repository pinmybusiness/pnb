'use client';
import { useState, useEffect } from "react";
import { 
  Store, 
  MapPin, 
  Search, 
  Plus, 
  Calendar,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Star,
  Users
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import KPICard from "@/components/KPICard";
import { toast } from "react-hot-toast";
import Link from "next/link";
import RestaurantForm from "@/components/RestaurantForm";

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

const Restaurants = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showForm, setShowForm] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

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
      case "revenue":
        aValue = aStats.totalRevenue;
        bValue = bStats.totalRevenue;
        break;
      case "rating":
        aValue = parseFloat(aStats.avgRating);
        bValue = parseFloat(bStats.avgRating);
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
    if (restaurants.length === 0) return { totalRevenue: 0, avgRating: 0, totalBranches: 0 };
    
    const totalRevenue = restaurants.reduce((sum, r) => {
      const stats = getRestaurantStats(r._id);
      return sum + stats.totalRevenue;
    }, 0);
    
    const avgRating = restaurants.reduce((sum, r) => {
      const stats = getRestaurantStats(r._id);
      return sum + parseFloat(stats.avgRating);
    }, 0) / restaurants.length;
    
    const totalBranches = branches.length;
    
    return {
      totalRevenue,
      avgRating: avgRating.toFixed(1),
      totalBranches
    };
  };

  const kpiData = calculateKPIs();

  const handleDelete = async (restaurantId) => {
    if (!confirm("Are you sure you want to delete this restaurant?")) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/${restaurantId}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Failed to delete restaurant');
      
      setRestaurants(restaurants.filter(r => r._id !== restaurantId));
      toast.success("Restaurant deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
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
        <button 
          className="flex items-center bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-primary/90 transition"
        >
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
          title="Total Branches" 
          value={kpiData.totalBranches} 
          icon={MapPin} 
        />
        <KPICard 
          title="Total Revenue" 
          value={`$${(kpiData.totalRevenue / 1000).toFixed(0)}K`} 
          icon={DollarSign} 
        />
        <KPICard 
          title="Avg Rating" 
          value={kpiData.avgRating} 
          icon={Star} 
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

      {/* Restaurants Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Restaurant Name
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Location</TableHead>
              <TableHead onClick={() => handleSort("branches")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Branches
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              {/* <TableHead onClick={() => handleSort("revenue")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Revenue
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("rating")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Avg Rating
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead> */}
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRestaurants.map((restaurant) => {
              const stats = getRestaurantStats(restaurant._id);
              return (
                <TableRow key={restaurant._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{restaurant.logo || '🍽️'}</div>
                      <div>
                        <div className="font-medium">{restaurant.name}</div>
                        <div className="text-xs text-gray-500">
                          {restaurant.contact?.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate" title={restaurant.location?.address}>
                      {restaurant.location?.address || 'No address'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge>{stats.branches.length}</Badge>
                      {stats.activeTrials > 0 && (
                        <Badge variant="destructive">
                          {stats.activeTrials} trial{stats.activeTrials > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  {/* <TableCell>
                    ${(stats.totalRevenue / 1000).toFixed(0)}K
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {stats.avgRating}
                    </div>
                  </TableCell> */}
                  <TableCell>
                    <StatusBadge status={restaurant.status.current || 'active'} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link 
                        href={`/company/admin/restaurants/${restaurant._id}`}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {/* <button
                        onClick={() => {
                          setSelectedRestaurant(restaurant);
                          // setShowForm(true);
                        }}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button> */}
                      {/* <button
                        onClick={() => handleDelete(restaurant._id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-md"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button> */}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredRestaurants.length === 0 && (
          <div className="p-12 text-center">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first restaurant partner"}
            </p>
            <Link href='/company/admin/restaurants/add'
              className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition mx-auto"
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