'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, ChevronLeft, ChevronRight, Search, ArrowUpDown, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useSelector } from 'react-redux';
import StatusBadge from '@/components/ui/StatusBadge';
import KPICard from '@/components/ui/KPICard';
import { Card, Button, Input, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';
import { getStatusText } from '@/utils/application';
import { formatDateWithSuffix } from '@/utils/dateFormat';
import { useDebounce } from 'use-debounce';

const CandidateApplicationsPage = () => {
  const router = useRouter();
  const { user, token } = useSelector((state) => state.auth);
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, totalPages: 1, count: 0, totalRecords: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
  const [sortBy, setSortBy] = useState('appliedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    if (token) {
      fetchApplications();
    }
  }, [token, debouncedSearchTerm, sortBy, sortOrder, pagination.current]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: 10,
        sort: sortBy,
        order: sortOrder,
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
      };
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/my`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      if (response.data.success) {
        setApplications(response.data.data);
        setPagination({
          current: response.data.pagination.current,
          totalPages: response.data.pagination.totalPages,
          count: response.data.count,
          totalRecords: response.data.pagination.totalRecords,
        });
      } else {
        toast.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const calculateKPIs = () => {
    if (applications.length === 0) return { totalApplications: 0, pendingApplications: 0, hiredCandidates: 0 };
    
    return {
      totalApplications: pagination.totalRecords,
      pendingApplications: applications.filter(app => app.status === 0).length,
      hiredCandidates: applications.filter(app => app.status === 5).length,
    };
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, current: newPage }));
    }
  };

  const kpiData = calculateKPIs();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="p-2 text-gray-600 hover:text-primary rounded-md"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Applications</h1>
          <p className="text-gray-500">Track status of jobs & internships you applied to</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total Applications" value={kpiData.totalApplications} icon={FileText} />
        <KPICard title="Pending Applications" value={kpiData.pendingApplications} icon={FileText} />
        <KPICard title="Hired" value={kpiData.hiredCandidates} icon={FileText} />
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by opportunity title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Applications Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('opportunity')} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Opportunity
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead onClick={() => handleSort('appliedAt')} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Applied Date
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application._id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{application.opportunity?.title || 'No title'}</div>
                    <div className="text-sm text-gray-500">{application.opportunity?.branch?.name || 'No branch'}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={getStatusText(application.status)} />
                </TableCell>
                <TableCell>{formatDateWithSuffix(application.appliedAt)}</TableCell>
                <TableCell>
                  <button
                    onClick={() => router.push(`/dashboard/applications/${application._id}`)}
                    className="p-2 text-gray-600 hover:text-gray-700"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {applications.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-500">You haven’t applied to any opportunities yet.</p>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {applications.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <p className="text-sm text-gray-500">
            Showing {pagination.count} of {pagination.totalRecords} applications
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="px-3 py-1"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600">
              Page {pagination.current} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.current + 1)}
              disabled={pagination.current === pagination.totalPages}
              className="px-3 py-1"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateApplicationsPage;
