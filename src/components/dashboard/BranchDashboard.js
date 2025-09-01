"use client";

import { useState } from "react";
import {
  Users,
  Clock,
  Settings,
  Download,
  Trash2,
  Edit3,
  CheckCircle,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const [restaurantName, setRestaurantName] = useState("Bella Vista Restaurant");
  const [isEditingName, setIsEditingName] = useState(false);

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const StatCard = ({ title, value, icon: Icon, unit = "", description, color }) => (
    <div className="bg-white border border-soft rounded-2xl p-5 flex items-center gap-4 shadow-sm cursor-pointer">
      <div className={`p-3 rounded-full ${color.bg} ${color.text}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold leading-tight">{value}{unit}</span>
        <span className="text-sm font-medium text-dark">{title}</span>
        <span className="text-xs text-gray-500">{description}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-light p-6 font-sans">
      <div className="max-w-5xl mx-auto flex flex-col gap-5">

        {/* Header */}
        <div className="bg-white border border-soft rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-primary-light text-primary">
              <Users className="w-7 h-7" />
            </div>
            <div>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    className="border border-soft rounded-lg px-2 py-1 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="flex items-center gap-1 bg-primary hover:opacity-90 text-white px-3 py-1 rounded-lg text-sm cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" /> Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-dark">{restaurantName}</h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="flex items-center gap-1 text-gray-600 hover:text-primary text-sm cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" /> Edit
                  </button>
                </div>
              )}
              <p className="text-sm text-gray-500">Management Dashboard</p>
            </div>
          </div>
          <div className="p-3 rounded-full bg-primary-light text-primary cursor-pointer">
            <Settings className="w-6 h-6" />
          </div>
        </div>

        {/* Date */}
        <div className="bg-white border border-soft rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="p-2 rounded-full bg-primary-light text-primary">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {getCurrentDate()}
            </h2>
            <p className="text-xs text-gray-500">Daily performance overview</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Today"
            value="0"
            description="Customers served & waiting"
            icon={Users}
            color={{ bg: "bg-primary-light", text: "text-primary" }}
          />
          <StatCard
            title="Average Wait"
            value="0"
            unit="m"
            description="Minutes per customer"
            icon={Clock}
            color={{ bg: "bg-primary-light", text: "text-primary" }}
          />
          <StatCard
            title="Currently Waiting"
            value="0"
            description="In queue right now"
            icon={Users}
            color={{ bg: "bg-primary-light", text: "text-primary" }}
          />
        </div>

        {/* Revenue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-soft rounded-2xl p-5 flex items-center gap-4 shadow-sm cursor-pointer">
            <div className="p-3 rounded-full bg-primary-light text-primary">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-3xl font-bold">₹650</div>
              <div className="text-sm font-medium">Each Customer&apos;s Spend</div>
              <div className="text-xs text-gray-500">Average customer value</div>
            </div>
          </div>
          <div className="bg-green-light border border-soft rounded-2xl p-5 flex items-center gap-4 shadow-sm cursor-pointer">
            <div className="p-3 rounded-full bg-green-light text-green-custom">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-3xl font-bold text-green-custom">₹0</div>
              <div className="text-sm font-medium">Total Revenue Opportunity Today</div>
              <div className="text-xs text-gray-500">Based on today&apos;s served guests</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-soft rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Export Data</h3>
            <p className="text-xs text-gray-500">
              Download today&apos;s customer data as a CSV file for your records.
            </p>
            <button className="flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-white py-3 rounded-lg text-sm cursor-pointer">
              <Download className="w-4 h-4" /> Export to CSV
            </button>
          </div>
          <div className="bg-white border border-soft rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <h3 className="text-sm font-semibold">Clear Data</h3>
            <p className="text-xs text-gray-500">
              Remove all customer data from today. This action cannot be undone.
            </p>
            <button className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg text-sm cursor-pointer">
              <Trash2 className="w-4 h-4" /> Clear Today&apos;s Data
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-soft rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button className="flex items-center justify-center gap-2 border border-soft py-3 rounded-lg hover:bg-gray-50 text-sm cursor-pointer">
              <Users className="w-4 h-4" /> Add Customer
            </button>
            <button className="flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-white py-3 rounded-lg text-sm cursor-pointer">
              <Clock className="w-4 h-4" /> View Queue
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-light hover:bg-gray-200 py-3 rounded-lg text-sm cursor-pointer">
              <Settings className="w-4 h-4" /> Analytics
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}