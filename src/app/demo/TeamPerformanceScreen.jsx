"use client";

import { useState } from "react";
import { Search, Download, MoreVertical, Users, Phone, PhoneOutgoing, PhoneIncoming, PhoneMissed, CheckCircle, XCircle, Eye } from "lucide-react";

// ─── Orange color constant ─────────────────────────────────────────────
const ORANGE = "#ff5a1f";

// ─── Team Member Data ──────────────────────────────────────────
const TEAM_DATA = [
  {
    id: 1,
    name: "Neha",
    initials: "N",
    totalCalls: 237,
    outgoing: 140,
    connected: 92,
    incoming: 97,
    missed: 37,
    status: "active",
    avatarColor: "bg-blue-600",
  },
  {
    id: 2,
    name: "Amit",
    initials: "A",
    totalCalls: 137,
    outgoing: 81,
    connected: 33,
    incoming: 56,
    missed: 19,
    status: "active",
    avatarColor: "bg-green-600",
  },
  {
    id: 3,
    name: "Rohit",
    initials: "R",
    totalCalls: 11,
    outgoing: 10,
    connected: 5,
    incoming: 1,
    missed: 1,
    status: "inactive",
    avatarColor: "bg-gray-500",
  },
];

// ─── Team Performance Screen ──────────────────────────────────────────
export const TeamPerformanceScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Filter team members based on search
  const filteredTeam = TEAM_DATA.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate team totals
  const teamTotals = {
    totalCalls: TEAM_DATA.reduce((sum, member) => sum + member.totalCalls, 0),
    outgoing: TEAM_DATA.reduce((sum, member) => sum + member.outgoing, 0),
    connected: TEAM_DATA.reduce((sum, member) => sum + member.connected, 0),
    incoming: TEAM_DATA.reduce((sum, member) => sum + member.incoming, 0),
    missed: TEAM_DATA.reduce((sum, member) => sum + member.missed, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
                {/* Search Bar */}
        <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
            type="text"
            placeholder="Search by name or mobile number"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={16} />
            Show Export Options
          </button>
          
          {/* Export dropdown */}
          {showExportOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Export as CSV
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Export as Excel
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Print Report
              </button>
            </div>
          )}
        </div>

      </div>


      {/* Team Members Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            {/* Table Header */}
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-xs text-gray-500 uppercase tracking-wider">
                <th className="text-left py-4 px-3 font-medium">Team Member</th>
                <th className="text-left py-4 px-3 font-medium">Calls</th>
                <th className="text-left py-4 px-3 font-medium">Outbound</th>
                <th className="text-left py-4 px-3 font-medium">Connected</th>
                <th className="text-left py-4 px-3 font-medium">Inbound</th>
                <th className="text-left py-4 px-3 font-medium">Missed</th>
                <th className="text-left py-4 px-3 font-medium">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100">
              {filteredTeam.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  {/* Team Member with Avatar */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${member.avatarColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {member.initials}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{member.name}</span>
                      </div>
                    </div>
                  </td>

                  {/* Total Calls */}
                  <td className="py-4 px-3">
                    <span className="font-medium text-gray-900">{member.totalCalls}</span>
                  </td>

                  {/* Outgoing */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <PhoneOutgoing size={14} className="text-blue-500" />
                      <span className="text-sm text-gray-700">{member.outgoing}</span>
                    </div>
                  </td>

                  {/* Connected */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-green-500" />
                      <span className="text-sm text-gray-700">{member.connected}</span>
                    </div>
                  </td>

                  {/* Incoming */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <PhoneIncoming size={14} className="text-emerald-500" />
                      <span className="text-sm text-gray-700">{member.incoming}</span>
                    </div>
                  </td>

                  {/* Missed */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <PhoneMissed size={14} className="text-rose-500" />
                      <span className="text-sm text-gray-700">{member.missed}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-3">
                    <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Table Footer - Summary Row */}
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr className="text-sm font-medium">
                <td className="py-4 px-5 text-gray-700">Team Total</td>
                <td className="py-4 px-5 text-gray-900 font-bold">{teamTotals.totalCalls}</td>
                <td className="py-4 px-5 text-gray-900">{teamTotals.outgoing}</td>
                <td className="py-4 px-5 text-gray-900">{teamTotals.connected}</td>
                <td className="py-4 px-5 text-gray-900">{teamTotals.incoming}</td>
                <td className="py-4 px-5 text-gray-900">{teamTotals.missed}</td>
                <td className="py-4 px-5"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamPerformanceScreen;