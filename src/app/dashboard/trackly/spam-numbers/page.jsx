'use client';
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Shield, Search, Phone, Users, Calendar, ArrowUpDown } from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "@/lib/apiClient";
import { Card, Input, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button } from "@/components/ui";
import Pagination from "@/components/ui/Pagination";

const SpamNumbers = () => {
  // State Management
  const [spamNumbers, setSpamNumbers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("lastReportedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [showExport, setShowExport] = useState(false);

  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasMore: false
  });

  // Refs
  const debounceTimerRef = useRef(null);

  // Data Mapping
  const mapSpamData = useCallback((spam) => {
    return {
      id: spam._id,
      phoneNumber: spam.phoneNumber || "Unknown",
      formattedPhone: spam.formattedNumber || spam.phoneNumber,
      spamCount: spam.spamCount || 0,
      lastReportedAt: spam.lastReportedAt,
      reporters: Array.isArray(spam.reportedBy) ? spam.reportedBy : [],
      reporterNames: Array.isArray(spam.reportedBy) 
        ? spam.reportedBy.map(reporter => reporter?.name || 'Unknown').join(', ')
        : 'System Check',
      reporterCount: Array.isArray(spam.reportedBy) ? spam.reportedBy.length : 0
    };
  }, []);

  // Format Date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

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

  // Fetch Spam Numbers
  const fetchSpamNumbers = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);

      const params = {
        page: pageNum,
        limit: pagination.limit,
        search: debouncedSearchTerm,
        sortBy: sortBy,
        sortOrder: sortOrder,
      };

      const response = await apiClient.get('/api/v1/calls/spam-numbers', { params });

      if (response.data.success) {
        const { data: spamData, pagination: paginationData } = response.data;
        const mappedSpam = spamData.map(mapSpamData);

        setSpamNumbers(mappedSpam);
        
        // Update pagination state
        setPagination(prev => ({
          ...prev,
          page: paginationData.page,
          total: paginationData.total,
          totalPages: paginationData.totalPages,
          hasMore: paginationData.hasMore
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch spam numbers");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, sortBy, sortOrder, mapSpamData, pagination.limit]);

  // Handle Page Change
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages || loading) return;
    fetchSpamNumbers(newPage);
  }, [pagination.totalPages, loading, fetchSpamNumbers]);

  // Handle Sort
  const handleSort = useCallback((key) => {
    setSortBy(prev => {
      if (prev === key) {
        setSortOrder(order => order === "asc" ? "desc" : "asc");
      } else {
        setSortOrder("desc");
      }
      return key;
    });
  }, []);

  // Effects
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Reset to page 1 when filters change
    fetchSpamNumbers(1);
  }, [debouncedSearchTerm, sortBy, sortOrder]);

  return (
    <div className="space-y-4 animate-fade-in p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Spam Numbers</h1>
          <p className="text-sm text-gray-500">Manage and monitor reported spam numbers</p>
        </div>
      </div>

      {/* Search Filter */}
      <Card className="p-3 sm:p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search phone numbers or reporters..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </Card>

      {/* Spam Numbers Table */}
      <Card>
        {loading && pagination.page === 1 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-sm text-gray-500">Loading spam numbers…</span>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Phone Number</TableHead>
                    <TableHead onClick={() => handleSort("spamCount")} className="cursor-pointer whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        Reports
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort("reporterCount")} className="cursor-pointer whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        Reporters
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead onClick={() => handleSort("lastReportedAt")} className="cursor-pointer whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        Last Reported
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Reported By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spamNumbers.map((spam, index) => (
                    <TableRow key={spam.id || index} className="hover:bg-gray-50">
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm sm:text-base">{spam.phoneNumber}</div>
                            {spam.formattedPhone !== spam.phoneNumber && (
                              <div className="text-xs text-gray-500">{spam.formattedPhone}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="destructive" className="text-xs sm:text-sm">
                          {spam.spamCount} time{spam.spamCount !== 1 ? 's' : ''}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">{spam.reporterCount}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{formatDate(spam.lastReportedAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="text-sm text-gray-700 max-w-xs truncate">
                          {spam.reporterNames}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View */}
            <div className="block sm:hidden space-y-2 p-2">
              {spamNumbers.map((spam, index) => (
                <Card key={spam.id || index} className="p-3 shadow-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Phone className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{spam.phoneNumber}</div>
                          <div className="text-xs text-gray-500">
                            {spam.reporterCount} reporter{spam.reporterCount !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      <Badge variant="destructive">
                        {spam.spamCount} report{spam.spamCount !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {formatDate(spam.lastReportedAt)}
                      </div>
                    </div>
                    
                    {spam.reporterNames && (
                      <div className="pt-2 border-t border-gray-200">
                        <div className="text-xs text-gray-500">Reported by:</div>
                        <div className="text-sm text-gray-700 truncate">{spam.reporterNames}</div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* No Data State */}
        {spamNumbers.length === 0 && !loading && (
          <div className="p-6 sm:p-12 text-center">
            <Shield className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No spam numbers found</h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "No spam numbers have been reported yet"}
            </p>
          </div>
        )}
      </Card>

      {/* Reusable Pagination Component */}
      {spamNumbers.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={loading}
          itemsLabel="spam numbers"
          showItemsCount={true}
          showPageInfo={true}
          className="mt-4"
        />
      )}
    </div>
  );
};

export default SpamNumbers;