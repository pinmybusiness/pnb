"use client";

import { useState } from "react";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Users,
  DollarSign,
  Star,
  Activity
} from "lucide-react";
import { performanceData, kpiData, branches } from "@/data/mockData";

export default function Reports() {
  const [timeRange, setTimeRange] = useState("6months");
  const [reportType, setReportType] = useState("overview");

  // Generate comparison data
  const comparisonData = performanceData.map((data) => ({
    ...data,
    previousFootfall: data.footfall - Math.floor(Math.random() * 200) + 100,
    previousRevenue: data.revenue - Math.floor(Math.random() * 5000) + 2000,
  }));

  // Branch performance data
  const branchPerformanceData = branches.slice(0, 6).map(branch => ({
    name: branch.name.split(' ').slice(-1)[0], 
    footfall: branch.footfall,
    revenue: branch.revenue / 1000, 
    rating: branch.reviews,
    engagement: branch.engagement
  }));

  const timeRangeOptions = [
    { value: "1month", label: "Last Month" },
    { value: "3months", label: "Last 3 Months" },
    { value: "6months", label: "Last 6 Months" },
    { value: "1year", label: "Last Year" },
  ];

  const reportTypeOptions = [
    { value: "overview", label: "Overview" },
    { value: "performance", label: "Performance" },
    { value: "comparison", label: "Comparison" },
    { value: "branches", label: "Branch Analysis" },
  ];

  const generateInsights = () => {
    const avgGrowth = 12.3;
    const topBranch = branches.reduce((prev, current) => 
      (prev.footfall > current.footfall) ? prev : current
    );
    const totalRevenue = branches.reduce((sum, b) => sum + b.revenue, 0);
    
    return [
      {
        title: "Revenue Growth",
        value: `+${avgGrowth}%`,
        description: "Average monthly growth across all branches",
        trend: "up",
        color: "text-green-600"
      },
      {
        title: "Top Performer",
        value: topBranch.name.split(' ').slice(-1)[0],
        description: `${topBranch.footfall.toLocaleString()} monthly visitors`,
        trend: "up",
        color: "text-orange-500"
      },
      {
        title: "Network Revenue",
        value: `$${(totalRevenue / 1000).toFixed(0)}K`,
        description: "Total monthly revenue across network",
        trend: "up",
        color: "text-gray-900"
      }
    ];
  };

  const insights = generateInsights();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-500">Comprehensive performance insights and trends</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-soft rounded-md bg-white hover:bg-gray-50 transition">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-soft rounded-md bg-white hover:bg-gray-50 transition">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border border-soft rounded-lg bg-white">
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium text-gray-500">Time Range:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-2 py-1 text-sm border border-soft rounded bg-white"
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium text-gray-500">Report Type:</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-2 py-1 text-sm border border-soft rounded bg-white"
            >
              {reportTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <div key={index} className="p-6 border border-soft rounded-lg bg-white shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">{insight.title}</h3>
                {insight.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
              <p className={`text-2xl font-bold ${insight.color}`}>{insight.value}</p>
              <p className="text-sm text-gray-500">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="p-6 border border-soft rounded-lg bg-white shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Trend</h3>
            <p className="text-sm text-gray-500">Monthly footfall and revenue trends</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
              <Line type="monotone" dataKey="footfall" stroke="#F86F4D" strokeWidth={3} dot={{ fill: '#F86F4D', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} dot={{ fill: '#4F46E5', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Branch Comparison */}
        <div className="p-6 border border-soft rounded-lg bg-white shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Branch Performance</h3>
            <p className="text-sm text-gray-500">Revenue comparison across branches</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={branchPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
              <Bar dataKey="revenue" fill="#F86F4D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Year-over-Year Comparison */}
      {reportType === "comparison" && (
        <div className="p-6 border border-soft rounded-lg bg-white shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Year-over-Year Comparison</h3>
            <p className="text-sm text-gray-500">Current vs previous year performance</p>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
              <Area type="monotone" dataKey="previousFootfall" stackId="1" stroke="#9CA3AF" fill="#9CA3AF" fillOpacity={0.3} />
              <Area type="monotone" dataKey="footfall" stackId="2" stroke="#F86F4D" fill="#F86F4D" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Performance Summary Table */}
      <div className="p-6 border border-soft rounded-lg bg-white shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Branch Performance Summary</h3>
          <p className="text-sm text-gray-500">Detailed metrics for all branches</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-soft">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Branch</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Footfall</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Rating</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Growth</th>
              </tr>
            </thead>
            <tbody>
              {branches.slice(0, 8).map((branch) => (
                <tr key={branch.id} className="border-b border-soft hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{branch.name}</td>
                  <td className="py-3 px-4">{branch.footfall.toLocaleString()}</td>
                  <td className="py-3 px-4">${(branch.revenue / 1000).toFixed(0)}K</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {branch.reviews}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium border border-soft bg-gray-100">
                      +{(Math.random() * 20 + 5).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
