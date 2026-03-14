"use client";

import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Users, Clock, AlertCircle, TrendingUp, TrendingDown, UserCheck, UserX } from "lucide-react";

// ─── Orange color constant ─────────────────────────────────────────────
const ORANGE = "#ff5a1f";

// ─── Dashboard Screen ──────────────────────────────────────────
export const DashboardScreen = () => {
  // Realistic data calculations based on 2,324 total calls
  const totalCalls = 2324;
  const inbound = 1542; // 66.3% of total
  const outbound = 782; // 33.7% of total
  const answered = 1892; // 81.4% answer rate
  const missed = totalCalls - answered; // 432 missed calls
  
  // Calculate percentages
  const answerRate = ((answered / totalCalls) * 100).toFixed(1);
  const missedRate = ((missed / totalCalls) * 100).toFixed(1);
  const inboundPercentage = ((inbound / totalCalls) * 100).toFixed(1);
  const outboundPercentage = ((outbound / totalCalls) * 100).toFixed(1);
  
  // Average handle time in seconds (realistic: 3-5 minutes)
  const avgHandleTime = "4:32";
  
  // Follow-ups pending (typically 15-20% of missed calls)
  const pendingFollowups = 87;
  
  // Spam numbers identified
  const spamNumbers = 24;

  return (
    <div className="space-y-6">
      {/* Header with date range */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Agent Performance Dashboard</h2>
        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200">
          Last 30 days • Updated just now
        </div>
      </div>
      
      {/* Stats Cards Row 1 - Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Calls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Calls</p>
              <p className="text-2xl font-bold text-gray-900">{totalCalls.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Phone size={24} color={ORANGE} />
            </div>
          </div>
        </div>

        {/* Answered Calls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Answered</p>
              <p className="text-2xl font-bold text-gray-900">{answered.toLocaleString()}</p>

            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
              <UserCheck size={24} color="#10b981" />
            </div>
          </div>
        </div>

        {/* Missed Calls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Missed</p>
              <p className="text-2xl font-bold text-gray-900">{missed.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center">
              <UserX size={24} color="#f43f5e" />
            </div>
          </div>
        </div>

        {/* Avg Duration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">{avgHandleTime}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock size={24} color="#3b82f6" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row 2 - Call Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Inbound Calls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Inbound</p>
              <p className="text-xl font-bold text-gray-900">{inbound.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">{inboundPercentage}% of total</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <PhoneIncoming size={20} color="#10b981" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Answered: {(inbound * 0.85).toFixed(0)}</span>
              <span className="text-gray-500">Missed: {(inbound * 0.15).toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Outgoing Calls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Outgoing</p>
              <p className="text-xl font-bold text-gray-900">{outbound.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">{outboundPercentage}% of total</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <PhoneOutgoing size={20} color="#f59e0b" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Connected: {(outbound * 0.75).toFixed(0)}</span>
              <span className="text-gray-500">Failed: {(outbound * 0.25).toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Pending Follow-ups */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Follow-ups</p>
              <p className="text-xl font-bold text-gray-900">{pendingFollowups}</p>
              <p className="text-xs text-amber-600 mt-1">Requires attention</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertCircle size={20} color="#f59e0b" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              {Math.round(pendingFollowups / missed * 100)}% of missed calls
            </div>
          </div>
        </div>

        {/* Spam Numbers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Spams</p>
              <p className="text-xl font-bold text-gray-900">{spamNumbers}</p>
              <p className="text-xs text-gray-400 mt-1">Blocked this month</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users size={20} color="#8b5cf6" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              +8 new this week
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions and Statistics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions - Left Column */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-base font-medium text-gray-700 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button className="text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <span className="font-medium text-gray-800">View Team Performance</span>
              <p className="text-xs text-gray-400 mt-1">Compare agent metrics</p>
            </button>
            <button className="text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-800">Manage Follow-ups</span>
                <p className="text-xs text-gray-400 mt-1">Pending callbacks</p>
              </div>
              <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-medium">{pendingFollowups}</span>
            </button>
            <button className="text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-800">Spams</span>
                <p className="text-xs text-gray-400 mt-1">Review blocked calls</p>
              </div>
              <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">{spamNumbers}</span>
            </button>
            <button className="text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <span className="font-medium text-gray-800">Call Queue Overview</span>
              <p className="text-xs text-gray-400 mt-1">Current wait time: 2 min</p>
            </button>
          </div>
        </div>

        {/* Statistics - Right Column with more details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-base font-medium text-gray-700 mb-4">Key Statistics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-500">Answer Rate</span>
                <span className="font-medium text-gray-800">{answerRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${answerRate}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-500">Missed Rate</span>
                <span className="font-medium text-gray-800">{missedRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${missedRate}%` }}></div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Avg Handle Time</span>
                <span className="font-medium text-gray-800">{avgHandleTime}</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen; 