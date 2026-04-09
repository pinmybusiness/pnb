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

const formatDuration = (value) => {
  if (!value) return "0m 0s";
  let totalSeconds = 0;
  if (typeof value === "number") {
    totalSeconds = value;
  } else if (typeof value === "string") {
    const parts = value.split(":").map(Number);
    if (parts.length === 3) totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    else if (parts.length === 2) totalSeconds = parts[0] * 60 + parts[1];
    else totalSeconds = parts[0] || 0;
  }
  if (totalSeconds <= 0) return "0m 0s";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

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
      <div className="flex flex-col items-center text-center gap-2">
        <div className="p-2 rounded-lg">
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-xs text-gray-500 leading-tight">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-3 z-50">
      <Card className="w-full max-w-3xl">

        {/* Header + Period in one row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <UserAvatar name={member.userName} className="w-9 h-9" />
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">{member.name}</h2>
              <p className="text-xs text-gray-500">{member.mobile || 'No mobile number'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {PERIOD_OPTIONS.map((option) => (
                <Button
                  key={option.key}
                  variant={period === option.key ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setPeriod(option.key)}
                  className="text-xs px-3 py-1"
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <button
              onClick={onClose}
              className="ml-1 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Stats Content */}
        <div className="p-4">
          {detailsLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary border-gray-400"></div>
              <span className="ml-3 text-sm text-gray-600">Loading statistics...</span>
            </div>
          ) : memberStats ? (
            <div className="space-y-3">

              {/* Summary Cards — horizontal compact */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: Phone,       label: "Total Calls",    value: memberStats.totalCalls || 0,                        color: "blue" },
                  { icon: CheckCircle, label: "Successful",     value: successfulCalls,                                    color: "green" },
                  { icon: Clock,       label: "Talk Time",      value: formatDuration(memberStats?.totalTalkTime),         color: "purple" },
                  { icon: BarChart3,   label: "Avg Duration",   value: formatDuration(memberStats?.avgCallDuration),       color: "blue" },
                ].map(({ icon: Icon, label, value, color }) => {
                  const cls = { blue: "text-blue-600 bg-blue-50 border-blue-200", green: "text-green-600 bg-green-50 border-green-200", purple: "text-purple-600 bg-purple-50 border-purple-200" };
                  return (
                    <Card key={label} className={`p-3 border-2 ${cls[color]}`}>
                      <div className="flex flex-col items-center text-center gap-1">
                        <Icon className="h-4 w-4" />
                        <p className="text-[11px] text-gray-500 leading-tight">{label}</p>
                        <p className="text-xl font-bold text-gray-900">{value}</p>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Incoming + Outgoing */}
              <div className="grid grid-cols-2 gap-3">
                {/* Incoming */}
                <Card className="p-3 border-2 border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-green-50 rounded-lg">
                      <PhoneIncoming className="h-4 w-4 text-green-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">Incoming Calls</h4>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <DetailRow label="Total" value={memberStats.incoming?.total || 0} />
                    <DetailRow label="Answered" value={memberStats.incoming?.answered || 0} variant="success" />
                    <DetailRow label="Missed" value={memberStats.incoming?.missed || 0} variant="danger" />
                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-xs text-gray-600">Answer Rate</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-14 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${Math.min(incomingAnswerRate, 100)}%` }} />
                        </div>
                        <span className="text-xs font-bold text-blue-600">{incomingAnswerRate}%</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Outgoing */}
                <Card className="p-3 border-2 border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-purple-50 rounded-lg">
                      <PhoneOutgoing className="h-4 w-4 text-purple-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">Outgoing Calls</h4>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <DetailRow label="Total" value={memberStats.outgoing?.total || 0} />
                    <DetailRow label="Connected" value={memberStats.outgoing?.answered || 0} variant="success" />
                    <DetailRow label="Failed" value={memberStats.outgoing?.missed || 0} variant="danger" />
                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-xs text-gray-600">Connect Rate</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-14 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${Math.min(outgoingConnectRate, 100)}%` }} />
                        </div>
                        <span className="text-xs font-bold text-blue-600">{outgoingConnectRate}%</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Period Info */}
              <p className="text-center text-xs text-gray-400 pt-1">
                Showing data for <span className="font-medium text-gray-600">{PERIOD_OPTIONS.find(p => p.key === period)?.label.toLowerCase()}</span>
              </p>
            </div>
          ) : (
            <div className="text-center py-10">
              <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No detailed statistics available</p>
              <p className="text-xs text-gray-400 mt-1">Select a different period or try again</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MemberDetailsModal;