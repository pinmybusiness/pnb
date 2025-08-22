"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Phone, Clock, CheckCircle, Plus, BarChart3, X } from "lucide-react";
import toast from "react-hot-toast";

const WaitingList = () => {
  const router = useRouter();
  const [waitingList, setWaitingList] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("waitingList") || "[]");
    setWaitingList(saved.filter(c => !c.served && !c.leftWithoutService));

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatWaitTime = (timestamp) => {
    const start = new Date(timestamp);
    const diff = Math.floor((currentTime - start) / 1000);
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return `${m}m ${s}s`;
  };

  const markAsServed = (id) => {
    const updated = waitingList.filter(c => c.id !== id);
    setWaitingList(updated);

    const all = JSON.parse(localStorage.getItem("waitingList") || "[]");
    const newAll = all.map(c => c.id === id ? { ...c, served: true } : c);
    localStorage.setItem("waitingList", JSON.stringify(newAll));

    toast.success("Customer has been marked as served!");
  };

  const markAsLeft = (id) => {
    const updated = waitingList.filter(c => c.id !== id);
    setWaitingList(updated);

    const all = JSON.parse(localStorage.getItem("waitingList") || "[]");
    const newAll = all.map(c => c.id === id ? { ...c, leftWithoutService: true } : c);
    localStorage.setItem("waitingList", JSON.stringify(newAll));

    toast.error("Customer left without service!");
  };

  const getWaitTimeColor = (timestamp) => {
    const minutes = Math.floor((currentTime - new Date(timestamp)) / 60000);
    if (minutes > 10) return "text-red-600";
    if (minutes > 5) return "text-primary"; // orange for warning
    return "text-gray-500";
  };

  return (
     <div className="space-y-6 animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark">Waiting List</h1>
            <p className="text-gray-500">
              {waitingList.length} customer{waitingList.length !== 1 ? "s" : ""} waiting
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/entry")}
            className="p-2 rounded-full bg-primary hover:opacity-90 text-primary-foreground transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Waiting List */}
        <div className="space-y-4">
          {waitingList.length === 0 ? (
            <div className="bg-white shadow rounded-xl p-8 text-center border border-soft">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-dark">No customers waiting</h3>
              <p className="text-gray-500 mb-4">Add new customers to get started</p>
              <button
                onClick={() => router.push("/dashboard/entry")}
                className="px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition"
              >
                Add Customer
              </button>
            </div>
          ) : (
            waitingList.map((customer, index) => (
              <div
                key={customer.id}
                className="bg-white shadow rounded-xl p-4 hover:shadow-md transition border border-soft"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-dark">{customer.customerName}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {customer.adults + customer.children}
                          {customer.children > 0 && ` (${customer.children} kids)`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {customer.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className={`font-medium ${getWaitTimeColor(customer.timestamp)}`}>
                      Waiting: {formatWaitTime(customer.timestamp)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => markAsServed(customer.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-custom hover:opacity-90 text-white rounded-lg text-sm transition"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as Served
                    </button>
                    <button
                      onClick={() => markAsLeft(customer.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary hover:opacity-90 text-white rounded-lg text-sm transition"
                    >
                      <X className="w-4 h-4" />
                      Mark as Left
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/analytics")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-soft rounded-lg hover:bg-gray-50 transition text-dark"
          >
            <BarChart3 className="w-4 h-4 text-primary" />
            Analytics
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingList;
