"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import apiClient from "@/lib/apiClient";
import {
  Loader2,
  Search,
  ArrowUpDown,
  Volume2,
  AudioLines,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Phone,
  Calendar,
  CalendarClock,
  Play,
  Pause
} from "lucide-react";
import { Card, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button } from "@/components/ui";
import KPICard from "@/components/ui/KPICard";
import Pagination from "@/components/ui/Pagination";

// Status configuration - Clean badge style
const statusConfig = {
  0: { label: 'Pending', icon: Clock, className: 'bg-blue-100 text-blue-700 border-blue-200' },
  1: { label: 'Synced', icon: CheckCircle2, className: 'bg-green-100 text-green-700 border-green-200' },
  2: { label: 'Processing', icon: Loader2, className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  3: { label: 'Failed', icon: XCircle, className: 'bg-red-100 text-red-700 border-red-200' }
};

export default function RecordingsPage() {
  // State Management
  const [recordings, setRecordings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("startTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [audioDurations, setAudioDurations] = useState({});
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  
  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
    hasMore: false
  });

  // Refs
  const debounceTimerRef = useRef(null);
  const audioRefs = useRef({});

  // Status Filter Options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: '0', label: 'Pending' },
    { value: '1', label: 'Synced' },
    { value: '2', label: 'Processing' },
    { value: '3', label: 'Failed' }
  ];

  // Format Date with Seconds
  const formatDateTimeWithSeconds = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit', // ✅ Seconds added
      hour12: true,
      timeZone: "Asia/Kolkata"
    });
  };

  const formatDateOnly = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: "Asia/Kolkata"
    });
  };

  // Format Duration (seconds to MM:SS)
  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get audio duration and metadata
  const handleAudioLoaded = useCallback((recordingId, audioElement) => {
    if (audioElement && audioElement.duration && !isNaN(audioElement.duration)) {
      setAudioDurations(prev => ({
        ...prev,
        [recordingId]: audioElement.duration
      }));
    }
  }, []);

  // Handle audio play/pause
  const handleAudioPlay = useCallback((recordingId) => {
    // Pause previously playing audio
    if (currentlyPlaying && currentlyPlaying !== recordingId) {
      const prevAudio = audioRefs.current[currentlyPlaying];
      if (prevAudio) {
        prevAudio.pause();
      }
    }
    setCurrentlyPlaying(recordingId);
  }, [currentlyPlaying]);

  const handleAudioPause = useCallback(() => {
    setCurrentlyPlaying(null);
  }, []);

  // Debounced Search
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, 1000);
  }, []);

  // Fetch Recordings with Pagination
  const fetchRecordings = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      
      const params = {
        page: pageNum,
        limit: pagination.limit,
        search: debouncedSearchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sortBy,
        sortOrder
      };

      const res = await apiClient.get('/api/recordings', { params });
      
      if (res.data.success) {
        const { data, total, currentPage, totalPages } = res.data;
        setRecordings(data || []);
        setPagination(prev => ({
          ...prev,
          page: currentPage || 1,
          total: total || 0,
          pages: totalPages || 1,
          hasMore: currentPage < totalPages
        }));
      }
    } catch (err) {
      toast.error("Failed to load recordings");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, statusFilter, sortBy, sortOrder, pagination.limit]);

  // Initial Load
  useEffect(() => {
    fetchRecordings(1);
  }, [fetchRecordings]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      // Pause all audio on unmount
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) audio.pause();
      });
    };
  }, []);

  // Handle Page Change
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > pagination.pages || loading) return;
    fetchRecordings(newPage);
  }, [pagination.pages, loading, fetchRecordings]);

  // Handle Sort
  const handleSort = useCallback((column) => {
    if (column === sortBy) {
      setSortOrder(order => order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  }, [sortBy]);

  // Handle Status Filter Change
  const handleStatusChange = useCallback((e) => {
    setStatusFilter(e.target.value);
    fetchRecordings(1);
  }, [fetchRecordings]);

  return (
    <div className="space-y-4 animate-fade-in p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Call Recordings</h1>
          <p className="text-sm text-gray-500">View uploaded call recordings synced from devices</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Total Recordings" 
          value={pagination?.total || 0} 
          icon={AudioLines}
          description="All call recordings"
        />
        <KPICard 
          title="Synced" 
          value={recordings.filter(r => r.status === 1).length || 0} 
          icon={CheckCircle2}
          description="Successfully processed"
          className="border-green-200"
        />
        <KPICard 
          title="Pending" 
          value={recordings.filter(r => r.status === 0).length || 0} 
          icon={Clock}
          description="Awaiting processing"
          className="border-blue-200"
        />
        <KPICard 
          title="Failed" 
          value={recordings.filter(r => r.status === 3).length || 0} 
          icon={XCircle}
          description="Processing failed"
          className="border-red-200"
        />
      </div>

      {/* Filters */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by user, number, or date..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Recordings Table */}
      <Card>
        {loading && pagination.page === 1 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-sm text-gray-500">Loading recordings…</span>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        User
                      </div>
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        Number
                      </div>
                    </TableHead>
                    
                    {/* Start Time Column - WITH SECONDS */}
                    <TableHead 
                      onClick={() => handleSort("startTime")} 
                      className="cursor-pointer whitespace-nowrap"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        Start Time
                        {sortBy === 'startTime' && (
                          <ArrowUpDown className={`h-4 w-4 ${sortOrder === 'asc' ? 'text-primary' : 'text-primary rotate-180'}`} />
                        )}
                      </div>
                    </TableHead>
                    
                    {/* Created At Column - WITH SECONDS */}
                    <TableHead 
                      onClick={() => handleSort("createdAt")} 
                      className="cursor-pointer whitespace-nowrap"
                    >
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-gray-400" />
                        Created At
                        {sortBy === 'createdAt' && (
                          <ArrowUpDown className={`h-4 w-4 ${sortOrder === 'asc' ? 'text-primary' : 'text-primary rotate-180'}`} />
                        )}
                      </div>
                    </TableHead>
                    
                    <TableHead className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        Status
                      </div>
                    </TableHead>
                    
                    {/* Audio Column with Duration */}
                    <TableHead className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4 text-gray-400" />
                        Recording
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recordings.map((rec) => {
                    const StatusIcon = statusConfig[rec.status]?.icon || Clock;
                    const duration = rec.duration || audioDurations[rec._id] || 0;
                    
                    return (
                      <TableRow key={rec._id} className="hover:bg-gray-50">
                        {/* User */}
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {(rec.username || "?").charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm sm:text-base">
                                {rec.username || "Unknown User"}
                              </div>
                              <div className="text-xs text-gray-500 font-mono">
                                {rec.userId || "—"}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Number */}
                        <TableCell className="whitespace-nowrap">
                          <span className="text-sm font-mono text-gray-700">
                            {rec.fromNumber || "—"}
                          </span>
                        </TableCell>

                        {/* Start Time - WITH SECONDS */}
                        <TableCell className="whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-700">
                              {formatDateTimeWithSeconds(rec.startTime)}
                            </span>
                          </div>
                        </TableCell>

                        {/* Created At - WITH SECONDS */}
                        <TableCell className="whitespace-nowrap">
                          <span className="text-sm text-gray-700">
                            {formatDateTimeWithSeconds(rec.createdAt)}
                          </span>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${statusConfig[rec.status]?.className || 'bg-gray-100 text-gray-700'}`}>
                            <StatusIcon className={`h-3.5 w-3.5 ${rec.status === 2 ? 'animate-spin' : ''}`} />
                            {statusConfig[rec.status]?.label || 'Unknown'}
                          </span>
                        </TableCell>

                        {/* Audio Player with Duration Badge */}
                        <TableCell className="whitespace-nowrap">
                          {rec.recordingUrl ? (
                            <div className="flex items-center gap-1 ">
                              <div className="relative">
                                <audio 
                                  ref={el => audioRefs.current[rec._id] = el}
                                  controls
                                  className="h-8 w-52 rounded-md"
                                  src={rec.recordingUrl}
                                  onLoadedMetadata={(e) => handleAudioLoaded(rec._id, e.target)}
                                  onPlay={() => handleAudioPlay(rec._id)}
                                  onPause={handleAudioPause}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View - Card Layout */}
            <div className="block sm:hidden space-y-3 p-3">
              {recordings.map((rec) => {
                const StatusIcon = statusConfig[rec.status]?.icon || Clock;
                const duration = rec.duration || audioDurations[rec._id] || 0;
                
                return (
                  <Card key={rec._id} className="p-4 shadow-sm">
                    <div className="space-y-3">
                      {/* Header with User and Status */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold">
                              {(rec.username || "?").charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {rec.username || "Unknown User"}
                            </div>
                            <div className="text-xs text-gray-500 font-mono">
                              {rec.userId || ""}
                            </div>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusConfig[rec.status]?.className}`}>
                          <StatusIcon className={`h-3 w-3 ${rec.status === 2 ? 'animate-spin' : ''}`} />
                          {statusConfig[rec.status]?.label}
                        </span>
                      </div>

                      {/* Number */}
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="font-mono text-gray-700">
                          {rec.fromNumber || "—"}
                        </span>
                      </div>

                      {/* Start Time - WITH SECONDS */}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div className="flex flex-col">
                          <span className="text-gray-700">
                            {formatDateTimeWithSeconds(rec.startTime)}
                          </span>
                          {duration > 0 && (
                            <span className="text-xs text-gray-500">
                              Duration: {formatDuration(duration)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Created At - WITH SECONDS */}
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarClock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">
                          {formatDateTimeWithSeconds(rec.createdAt)}
                        </span>
                      </div>

                      {/* Audio Player */}
                      {rec.recordingUrl && (
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-700">Recording</span>
                            {duration > 0 && (
                              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded-md">
                                {formatDuration(duration)}
                              </span>
                            )}
                          </div>
                          <audio 
                            ref={el => audioRefs.current[rec._id] = el}
                            controls 
                            className="w-full h-8 rounded-md"
                            src={rec.recordingUrl}
                            onLoadedMetadata={(e) => handleAudioLoaded(rec._id, e.target)}
                            onPlay={() => handleAudioPlay(rec._id)}
                            onPause={handleAudioPause}
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* No Data State */}
        {!loading && recordings.length === 0 && (
          <div className="p-6 sm:p-12 text-center">
            <AudioLines className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
              {searchTerm || statusFilter !== 'all' 
                ? "No matching recordings found" 
                : "No recordings found"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? "Try adjusting your search or filter criteria"
                : "Recordings will appear here once they are synced from devices"}
            </p>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {recordings.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={loading}
          itemsLabel="recordings"
          showItemsCount={true}
          showPageInfo={true}
          className="mt-4"
        />
      )}
    </div>
  );
}