"use client";

import { useState } from "react";
import { Search, Download, Eye, PhoneOutgoing, PhoneIncoming, PhoneMissed, CheckCircle } from "lucide-react";
import MemberDetailsModal from "./MemberDetailsModal";
import * as XLSX from 'xlsx';

// ─── Orange color constant ─────────────────────────────────────────────
const ORANGE = "#ff5a1f";

// ─── Team Member Data ──────────────────────────────────────────
const TEAM_DATA = [
  {
    id: 1,
    userId: "user_123",
    name: "Neha",
    initials: "N",
    totalCalls: 237,
    outgoing: 140,
    connected: 92,
    incoming: 97,
    missed: 37,
    status: "active",
    avatarColor: "bg-blue-600",
    mobile: "+91 98765 43210",
    role: "Senior Agent",
    email: "neha@fasterq.in",
    joinDate: "2025-12-15",
  },
  {
    id: 2,
    userId: "user_456",
    name: "Amit",
    initials: "A",
    totalCalls: 137,
    outgoing: 81,
    connected: 33,
    incoming: 56,
    missed: 19,
    status: "active",
    avatarColor: "bg-green-600",
    mobile: "+91 87654 32109",
    role: "Team Lead",
    email: "amit@fasterq.in",
    joinDate: "2025-10-10",
  },
  {
    id: 3,
    userId: "user_789",
    name: "Rohit",
    initials: "R",
    totalCalls: 11,
    outgoing: 10,
    connected: 5,
    incoming: 1,
    missed: 1,
    status: "inactive",
    avatarColor: "bg-gray-500",
    mobile: "+91 76543 21098",
    role: "Junior Agent",
    email: "rohit@fasterq.in",
    joinDate: "2026-01-05",
  },
];

// ─── Team Performance Screen ──────────────────────────────────────────
export const TeamPerformanceScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter team members based on search
  const filteredTeam = TEAM_DATA.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.mobile.includes(searchQuery)
  );

  // Calculate team totals
  const teamTotals = {
    totalCalls: TEAM_DATA.reduce((sum, member) => sum + member.totalCalls, 0),
    outgoing: TEAM_DATA.reduce((sum, member) => sum + member.outgoing, 0),
    connected: TEAM_DATA.reduce((sum, member) => sum + member.connected, 0),
    incoming: TEAM_DATA.reduce((sum, member) => sum + member.incoming, 0),
    missed: TEAM_DATA.reduce((sum, member) => sum + member.missed, 0),
  };

  // Handle eye icon click
  const handleViewDetails = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  // Export to Excel
  const exportToExcel = () => {
    // Prepare data for export
    const exportData = filteredTeam.map(member => ({
      'Team Member': member.name,
      'Role': member.role,
      'Mobile': member.mobile,
      'Email': member.email,
      'Total Calls': member.totalCalls,
      'Outbound': member.outgoing,
      'Connected': member.connected,
      'Inbound': member.incoming,
      'Missed': member.missed,
      'Success Rate': member.totalCalls > 0 
        ? `${Math.round((member.connected / member.totalCalls) * 100)}%` 
        : '0%',
      'Status': member.status === 'active' ? 'Active' : 'Inactive',
      'Join Date': member.joinDate
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Team Performance");
    
    // Generate filename with current date
    const date = new Date();
    const filename = `team_performance_${date.toISOString().split('T')[0]}.xlsx`;
    
    // Save file
    XLSX.writeFile(wb, filename);
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

        {/* Export Button */}
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download size={16} />
          Export
        </button>
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
                        <span className="text-xs text-gray-400 block">{member.role}</span>
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
                    <button 
                      onClick={() => handleViewDetails(member)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors group"
                      title="View Member Details"
                    >
                      <Eye size={18} className="text-gray-400 group-hover:text-orange-600 transition-colors" />
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

      {/* Member Details Modal */}
      <MemberDetailsModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default TeamPerformanceScreen;