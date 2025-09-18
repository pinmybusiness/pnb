// components/csr/CandidateApplicationsContent.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ArrowLeft, FileText, Eye, Filter } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import StatusBadge from "@/components/ui/StatusBadge";
import KPICard from "@/components/ui/KPICard";
import { Card, Button } from "@/components/ui";
import { getStatusText } from "@/utils/application";
import { formatDateWithSuffix } from "@/utils/dateFormat";

export default function CandidateApplicationsContent() {
  const router = useRouter();
  const { user, token } = useSelector((state) => state.auth);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Determine if the user is authenticated
  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    if (isAuthenticated && user?.role === 10 && token) {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user, token]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 20 },
        }
      );

      if (response.data.success) {
        setApplications(response.data.data);
      } else {
        toast.error("Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const calculateKPIs = () => {
    if (applications.length === 0)
      return { totalApplications: 0, pendingApplications: 0 };
    return {
      totalApplications: applications.length,
      pendingApplications: applications.filter((app) => app.status === 0).length,
    };
  };

  const kpiData = calculateKPIs();

  // Redirect if not authenticated or not a candidate
  if (!isAuthenticated || user?.role !== 10) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Access Denied
          </h2>
          <p className="text-gray-500">
            {isAuthenticated
              ? "Only candidates can view applications."
              : "Please log in to view your applications."}
          </p>
          <Button
            onClick={() => router.push(isAuthenticated ? "/" : "/login")}
            className="px-6"
          >
            {isAuthenticated ? "Back to Dashboard" : "Log In"}
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/")}
          className="p-2 text-gray-600 hover:text-primary rounded-md"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-500 text-sm">
            Track and manage your job applications
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3">
        <KPICard
          title="Total Applications"
          value={kpiData.totalApplications}
          icon={FileText}
        />
        <KPICard
          title="Pending"
          value={kpiData.pendingApplications}
          icon={Filter}
        />
      </div>

      {/* Applications List */}
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card
              key={application._id}
              className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-base">
                  {application.opportunity?.title || "No title"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {application.opportunity?.branch?.parentRestaurant?.name || ""}{" "}
                  ({application.opportunity?.branch?.name || ""})
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Applied on {formatDateWithSuffix(application.appliedAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={getStatusText(application.status)} />
                <a
                  href={`/job/${application?.opportunity?.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-gray-700"
                  title="View"
                >
                  <Eye className="h-5 w-5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-10 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No applications yet
          </h3>
          <p className="text-gray-500 mb-4">
            You haven’t applied to any jobs. Explore opportunities and start
            applying now.
          </p>
          <Button onClick={() => router.push("/jobs")} className="px-6">
            Browse Jobs
          </Button>
        </div>
      )}
    </div>
  );
}