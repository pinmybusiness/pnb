"use client";
import { useState } from "react";
import KPICard from "@/components/KPICard";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  FileText,
  Users,
  DollarSign,
  Star,
  Target,
  PieChart,
  LineChart,
  Activity
} from "lucide-react";

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [selectedReport, setSelectedReport] = useState("performance");

  const reportTypes = [
    { id: "performance", name: "Performance", icon: BarChart3 },
    { id: "revenue", name: "Revenue", icon: DollarSign },
    { id: "customer", name: "Customer", icon: Users },
    { id: "feedback", name: "Feedback", icon: Star }
  ];

  const periods = [
    { id: "daily", name: "Daily" },
    { id: "weekly", name: "Weekly" },
    { id: "monthly", name: "Monthly" },
    { id: "quarterly", name: "Quarterly" }
  ];

  const performanceMetrics = [
    {
      title: "Total Footfall",
      value: "8,742",
      change: "+12%",
      icon: Users,
      trend: "up"
    },
    {
      title: "Revenue Generated",
      value: "₹2.84L",
      change: "+8%",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.2",
      icon: Star,
      trend: "up"
    },
    {
      title: "Engagement Rate",
      value: "85%",
      change: "-3%",
      icon: Target,
      trend: "down"
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: "Weekly Performance Summary",
      type: "Performance",
      date: "Dec 15, 2024",
      status: "Ready",
      size: "2.4 MB"
    },
    {
      id: 2,
      name: "Customer Feedback Analysis",
      type: "Feedback",
      date: "Dec 14, 2024",
      status: "Ready",
      size: "1.8 MB"
    },
    {
      id: 3,
      name: "Revenue Trend Report",
      type: "Revenue",
      date: "Dec 13, 2024",
      status: "Processing",
      size: "3.2 MB"
    },
    {
      id: 4,
      name: "Team Performance Review",
      type: "Performance",
      date: "Dec 12, 2024",
      status: "Ready",
      size: "1.5 MB"
    }
  ];

  const chartData = [
    { day: "Mon", footfall: 1200, revenue: 45000, rating: 4.6 },
    { day: "Tue", footfall: 1100, revenue: 42000, rating: 4.7 },
    { day: "Wed", footfall: 1350, revenue: 48000, rating: 4.8 },
    { day: "Thu", footfall: 1280, revenue: 46000, rating: 4.7 },
    { day: "Fri", footfall: 1450, revenue: 52000, rating: 4.9 },
    { day: "Sat", footfall: 1650, revenue: 58000, rating: 4.8 },
    { day: "Sun", footfall: 1550, revenue: 55000, rating: 4.7 }
  ];

  const insights = [
    {
      title: "Peak Performance Day",
      description: "Saturday shows highest revenue and footfall",
      value: "Saturday",
      change: "+25% vs weekday average"
    },
    {
      title: "Customer Satisfaction Trend",
      description: "Rating consistently above 4.6 this week",
      value: "4.8/5",
      change: "+0.2 vs last week"
    },
    {
      title: "Revenue Growth",
      description: "Weekly revenue up compared to last week",
      value: "₹3.46L",
      change: "+12% week over week"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Branch performance insights and detailed reports
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-soft rounded-md text-sm flex items-center gap-2 hover:bg-accent">
            <Calendar className="h-4 w-4" />
            Schedule Report
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm flex items-center gap-2 hover:bg-primary/90">
            <FileText className="h-4 w-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="p-4 rounded-lg border border-soft bg-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Report Type
            </label>
            <div className="flex gap-2 flex-wrap">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedReport(type.id)}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-2 border border-soft ${
                    selectedReport === type.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-accent"
                  }`}
                >
                  <type.icon className="h-4 w-4" />
                  {type.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Time Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-soft rounded-md bg-background text-foreground"
            >
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <KPICard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            trend={metric.trend}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Visualization */}
        <div className="p-6 rounded-lg border border-soft bg-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Performance Trends</h3>
            <div className="flex gap-2">
              <button className="p-2 border border-soft rounded-md hover:bg-accent">
                <LineChart className="h-4 w-4" />
              </button>
              <button className="p-2 border border-soft rounded-md hover:bg-accent">
                <BarChart3 className="h-4 w-4" />
              </button>
              <button className="p-2 border border-soft rounded-md hover:bg-accent">
                <PieChart className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {chartData.map((data) => (
              <div
                key={data.day}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <span className="font-medium w-12">{data.day}</span>
                <div className="flex-1 mx-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-2 bg-primary/20 rounded-full">
                        <div
                          className="h-2 bg-primary rounded-full"
                          style={{ width: `${(data.footfall / 1650) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground w-16">
                      {data.footfall}
                    </span>
                  </div>
                </div>
                <span className="text-sm font-medium w-20">
                  ₹{(data.revenue / 1000).toFixed(0)}K
                </span>
                <span className="text-sm text-muted-foreground w-12">
                  {data.rating}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="p-6 rounded-lg border border-soft bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Reports</h3>
            <button className="px-3 py-1.5 border border-soft rounded-md text-sm hover:bg-accent">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{report.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {report.type} • {report.date} • {report.size}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      report.status === "Ready"
                        ? "bg-green-100 text-green-600"
                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {report.status}
                  </span>
                  {report.status === "Ready" && (
                    <button className="p-2 hover:bg-accent rounded-md">
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="p-6 rounded-lg border border-soft bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-semibold text-foreground mb-2">{insight.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {insight.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">{insight.value}</span>
                <span className="text-sm text-green-600">{insight.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Options */}
      <div className="p-6 rounded-lg border border-soft bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Export Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="h-12 px-4 border border-soft rounded-md flex items-center gap-3 hover:bg-accent">
            <Download className="h-5 w-5" />
            Export as PDF
          </button>
          <button className="h-12 px-4 border border-soft rounded-md flex items-center gap-3 hover:bg-accent">
            <FileText className="h-5 w-5" />
            Export as Excel
          </button>
          <button className="h-12 px-4 border border-soft rounded-md flex items-center gap-3 hover:bg-accent">
            <Activity className="h-5 w-5" />
            Export as CSV
          </button>
        </div>
      </div>
    </div>
  );
}
