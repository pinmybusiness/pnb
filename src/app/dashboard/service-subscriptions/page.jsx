'use client';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import apiClient from '@/lib/apiClient';
import { 
  Loader2, Search, ArrowUpDown, RefreshCw, 
  CreditCard, Calendar, User, Package, 
  Edit, RotateCw, CalendarPlus, XCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDateWithSuffix } from '@/utils/dateFormat';
import { Card, Input, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button } from '@/components/ui';
import Pagination from '@/components/ui/Pagination';

// 🔹 Status color styles - Clean badge style
const statusConfig = {
  1: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  2: { label: 'Active', className: 'bg-green-100 text-green-800 border-green-200' },
  3: { label: 'Expired', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  4: { label: 'Cancelled', className: 'bg-red-100 text-red-800 border-red-200' }
};

export default function AdminSubscriptionsPage() {
  // State Management - CallTracking style
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // ✅ Sirf Plan aur ExpireDate ke liye sorting
  const [sortBy, setSortBy] = useState('expireDate');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  
  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasMore: false
  });

  // 🔹 Action States
  const [selectedSub, setSelectedSub] = useState(null);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showCorrectModal, setShowCorrectModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  
  // 🔹 Form States
  const [selectedPlan, setSelectedPlan] = useState('');
  const [extendDays, setExtendDays] = useState('');
  const [renewPlan, setRenewPlan] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Refs
  const debounceTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  // Status Filter Options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: '1', label: 'Pending' },
    { value: '2', label: 'Active' },
    { value: '3', label: 'Expired' },
    { value: '4', label: 'Cancelled' }
  ];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Fetch Plans for dropdowns
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await apiClient.get('/api/services/plans');
        setPlans(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      }
    };
    fetchPlans();
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

  // Fetch Subscriptions with Pagination
  const fetchSubscriptions = useCallback(async (pageNum = 1) => {
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

      const res = await apiClient.get('/api/services/subscriptions/all', { params });
      
      if (res.data.success && isMountedRef.current) {
        const { data, total, currentPage, totalPages } = res.data;
        setSubscriptions(data || []);
        setPagination(prev => ({
          ...prev,
          page: currentPage || 1,
          total: total || 0,
          pages: totalPages || 1,
          hasMore: currentPage < totalPages
        }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch subscriptions');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [debouncedSearchTerm, statusFilter, sortBy, sortOrder, pagination.limit]);

  // Initial Load
  useEffect(() => {
    fetchSubscriptions(1);
  }, [fetchSubscriptions]);

  // Handle Page Change
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > pagination.pages || loading) return;
    fetchSubscriptions(newPage);
  }, [pagination.pages, loading, fetchSubscriptions]);

  // ✅ Handle Sort
  const handleSort = useCallback((key) => {
    if (key !== 'plan.name' && key !== 'expireDate') return;
    
    setSortBy(prev => {
      if (prev === key) {
        setSortOrder(order => order === "asc" ? "desc" : "asc");
      } else {
        setSortOrder("desc");
      }
      return key;
    });
  }, []);

  // ✅ Update Status -直接从Dropdown
  const updateStatus = useCallback(async (subscriptionId, newStatus) => {
    try {
      await apiClient.put('/api/services/subscriptions/status', {
        subscriptionId,
        status: parseInt(newStatus)
      });
      toast.success('Status updated successfully');
      
      setSubscriptions(prev =>
        prev.map(sub =>
          sub._id === subscriptionId ? { ...sub, status: parseInt(newStatus) } : sub
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  }, []);

  // 🔹 Action Handlers
  const openRenewModal = (sub) => {
    setSelectedSub(sub);
    setRenewPlan('');
    setShowRenewModal(true);
  };

  const openCorrectModal = (sub) => {
    setSelectedSub(sub);
    setSelectedPlan('');
    setShowCorrectModal(true);
  };

  const openExtendModal = (sub) => {
    setSelectedSub(sub);
    setExtendDays('');
    setShowExtendModal(true);
  };

  const closeModals = () => {
    setShowRenewModal(false);
    setShowCorrectModal(false);
    setShowExtendModal(false);
    setSelectedSub(null);
    setSelectedPlan('');
    setRenewPlan('');
    setExtendDays('');
  };

  // 🔹 API Calls
  const handleRenew = async () => {
    if (!selectedSub) return;
    
    try {
      setActionLoading(true);
      await apiClient.post('/api/services/subscriptions/renew', {
        subscriptionId: selectedSub._id,
        planId: renewPlan || undefined
      });
      toast.success('Subscription renewed successfully');
      closeModals();
      fetchSubscriptions(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Renew failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCorrect = async () => {
    if (!selectedSub || !selectedPlan) {
      toast.error('Please select a plan');
      return;
    }
    
    try {
      setActionLoading(true);
      await apiClient.post('/api/services/subscriptions/correct-plan', {
        subscriptionId: selectedSub._id,
        newPlanId: selectedPlan
      });
      toast.success('Plan corrected successfully');
      closeModals();
      fetchSubscriptions(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Correction failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExtend = async () => {
    if (!selectedSub || !extendDays || parseInt(extendDays) <= 0) {
      toast.error('Please enter valid number of days');
      return;
    }
    
    try {
      setActionLoading(true);
      await apiClient.post('/api/services/subscriptions/extend', {
        subscriptionId: selectedSub._id,
        days: parseInt(extendDays)
      });
      toast.success('Subscription extended successfully');
      closeModals();
      fetchSubscriptions(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Extend failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Format Price
  const formatPrice = (sub) => {
    return `₹${sub.amount || sub.planId?.price || 0}`;
  };

  // ✅ Check if subscription is expiring soon
  const isExpiringSoon = (expireDate) => {
    if (!expireDate) return false;
    const today = new Date();
    const expiry = new Date(expireDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  // ✅ Check if subscription is expired
  const isExpired = (expireDate) => {
    if (!expireDate) return false;
    return new Date(expireDate) < new Date();
  };

  return (
    <div className="space-y-4 animate-fade-in p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">All Subscriptions</h1>
          <p className="text-sm text-gray-500">Manage all user service subscriptions</p>
        </div>

        {/* Refresh Button */}
        <Button
          variant="outline"
          onClick={() => fetchSubscriptions(1)}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by user, service, or plan..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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

      {/* Subscriptions Table */}
      <Card>
        {loading && pagination.page === 1 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-sm text-gray-500">Loading subscriptions…</span>
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
                        User
                      </div>
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        Service
                      </div>
                    </TableHead>
                    
                    {/* Plan Column - SORTING ENABLED */}
                    <TableHead 
                      onClick={() => handleSort("plan.name")} 
                      className="cursor-pointer whitespace-nowrap"
                    >
                      <div className="flex items-center gap-2">
                        Plan
                        <ArrowUpDown className={`h-4 w-4 ${sortBy === 'plan.name' ? 'text-primary' : 'text-gray-400'}`} />
                      </div>
                    </TableHead>
                    
                    <TableHead className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        Price
                      </div>
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        Start Date
                      </div>
                    </TableHead>
                    
                    {/* Expire Date Column - SORTING ENABLED */}
                    <TableHead 
                      onClick={() => handleSort("expireDate")} 
                      className="cursor-pointer whitespace-nowrap"
                    >
                      <div className="flex items-center gap-2">
                        Expire Date
                        <ArrowUpDown className={`h-4 w-4 ${sortBy === 'expireDate' ? 'text-primary' : 'text-gray-400'}`} />
                      </div>
                    </TableHead>
                    
                    {/* Status Column with Dropdown */}
                    <TableHead className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        Status
                      </div>
                    </TableHead>

                    {/* Actions Column */}
                    <TableHead className="whitespace-nowrap text-center">
                      <div className="flex items-center gap-2">
                        Actions
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((sub) => {
                    const expiringSoon = isExpiringSoon(sub.expireDate);
                    const expired = isExpired(sub.expireDate);
                    
                    return (
                      <TableRow key={sub._id} className="hover:bg-gray-50">
                        {/* User */}
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                              <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm sm:text-base">
                                {sub.userId?.name || '—'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {sub.userId?.mobile || sub.userId?.email || '—'}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Service */}
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center">
                              <Package className="h-3 w-3 text-orange-600" />
                            </div>
                            <span className="text-sm">{sub.serviceId?.name || '—'}</span>
                          </div>
                        </TableCell>

                        {/* Plan */}
                        <TableCell className="whitespace-nowrap">
                          <span className="text-sm font-medium">{sub.planId?.name || '—'}</span>
                        </TableCell>

                        {/* Price */}
                        <TableCell className="whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatPrice(sub)}
                          </span>
                        </TableCell>

                        {/* Start Date */}
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {sub.startDate ? formatDateWithSuffix(sub.startDate) : '—'}
                            </span>
                          </div>
                        </TableCell>

                        {/* Expire Date with Warning Badge */}
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className={`h-4 w-4 ${expired ? 'text-red-400' : expiringSoon ? 'text-orange-400' : 'text-gray-400'}`} />
                            <span className={`text-sm ${
                              expired ? 'text-red-600 font-medium' : 
                              expiringSoon ? 'text-orange-600 font-medium' : 'text-gray-700'
                            }`}>
                              {sub.expireDate ? formatDateWithSuffix(sub.expireDate) : '—'}
                            </span>
                            {expiringSoon && !expired && (
                              <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                                Soon
                              </span>
                            )}
                            {expired && (
                              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                Expired
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* ✅ Status Dropdown - Restored */}
                        <TableCell className="whitespace-nowrap">
                          <select
                            value={sub.status}
                            onChange={(e) => updateStatus(sub._id, e.target.value)}
                            className={`px-2 py-1 text-xs font-medium rounded-md border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                              statusConfig[sub.status]?.className || 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <option value="1">Pending</option>
                            <option value="2">Active</option>
                            <option value="3">Expired</option>
                            <option value="4">Cancelled</option>
                          </select>
                        </TableCell>

                        {/* Action Buttons */}
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs flex items-center gap-1"
                              onClick={() => openRenewModal(sub)}
                              title="Renew Subscription"
                            >
                              <RotateCw className="h-4 w-4" />
                              {/* Renew */}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs flex items-center gap-1"
                              onClick={() => openCorrectModal(sub)}
                              title="Correct Plan"
                            >
                              <Edit className="h-4 w-4" />
                              {/* Correct */}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs flex items-center gap-1"
                              onClick={() => openExtendModal(sub)}
                              title="Extend Subscription"
                            >
                              <CalendarPlus className="h-4 w-4" />
                              {/* Extend */}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View */}
            <div className="block sm:hidden space-y-2 p-2">
              {subscriptions.map((sub) => {
                const expiringSoon = isExpiringSoon(sub.expireDate);
                const expired = isExpired(sub.expireDate);
                
                return (
                  <Card key={sub._id} className="p-3 shadow-sm">
                    <div className="space-y-3">
                      {/* Header with User and Status Dropdown */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{sub.userId?.name || '—'}</div>
                            <div className="text-xs text-gray-500">{sub.userId?.mobile || sub.userId?.email}</div>
                          </div>
                        </div>
                        {/* ✅ Status Dropdown in Mobile */}
                        <select
                          value={sub.status}
                          onChange={(e) => updateStatus(sub._id, e.target.value)}
                          className={`px-2 py-1 text-xs font-medium rounded-md border cursor-pointer ${
                            statusConfig[sub.status]?.className
                          }`}
                        >
                          <option value="1">Pending</option>
                          <option value="2">Active</option>
                          <option value="3">Expired</option>
                          <option value="4">Cancelled</option>
                        </select>
                      </div>

                      {/* Service & Plan Info */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-xs text-gray-500">Service</div>
                          <div className="font-medium">{sub.serviceId?.name || '—'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Plan</div>
                          <div className="font-medium">{sub.planId?.name || '—'}</div>
                        </div>
                      </div>

                      {/* Price & Dates */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-xs text-gray-500">Price</div>
                          <div className="font-semibold text-gray-900">{formatPrice(sub)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Start Date</div>
                          <div className="text-gray-700">{sub.startDate ? formatDateWithSuffix(sub.startDate) : '—'}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-xs text-gray-500">Expire Date</div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${
                              expired ? 'text-red-600 font-medium' : 
                              expiringSoon ? 'text-orange-600 font-medium' : 'text-gray-700'
                            }`}>
                              {sub.expireDate ? formatDateWithSuffix(sub.expireDate) : '—'}
                            </span>
                            {expiringSoon && !expired && (
                              <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                                Soon
                              </span>
                            )}
                            {expired && (
                              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                Expired
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - Mobile */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs flex items-center justify-center gap-1"
                          onClick={() => openRenewModal(sub)}
                        >
                          <RotateCw className="h-3 w-3" />
                          Renew
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs flex items-center justify-center gap-1"
                          onClick={() => openCorrectModal(sub)}
                        >
                          <Edit className="h-3 w-3" />
                          Correct
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs flex items-center justify-center gap-1"
                          onClick={() => openExtendModal(sub)}
                        >
                          <CalendarPlus className="h-3 w-3" />
                          Extend
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* No Data State */}
        {subscriptions.length === 0 && !loading && (
          <div className="p-6 sm:p-12 text-center">
            <CreditCard className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No subscriptions found</h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? "Try adjusting your search or filter criteria"
                : "No subscriptions have been created yet"}
            </p>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {subscriptions.length > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={loading}
          itemsLabel="subscriptions"
          showItemsCount={true}
          showPageInfo={true}
          className="mt-4"
        />
      )}

      {/* Renew Modal */}
      {showRenewModal && selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Renew Subscription</h3>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">User:</span> {selectedSub.userId?.name}
                </p>
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Current Plan:</span> {selectedSub.planId?.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select New Plan
                </label>
                <select
                  value={renewPlan}
                  onChange={(e) => setRenewPlan(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Same Plan</option>
                  {plans.map(plan => (
                    <option key={plan._id} value={plan._id}>
                      {plan.name} - ₹{plan.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={closeModals}>
                  Cancel
                </Button>
                <Button onClick={handleRenew} disabled={actionLoading}>
                  {actionLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Renew'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Correct Plan Modal */}
      {showCorrectModal && selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Correct Plan</h3>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">User:</span> {selectedSub.userId?.name}
                </p>
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Current Plan:</span> {selectedSub.planId?.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select New Plan <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Choose a plan...</option>
                  {plans.map(plan => (
                    <option key={plan._id} value={plan._id}>
                      {plan.name} - ₹{plan.price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={closeModals}>
                  Cancel
                </Button>
                <Button onClick={handleCorrect} disabled={actionLoading || !selectedPlan}>
                  {actionLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Correction'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Extend Modal */}
      {showExtendModal && selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Extend Subscription</h3>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-medium">User:</span> {selectedSub.userId?.name}
                </p>
                <p className="text-sm text-green-800">
                  <span className="font-medium">Current Expiry:</span> {formatDateWithSuffix(selectedSub.expireDate)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Days <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  min="1"
                  value={extendDays}
                  onChange={(e) => setExtendDays(e.target.value)}
                  placeholder="e.g., 30"
                  className="text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={closeModals}>
                  Cancel
                </Button>
                <Button onClick={handleExtend} disabled={actionLoading || !extendDays}>
                  {actionLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Extension'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}