'use client';

import { useState, useCallback, useMemo } from "react";
import apiClient from "@/lib/apiClient";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  CheckCircle,
  BarChart3,
  FileText,
  X,
  Clock
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Card,
  Button
} from "@/components/ui";

const PERIOD_OPTIONS = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" }
];

// Separate UserAvatar Component
const UserAvatar = ({ name, className = "w-8 h-8" }) => (
  <div className={`flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold ${className}`}>
    {(name || 'U').charAt(0).toUpperCase()}
  </div>
);

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color = "blue", className = "" }) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    green: "text-green-600 bg-green-50 border-green-200",
    purple: "text-purple-600 bg-purple-50 border-purple-200",
  };

  return (
    <Card className={`p-4 border-2 ${colorClasses[color]} ${className}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
};

// Detail Row Component
const DetailRow = ({ label, value, variant = "default" }) => {
  const variantClasses = {
    default: "text-gray-900",
    success: "text-green-600 font-semibold",
    danger: "text-red-600 font-semibold",
  };

  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-600">{label}</span>
      <span className={`font-medium ${variantClasses[variant]}`}>{value}</span>
    </div>
  );
};

const MemberDetailsModal = ({ member, onClose }) => {
  const [period, setPeriod] = useState("today");
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [memberStats, setMemberStats] = useState(null);

  // Fetch individual member stats
  const fetchMemberStats = useCallback(async () => {
    if (!member || !member.userId) return;
    
    try {
      setDetailsLoading(true);
      const { data } = await apiClient.get(`/api/v1/calls/team/member-call-counts`, {
        params: { userId: member.userId, period }
      });
      
      if (data.success) {
        setMemberStats(data.data);
      } else {
        toast.error(data.message || "Failed to load member stats");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load member stats");
    } finally {
      setDetailsLoading(false);
    }
  }, [member, period]);

  // Fetch stats when modal opens or period changes
  useMemo(() => {
    if (member) {
      fetchMemberStats();
    }
  }, [member, period, fetchMemberStats]);

  if (!member) return null;

  // Calculate derived stats
  const successfulCalls = (memberStats?.incoming?.answered || 0) + (memberStats?.outgoing?.answered || 0);
  const overallSuccessRate = memberStats?.totalCalls > 0 
    ? Math.round(successfulCalls / memberStats.totalCalls * 100)
    : 0;
  
  const incomingAnswerRate = memberStats?.incoming?.total > 0 
    ? Math.round((memberStats.incoming.answered / memberStats.incoming.total) * 100)
    : 0;
    
  const outgoingConnectRate = memberStats?.outgoing?.total > 0 
    ? Math.round((memberStats.outgoing.answered / memberStats.outgoing.total) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-400">
          <div className="flex items-center gap-4">
            <UserAvatar name={member.userName} className="w-12 h-12" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{member.name}</h2>
              <p className="text-sm text-gray-500">{member.mobile || 'No mobile number'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Period Selector */}
        <div className="p-6 border-b border-gray-400">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Performance Statistics</h3>
              <p className="text-sm text-gray-500">Detailed call analytics</p>
            </div>
            <div className="flex gap-2">
              {PERIOD_OPTIONS.map((option) => (
                <Button
                  key={option.key}
                  variant={period === option.key ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setPeriod(option.key)}
                  className="flex-1 sm:flex-none"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Content */}
        <div className="p-6">
          {detailsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary border-gray-400"></div>
              <span className="ml-3 text-gray-600">Loading statistics...</span>
            </div>
          ) : memberStats ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  icon={Phone}
                  label="Total Calls Handled"
                  value={memberStats.totalCalls || 0}
                  color="blue"
                />
                <StatCard
                  icon={CheckCircle}
                  label="Successful Calls"
                  value={successfulCalls}
                  color="green"
                />
                <StatCard
                  icon={Clock}
                  label="Avg Call Duration"
                  value={memberStats?.avgCallDuration || "0:00"}
                  color="purple"
                />
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Incoming Calls Breakdown */}
                <Card className="p-6 border-2 border-green-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <PhoneIncoming className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Incoming Calls</h4>
                      <p className="text-sm text-gray-500">Received call performance</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <DetailRow 
                      label="Total Incoming" 
                      value={memberStats.incoming?.total || 0} 
                    />
                    <DetailRow 
                      label="Answered" 
                      value={memberStats.incoming?.answered || 0}
                      variant="success"
                    />
                    <DetailRow 
                      label="Missed" 
                      value={memberStats.incoming?.missed || 0}
                      variant="danger"
                    />
                    
                    <div className="pt-4 border-t border-gray-400 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Answer Rate</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500"
                              style={{ width: `${Math.min(incomingAnswerRate, 100)}%` }}
                            />
                          </div>
                          <span className="font-bold text-blue-600">{incomingAnswerRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Outgoing Calls Breakdown */}
                <Card className="p-6 border-2 border-purple-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <PhoneOutgoing className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Outgoing Calls</h4>
                      <p className="text-sm text-gray-500">Initiated call performance</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <DetailRow 
                      label="Total Outgoing" 
                      value={memberStats.outgoing?.total || 0} 
                    />
                    <DetailRow 
                      label="Connected" 
                      value={memberStats.outgoing?.answered || 0}
                      variant="success"
                    />
                    <DetailRow 
                      label="Failed" 
                      value={memberStats.outgoing?.missed || 0}
                      variant="danger"
                    />
                    
                    <div className="pt-4 border-t border-gray-400 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Connect Rate</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500"
                              style={{ width: `${Math.min(outgoingConnectRate, 100)}%` }}
                            />
                          </div>
                          <span className="font-bold text-blue-600">{outgoingConnectRate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Period Info */}
              <div className="text-center pt-4 border-t border-gray-400">
                <p className="text-sm text-gray-500">
                  Showing data for <span className="font-medium text-gray-700">
                    {PERIOD_OPTIONS.find(p => p.key === period)?.label.toLowerCase()}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No detailed statistics available</p>
              <p className="text-sm text-gray-400 mt-2">Select a different period or try again</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MemberDetailsModal;