"use client";

import { Filter, Download, Play, X } from "lucide-react";
import { useState, useMemo } from "react";
import * as XLSX from 'xlsx';

// ─── Color (orange primary) ─────────────────────────────────────────────
const ORANGE = "#ff5a1f";

// ─── Demo Call Log Data (Safe for Client Demo) ───────────────────────
const CALL_LOG_DATA = [
  {
    id: 1,
    // caller: "Bright Future Academy",
    phone: "8745621903",
    agent: "Amit",
    direction: "incoming",
    status: "Answered",
    duration: "1:32",
    time: "08:42 pm",
    date: "13/03/26",
    recording: true,
  },
  {
    id: 2,
    caller: "Rahul Verma",
    phone: "9124785631",
    agent: "Neha",
    direction: "outgoing",
    status: "Answered",
    duration: "0:54",
    time: "08:30 pm",
    date: "13/03/26",
    recording: true,
  },
  {
    id: 3,
    // caller: "Global Tech Institute",
    phone: "9356124708",
    agent: "Amit",
    direction: "incoming",
    status: "Missed",
    duration: "0:00",
    time: "08:12 pm",
    date: "13/03/26",
    recording: false,
  },
  {
    id: 4,
    caller: "Sneha Sharma",
    phone: "9013475628",
    agent: "Rohit",
    direction: "incoming",
    status: "Answered",
    duration: "2:05",
    time: "07:58 pm",
    date: "13/03/26",
    recording: true,
  },
  {
    id: 5,
    caller: "Sunrise Coaching",
    phone: "8801452369",
    agent: "Neha",
    direction: "outgoing",
    status: "Missed",
    duration: "0:00",
    time: "07:45 pm",
    date: "13/03/26",
    recording: false,
  },
  {
    id: 6,
    caller: "Arjun Patel",
    phone: "9784512367",
    agent: "Amit",
    direction: "incoming",
    status: "Answered",
    duration: "0:48",
    time: "07:30 pm",
    date: "13/03/26",
    recording: true,
  },
  {
    id: 7,
    caller: "Future Skills Hub",
    phone: "9145623780",
    agent: "Rohit",
    direction: "incoming",
    status: "Answered",
    duration: "1:15",
    time: "07:18 pm",
    date: "13/03/26",
    recording: true,
  },
  {
    id: 8,
    caller: "Karan Singh",
    phone: "9874512036",
    agent: "Neha",
    direction: "outgoing",
    status: "Missed",
    duration: "0:00",
    time: "07:05 pm",
    date: "13/03/26",
    recording: false,
  },
  {
    id: 9,
    caller: "NextGen Solutions",
    phone: "9032147856",
    agent: "Amit",
    direction: "incoming",
    status: "Answered",
    duration: "0:26",
    time: "06:50 pm",
    date: "13/03/26",
    recording: true,
  },
  {
    id: 10,
    caller: "Priya Mehta",
    phone: "8912365470",
    agent: "Rohit",
    direction: "outgoing",
    status: "Answered",
    duration: "1:02",
    time: "06:38 pm",
    date: "13/03/26",
    recording: true,
  },
  {
    id: 11,
    caller: "Urban Digital Services",
    phone: "9345612078",
    agent: "Neha",
    direction: "incoming",
    status: "Answered",
    duration: "0:34",
    time: "06:20 pm",
    date: "13/03/26",
    recording: true,
  },
  {
    id: 12,
    caller: "Deepak Kumar",
    phone: "9765123047",
    agent: "Amit",
    direction: "outgoing",
    status: "Missed",
    duration: "0:00",
    time: "06:05 pm",
    date: "13/03/26",
    recording: false,
  },
];

// ─── Main History Screen Component ───────────────────────────────────────
export const HistoryScreen = ({ searchQuery = "" }) => {
  const [search, setSearch] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    agent: "",
    direction: "",
    status: "",
  });
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: "time", // default sort by time
    direction: "desc", // newest first
  });

  // Get unique values for filter dropdowns
  const uniqueAgents = useMemo(() => 
    [...new Set(CALL_LOG_DATA.map(call => call.agent))], []
  );
  
  const uniqueDirections = useMemo(() => 
    [...new Set(CALL_LOG_DATA.map(call => call.direction))], []
  );
  
  const uniqueStatuses = useMemo(() => 
    [...new Set(CALL_LOG_DATA.map(call => call.status))], []
  );

  // Filter and search logic
  const filteredData = useMemo(() => {
    return CALL_LOG_DATA.filter(call => {
      // Search filter (case insensitive)
      const matchesSearch = search === "" || 
        call?.caller?.toLowerCase().includes(search.toLowerCase()) ||
        call?.phone.includes(search) ||
        call?.agent.toLowerCase().includes(search.toLowerCase());
      
      // Dropdown filters
      const matchesAgent = !filters.agent || call.agent === filters.agent;
      const matchesDirection = !filters.direction || call.direction === filters.direction;
      const matchesStatus = !filters.status || call.status === filters.status;
      
      return matchesSearch && matchesAgent && matchesDirection && matchesStatus;
    });
  }, [search, filters]);

  // Sorting logic
  const sortedData = useMemo(() => {
    const sortableItems = [...filteredData];
    
    sortableItems.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Special handling for time + date sorting
      if (sortConfig.key === "time") {
        // Combine date and time for proper chronological sorting
        const getTimestamp = (item) => {
          const [day, month, year] = item.date.split('/');
          const [time, period] = item.time.split(' ');
          const [hours, minutes] = time.split(':');
          
          let hour = parseInt(hours);
          if (period === 'pm' && hour !== 12) hour += 12;
          if (period === 'am' && hour === 12) hour = 0;
          
          return new Date(`20${year}`, month - 1, day, hour, minutes).getTime();
        };
        
        return sortConfig.direction === "asc" 
          ? getTimestamp(a) - getTimestamp(b)
          : getTimestamp(b) - getTimestamp(a);
      }
      
      // Default string comparison
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    
    return sortableItems;
  }, [filteredData, sortConfig]);

  // Handle sort
  const requestSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ agent: "", direction: "", status: "" });
    setSearch("");
  };

  // Export to Excel
  const exportToExcel = () => {
    const exportData = sortedData.map(call => ({
      Caller: call.caller,
      Phone: call.phone,
      Agent: call.agent,
      Direction: call.direction === "incoming" ? "Incoming" : "Outgoing",
      Status: call.status,
      Duration: call.duration,
      Time: call.time,
      Date: call.date,
      "Has Recording": call.recording ? "Yes" : "No"
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Call History");
    
    // Generate filename with current date
    const date = new Date();
    const filename = `call_history_${date.toISOString().split('T')[0]}.xlsx`;
    
    XLSX.writeFile(wb, filename);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header with search and filter */}
        <div className="p-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3">
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by caller, phone or agent..."
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm w-80 pr-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors ${
                showFilters || filters.agent || filters.direction || filters.status
                  ? "bg-orange-100 text-orange-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              style={showFilters || filters.agent || filters.direction || filters.status ? { backgroundColor: '#fff1e6', color: ORANGE } : {}}
            >
              <Filter size={16} /> Filter
              {(filters.agent || filters.direction || filters.status) && (
                <span className="ml-1 w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
                  {Object.values(filters).filter(Boolean).length}
                </span>
              )}
            </button>
            
            {/* Active filters summary */}
            {(filters.agent || filters.direction || filters.status) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X size={16} /> Clear all
              </button>
            )}
          </div>
          
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Download size={16} /> Export Excel
          </button>
        </div>

        {/* Filter dropdowns */}
        {showFilters && (
          <div className="p-5 border-b border-gray-100 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Agent filter */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Agent</label>
                <select
                  value={filters.agent}
                  onChange={(e) => setFilters(prev => ({ ...prev, agent: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                >
                  <option value="">All Agents</option>
                  {uniqueAgents.map(agent => (
                    <option key={agent} value={agent}>{agent}</option>
                  ))}
                </select>
              </div>
              
              {/* Direction filter */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Direction</label>
                <select
                  value={filters.direction}
                  onChange={(e) => setFilters(prev => ({ ...prev, direction: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                >
                  <option value="">All Directions</option>
                  {uniqueDirections.map(dir => (
                    <option key={dir} value={dir}>
                      {dir === "incoming" ? "Incoming" : "Outgoing"}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Status filter */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                >
                  <option value="">All Status</option>
                  {uniqueStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Calls table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr className="text-xs text-gray-400 uppercase tracking-wider">
                <th 
                  className="text-left py-4 px-2 pl-5 font-medium cursor-pointer hover:text-gray-600"
                  onClick={() => requestSort("caller")}
                >
                  Caller {getSortIndicator("caller")}
                </th>
                <th 
                  className="text-left py-4 px-2 font-medium cursor-pointer hover:text-gray-600"
                  onClick={() => requestSort("agent")}
                >
                  Agent
                </th>
                <th 
                  className="text-left py-4 px-2 font-medium cursor-pointer hover:text-gray-600"
                  onClick={() => requestSort("direction")}
                >
                  Direction
                </th>
                <th 
                  className="text-left py-4 px-2 font-medium cursor-pointer hover:text-gray-600"
                >
                  Status
                </th>
                <th 
                  className="text-left py-4 px-2 font-medium cursor-pointer hover:text-gray-600"
                >
                  Duration
                </th>
                <th 
                  className="text-left py-4 px-2 font-medium cursor-pointer hover:text-gray-600"
                  onClick={() => requestSort("time")}
                >
                  Call At {getSortIndicator("time")}
                </th>
                <th className="text-left py-4 px-2 font-medium">Recording</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedData.length > 0 ? (
                sortedData.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-50 transition-colors">
                    {/* Caller + Phone */}
                    <td className="py-4 px-2 pl-5">
                    <div className="text-sm font-medium text-gray-900">
                    {(call.caller || "Unknown").length > 7
                        ? (call.caller || "Unknown").slice(0, 7) + ".."
                        : null}
                    </div>

                    <div className="text-xs text-gray-400">
                    {call.phone || "—"}
                    </div>
                    </td>
                    
                    {/* Agent */}
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-700 flex-shrink-0">
                          {call.agent
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <span className="font-medium text-sm">{call.agent}</span>
                      </div>
                    </td>

                    {/* Direction */}
                    <td className="py-4 px-2">
                      <span
                        className={`text-xs px-2 py-1.5 rounded-lg font-medium ${
                          call.direction === "incoming"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {call.direction === "incoming" ? "Incoming" : "Outgoing"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-2">
                      <span
                        className={`text-xs px-2 py-1.5 rounded-lg font-medium ${
                          call.status === "Answered"
                            ? "bg-green-100 text-green-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {call.status}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-2 text-sm font-mono">
                      {call.duration}
                    </td>

                    {/* Call At */}
                    <td className="py-4 px-2">
                      <div className="text-sm font-medium text-gray-700">
                        {call.time}
                      </div>
                      <div className="text-xs text-gray-400">
                        {call.date}
                      </div>
                    </td>

                    {/* Recording */}
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <button
                          disabled={!call.recording}
                          className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border transition ${
                            call.recording
                              ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                              : "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                          }`}
                        >
                          <Play size={14} />
                          Play
                        </button>

                        <button
                          disabled={!call.recording}
                          className={`p-1.5 rounded-md border transition ${
                            call.recording
                              ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                              : "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                          }`}
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500">
                    No calls found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3">
          <span className="text-sm text-gray-400">
            Showing {sortedData.length} of {CALL_LOG_DATA.length} calls
          </span>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button
              className="px-4 py-2 text-sm rounded-lg text-white"
              style={{ backgroundColor: ORANGE }}
            >
              1
            </button>
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Optional default export for convenience
export default HistoryScreen; 