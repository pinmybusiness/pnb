'use client';
import { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Mail,
  Calendar,
  MapPin,
  UserPlus,
  Shield,
  ChevronRight,
} from "lucide-react";
import { teams, branches, restaurants } from "@/data/mockData";
import StatusBadge from "@/components/StatusBadge";
import KPICard from "@/components/KPICard";

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const getBranchInfo = (branchId) => {
    const branch = branches.find((b) => b.id === branchId);
    const restaurant = branch
      ? restaurants.find((r) => r.id === branch.restaurantId)
      : null;
    return { branch, restaurant };
  };

  const filteredTeams = teams.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleStats = {
    managers: teams.filter((t) => t.role.includes("Manager")).length,
    analysts: teams.filter((t) => t.role.includes("Analyst")).length,
    assistants: teams.filter((t) => t.role.includes("Assistant")).length,
    total: teams.length,
  };

  const getRoleColor = (role) => {
    if (role.includes("Manager"))
      return "bg-primary/10 text-primary border-primary/20";
    if (role.includes("Analyst"))
      return "bg-secondary-accent/20 text-secondary-accent border-secondary-accent/30";
    if (role.includes("Assistant"))
      return "bg-accent-primary/20 text-accent-primary border-accent-primary/30";
    return "bg-muted text-muted-foreground border-soft";
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
          <p className="text-muted-foreground">
            Manage team members across all branches
          </p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:opacity-90">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Members" value={roleStats.total} icon={Users} />
        <KPICard title="Managers" value={roleStats.managers} icon={Shield} />
        <KPICard title="Analysts" value={roleStats.analysts} icon={Users} />
        <KPICard title="Assistants" value={roleStats.assistants} icon={Users} />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-soft rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Team Members */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTeams.map((member) => {
          const { branch, restaurant } = getBranchInfo(member.branchId);
          return (
            <div
              key={member.id}
              className="p-6 bg-card rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {member.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-md text-xs border ${getRoleColor(
                      member.role
                    )}`}
                  >
                    {member.role}
                  </span>
                </div>

                {/* Branch Info */}
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{restaurant?.logo}</span>
                      <div>
                        <p className="font-medium text-sm">{branch?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {restaurant?.name}
                        </p>
                      </div>
                    </div>
                    {branch && <StatusBadge status={branch.status} />}
                  </div>
                  {branch?.location && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{branch.location}</span>
                    </div>
                  )}
                </div>

                {/* Joined Date */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Joined {new Date(member.joinDate).toLocaleDateString()}
                  </div>
                  <button className="h-8 w-8 flex items-center justify-center rounded hover:bg-muted">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-soft">
                  <button className="flex-1 border border-soft rounded-md py-1 text-sm hover:bg-muted">
                    View Profile
                  </button>
                  <button className="flex-1 rounded-md py-1 text-sm hover:bg-muted">
                    Edit Role
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTeams.length === 0 && (
        <div className="p-12 text-center bg-card rounded-lg">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No team members found
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Get started by inviting your first team member"}
          </p>
          <button className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 mx-auto">
            <UserPlus className="h-4 w-4" />
            Invite Member
          </button>
        </div>
      )}
    </div>
  );
};

export default Teams;
