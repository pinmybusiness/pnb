"use client"
import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  User,
  Shield,
  Clock
} from "lucide-react";

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const teamMembers = [
    {
      id: 1,
      name: "Marco Rodriguez",
      role: "Branch Manager",
      email: "marco@bellavista.com",
      phone: "+91 98765 43210",
      joinDate: "2024-01-20",
      status: "Active",
      permissions: "Full Access",
      shift: "Full Time",
      lastActive: "Online now"
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Assistant Manager",
      email: "sarah@bellavista.com",
      phone: "+91 98765 43211",
      joinDate: "2024-02-15",
      status: "Active",
      permissions: "Limited Admin",
      shift: "Morning",
      lastActive: "2 hours ago"
    },
    {
      id: 3,
      name: "David Park",
      role: "Analyst",
      email: "david@bellavista.com",
      phone: "+91 98765 43212",
      joinDate: "2024-03-01",
      status: "Active",
      permissions: "Reports Only",
      shift: "Evening",
      lastActive: "Online now"
    },
    {
      id: 4,
      name: "Lisa Wong",
      role: "Staff",
      email: "lisa@bellavista.com",
      phone: "+91 98765 43213",
      joinDate: "2024-04-10",
      status: "On Leave",
      permissions: "Basic Access",
      shift: "Afternoon",
      lastActive: "3 days ago"
    },
    {
      id: 5,
      name: "Mike Johnson",
      role: "Staff",
      email: "mike@bellavista.com",
      phone: "+91 98765 43214",
      joinDate: "2024-05-15",
      status: "Active",
      permissions: "Basic Access",
      shift: "Morning",
      lastActive: "1 hour ago"
    }
  ];

  const roles = ["all", "Branch Manager", "Assistant Manager", "Analyst", "Staff"];

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600";
      case "On Leave":
        return "bg-amber-100 text-amber-600";
      case "Inactive":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPermissionColor = (permission) => {
    switch (permission) {
      case "Full Access":
        return "bg-purple-100 text-purple-600";
      case "Limited Admin":
        return "bg-blue-100 text-blue-600";
      case "Reports Only":
        return "bg-orange-100 text-orange-600";
      case "Basic Access":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
          <p className="text-muted-foreground">Manage branch staff and their permissions</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition">
          <Plus className="h-4 w-4" />
          Add Team Member
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Members",
            value: teamMembers.length,
            icon: <User className="h-5 w-5 text-blue-600" />,
            bg: "bg-blue-100"
          },
          {
            label: "Active Members",
            value: teamMembers.filter((m) => m.status === "Active").length,
            icon: <Shield className="h-5 w-5 text-green-600" />,
            bg: "bg-green-100"
          },
          {
            label: "On Duty Now",
            value: 3,
            icon: <Clock className="h-5 w-5 text-purple-600" />,
            bg: "bg-purple-100"
          },
          {
            label: "On Leave",
            value: teamMembers.filter((m) => m.status === "On Leave").length,
            icon: <Calendar className="h-5 w-5 text-amber-600" />,
            bg: "bg-amber-100"
          }
        ].map((stat, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg border border-soft bg-white shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>{stat.icon}</div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="p-4 rounded-lg border border-soft bg-white shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-soft rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-soft rounded-md bg-background text-foreground text-sm"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role === "all" ? "All Roles" : role}
                </option>
              ))}
            </select>
            <button className="px-3 py-2 border border-soft rounded-md hover:bg-gray-100 transition">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="p-6 rounded-lg border border-soft bg-white shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                    member.status
                  )}`}
                >
                  {member.status}
                </span>
                <button className="p-1 rounded hover:bg-gray-100">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {member.joinDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getPermissionColor(
                      member.permissions
                    )}`}
                  >
                    {member.permissions}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {member.lastActive}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-soft">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-soft rounded-md hover:bg-gray-100 transition text-sm">
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button className="px-3 py-2 border border-soft rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 transition">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="p-12 rounded-lg border border-soft bg-white shadow-sm text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No team members found
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterRole !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Start by adding your first team member"}
          </p>
          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition">
            <Plus className="h-4 w-4 mr-2 inline-block" />
            Add Team Member
          </button>
        </div>
      )}
    </div>
  );
};

export default Teams;
