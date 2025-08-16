'use client';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import KPICard from "@/components/KPICard";
import StatusBadge from "@/components/StatusBadge";
import { 
  Store, 
  MapPin, 
  DollarSign, 
  Star,
  AlertTriangle
} from "lucide-react";
import { kpiData, performanceData, trialExpiringBranches, statusCounts, branches } from "@/data/mockData";

const Dashboard = () => {
  const pieData = [
    { name: 'Partnered', value: statusCounts.partnered, color: '#22c55e' },
    { name: 'In Progress', value: statusCounts.inProgress, color: '#f59e0b' },
    { name: 'Closed', value: statusCounts.closed, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Restaurants" value={kpiData.totalRestaurants} change="+2 this month" icon={Store} trend="up" />
        <KPICard title="Active Branches" value={kpiData.totalBranches} change="+1 this week" icon={MapPin} trend="up" />
        <KPICard title="Total Revenue" value={`$${(kpiData.totalRevenue / 1000).toFixed(0)}K`} change="+12.3%" icon={DollarSign} trend="up" />
        <KPICard title="Avg Rating" value={kpiData.avgRating} change="+0.2" icon={Star} trend="up" />
      </div>

      {/* Alerts for trial expiring */}
      {trialExpiringBranches.length > 0 && (
        <div className="p-4 border border-soft bg-yellow-50 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <h4 className="font-medium text-yellow-700">Trial Expiring Soon</h4>
              <p className="text-sm text-yellow-600">
                {trialExpiringBranches.length} branch{trialExpiringBranches.length > 1 ? 'es' : ''} 
                {trialExpiringBranches.length > 1 ? ' have' : ' has'} trials expiring within 15 days
              </p>
            </div>
            <button className="ml-auto px-3 py-1 text-sm border border-soft rounded hover:bg-gray-100 transition">
              View Details
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="p-6 rounded-lg shadow-sm border border-soft bg-white">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Performance Overview</h3>
            <p className="text-sm text-gray-500">Monthly footfall and revenue trends</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
              <Area type="monotone" dataKey="footfall" stroke="#F86F4D" fill="#F86F4D" fillOpacity={0.3} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Branch Status Distribution */}
        <div className="p-6 rounded-lg shadow-sm border border-soft bg-white">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Branch Status Distribution</h3>
            <p className="text-sm text-gray-500">Current status of all branches</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-sm text-gray-500">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Branch Activity */}
      <div className="p-6 rounded-lg shadow-sm border border-soft bg-white">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Branch Activity</h3>
          <p className="text-sm text-gray-500">Latest updates from your restaurant network</p>
        </div>
        <div className="space-y-4">
          {branches.slice(0, 5).map((branch) => (
            <div key={branch.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-orange-100">
                  <MapPin className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{branch.name}</h4>
                  <p className="text-sm text-gray-500">{branch.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{branch.footfall} visitors</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
                <StatusBadge status={branch.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
