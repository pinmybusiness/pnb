"use client";

import { useState, useMemo } from "react";
import { 
  Users, 
  Search, 
  UserPlus, 
  ArrowUpDown, 
  Pen, 
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

// ─── Orange color constant ─────────────────────────────────────────────
const ORANGE = "#ff5a1f";
const ORANGE_LIGHT = "#fff1e6";

// ─── Card Component ───────────────────────────────────────────────
const Card = ({ className = "", children }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

// ─── Button Component ─────────────────────────────────────────────
const Button = ({ children, variant = "primary", size = "default", onClick, className = "", disabled = false, ...props }) => {
  const variants = {
    primary: "bg-orange-600 text-white hover:bg-orange-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
  };
  
  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base",
  };
  
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// ─── Input Component ──────────────────────────────────────────────
const Input = ({ className = "", icon, ...props }) => (
  <div className="relative">
    {icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
    )}
    <input
      className={`border border-gray-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 ${icon ? 'pl-10' : ''} ${className}`}
      {...props}
    />
  </div>
);

// ─── Table Components ─────────────────────────────────────────────
const Table = ({ children }) => <table className="w-full">{children}</table>;
const TableHeader = ({ children }) => <thead className="bg-gray-50 border-y border-gray-200">{children}</thead>;
const TableBody = ({ children }) => <tbody className="divide-y divide-gray-100">{children}</tbody>;
const TableRow = ({ children, className = "" }) => <tr className={`hover:bg-gray-50 transition-colors ${className}`}>{children}</tr>;
const TableHead = ({ children, sortable = true, onClick, className = "" }) => (
  <th
    scope="col"
    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${sortable ? 'cursor-pointer hover:text-gray-700' : ''} ${className}`}
    onClick={onClick}
  >
    {children}
  </th>
);
const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${className}`}>{children}</td>
);

// ─── Badge Component ──────────────────────────────────────────────
const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    info: "bg-blue-100 text-blue-800",
    purple: "bg-purple-100 text-purple-800",
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ─── KPICard Component ────────────────────────────────────────────
const KPICard = ({ title, value, icon: Icon }) => (
  <Card className="p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
        <Icon size={24} color={ORANGE} />
      </div>
    </div>
  </Card>
);

// ─── Pagination Component ─────────────────────────────────────────
const Pagination = ({ pagination, onPageChange, loading }) => {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
        <span className="font-medium">
          {Math.min(pagination.page * pagination.limit, pagination.total)}
        </span>{" "}
        of <span className="font-medium">{pagination.total}</span> team members
      </p>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1 || loading}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        {[...Array(Math.min(3, pagination.pages))].map((_, i) => {
          let pageNum;
          if (pagination.pages <= 3) {
            pageNum = i + 1;
          } else if (pagination.page === 1) {
            pageNum = i + 1;
          } else if (pagination.page === pagination.pages) {
            pageNum = pagination.pages - 2 + i;
          } else {
            pageNum = pagination.page - 1 + i;
          }
          
          return (
            <Button
              key={pageNum}
              variant={pagination.page === pageNum ? "primary" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              disabled={loading}
            >
              {pageNum}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.pages || loading}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

// ─── Role Filter Component ────────────────────────────────────────
const RoleFilter = ({ selectedRole, onRoleChange }) => {
  const branchRoles = [
    { value: "all", label: "All Roles" },
    { value: "6", label: "Admin" },
    { value: "7", label: "Manager" },
    { value: "8", label: "Team" },
  ];

  return (
    <select
      value={selectedRole}
      onChange={(e) => onRoleChange(e.target.value)}
      className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 min-w-[160px]"
    >
      {branchRoles.map((role) => (
        <option key={role.value} value={role.value}>
          {role.label}
        </option>
      ))}
    </select>
  );
};

// ─── Branch Team Demo Data ────────────────────────────────────────
const BRANCH_TEAM_DATA = [
  {
    _id: "1",
    name: "Rajesh Kumar",
    mobile: "+91 98765 43210",
    email: "rajesh.k@fasterq.in",
    role: "8", // Branch Team
    roleLabel: "Team Member",
    branch: "Mumbai - Andheri",
    manager: {
      name: "Amit Sharma",
      mobile: "+91 99887 66554"
    },
    joinDate: "2025-12-15",
    status: "active",
    avatar: "RK"
  },
  {
    _id: "2",
    name: "Priya Singh",
    mobile: "+91 87654 32109",
    email: "priya.s@fasterq.in",
    role: "8", // Branch Team
    roleLabel: "Team Member",
    branch: "Mumbai - Andheri",
    manager: {
      name: "Amit Sharma",
      mobile: "+91 99887 66554"
    },
    joinDate: "2026-01-20",
    status: "active",
    avatar: "PS"
  },
  {
    _id: "3",
    name: "Amit Sharma",
    mobile: "+91 99887 66554",
    email: "amit.s@fasterq.in",
    role: "7", // Branch Manager
    roleLabel: "Team Manager",
    branch: "Mumbai - Andheri",
    manager: null,
    joinDate: "2025-10-05",
    status: "active",
    avatar: "AS"
  },
  {
    _id: "4",
    name: "Sneha Patel",
    mobile: "+91 76543 21098",
    email: "sneha.p@fasterq.in",
    role: "8", // Branch Team
    roleLabel: "Team Member",
    branch: "Mumbai - Andheri",
    manager: {
      name: "Amit Sharma",
      mobile: "+91 99887 66554"
    },
    joinDate: "2026-02-10",
    status: "active",
    avatar: "SP"
  },
  {
    _id: "5",
    name: "Vikram Mehta",
    mobile: "+91 65432 10987",
    email: "vikram.m@fasterq.in",
    role: "6", // Branch Admin
    roleLabel: "Admin",
    branch: "Mumbai - Andheri",
    manager: null,
    joinDate: "2025-09-01",
    status: "active",
    avatar: "VM"
  },
  {
    _id: "6",
    name: "Neha Gupta",
    mobile: "+91 54321 09876",
    email: "neha.g@fasterq.in",
    role: "8", // Branch Team
    roleLabel: "Team Member",
    branch: "Mumbai - Andheri",
    manager: {
      name: "Amit Sharma",
      mobile: "+91 99887 66554"
    },
    joinDate: "2026-01-05",
    status: "active",
    avatar: "NG"
  },
  {
    _id: "7",
    name: "Rahul Verma",
    mobile: "+91 43210 98765",
    email: "rahul.v@fasterq.in",
    role: "8", // Branch Team
    roleLabel: "Team Member",
    branch: "Mumbai - Andheri",
    manager: {
      name: "Amit Sharma",
      mobile: "+91 99887 66554"
    },
    joinDate: "2025-11-12",
    status: "inactive",
    avatar: "RV"
  },
  {
    _id: "8",
    name: "Pooja Desai",
    mobile: "+91 32109 87654",
    email: "pooja.d@fasterq.in",
    role: "8", // Branch Team
    roleLabel: "Team Member",
    branch: "Mumbai - Andheri",
    manager: {
      name: "Amit Sharma",
      mobile: "+91 99887 66554"
    },
    joinDate: "2026-02-15",
    status: "active",
    avatar: "PD"
  },
];

// ─── Main Branch Teams Demo Screen ───────────────────────────────
export default function BranchTeamsDemoScreen() {
  const [teamMembers, setTeamMembers] = useState(BRANCH_TEAM_DATA);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: BRANCH_TEAM_DATA.length,
    pages: Math.ceil(BRANCH_TEAM_DATA.length / 5),
  });

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let filtered = [...teamMembers];

    // Apply role filter
    if (selectedRole !== "all") {
      filtered = filtered.filter(m => m.role === selectedRole);
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(search) ||
        member.mobile.includes(search) ||
        member.email.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === "name") {
        aValue = a.name;
        bValue = b.name;
      } else if (sortBy === "role") {
        aValue = a.roleLabel;
        bValue = b.roleLabel;
      } else {
        aValue = a[sortBy];
        bValue = b[sortBy];
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [teamMembers, selectedRole, searchTerm, sortBy, sortOrder]);

  // Get current page data
  const currentPageMembers = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return filteredMembers.slice(start, end);
  }, [filteredMembers, pagination.page, pagination.limit]);

  // Update pagination when filters change
  useMemo(() => {
    setPagination(prev => ({
      ...prev,
      total: filteredMembers.length,
      pages: Math.ceil(filteredMembers.length / prev.limit),
      page: 1
    }));
  }, [filteredMembers.length]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRole("all");
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const hasActiveFilters = searchTerm || selectedRole !== "all";

  return (
    <div className="space-y-6 animate-fade-in p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="text-gray-500">Manage your team members and their roles</p>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setTeamMembers(BRANCH_TEAM_DATA);
                setLoading(false);
              }, 800);
            }}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Refresh
          </Button>

          <Button variant="primary">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Input
              placeholder="Search by name, mobile or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <RoleFilter selectedRole={selectedRole} onRoleChange={setSelectedRole} />

          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Team Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("name")}>
                <div className="flex items-center gap-2">
                  Team Member {getSortIcon("name")}
                </div>
              </TableHead>

              <TableHead>Contact</TableHead>

              <TableHead onClick={() => handleSort("role")}>
                <div className="flex items-center gap-2">
                  Role {getSortIcon("role")}
                </div>
              </TableHead>

              <TableHead>Reports To</TableHead>

              <TableHead sortable={false}>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading team members...
                  </div>
                </TableCell>
              </TableRow>
            ) : currentPageMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
                  <p className="text-sm text-gray-500">
                    {hasActiveFilters 
                      ? "Try adjusting your search or filters" 
                      : "Get started by adding your first team member"}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              currentPageMembers.map((member) => (
                <TableRow key={member._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm text-orange-700 font-medium">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{member.name}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {member.mobile}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Mail className="w-3 h-3" />
                        {member.email}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={
                      member.role === "6" ? "purple" :
                      member.role === "7" ? "info" : "default"
                    }>
                      {member.roleLabel}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {member.manager ? (
                      <div>
                        <div className="text-sm font-medium">{member.manager.name}</div>
                        <div className="text-xs text-gray-400">{member.manager.mobile}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        className="p-2 text-green-600 hover:text-white hover:bg-green-600 rounded-md transition-colors"
                        title="Edit Member"
                      >
                        <Pen className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!loading && filteredMembers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              pagination={{
                ...pagination,
                total: filteredMembers.length
              }}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </div>
        )}
      </Card>

    </div>
  );
}