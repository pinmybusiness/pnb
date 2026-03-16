"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  CheckCircle,
  BarChart3,
  FileText,
  X,
  Clock,
  Mail,
  Calendar,
  User,
  Star
} from "lucide-react";

// ─── Orange color constant ─────────────────────────────────────────────
const ORANGE = "#ff5a1f";

// ─── Period Options ──────────────────────────────────────────────
const PERIOD_OPTIONS = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" }
];

// ─── Stat Card Component ─────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${colorClasses[color]} hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/50">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

// ─── Detail Row Component ────────────────────────────────────────
const DetailRow = ({ label, value, variant = "default" }) => {
  const variantClasses = {
    default: "text-gray-900",
    success: "text-green-600 font-semibold",
    danger: "text-red-600 font-semibold",
  };

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`text-sm font-medium ${variantClasses[variant]}`}>{value}</span>
    </div>
  );
};

// ─── User Avatar Component ───────────────────────────────────────
const UserAvatar = ({ name, className = "w-12 h-12" }) => (
  <div className={`flex-shrink-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-lg font-bold ${className}`}>
    {(name || 'U').charAt(0).toUpperCase()}
  </div>
);

// ─── Main Member Details Modal ───────────────────────────────────
const MemberDetailsModal = ({ member, isOpen, onClose }) => {
  const [period, setPeriod] = useState("today");
  const [loading, setLoading] = useState(false);
  const [memberStats, setMemberStats] = useState(null);

  // Mock stats based on period
  useEffect(() => {
    if (!member || !isOpen) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate random stats based on member data
      const totalCalls = member.totalCalls || 0;
      const answered = member.connected || 0;
      const missed = member.missed || 0;
      
      // Different multipliers for different periods
      const multipliers = {
        today: 0.1,
        yesterday: 0.15,
        week: 0.6,
        month: 1
      };
      
      const multiplier = multipliers[period] || 0.5;
      
      const stats = {
        totalCalls: Math.round(totalCalls * multiplier),
        incoming: {
          total: Math.round(member.incoming * multiplier),
          answered: Math.round((member.incoming - member.missed) * multiplier * 0.8),
          missed: Math.round(member.missed * multiplier * 0.7)
        },
        outgoing: {
          total: Math.round(member.outgoing * multiplier),
          answered: Math.round(member.connected * multiplier * 0.9),
          missed: Math.round((member.outgoing - member.connected) * multiplier * 0.6)
        },
        avgCallDuration: "3:45",
        totalDuration: "45:30"
      };
      
      setMemberStats(stats);
      setLoading(false);
    }, 800);
  }, [member, period, isOpen]);

  if (!isOpen || !member) return null;

  // Calculate rates
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Modal Header with Gradient */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <UserAvatar name={member.name} className="w-16 h-16 border-4 border-white/30" />
              <div>
                <h2 className="text-2xl font-bold mb-1">{member.name}</h2>
                <div className="flex items-center gap-3 text-sm text-orange-100">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {member.email || "No email"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {member.mobile || "No mobile"}
                  </span>
                </div>
               
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Select Period:</span>
            </div>
            <div className="flex gap-2">
              {PERIOD_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setPeriod(option.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    period === option.key
                      ? "bg-orange-600 text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
              <p className="text-sm text-gray-500">Loading member statistics...</p>
            </div>
          ) : memberStats ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  icon={Phone}
                  label="Total Calls"
                  value={memberStats.totalCalls}
                  color="blue"
                />
                <StatCard
                  icon={CheckCircle}
                  label="Successful"
                  value={successfulCalls}
                  color="green"
                />
                <StatCard
                  icon={Clock}
                  label="Avg Duration"
                  value={memberStats.avgCallDuration}
                  color="purple"
                />
              </div>


              {/* Detailed Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Incoming Calls */}
                <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <PhoneIncoming className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Incoming Calls</h3>
                  </div>
                  <div className="space-y-2">
                    <DetailRow label="Total" value={memberStats.incoming.total} />
                    <DetailRow label="Answered" value={memberStats.incoming.answered} variant="success" />
                    <DetailRow label="Missed" value={memberStats.incoming.missed} variant="danger" />
                    <div className="pt-2 mt-2 border-t border-blue-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Answer Rate</span>
                        <span className="text-sm font-bold text-blue-600">{incomingAnswerRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outgoing Calls */}
                <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <PhoneOutgoing className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Outgoing Calls</h3>
                  </div>
                  <div className="space-y-2">
                    <DetailRow label="Total" value={memberStats.outgoing.total} />
                    <DetailRow label="Connected" value={memberStats.outgoing.answered} variant="success" />
                    <DetailRow label="Failed" value={memberStats.outgoing.missed} variant="danger" />
                    <div className="pt-2 mt-2 border-t border-purple-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Connect Rate</span>
                        <span className="text-sm font-bold text-purple-600">{outgoingConnectRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  Total Talk Time: {memberStats.totalDuration}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-gray-400" />
                  Joined: {member.joinDate || "N/A"}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Statistics Available</h3>
              <p className="text-sm text-gray-500">No call data found for this period</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDetailsModal;