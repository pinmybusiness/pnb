'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { toast } from 'react-hot-toast';
import {
  Settings2, CheckCircle2, XCircle, FlaskConical,
  Save, ToggleLeft, ToggleRight, History, ChevronRight,
  Link2, Loader2
} from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';

// CRM_TYPES numeric values - must match backend constants/crm.js
const CRM_TYPES = { LEADSQUARED: 1 };
const CRM_TYPE_LABELS = { 1: 'LeadSquared' };

export default function CrmConfigPage() {
  const router = useRouter();

  const [config, setConfig]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [testing, setTesting]       = useState(false);
  const [testResult, setTestResult] = useState(null); // { ok: bool, message: string }

  // Form state
  const [callLogUrl, setCallLogUrl] = useState('');
  const [enabled, setEnabled]       = useState(false);

  // ─── Fetch existing config ──────────────────────────────────────────────────

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/crm/config');
      const data = res.data?.data;
      if (data) {
        setConfig(data);
        setCallLogUrl(data.credentials?.callLogUrl || '');
        setEnabled(data.enabled);
      }
    } catch {
      toast.error('Failed to load CRM config');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // ─── Save config ────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!callLogUrl.trim()) {
      toast.error('Call Log URL is required');
      return;
    }
    try {
      setSaving(true);
      setTestResult(null);
      await apiClient.post('/api/crm/config', {
        crmType: CRM_TYPES.LEADSQUARED,
        enabled,
        credentials: {
          callLogUrl: callLogUrl.trim(),
        },
      });
      toast.success('CRM config saved successfully');
      await fetchConfig();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save config');
    } finally {
      setSaving(false);
    }
  };

  // ─── Toggle enable/disable ───────────────────────────────────────────────────

  const handleToggle = async () => {
    if (!config) {
      toast.error('Save config first before enabling');
      return;
    }
    try {
      setSaving(true);
      const newEnabled = !enabled;
      await apiClient.post('/api/crm/config', {
        crmType:     CRM_TYPES.LEADSQUARED,
        enabled:     newEnabled,
        credentials: {
          callLogUrl: callLogUrl.trim(),
        },
      });
      setEnabled(newEnabled);
      toast.success(newEnabled ? 'CRM sync enabled' : 'CRM sync disabled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  // ─── Test connection ─────────────────────────────────────────────────────────

  const handleTest = async () => {
    try {
      setTesting(true);
      setTestResult(null);
      const res = await apiClient.post('/api/crm/config/test');
      setTestResult({ ok: true, message: `Connected - LSQ responded with status ${res.data.lsqStatus}` });
    } catch (err) {
      const msg = err.response?.data?.error
        ? (typeof err.response.data.error === 'object'
            ? JSON.stringify(err.response.data.error)
            : err.response.data.error)
        : 'Connection failed';
      setTestResult({ ok: false, message: msg });
    } finally {
      setTesting(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
          <p className="text-gray-500 text-sm">Loading CRM config...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto p-4 sm:p-6 md:p-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">CRM Integration</h1>
          <p className="text-sm text-gray-500">Push call logs to your CRM automatically</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/crm-config/logs')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <History className="w-4 h-4" />
          Sync Logs
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Config Card */}
      <Card className="p-4 sm:p-6">

        {/* Card Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg">
            <Settings2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-gray-900">LeadSquared Configuration</h2>
            <p className="text-xs text-gray-500">Universal Telephony Connector - Call Log API</p>
          </div>

          {/* Enable / Disable toggle */}
          <button
            onClick={handleToggle}
            disabled={saving}
            className="flex items-center gap-1.5 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {enabled ? (
              <>
                <ToggleRight className="w-6 h-6 text-emerald-600" />
                <span className="text-emerald-700">Enabled</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-6 h-6 text-gray-400" />
                <span className="text-gray-500">Disabled</span>
              </>
            )}
          </button>
        </div>

        {/* Status badge if config exists */}
        {config && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-5">
            <div>
              <p className="text-xs font-medium text-gray-600">Integration Status</p>
              <p className="text-xs text-gray-400 mt-0.5">
                CRM: {CRM_TYPE_LABELS[config.crmType] || 'Unknown'} &nbsp;·&nbsp;
                Last updated: {new Date(config.updatedAt).toLocaleDateString('en-IN')}
              </p>
            </div>
            {config.enabled ? (
              <Badge className="flex items-center gap-1 bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                <CheckCircle2 className="w-3 h-3" /> Active
              </Badge>
            ) : (
              <Badge className="flex items-center gap-1 bg-gray-100 text-gray-600 border-gray-200 text-xs">
                <XCircle className="w-3 h-3" /> Inactive
              </Badge>
            )}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-5">

          {/* Call Log URL */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-gray-400" />
              Call Log URL
              <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={callLogUrl}
              onChange={e => setCallLogUrl(e.target.value)}
              placeholder="https://api.leadsquared.com/v2/TelephonyManagement.svc/CallLog?accessKey=...&secretKey=..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-400 mt-1">
              LeadSquared UTC settings page → Call Log API endpoint
            </p>
          </div>

        </div>

        {/* Test Result */}
        {testResult && (
          <div className={`mt-5 flex items-start gap-2.5 p-3 rounded-lg text-sm ${
            testResult.ok
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {testResult.ok
              ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              : <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            }
            <span className="text-xs leading-relaxed">{testResult.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-gray-100">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 text-sm"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : 'Save Config'}
          </Button>

          <Button
            variant="outline"
            onClick={handleTest}
            disabled={testing || !config}
            className="flex items-center gap-2 px-5 py-2 text-sm"
            title={!config ? 'Save config first' : 'Send a test payload to LeadSquared'}
          >
            {testing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FlaskConical className="w-4 h-4" />
            )}
            {testing ? 'Testing...' : 'Test Connection'}
          </Button>
        </div>
      </Card>

      {/* How it works */}
      <Card className="p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">How it works</h3>
        <ol className="space-y-2.5">
          {[
            'A call is received and saved in FasterQ',
            'A sync job is added to the CRM queue',
            'Every 5 minutes, the queue processor pushes data to LeadSquared',
            'Once the recording URL is available, the same job is updated with it',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-semibold text-xs">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </Card>

    </div>
  );
}
