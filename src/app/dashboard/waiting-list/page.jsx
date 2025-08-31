"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Phone, Clock, CheckCircle, Plus, BarChart3, X } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchCustomers, 
  markCustomerAsServed, 
  markCustomerAsLeft 
} from "@/store/customerSlice";

const WaitingList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items: waitingList, loading, error } = useSelector((state) => state.customers);
  const { user } = useSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentBranch = user?.branch;

  useEffect(() => {
    if (currentBranch) {
      dispatch(fetchCustomers(currentBranch));
    }
  }, [dispatch, currentBranch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const formatWaitTime = (timestamp) => {
    const start = new Date(timestamp);
    const diff = Math.floor((currentTime - start) / 1000);
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return `${m}m ${s}s`;
  };

  const handleMarkAsServed = async (id) => {
    try {
      await dispatch(markCustomerAsServed(id)).unwrap();
      toast.success("Customer has been marked as served!");
      
      // Refresh the waiting list after marking as served
      if (currentBranch && currentBranch) {
        dispatch(fetchCustomers(currentBranch));
      }
    } catch (error) {
      toast.error(error || "Failed to mark as served");
    }
  };

  const handleMarkAsLeft = async (id) => {
    try {
      await dispatch(markCustomerAsLeft(id)).unwrap();
      toast.error("Customer left without service!");
      
      // Refresh the waiting list after marking as left
      if (currentBranch && currentBranch) {
        dispatch(fetchCustomers(currentBranch));
      }
    } catch (error) {
      toast.error(error || "Failed to mark as left");
    }
  };

  const getWaitTimeColor = (timestamp) => {
    const minutes = Math.floor((currentTime - new Date(timestamp)) / 60000);
    if (minutes > 10) return "text-red-600 font-bold";
    if (minutes > 5) return "text-orange-500 font-medium";
    return "text-gray-500";
  };

  if (!currentBranch) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700">No branch selected</h3>
          <p className="text-gray-500">Please select a branch to view the waiting list</p>
        </div>
      </div>
    );
  }

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
            <p className="text-sm text-primary font-medium">
              Branch: {currentBranch.name}
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/entry")}
            className="p-2 rounded-full bg-primary hover:opacity-90 text-primary-foreground transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-600">Error loading waiting list: {error}</p>
            <button
              onClick={() => currentBranch._id && dispatch(fetchCustomers(currentBranch._id))}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Waiting List */}
        <div className="space-y-4">
          {!loading && !error && waitingList.length === 0 ? (
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
                key={customer._id}
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
                    <span className={`font-medium ${getWaitTimeColor(customer.createdAt)}`}>
                      Waiting: {formatWaitTime(customer.createdAt)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarkAsServed(customer._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as Served
                    </button>
                    <button
                      onClick={() => handleMarkAsLeft(customer._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
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
            onClick={() => router.push("/dashboard/analytics")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-dark"
          >
            <BarChart3 className="w-4 h-4 text-primary" />
            Analytics
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingList;