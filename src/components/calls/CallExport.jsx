'use client';

import { useState } from "react";
import { Card, Button, Input } from "@/components/ui";
import { toast } from "react-hot-toast";

// ====================== EXPORT HELPERS ======================
const formatDate = (date) => date.toISOString().split("T")[0];

const getDateRange = (type) => {
  const today = new Date();
  let start, end;

  switch (type) {
    case "today":
      start = end = today;
      break;

    case "yesterday":
      start = end = new Date(today);
      start.setDate(today.getDate() - 1);
      break;

    case "week":
      start = new Date(today);
      start.setDate(today.getDate() - today.getDay());
      end = today;
      break;

    case "month":
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = today;
      break;

    case "last_month":
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
      break;

    default:
      start = end = today;
  }

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
};

const CallExport = () => {
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const downloadExcel = (startDate, endDate) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/calls/export/excel?startDate=${startDate}&endDate=${endDate}`;
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      toast.error("Export failed");
    }
  };

  return (
    <Card className="p-3 sm:p-4 mt-4 animate-fade-in">
      <h2 className="text-md font-semibold mb-3">Export Calls</h2>

      {/* Quick Ranges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Button
          variant="outline"
          onClick={() => {
            const { startDate, endDate } = getDateRange("today");
            downloadExcel(startDate, endDate);
          }}
        >
          Today
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const { startDate, endDate } = getDateRange("yesterday");
            downloadExcel(startDate, endDate);
          }}
        >
          YesterDay
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            const { startDate, endDate } = getDateRange("week");
            downloadExcel(startDate, endDate);
          }}
        >
          This Week
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            const { startDate, endDate } = getDateRange("month");
            downloadExcel(startDate, endDate);
          }}
        >
          This Month
        </Button>
      </div>

      {/* Custom Date Range */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <Input
          type="date"
          value={customStart}
          onChange={(e) => setCustomStart(e.target.value)}
        />
        <Input
          type="date"
          value={customEnd}
          onChange={(e) => setCustomEnd(e.target.value)}
        />
        <Button
          onClick={() => {
            if (!customStart || !customEnd) {
              return toast.error("Please select both dates");
            }
            downloadExcel(customStart, customEnd);
          }}
        >
          Export
        </Button>
      </div>
    </Card>
  );
};

export default CallExport;
