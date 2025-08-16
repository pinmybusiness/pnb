'use client';
import React from "react";
import {
  Users,
  TrendingUp,
  Star,
  DollarSign,
  AlertTriangle,
  Calendar,
  MapPin,
  Target,
  Activity,
  Clock,
  Bell,
  BarChart3,
  Settings,
} from "lucide-react";

// Simple KPI card
const KPICard = ({ title, value, change, icon: Icon, trend }) => {
  const trendColor =
    trend === "up"
      ? "text-green-600"
      : trend === "down"
      ? "text-red-600"
      : "text-gray-500";
  const trendIcon = trend === "up" ? "↗" : trend === "down" ? "↘" : "→";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              <span className={`text-sm font-medium ${trendColor}`}>
                {trendIcon} {change}
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-orange-100">
            <Icon className="h-6 w-6 text-orange-500" />
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Status Badge
const StatusBadge = ({ status }) => {
  const statusClass =
    status?.toLowerCase() === "partnered"
      ? "bg-green-100 text-green-600 border-green-200"
      : status?.toLowerCase() === "in progress"
      ? "bg-yellow-100 text-yellow-600 border-yellow-200"
      : status?.toLowerCase() === "closed"
      ? "bg-red-100 text-red-600 border-red-200"
      : "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClass}`}
    >
      {status || "No Status"}
    </span>
  );
};

const AdminDashboard = () => {
  const branchData = {
    id: 1,
    name: "Bella Vista Downtown",
    location: "123 Main St, Downtown",
    status: "Partnered",
    trialDaysLeft: 0,
    footfall: 1250,
    reviews: 4.8,
    engagement: 85,
    revenue: 45600,
    teamCount: 8,
    manager: "Marco Rodriguez",
  };

  const monthlyData = [
    { month: "Jan", footfall: 1200, revenue: 42000, engagement: 82 },
    { month: "Feb", footfall: 1100, revenue: 38500, engagement: 79 },
    { month: "Mar", footfall: 1350, revenue: 47200, engagement: 85 },
    { month: "Apr", footfall: 1280, revenue: 44800, engagement: 83 },
    { month: "May", footfall: 1400, revenue: 49600, engagement: 88 },
    { month: "Jun", footfall: 1550, revenue: 53200, engagement: 91 },
  ];

  const recentAlerts = [
    { id: 1, type: "warning", message: "Low engagement this week", time: "2 hours ago" },
    { id: 2, type: "info", message: "New team member joined", time: "1 day ago" },
    { id: 3, type: "success", message: "Revenue target achieved", time: "2 days ago" },
  ];

  const teamMembers = [
    { id: 1, name: "Sarah Chen", role: "Assistant Manager", status: "Active", avatar: "SC" },
    { id: 2, name: "David Park", role: "Analyst", status: "Active", avatar: "DP" },
    { id: 3, name: "Lisa Wong", role: "Staff", status: "On Leave", avatar: "LW" },
    { id: 4, name: "Mike Johnson", role: "Staff", status: "Active", avatar: "MJ" },
  ];

  return (
    <div className="space-y-6">
      {/* Trial Banner */}
<div className="bg-gradient-to-r from-[var(--color-primary)] to-orange-500 text-white px-6 py-3">
  <div className="flex items-center justify-between max-w-7xl mx-auto">
    <div className="flex items-center gap-3">
      <Clock className="h-5 w-5" />
      <span className="font-medium">Free Trial: 12 days remaining</span>
    </div>
    <button
      className="text-white hover:bg-white/20 text-sm px-3 py-1 rounded transition-colors"
    >
      Upgrade Now
    </button>
  </div>
</div>

      {/* Branch Status Card */}
      <div className="bg-gradient-to-r from-orange-50 to-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {branchData.name}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{branchData.location}</span>
              </div>
              <StatusBadge status={branchData.status} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Manager</p>
            <p className="font-semibold text-gray-900">{branchData.manager}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Daily Footfall"
          value={branchData.footfall.toLocaleString()}
          change="+12%"
          icon={Users}
          trend="up"
        />
        <KPICard
          title="Revenue"
          value={`₹${(branchData.revenue / 1000).toFixed(0)}K`}
          change="+8%"
          icon={DollarSign}
          trend="up"
        />
        <KPICard
          title="Rating"
          value={branchData.reviews}
          change="+0.2"
          icon={Star}
          trend="up"
        />
        <KPICard
          title="Engagement"
          value={`${branchData.engagement}%`}
          change="-3%"
          icon={Target}
          trend="down"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
            <button className="px-3 py-1.5 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              View Details
            </button>
          </div>
          <div className="space-y-4">
            {monthlyData.slice(-3).map((data) => (
              <div
                key={data.month}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="font-medium">{data.month}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500">Footfall</p>
                    <p className="font-semibold">{data.footfall}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Revenue</p>
                    <p className="font-semibold">
                      ₹{(data.revenue / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">Engagement</p>
                    <p className="font-semibold">{data.engagement}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
            <Bell className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
              >
                <div
                  className={`p-1 rounded-full ${
                    alert.type === "warning"
                      ? "bg-amber-100 text-amber-600"
                      : alert.type === "success"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <AlertTriangle className="h-3 w-3" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Team Overview</h3>
          <button className="px-3 py-1.5 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">
            Manage Team
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
            >
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-orange-500">
                  {member.avatar}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {member.name}
                </p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
              <div
                className={`w-2 h-2 rounded-full ${
                  member.status === "Active" ? "bg-green-500" : "bg-amber-500"
                }`}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="h-12 flex items-center justify-start gap-3 px-4 border rounded-lg text-gray-700 hover:bg-gray-50">
            <Users className="h-5 w-5" />
            Add Team Member
          </button>
          <button className="h-12 flex items-center justify-start gap-3 px-4 border rounded-lg text-gray-700 hover:bg-gray-50">
            <BarChart3 className="h-5 w-5" />
            Generate Report
          </button>
          <button className="h-12 flex items-center justify-start gap-3 px-4 border rounded-lg text-gray-700 hover:bg-gray-50">
            <Settings className="h-5 w-5" />
            Update Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
