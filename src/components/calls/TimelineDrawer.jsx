'use client';

import { useState } from "react";
import { 
  Phone, X, PhoneCall, PhoneMissed, PhoneIncoming, 
  PhoneOutgoing, Clock, History, Loader2, CalendarDays 
} from "lucide-react";

// Utils (same as parent)
const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata"
  });
};

const formatDateOnly = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata"
  });
};

// Skeleton Loader (moved from parent)
const TimelineSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="relative pl-8">
          <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 to-gray-300"></div>
          <div className="absolute left-0 top-3 w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 rounded-2xl p-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="h-8 bg-gray-100 rounded w-3/4 mb-3"></div>
            <div className="flex gap-2 mb-3">
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              <div className="h-6 bg-gray-200 rounded-full w-24"></div>
            </div>
            <div className="h-4 bg-gray-100 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Empty State Component
const EmptyTimelineState = ({ phone }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="relative mb-8">
      <div className="w-32 h-32 bg-gradient-to-br from-orange-50 to-orange-100 rounded-full flex items-center justify-center">
        <div className="relative">
          <Phone className="w-16 h-16 text-orange-300 animate-pulse" />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
            <X className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Call History Found</h3>
    <p className="text-gray-600 mb-6 max-w-md">
      This customer <span className="font-bold text-[#FF5211]">{phone}</span> hasn't made any calls yet.
    </p>

    <div className="bg-gradient-to-r from-orange-50 to-white border-2 border-orange-100 rounded-2xl p-6 mb-8 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <CalendarDays className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Phone Number</div>
            <div className="text-lg font-bold text-gray-900 font-mono">{phone}</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-500">Total Calls</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">0</div>
          <div className="text-sm text-gray-500">Agents</div>
        </div>
      </div>
    </div>
  </div>
);

// Main TimelineDrawer Component
const TimelineDrawer = ({ 
  isOpen, 
  onClose, 
  timeline, 
  timelineSummary, 
  activePhone, 
  customerName, 
  isLoading 
}) => {
  // Calculate stats
  const calculateStats = () => {
    if (isLoading || timeline.length === 0) {
      return {
        totalCalls: 0,
        answeredCalls: 0,
        missedCalls: 0,
        answerRate: 0,
        totalDuration: 0,
        avgDuration: 0,
        firstCall: null,
        lastCall: null
      };
    }

    const answeredCalls = timeline.filter(c => c.answered).length;
    const missedCalls = timeline.filter(c => !c.answered).length;
    const answerRate = timeline.length > 0 ? (answeredCalls / timeline.length) * 100 : 0;
    
    const totalDuration = timeline.reduce((sum, call) => sum + (call.duration || 0), 0);
    const avgDuration = timeline.length > 0 ? Math.round(totalDuration / timeline.length) : 0;
    
    const callsWithDate = timeline.filter(c => c.startTimeIST);
    const firstCall = callsWithDate.length > 0 
      ? new Date(Math.min(...callsWithDate.map(c => new Date(c.startTimeIST).getTime())))
      : null;
    const lastCall = callsWithDate.length > 0 
      ? new Date(Math.max(...callsWithDate.map(c => new Date(c.startTimeIST).getTime())))
      : null;

    return {
      totalCalls: timeline.length,
      answeredCalls,
      missedCalls,
      answerRate,
      totalDuration,
      avgDuration,
      firstCall,
      lastCall
    };
  };

  const stats = calculateStats();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full sm:w-[500px] h-full bg-white shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#FF5211] to-orange-600 text-white p-6 shadow-lg z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-1">
                {customerName || "Customer"}
              </h3>
              <div className="text-sm text-white/90 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {activePhone}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : stats.totalCalls}
              </div>
              <div className="text-xs text-white/90 font-medium">Total Calls</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : `${Math.round(stats.answerRate)}%`}
              </div>
              <div className="text-xs text-white/90 font-medium">Answer Rate</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                ) : timelineSummary?.uniqueAgentsCount || "1"}
              </div>
              <div className="text-xs text-white/90 font-medium">Agents</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <TimelineSkeleton />
          ) : timeline.length === 0 ? (
            <EmptyTimelineState phone={activePhone} />
          ) : (
            <>
              {/* Timeline Summary Card */}
              <div className="bg-gradient-to-r from-orange-50 to-white border-2 border-orange-100 rounded-2xl p-6 mb-8 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-xs text-gray-500">Activity Period</div>
                    <div className="text-sm font-bold text-gray-900">
                      {stats.firstCall && stats.lastCall 
                        ? `${formatDateOnly(stats.firstCall)} - ${formatDateOnly(stats.lastCall)}`
                        : "N/A"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">Avg Duration</div>
                    <div className="text-sm font-bold text-gray-900">
                      {Math.floor(stats.avgDuration / 60)}m {stats.avgDuration % 60}s
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Items */}
              <div className="space-y-6">
                <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-[#FF5211]" />
                  Call History
                </h4>
                
                <div className="space-y-4">
                  {timeline.map((call, i) => (
                    <div key={i} className="relative pl-8">
                      {/* Timeline Line */}
                      {i !== timeline.length - 1 && (
                        <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-[#FF5211] to-orange-600"></div>
                      )}
                      
                      {/* Timeline Dot */}
                      <div className={`absolute left-0 top-3 w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
                        call.answered 
                          ? "bg-gradient-to-br from-green-500 to-green-600" 
                          : "bg-gradient-to-br from-red-500 to-red-600"
                      }`}>
                        {call.answered ? (
                          <PhoneCall className="w-3 h-3 text-white" />
                        ) : (
                          <PhoneMissed className="w-3 h-3 text-white" />
                        )}
                      </div>

                      {/* Call Card */}
                      <div className="bg-white border-2 border-orange-100 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        {/* Time */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(call.startTime)}
                        </div>

                        {/* Agent */}
                        {call.userId && (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                              {(call.userId?.name || "?").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900">
                                {call.userId?.name || "Unknown Agent"}
                              </div>
                              <div className="text-xs text-gray-500">Agent</div>
                            </div>
                          </div>
                        )}

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full ${
                            call.answered 
                              ? "bg-green-100 text-green-700" 
                              : "bg-red-100 text-red-700"
                          }`}>
                            {call.answered ? <PhoneCall className="w-3 h-3" /> : <PhoneMissed className="w-3 h-3" />}
                            {call.answered ? "Answered" : "Missed"}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                            {call.inbound ? <PhoneIncoming className="w-3 h-3" /> : <PhoneOutgoing className="w-3 h-3" />}
                            {call.inbound ? "Incoming" : "Outgoing"}
                          </span>
                          {call.duration && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                              <Clock className="w-3 h-3" />
                              {Math.floor(call.duration / 60)}m {call.duration % 60}s
                            </span>
                          )}
                        </div>

                        {/* Recording */}
                        {call.recordingUrl && (
                          <audio controls className="w-full mb-3 rounded-lg">
                            <source src={call.recordingUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineDrawer;