"use client";

import { Filter, Download, Play, X } from "lucide-react";
import { useState, useMemo } from "react";

// ─── Color (orange primary) ─────────────────────────────────────────────
const ORANGE = "#ff5a1f";

// ─── Recording Call Data - Only with recordings ────────────────────────
const RECORDING_DATA = [
  {
    id: 1,
    phone: "8745621903",
    agent: "Amit",
    time: "08:42 pm",
    date: "13/03/26",
    duration: "1:32",
  },
  {
    id: 2,
    phone: "9124785631",
    agent: "Neha",
    time: "08:30 pm",
    date: "13/03/26",
    duration: "0:54",
  },
  {
    id: 4,
    phone: "9013475628",
    agent: "Rohit",
    time: "07:58 pm",
    date: "13/03/26",
    duration: "2:05",
  },
  {
    id: 6,
    phone: "9784512367",
    agent: "Amit",
    time: "07:30 pm",
    date: "13/03/26",
    duration: "0:48",
  },
  {
    id: 7,
    phone: "9145623780",
    agent: "Rohit",
    time: "07:18 pm",
    date: "13/03/26",
    duration: "1:15",
  },
  {
    id: 9,
    phone: "9032147856",
    agent: "Amit",
    time: "06:50 pm",
    date: "13/03/26",
    duration: "0:26",
  },
  {
    id: 10,
    phone: "8912365470",
    agent: "Rohit",
    time: "06:38 pm",
    date: "13/03/26",
    duration: "1:02",
  },
  {
    id: 11,
    phone: "9345612078",
    agent: "Neha",
    time: "06:20 pm",
    date: "13/03/26",
    duration: "0:34",
  },
];

// ─── Main Recording Screen ───────────────────────────────────────
export const RecordingScreen = () => {
  const [search, setSearch] = useState("");
  const [agentFilter, setAgentFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "time",
    direction: "desc",
  });

  // Get unique agents for filter
  const uniqueAgents = useMemo(() => 
    [...new Set(RECORDING_DATA.map(call => call.agent))], []
  );

  // Filter and search logic
  const filteredData = useMemo(() => {
    return RECORDING_DATA.filter(call => {
      const matchesSearch = search === "" || 
        call.phone.includes(search);
      
      const matchesAgent = !agentFilter || call.agent === agentFilter;
      
      return matchesSearch && matchesAgent;
    });
  }, [search, agentFilter]);

  // Sorting logic
  const sortedData = useMemo(() => {
    const sortableItems = [...filteredData];
    
    sortableItems.sort((a, b) => {
      if (sortConfig.key === "time") {
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
      
      if (sortConfig.key === "duration") {
        const getSeconds = (dur) => {
          const [min, sec] = dur.split(':').map(Number);
          return min * 60 + sec;
        };
        return sortConfig.direction === "asc" 
          ? getSeconds(a.duration) - getSeconds(b.duration)
          : getSeconds(b.duration) - getSeconds(a.duration);
      }
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    
    return sortableItems;
  }, [filteredData, sortConfig]);

  const requestSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const clearFilters = () => {
    setSearch("");
    setAgentFilter("");
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
                placeholder="Search by phone number..."
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm w-64 pr-8"
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Agent filter */}
              <div>
                <select
                  value={agentFilter}
                  onChange={(e) => setAgentFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
                >
                  <option value="">All Agents</option>
                  {uniqueAgents.map(agent => (
                    <option key={agent} value={agent}>{agent}</option>
                  ))}
                </select>
              </div>
            </div>

            {(search || agentFilter) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X size={16} /> Clear
              </button>
            )}
          </div>

        </div>

        {/* Results count */}
        <div className="px-5 py-2 bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
          Found {sortedData.length} recordings
        </div>

        {/* Calls table - 4 Columns only */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50">
              <tr className="text-xs text-gray-400 uppercase tracking-wider">
                <th 
                  className="text-left py-4 px-5 font-medium cursor-pointer hover:text-gray-600"
                  onClick={() => requestSort("phone")}
                >
                  Phone Number {getSortIndicator("phone")}
                </th>
                <th 
                  className="text-left py-4 px-5 font-medium cursor-pointer hover:text-gray-600"
                  onClick={() => requestSort("agent")}
                >
                  Agent {getSortIndicator("agent")}
                </th>
                <th 
                  className="text-left py-4 px-5 font-medium cursor-pointer hover:text-gray-600"
                  onClick={() => requestSort("time")}
                >
                  Call At {getSortIndicator("time")}
                </th>
                <th className="text-left py-4 px-5 font-medium">Recording</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedData.length > 0 ? (
                sortedData.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-50 transition-colors">
                    {/* Phone Number */}
                    <td className="py-4 px-5">
                      <div className="text-sm font-medium text-gray-900">
                        {call.phone}
                      </div>
                      <div className="text-xs text-gray-400">
                        Duration: {call.duration}
                      </div>
                    </td>
                    
                    {/* Agent */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
                          {call.agent[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">{call.agent}</span>
                      </div>
                    </td>

                    {/* Call At */}
                    <td className="py-4 px-5">
                      <div className="text-sm font-medium text-gray-700">
                        {call.time}
                      </div>
                      <div className="text-xs text-gray-400">
                        {call.date}
                      </div>
                    </td>

                    {/* Recording */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <button
                          className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-orange-300 transition"
                        >
                          <Play size={14} color={ORANGE} />
                          Play
                        </button>

                        <button
                          className="p-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-orange-300 transition"
                        >
                          <Download size={14} color={ORANGE} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    No recordings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 border-t border-gray-100 flex flex-wrap justify-between items-center gap-3">
          <span className="text-sm text-gray-400">
            Showing {sortedData.length} of {RECORDING_DATA.length} recordings
          </span>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 text-sm rounded-lg text-white" style={{ backgroundColor: ORANGE }}>
              1
            </button>
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingScreen; 