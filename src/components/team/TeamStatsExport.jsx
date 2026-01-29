'use client';

import { useState } from "react";
import { Card, Button, Input } from "@/components/ui";
import { toast } from "react-hot-toast";
import { Download } from "lucide-react";

// ====================== EXPORT HELPERS ======================
const formatDate = (date) => date.toISOString().split("T")[0];

const getDateRange = (type) => {
  const today = new Date();
  let start, end;

  switch (type) {
    case "today":
      start = new Date(today);
      end = new Date(today);
      break;

    case "yesterday":
      start = new Date(today);
      start.setDate(today.getDate() - 1);
      end = new Date(today);
      end.setDate(today.getDate() - 1);
      break;

    case "week":
      start = new Date(today);
      start.setDate(today.getDate() - 7);
      end = new Date(today);
      break;

    case "month":
      start = new Date(today);
      start.setMonth(today.getMonth() - 1);
      start.setDate(1);
      end = new Date(today);
      break;

    case "this_month":
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today);
      break;

    default:
      start = end = new Date(today);
  }

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
    label: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')
  };
};

// ====================== MAIN COMPONENT ======================
const TeamStatsExport = () => {
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const downloadTeamStatsExcel = async (periodType, startDate = null, endDate = null) => {
    try {
      setIsLoading(true);
      
      let params = "";
      
      if (periodType === "custom") {
        if (!startDate || !endDate) {
          toast.error("Please select both start and end dates");
          return;
        }
        params = `?period=custom&from=${startDate}&to=${endDate}`;
      } else {
        params = `?period=${periodType}`;
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/calls/team/export/stats${params}`;
      
      // Open in new tab
      window.open(url, "_blank");
      
      toast.success(`Team stats export started for ${periodType}`);
      
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to export team stats");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickExport = (periodType) => {
    const { startDate, endDate } = getDateRange(periodType);
    downloadTeamStatsExcel(periodType, startDate, endDate);
  };

  const handleCustomExport = () => {
    if (!customStart || !customEnd) {
      toast.error("Please select both start and end dates");
      return;
    }
    
    // Validate dates
    const start = new Date(customStart);
    const end = new Date(customEnd);
    
    if (start > end) {
      toast.error("Start date cannot be after end date");
      return;
    }
    
    downloadTeamStatsExcel("custom", customStart, customEnd);
  };

  return (
    <Card className="p-4 sm:p-6 mt-6 animate-fade-in border border-blue-100 bg-blue-50/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Export Team Performance</h3>
          <p className="text-sm text-gray-600">Download team stats in Excel format</p>
        </div>
        <Download className="h-6 w-6 text-blue-600" />
      </div>

      {/* Quick Export Buttons */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Export</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {["today", "yesterday", "week", "month"].map((period) => (
            <Button
              key={period}
              variant="outline"
              onClick={() => handleQuickExport(period)}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-2"
            >
              <Download className="h-4 w-4" />
              {period.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Date Range */}
      <div className="border-t border-gray-400 pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Date Range</h4>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-2">
            <label className="block text-xs font-medium text-gray-700">Start Date</label>
            <Input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="w-full"
              max={customEnd || formatDate(new Date())}
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="block text-xs font-medium text-gray-700">End Date</label>
            <Input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="w-full"
              min={customStart}
              max={formatDate(new Date())}
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleCustomExport}
              disabled={isLoading || !customStart || !customEnd}
              className="min-w-[120px] h-10"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

    </Card>
  );
};

export default TeamStatsExport;