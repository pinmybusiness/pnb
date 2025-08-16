'use client';
import { useState } from "react";
import { MapPin, Search, Plus, DollarSign, Star, TrendingUp, ArrowUpDown } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import KPICard from "@/components/KPICard";
import { branches, restaurants, kpiData } from "@/data/mockData";

// Simple Card wrapper with Tailwind
const Card = ({ className = "", children }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

// Simple Button wrapper
const Button = ({ children, className = "", ...props }) => (
  <button
    className={`inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Simple Input wrapper
const Input = ({ className = "", ...props }) => (
  <input
    className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
    {...props}
  />
);

// Simple Badge wrapper
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

// Table structure
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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : "Unknown";
  };

  const filteredAndSortedBranches = branches
    .filter(branch => {
      const matchesSearch =
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getRestaurantName(branch.restaurantId).toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || branch.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "restaurant":
          aValue = getRestaurantName(a.restaurantId);
          bValue = getRestaurantName(b.restaurantId);
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "revenue":
          aValue = a.revenue;
          bValue = b.revenue;
          break;
        case "footfall":
          aValue = a.footfall;
          bValue = b.footfall;
          break;
        case "rating":
          aValue = a.reviews;
          bValue = b.reviews;
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
    { value: "in progress", label: "In Progress" },
    { value: "closed", label: "Closed" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branch Management</h1>
          <p className="text-gray-500">Monitor and manage all restaurant branches</p>
        </div>
        <Button className="rounded-lg">
          <Plus className="h-4 w-4 mr-2" />
          Add Branch
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Branches" value={branches.length} icon={MapPin} />
        <KPICard title="Avg Revenue" value={`$${(kpiData.totalRevenue / branches.length / 1000).toFixed(0)}K`} icon={DollarSign} />
        <KPICard title="Avg Footfall" value={kpiData.avgFootfall.toLocaleString()} icon={TrendingUp} />
        <KPICard title="Avg Rating" value={kpiData.avgRating} icon={Star} />
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
              <TableHead onClick={() => handleSort("footfall")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Footfall
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("revenue")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Revenue
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("rating")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Rating
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Trial Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedBranches.map((branch) => (
              <TableRow key={branch.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <div className="font-medium">{branch.name}</div>
                    <div className="text-sm text-gray-500">{branch.teamCount} team members</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{restaurants.find(r => r.id === branch.restaurantId)?.logo}</span>
                    <span className="font-medium">{getRestaurantName(branch.restaurantId)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[200px] truncate" title={branch.location}>
                    {branch.location}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <StatusBadge status={branch.status} />
                    {branch.reason && (
                      <div className="text-xs text-gray-500 max-w-[150px] truncate" title={branch.reason}>
                        {branch.reason}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{branch.footfall.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">visitors</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">${(branch.revenue / 1000).toFixed(0)}K</div>
                  <div className="text-sm text-gray-500">monthly</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{branch.reviews}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {branch.trialDaysLeft > 0 ? (
                    <Badge variant={branch.trialDaysLeft <= 7 ? "destructive" : "secondary"}>
                      {branch.trialDaysLeft} days left
                    </Badge>
                  ) : (
                    <Badge variant="outline">Trial ended</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 rounded-lg px-3 py-1">
                      View
                    </Button>
                    <Button className="bg-transparent text-primary hover:bg-primary/10 rounded-lg px-3 py-1">
                      Edit
                    </Button>
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
