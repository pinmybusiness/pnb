'use client';

import { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Mail,
  Calendar,
  ArrowUpDown,
  Eye,
  UserPlus,
} from "lucide-react";
import { teams, branches, restaurants } from "@/data/mockData";
import KPICard from "@/components/ui/KPICard";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 🔹 Reusable components (same as Branches)
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

const Table = ({ children }) => <table className="min-w-full">{children}</table>;
const TableHeader = ({ children }) => <thead className="bg-gray-50">{children}</thead>;
const TableBody = ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>;
const TableRow = ({ children, className = "" }) => <tr className={className}>{children}</tr>;
const TableHead = ({ children, className = "", ...props }) => (
  <th
    scope="col"
    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${className}`}
    {...props}
  >
    {children}
  </th>
);
const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${className}`}>{children}</td>
);

const Teams = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const getBranchInfo = (branchId) => {
    const branch = branches.find((b) => b.id === branchId);
    const restaurant = branch
      ? restaurants.find((r) => r.id === branch.restaurantId)
      : null;
    return { branch, restaurant };
  };

  const filteredTeams = teams
    .filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "role":
          aValue = a.role;
          bValue = b.role;
          break;
        case "email":
          aValue = a.email;
          bValue = b.email;
          break;
        case "joined":
          aValue = new Date(a.joinDate);
          bValue = new Date(b.joinDate);
          break;
        default:
          return 0;
      }
      if (typeof aValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
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

  const roleStats = {
    managers: teams.filter((t) => t.role.includes("Manager")).length,
    analysts: teams.filter((t) => t.role.includes("Analyst")).length,
    assistants: teams.filter((t) => t.role.includes("Assistant")).length,
    total: teams.length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-500">Manage team members across all branches</p>
        </div>
        <Link href='/dashboard/teams/add'>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Team
        </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Members" value={roleStats.total} icon={Users} />
        <KPICard title="Managers" value={roleStats.managers} icon={Users} />
        <KPICard title="Analysts" value={roleStats.analysts} icon={Users} />
        <KPICard title="Assistants" value={roleStats.assistants} icon={Users} />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Teams Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("name")}>
                <div className="flex items-center gap-2">
                  Name <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("role")}>
                <div className="flex items-center gap-2">
                  Role <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("email")}>
                <div className="flex items-center gap-2">
                  Email <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Branch & Restaurant</TableHead>
              <TableHead onClick={() => handleSort("joined")}>
                <div className="flex items-center gap-2">
                  Joined <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeams.map((member) => {
              const { branch, restaurant } = getBranchInfo(member.branchId);
              return (
                <TableRow key={member.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Mail className="h-3 w-3" /> {member.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate">
                      {branch?.name || "Unknown"} <br />
                      <span className="text-xs text-gray-500">{restaurant?.name || ""}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="h-3 w-3" />
                      {new Date(member.joinDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/teams/${member.id}`)}
                        className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-md"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredTeams.length === 0 && (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by inviting your first team member"}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Teams;
