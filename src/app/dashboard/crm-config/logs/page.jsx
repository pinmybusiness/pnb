'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft, RefreshCw, RotateCcw, CheckCircle2,
  Clock, XCircle, AlertTriangle, Loader2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';

const STATUS_CONFIG = {
  1: { label: 'Pending',   color: 'bg-amber-100 text-amber-800 border-amber-200',   icon: Clock         },
  2: { label: 'Sent',      color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
  3: { label: 'Failed',    color: 'bg-red-100 text-red-800 border-red-200',          icon: XCircle       },
  4: { label: 'Exhausted', color: 'bg-gray-100 text-gray-600 border-gray-200',       icon: AlertTriangle },
};

const STATUS_FILTERS = [
  { value: '',  label: 'All'       },
  { value: '1', label: 'Pending'   },
  { value: '2', label: 'Sent'      },
  { value: '3', label: 'Failed'    },
  { value: '4', label: 'Exhausted' },
];

export default function CrmLogsPage() {
  const router = useRouter();

  const [logs, setLogs]           = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [retrying, setRetrying]   = useState(null); // jobId being retried
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage]           = useState(1);
  const LIMIT = 20;

  // ─── Fetch logs ─────────────────────────────────────────────────────────────

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: LIMIT };
      if (statusFilter) params.status = statusFilter;
      const res = await apiClient.get('/api/crm/logs', { params });
      setLogs(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch {
      toast.error('Failed to load sync logs');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Reset to page 1 when filter changes
  const handleFilterChange = (val) => {
    setStatusFilter(val);
    setPage(1);
  };

  // ─── Retry job ───────────────────────────────────────────────────────────────

  const handleRetry = async (jobId) => {
    try {
      setRetrying(jobId);
      await apiClient.post(`/api/crm/logs/${jobId}/retry`);
      toast.success('Job reset to pending — will retry in next cycle');
      await fetchLogs();
    } catch {
      toast.error('Failed to retry job');
    } finally {
      setRetrying(null);
    }
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const totalPages = Math.ceil(total / LIMIT);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true }) : '—';

  const truncate = (str, n = 60) =>
    str && str.length > n ? str.slice(0, n) + '...' : (str || '—');

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4 max-w-6xl mx-auto p-4 sm:p-6 md:p-8">

      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard/crm-config')}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-500" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CRM Sync Logs</h1>
            <p className="text-xs text-gray-500">
              {total} total job{total !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 text-sm px-3 py-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 flex-wrap">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => handleFilterChange(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-slate-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16">
            <CheckCircle2 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No sync jobs found</p>
            <p className="text-xs text-gray-400 mt-1">
              Jobs appear here once calls start syncing to CRM
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Call ID</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Attempts</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Synced At</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Last Error</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((job) => {
                  const sc = STATUS_CONFIG[job.status] || STATUS_CONFIG[3];
                  const Icon = sc.icon;
                  const canRetry = job.status === 3 || job.status === 4; // failed or exhausted

                  return (
                    <tr key={job._id} className="hover:bg-gray-50 transition-colors">

                      {/* Status */}
                      <td className="px-4 py-3">
                        <Badge className={`flex items-center gap-1 text-xs w-fit ${sc.color}`}>
                          <Icon className="w-3 h-3" />
                          {sc.label}
                        </Badge>
                      </td>

                      {/* Call ID */}
                      <td className="px-4 py-3">
                        <code className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                          {String(job.callId).slice(-8)}
                        </code>
                      </td>

                      {/* Attempts */}
                      <td className="px-4 py-3">
                        {job.status === 2 && job.attempts === 0 ? (
                          <span className="text-xs text-emerald-600 font-medium">1st try</span>
                        ) : (
                          <span className={`text-xs font-medium ${job.attempts >= job.maxAttempts ? 'text-red-600' : 'text-gray-600'}`}>
                            {job.attempts} / {job.maxAttempts}
                          </span>
                        )}
                      </td>

                      {/* Synced At — sentAt for sent jobs, lastAttemptAt for failed, createdAt fallback */}
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(job.sentAt || job.lastAttemptAt || job.createdAt)}
                      </td>

                      {/* Last Error */}
                      <td className="px-4 py-3 text-xs text-gray-400 max-w-xs">
                        {job.lastError ? (
                          <span className="text-red-500" title={job.lastError}>
                            {truncate(job.lastError, 50)}
                          </span>
                        ) : '—'}
                      </td>

                      {/* Retry Action */}
                      <td className="px-4 py-3">
                        {canRetry && (
                          <button
                            onClick={() => handleRetry(job._id)}
                            disabled={retrying === job._id}
                            className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 disabled:opacity-50 transition-colors"
                          >
                            {retrying === job._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <RotateCcw className="w-3.5 h-3.5" />
                            )}
                            Retry
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Page {page} of {totalPages} &nbsp;·&nbsp; {total} total
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
