'use client';
import { useState, useEffect, useMemo } from "react";
import {
  Store,
  Search,
  Plus,
  DollarSign,
  TrendingUp,
  ArrowUpDown,
  Edit
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import KPICard from "@/components/ui/KPICard";
import { toast } from "react-hot-toast";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  Button,
  Input,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui";

const Organizations = () => {
  const router = useRouter();

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/api/organizations");
        setOrganizations(res.data.data || []);
      } catch (error) {
        toast.error("Failed to fetch data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= SORT HANDLER =================
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // ================= FILTER + SORT =================
  const filteredAndSortedOrganizations = useMemo(() => {
    return [...organizations]
      .filter((org) => {
        const matchesSearch =
          org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          org.contact?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          org.contact?.phone?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" ||
          org.status?.current?.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
          case "name":
            aValue = a.name || "";
            bValue = b.name || "";
            break;
          case "branches":
            aValue = a.branchCount || 0;
            bValue = b.branchCount || 0;
            break;
          case "status":
            aValue = a.status?.current || "";
            bValue = b.status?.current || "";
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
  }, [organizations, searchTerm, statusFilter, sortBy, sortOrder]);

  // ================= KPI CALC =================
  const kpiData = useMemo(() => {
    const totalOrganizations = organizations.length;
    const totalBranches = organizations.reduce(
      (sum, org) => sum + (org.branchCount || 0),
      0
    );

    return {
      totalOrganizations,
      totalBranches,
      activeTrials: 0 // backend se nahi aa raha, isliye 0
    };
  }, [organizations]);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
  ];

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // ================= RENDER =================
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Organization Management
          </h1>
          <p className="text-gray-500">
            Monitor and manage all organizations
          </p>
        </div>
        <Link href="/dashboard/organizations/add">
          <Button className="rounded-lg">
            <Plus className="h-4 w-4 mr-2" />
            Add Organization
          </Button>
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Total Organizations"
          value={kpiData.totalOrganizations}
          icon={Store}
        />
        <KPICard
          title="Total Branches"
          value={kpiData.totalBranches}
          icon={TrendingUp}
        />
        <KPICard
          title="Active Trials"
          value={kpiData.activeTrials}
          icon={DollarSign}
        />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search Organizations..."
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
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => handleSort("name")}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  Organization Name <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead
                onClick={() => handleSort("branches")}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  Branches <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("status")}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  Status <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredAndSortedOrganizations.map((org) => (
              <TableRow key={org._id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                      {org.logo ? (
                        <Image
                          src={org.logo}
                          alt={org.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <Store className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-4 text-sm font-medium text-gray-900">
                      {org.name}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-sm">
                    <div>{org.contact?.phone || "No phone"}</div>
                    <div className="text-gray-500 truncate max-w-[200px]">
                      {org.contact?.email || "No email"}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="font-medium">
                    {org.branchCount || 0} branch
                    {org.branchCount !== 1 ? "es" : ""}
                  </div>
                </TableCell>

                <TableCell>
                  <StatusBadge
                    status={
                      org.status?.current ||
                      (org.isActive ? "active" : "inactive")
                    }
                  />
                </TableCell>

                <TableCell>
                  <button
                    onClick={() =>
                      router.push(`/dashboard/organizations/${org._id}`)
                    }
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredAndSortedOrganizations.length === 0 && (
          <div className="p-12 text-center">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Organizations found
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by adding your first organization"}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Organizations;
