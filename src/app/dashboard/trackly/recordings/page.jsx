"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  Loader2,
  Search,
  ArrowUpDown,
  Volume2,
  AudioLines,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import KPICard from "@/components/ui/KPICard";

// Table Components (same theme)
const Card = ({ className = "", children }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${className}`}
    {...props}
  />
);

const Table = ({ children }) => <table className="min-w-full">{children}</table>;
const TableHeader = ({ children }) => <thead className="bg-gray-50">{children}</thead>;
const TableBody = ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>;
const TableRow = ({ children, className = "" }) => <tr className={className}>{children}</tr>;
const TableHead = ({ children, className = "", ...props }) => (
  <th
    scope="col"
    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
    {...props}
  >
    {children}
  </th>
);
const TableCell = ({ children, className = "", ...props }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${className}`} {...props}>
    {children}
  </td>
);

export default function RecordingsPage() {
  const { token } = useSelector((state) => state.auth);

  const [recordings, setRecordings] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRecordings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/recordings?page=${page}&limit=50&search=${searchTerm}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecordings(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      toast.error("Failed to load recordings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchRecordings();
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call Recordings</h1>
          <p className="text-gray-500">View uploaded call recordings synced from devices</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total Records" value={pagination?.total || 0} icon={AudioLines} />
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md flex gap-3 items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by user, number, or date..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Search
          </button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Audio</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading recordings...
                  </div>
                </TableCell>
              </TableRow>
            ) : recordings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recordings found</h3>
                </TableCell>
              </TableRow>
            ) : (
              recordings.map((rec) => (
                <TableRow
                  key={rec._id}
                  className={`hover:bg-gray-50
                    ${rec.status === 0 ? "bg-blue-50/40" : ""}      /* Pending */
                    ${rec.status === 2 ? "bg-yellow-50" : ""}       /* Processing */
                    ${rec.status === 3 ? "bg-red-50" : ""}          /* Failed */
                  `}
                >
                  {/* USER NAME */}
                  <TableCell>
                    <div>
                      <div className="font-semibold">
                        {rec.username || "Unknown User"}
                      </div>
                      <div className="text-xs text-gray-500">{rec.userId}</div>
                    </div>
                  </TableCell>

                  {/* NUMBER */}
                  <TableCell>{rec.fromNumber || "—"}</TableCell>

                  {/* START TIME IST */}
                  <TableCell>
                    {new Date(rec.startTime).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                    })}
                  </TableCell>

                  {/* STATUS (UPDATED) */}
                  <TableCell>
                    {rec.status === 0 && (
                      <span className="flex items-center gap-1 text-blue-600 font-medium">
                        <Clock className="h-4 w-4" /> Pending
                      </span>
                    )}

                    {rec.status === 1 && (
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <CheckCircle2 className="h-4 w-4" /> Synced
                      </span>
                    )}

                    {rec.status === 2 && (
                      <span className="flex items-center gap-1 text-yellow-600 font-medium">
                        <Loader2 className="h-4 w-4 animate-spin" /> Processing
                      </span>
                    )}

                    {rec.status === 3 && (
                      <span className="flex items-center gap-1 text-red-600 font-medium">
                        <XCircle className="h-4 w-4" /> Failed
                      </span>
                    )}
                  </TableCell>

                  {/* AUDIO PLAYER */}
                  <TableCell>
                    {rec.recordingUrl ? (
                      <audio controls className="h-8 rounded-md shadow-sm" src={rec.recordingUrl} />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex gap-4 mt-5">
        {page > 1 && (
          <button
            onClick={() => setPage(page - 1)}
            className="px-3 py-2 bg-gray-300 rounded"
          >
            Previous
          </button>
        )}
        {pagination.totalPages > page && (
          <button
            onClick={() => setPage(page + 1)}
            className="px-3 py-2 bg-gray-300 rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
