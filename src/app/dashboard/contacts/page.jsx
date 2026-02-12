"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Search, ArrowUpDown, Mail, Phone, User, Calendar } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { Card, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button } from "@/components/ui";
import Pagination from "@/components/ui/Pagination";

export default function ContactList() {
  // State Management - CallTracking style
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasMore: false
  });

  // Refs
  const debounceTimerRef = useRef(null);

  // Format Date
  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }).format(new Date(date)).replace(',', ', ');
  };

  // Format Date only for mobile
  const formatDateOnly = (date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    }).format(new Date(date));
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

  // Fetch Contacts with Pagination
  const fetchContacts = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pageNum,
        limit: pagination.limit,
        search: debouncedSearchTerm,
        sortBy,
        sortOrder
      };

      const response = await apiClient.get('/api/contact', { params });
      
      // Handle both array response and paginated response
      if (Array.isArray(response.data)) {
        // If API returns array without pagination
        setContacts(response.data);
        setPagination(prev => ({
          ...prev,
          page: 1,
          total: response.data.length,
          pages: Math.ceil(response.data.length / prev.limit),
          hasMore: 1 < Math.ceil(response.data.length / prev.limit)
        }));
      } else if (response.data.data) {
        // If API returns paginated response
        const { data, total, currentPage, totalPages } = response.data;
        setContacts(data || []);
        setPagination(prev => ({
          ...prev,
          page: currentPage || 1,
          total: total || 0,
          pages: totalPages || 1,
          hasMore: currentPage < totalPages
        }));
      }
      
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, sortBy, sortOrder, pagination.limit]);

  // Initial Load
  useEffect(() => {
    fetchContacts(1);
  }, [fetchContacts]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle Page Change
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > pagination.pages || loading) return;
    fetchContacts(newPage);
  }, [pagination.pages, loading, fetchContacts]);

  // ✅ Handle Sort - Sirf CreatedAt ke liye
  const handleSort = useCallback(() => {
    setSortOrder(order => order === "asc" ? "desc" : "asc");
  }, []);

  return (
    <div className="space-y-4 animate-fade-in p-4 sm:p-6 md:p-8">
      {/* Header - CallTracking style */}
      <div className="flex justify-between items-start gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="text-sm text-gray-500">View all contact form submissions</p>
        </div>
      </div>

      {/* Search Filter - CallTracking style */}
      <Card className="p-3 sm:p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, phone or message..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </Card>

      {/* Contacts Table */}
      <Card>
        {loading && pagination.page === 1 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-sm text-gray-500">Loading submissions…</span>
          </div>
        ) : error ? (
          <div className="p-6 sm:p-12 text-center">
            <div className="text-red-600 mb-2">Failed to load submissions</div>
            <p className="text-sm text-gray-500">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => fetchContacts(1)}
            >
              Try Again
            </Button>
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
                        Name
                      </div>
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        Phone
                      </div>
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        Message
                      </div>
                    </TableHead>
                    
                    {/* ✅ CreatedAt Column - SORTING ENABLED */}
                    <TableHead 
                      onClick={handleSort} 
                      className="cursor-pointer whitespace-nowrap"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        Submitted At
                        <ArrowUpDown className={`h-4 w-4 ${sortOrder === 'asc' ? 'text-primary' : 'text-gray-400'}`} />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact._id} className="hover:bg-gray-50">
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {(contact.name || "?").charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900 text-sm sm:text-base">
                            {contact.name || "—"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-700">
                          {contact.phone || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="text-sm text-gray-700 line-clamp-2">
                          {contact.message || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {formatDateTime(contact.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View - Card Layout */}
            <div className="block sm:hidden space-y-3 p-3">
              {contacts.map((contact) => (
                <Card key={contact._id} className="p-4 shadow-sm">
                  <div className="space-y-3">
                    {/* Header with Avatar and Name */}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold">
                          {(contact.name || "?").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {contact.name || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {contact.phone || "No phone"}
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Message</div>
                      <div className="text-sm text-gray-900">
                        {contact.message || "—"}
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {formatDateOnly(contact.createdAt)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* No Data State */}
        {!loading && !error && contacts.length === 0 && (
          <div className="p-6 sm:p-12 text-center">
            <Mail className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
              {searchTerm ? "No matching submissions found" : "No submissions found"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {searchTerm 
                ? "Try adjusting your search criteria" 
                : "Contact form submissions will appear here"}
            </p>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {contacts.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={loading}
          itemsLabel="submissions"
          showItemsCount={true}
          showPageInfo={true}
          className="mt-4"
        />
      )}
    </div>
  );
}