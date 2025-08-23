"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Clock,
  AlertTriangle,
  UserCheck,
  UserX,
  ArrowLeft,
  BarChart3,
  Calendar,
  TrendingDown,
  DollarSign,
  UserMinus,
} from "lucide-react";

export default function Analytics() {
  const router = useRouter();
  const [currentWaiting, setCurrentWaiting] = useState([]);
  const [avgCustomerValue, setAvgCustomerValue] = useState(650);
  const [revenueFilter, setRevenueFilter] = useState("week");
  const [stats, setStats] = useState({
    totalWaiting: 0,
    waitingOver1Min: 0,
    waitingOver10Min: 0,
    moreThan5People: 0,
    notAttended: 0,
    lostCustomersLastWeek: 0,
    estimatedRevenueLost: 0,
  });

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const savedAvgValue = localStorage.getItem("avgCustomerValue");
    if (savedAvgValue) {
      setAvgCustomerValue(parseInt(savedAvgValue));
    }

    const loadAnalytics = () => {
      const waitingList = JSON.parse(localStorage.getItem("waitingList") || "[]");
      const currentlyWaiting = waitingList.filter((c) => !c.served);
      setCurrentWaiting(currentlyWaiting);

      const now = new Date();
      const waitingOver1Min = currentlyWaiting.filter((c) => {
        const waitTime = Math.floor(
          (now.getTime() - new Date(c.timestamp).getTime()) / 60000
        );
        return waitTime >= 1;
      }).length;

      const waitingOver10Min = currentlyWaiting.filter((c) => {
        const waitTime = Math.floor(
          (now.getTime() - new Date(c.timestamp).getTime()) / 60000
        );
        return waitTime >= 10;
      }).length;

      const moreThan5People = currentlyWaiting.filter(
        (c) => c.adults + c.children > 5
      ).length;

      let filterDate = new Date();
      switch (revenueFilter) {
        case "day":
          filterDate.setDate(now.getDate() - 1);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setDate(now.getDate() - 30);
          break;
      }

      const leftCustomersInPeriod = waitingList.filter(
        (c) =>
          c.leftWithoutService && new Date(c.timestamp) >= filterDate
      );
      const lostCustomersLastWeek = leftCustomersInPeriod.length;

      const estimatedRevenueLost = lostCustomersLastWeek * avgCustomerValue;

      setStats({
        totalWaiting: currentlyWaiting.length,
        waitingOver1Min,
        waitingOver10Min,
        moreThan5People,
        notAttended: currentlyWaiting.length,
        lostCustomersLastWeek,
        estimatedRevenueLost,
      });
    };

    loadAnalytics();
    const interval = setInterval(loadAnalytics, 5000);
    return () => clearInterval(interval);
  }, [avgCustomerValue, revenueFilter]);

  const handleAvgValueChange = (value) => {
    const numValue = parseInt(value) || 650;
    setAvgCustomerValue(numValue);
    localStorage.setItem("avgCustomerValue", numValue.toString());
  };

  const StatCard = ({ title, value, icon: Icon, description, variant = "default" }) => {
    const variantStyles = {
      default: "border border-soft bg-white",
      warning: "border border-yellow-400 bg-yellow-50",
      success: "border border-green-custom bg-green-light",
      danger: "border border-red-400 bg-red-50",
    };

    const iconColors = {
      default: "text-primary",
      warning: "text-yellow-600",
      success: "text-green-custom",
      danger: "text-red-600",
    };

    return (
      <div className={`rounded-xl shadow p-6 ${variantStyles[variant]}`}>
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full bg-gray-light ${iconColors[variant]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-dark">{value}</div>
            <div className="text-sm font-medium text-dark">{title}</div>
            <div className="text-xs text-gray-500">{description}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-light p-4 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/waiting-list")}
            className="p-2 border border-soft rounded-lg hover:bg-primary-light"
          >
            <ArrowLeft className="w-4 h-4 text-dark" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-dark">Analytics Dashboard</h1>
            <p className="text-gray-500">Real-time waiting list insights</p>
          </div>
        </div>

        {/* Date */}
        <div className="rounded-xl shadow bg-white p-4 flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary-light text-primary">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-dark">📅 {getCurrentDate()}</h2>
            <p className="text-sm text-gray-500">Today's Analytics Overview</p>
          </div>
        </div>

        {/* Revenue Filter */}
        <div className="rounded-xl shadow bg-white p-4">
          <h3 className="font-semibold mb-2 text-dark">Revenue Period</h3>
          <div className="flex gap-2">
            {["day", "week", "month"].map((period) => (
              <button
                key={period}
                onClick={() => setRevenueFilter(period)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium ${
                  revenueFilter === period
                    ? "bg-primary text-primary-foreground"
                    : "bg-white border-soft hover:bg-primary-light text-dark"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Revenue & Avg Value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl shadow bg-white p-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-dark">
              <DollarSign className="w-5 h-5 text-primary" />
              Average Customer Value
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-dark">₹</span>
              <input
                type="number"
                value={avgCustomerValue}
                onChange={(e) => handleAvgValueChange(e.target.value)}
                className="text-2xl font-bold border border-soft rounded-lg px-2 py-1 w-32 text-dark"
                min="1"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">Used for revenue calculations</p>
          </div>

          <div className="rounded-xl shadow border border-red-400 bg-red-50 p-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-red-600 mb-3">
              <TrendingDown className="w-5 h-5" />
              💸 Estimated Revenue Lost
            </h3>
            <div className="text-3xl font-bold text-red-600">
              ₹{stats.estimatedRevenueLost.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">
              Last {revenueFilter === "day" ? "1 day" : revenueFilter === "week" ? "7 days" : "30 days"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Based on unattended customers × average value
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Total Waiting" value={stats.totalWaiting} icon={Users} description="Currently in queue" />
          <StatCard
            title="Waiting 1+ Min"
            value={stats.waitingOver1Min}
            icon={Clock}
            description="Need attention soon"
            variant={stats.waitingOver1Min > 0 ? "warning" : "default"}
          />
          <StatCard
            title="Waiting 10+ Min"
            value={stats.waitingOver10Min}
            icon={AlertTriangle}
            description="High priority"
            variant={stats.waitingOver10Min > 0 ? "danger" : "default"}
          />
          <StatCard
            title="Large Parties (5+)"
            value={stats.moreThan5People}
            icon={UserCheck}
            description="Special seating needed"
            variant={stats.moreThan5People > 0 ? "warning" : "default"}
          />
          <StatCard
            title="Not Attended"
            value={stats.notAttended}
            icon={UserX}
            description="Awaiting service"
            variant={stats.notAttended > 0 ? "warning" : "success"}
          />
          <StatCard
            title="Lost Customers Last Week"
            value={stats.lostCustomersLastWeek}
            icon={UserMinus}
            description="Customers walked out or never attended"
            variant={stats.lostCustomersLastWeek > 0 ? "danger" : "success"}
          />
        </div>

        {/* Chart Placeholder */}
        <div className="rounded-xl shadow bg-white p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-dark">
            <BarChart3 className="w-5 h-5 text-primary" />
            Guests per Hour
          </h3>
          <div className="h-64 bg-gray-light rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-gray-500 font-medium">Chart Coming Soon</p>
              <p className="text-sm text-gray-400">Visual analytics will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Queue Summary */}
        {currentWaiting.length > 0 && (
          <div className="rounded-xl shadow bg-white p-6">
            <h3 className="text-lg font-semibold mb-4 text-dark">Current Queue Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2 text-dark">Longest Wait:</h4>
                <p className="text-2xl font-bold text-red-600">
                  {Math.floor(
                    (new Date().getTime() -
                      new Date(currentWaiting[0]?.timestamp).getTime()) /
                      60000
                  )}
                  m
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-dark">Total People:</h4>
                <p className="text-2xl font-bold text-primary">
                  {currentWaiting.reduce(
                    (sum, c) => sum + c.adults + c.children,
                    0
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard/waiting-list")}
            className="flex-1 py-2 rounded-lg border border-soft hover:bg-primary-light text-dark"
          >
            Back to Queue
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
