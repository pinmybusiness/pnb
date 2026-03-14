"use client";

import { useState } from "react";
import { 
  Phone, X, PhoneCall, PhoneMissed, PhoneIncoming, 
  PhoneOutgoing, Clock, History, Loader2, Calendar,
  User, ChevronRight
} from "lucide-react";

// ─── Orange color constant ─────────────────────────────────────────────
const ORANGE = "#ff5a1f";

// ─── Format Date Function ──────────────────────────────────────────────
const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-IN", {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// ─── TimelineDrawer Component ──────────────────────────────────────────
const TimelineDrawer = ({ 
  isOpen, 
  onClose, 
  timeline, 
  activePhone, 
  customerName, 
  isLoading 
}) => {
  if (!isOpen) return null;

  // Calculate stats
  const stats = {
    totalCalls: timeline?.length || 0,
    answered: timeline?.filter(c => c.answered).length || 0,
    missed: timeline?.filter(c => !c.answered).length || 0,
    answerRate: timeline?.length > 0 
      ? Math.round((timeline.filter(c => c.answered).length / timeline.length) * 100) 
      : 0
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex justify-end">
      <div className="w-full max-w-md bg-white h-full overflow-y-auto animate-slide-left shadow-2xl">
        {/* Header with Customer Info */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{customerName || "Customer"}</h2>
              <p className="text-orange-100 text-sm mt-1 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {activePhone}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/20 rounded-lg p-3 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold">{stats.totalCalls}</p>
              <p className="text-xs text-orange-100">Total Calls</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold">{stats.answered}</p>
              <p className="text-xs text-orange-100">Answered</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center backdrop-blur-sm">
              <p className="text-2xl font-bold">{stats.missed}</p>
              <p className="text-xs text-orange-100">Missed</p>
            </div>
          </div>

          {/* Answer Rate Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Answer Rate</span>
              <span className="font-bold">{stats.answerRate}%</span>
            </div>
            <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${stats.answerRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="p-5">
          <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
            <History className="w-4 h-4 text-orange-600" />
            Call History
          </h3>

          {isLoading ? (
            // Loading Skeleton
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : timeline?.length > 0 ? (
            // Timeline Items
            <div className="space-y-4">
              {timeline.map((call, index) => (
                <div key={index} className="relative pl-6">
                  {/* Timeline Line */}
                  {index < timeline.length - 1 && (
                    <div className="absolute left-2.5 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                  )}
                  
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 top-2 w-5 h-5 rounded-full flex items-center justify-center ${
                    call.answered ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {call.answered ? (
                      <PhoneCall className="w-3 h-3 text-white" />
                    ) : (
                      <PhoneMissed className="w-3 h-3 text-white" />
                    )}
                  </div>

                  {/* Call Card */}
                  <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    {/* Time */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(call.startTime)}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>

                    {/* Call Details */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Direction Badge */}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          call.inbound 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {call.inbound ? 'Incoming' : 'Outgoing'}
                        </span>

                        {/* Duration */}
                        {call.duration > 0 && (
                          <span className="text-xs text-gray-500">
                            {Math.floor(call.duration / 60)}m {call.duration % 60}s
                          </span>
                        )}
                      </div>

                      {/* Agent */}
                      {call.userId?.name && (
                        <div className="flex items-center gap-1">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                            {call.userId.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs text-gray-600">{call.userId.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Recording Player */}
                    {call.recordingUrl && (
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <audio controls className="w-full h-8">
                          <source src={call.recordingUrl} type="audio/mpeg" />
                        </audio>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-gray-900 font-medium mb-2">No Call History</h4>
              <p className="text-sm text-gray-400">
                This customer hasn't made any calls yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineDrawer;