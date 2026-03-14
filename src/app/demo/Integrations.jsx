"use client";

import { useState, useCallback } from "react";
import { 
  Copy, 
  Eye, 
  EyeOff, 
  Key, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Code2, 
  ChevronRight, 
  Lock, 
  Globe, 
  Terminal, 
  Database, 
  FileJson, 
  ArrowRight 
} from "lucide-react";

// ─── Orange color constant ─────────────────────────────────────────────
const ORANGE = "#ff5a1f";
const ORANGE_LIGHT = "#fff1e6";

// ─── Card Component ───────────────────────────────────────────────
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

// ─── Badge Component ──────────────────────────────────────────────
const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    outline: "border border-gray-200 text-gray-600",
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-purple-100 text-purple-800",
    yellow: "bg-yellow-100 text-yellow-800",
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ─── Button Component ─────────────────────────────────────────────
const Button = ({ children, variant = "default", size = "default", onClick, className = "", ...props }) => {
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700",
  };
  
  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
  };
  
  return (
    <button
      className={`rounded-lg font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// ─── Main Integrations Demo Screen ─────────────────────────────────
export default function IntegrationsDemoScreen() {
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const generateKey = async () => {
    setLoading(true);
    setMessage("Generating API key...");
    
    // Simulate API call
    setTimeout(() => {
      setApiKey({
        key: "fk_live_8x7w3k9m2n4p6q8r2t5v7w9x1y3z5a7b",
        active: true,
        name: "CRM Integration",
        created: new Date().toISOString(),
      });
      setMessage("API key generated. Activate to use.");
      setLoading(false);
    }, 1500);
  };

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="space-y-4 max-w-7xl mx-auto animate-fade-in p-4">
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div>
          <h4 className="text-xl sm:text-2xl font-bold text-gray-900">API Integrations</h4>
          <p className="text-sm text-gray-500">Manage API keys and connect with external services</p>
        </div>
      </div>

      {/* API Key Card */}
      <Card className="p-3 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">API Key Management</h4>
            <p className="text-sm text-gray-500">Generate and manage your API access keys</p>
          </div>
        </div>

        {!apiKey ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-50 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-slate-600" />
            </div>
            <h5 className="text-lg font-semibold text-gray-900 mb-2">
              No API Key Generated
            </h5>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">
              Create your first API key to start integrating with CRMs and external services
            </p>
            <Button
              onClick={generateKey}
              disabled={loading}
              className="inline-flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate API Key
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Section */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Key Status</p>
              </div>
              {apiKey.active ? (
                <Badge variant="success" className="flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  <span>Active</span>
                </Badge>
              ) : (
                <Badge variant="warning" className="flex items-center">
                  <XCircle className="w-3 h-3 mr-1" />
                  <span>Inactive</span>
                </Badge>
              )}
            </div>

            {/* API Key Display */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Your API Key
              </label>
              <div className="relative">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <Key className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <code className="flex-1 overflow-hidden text-sm font-mono">
                    {showKey ? apiKey.key : "•".repeat(48)}
                  </code>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowKey(!showKey)}
                      className="h-8 px-2"
                    >
                      {showKey ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="h-8 px-2"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {message && (
              <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></div>
                {message}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* API Documentation Card */}
      <Card className="p-3 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">API Documentation</h3>
            <p className="text-sm text-gray-500">Technical details and integration guides</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "details" 
                ? "border-slate-700 text-slate-900" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Endpoint Details
            </div>
          </button>
          <button
            onClick={() => setActiveTab("response")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "response" 
                ? "border-slate-700 text-slate-900" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileJson className="w-4 h-4" />
              Response Structure
            </div>
          </button>
        </div>

        {activeTab === "details" ? (
          <div className="space-y-6">
            {/* Base URL */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Base URL
              </label>
              <Card className="p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <code className="text-sm font-mono text-gray-800">
                      https://api.fasterq.in
                    </code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("https://api.fasterq.in")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </div>

            {/* Fetch Calls Endpoint */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Fetch Calls Endpoint
              </label>
              <Card className="p-4 border border-gray-200">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-gray-400" />
                      <code className="text-sm font-mono text-gray-800">
                        GET /api/integrations/calls
                      </code>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      GET
                    </Badge>
                  </div>
                  <div className="pl-6">
                    <p className="text-xs text-gray-500">Query Parameters:</p>
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                        <code className="text-xs font-mono text-gray-700">
                          from: string (ISO date)
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                        <code className="text-xs font-mono text-gray-700">
                          to: string (ISO date)
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                        <code className="text-xs font-mono text-gray-700">
                          page: number (optional)
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                        <code className="text-xs font-mono text-gray-700">
                          limit: number (optional, default: 20)
                        </code>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard("GET /api/integrations/calls?from=2026-01-01T00:00:00Z&to=2026-02-01T00:00:00Z")}
                      className="w-full flex items-center justify-start text-xs"
                    >
                      <Copy className="w-3 h-3 mr-2" />
                      <span>Copy full example</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Authorization */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Authorization Header
              </label>
              <Card className="p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <code className="text-sm font-mono">
                      Authorization: Bearer{" "}
                      <span className="text-emerald-600">YOUR_API_KEY</span>
                    </code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("Authorization: Bearer YOUR_API_KEY")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Response Schema */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                CallData Response Schema
              </label>
              <Card className="p-4 border border-gray-200">
                <div className="space-y-4">
                  {/* Schema Header */}
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <Database className="w-4 h-4 text-gray-400" />
                    <code className="text-sm font-mono font-semibold text-gray-900">
                      CallData Object
                    </code>
                  </div>
                  
                  {/* Fields Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <code className="text-xs font-mono bg-gray-50 px-2 py-1 rounded">answered</code>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <Badge variant="blue" className="text-xs">boolean</Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">Whether the call was answered</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <code className="text-xs font-mono bg-gray-50 px-2 py-1 rounded">callId</code>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <Badge variant="green" className="text-xs">string</Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">Unique identifier for the call</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <code className="text-xs font-mono bg-gray-50 px-2 py-1 rounded">createdAt</code>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <Badge variant="purple" className="text-xs">date-time</Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">When the call record was created</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <code className="text-xs font-mono bg-gray-50 px-2 py-1 rounded">duration</code>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <Badge variant="yellow" className="text-xs">number</Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">Call duration in seconds</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <code className="text-xs font-mono bg-gray-50 px-2 py-1 rounded">formattedNumber</code>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <Badge variant="green" className="text-xs">string</Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">Formatted phone number</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <code className="text-xs font-mono bg-gray-50 px-2 py-1 rounded">inbound</code>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <Badge variant="blue" className="text-xs">boolean</Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">True for incoming calls</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <code className="text-xs font-mono bg-gray-50 px-2 py-1 rounded">number</code>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <Badge variant="green" className="text-xs">string</Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">Raw phone number</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <code className="text-xs font-mono bg-gray-50 px-2 py-1 rounded">phonebookName</code>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <Badge variant="green" className="text-xs">string</Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">Contact name from phonebook</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <code className="text-xs font-mono bg-gray-50 px-2 py-1 rounded">recUrl</code>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <Badge variant="green" className="text-xs">string</Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">Recording URL</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <code className="text-xs font-mono bg-gray-50 px-2 py-1 rounded">startTime</code>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <Badge variant="purple" className="text-xs">date-time</Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">When the call started</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <code className="text-xs font-mono bg-gray-50 px-2 py-1 rounded">userId</code>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <Badge variant="green" className="text-xs">string</Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">User/agent ID</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <code className="text-xs font-mono bg-gray-50 px-2 py-1 rounded">userName</code>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <Badge variant="green" className="text-xs">string</Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">User/agent name</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <code className="text-xs font-mono bg-gray-50 px-2 py-1 rounded">userPhone</code>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <Badge variant="green" className="text-xs">string</Badge>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-600">User/agent phone number</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </div>

            {/* Full Example Response */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Complete Example Response
              </label>
              <Card className="p-4 border border-gray-200">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileJson className="w-4 h-4 text-gray-400" />
                      <code className="text-sm font-mono text-gray-800">
                        Successful API Response
                      </code>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify({
                        success: true,
                        data: [{
                          answered: true,
                          callId: "call_123456",
                          createdAt: "2026-01-15T10:30:00Z",
                          duration: 180,
                          formattedNumber: "+1 (234) 567-890",
                          inbound: true,
                          number: "+1234567890",
                          phonebookName: "John Doe",
                          recUrl: "https://cdn.fasterq.in/recordings/call_123456.mp3",
                          startTime: "2026-01-15T10:30:00Z",
                          userId: "user_789",
                          userName: "Agent Smith",
                          userPhone: "+1987654321",
                        }],
                        total: 1,
                        page: 1,
                        limit: 20
                      }, null, 2))}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <pre className="text-xs font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    {`{
                    "success": true,
                    "data": [
                        {
                        "answered": true,
                        "callId": "call_123456",
                        "createdAt": "2026-01-15T10:30:00Z",
                        "duration": 180,
                        "formattedNumber": "+1 (234) 567-890",
                        "inbound": true,
                        "number": "+1234567890",
                        "phonebookName": "John Doe",
                        "recUrl": "https://cdn.fasterq.in/recordings/call_123456.mp3",
                        "startTime": "2026-01-15T10:30:00Z",
                        "userId": "user_789",
                        "userName": "Agent Smith",
                        "userPhone": "+1987654321"
                        }
                    ],
                    "total": 1,
                    "page": 1,
                    "limit": 20
                    }`}
                  </pre>
                </div>
              </Card>
            </div>

            {/* Response Notes */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <ArrowRight className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Response Notes
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• All timestamps are in ISO 8601 format (UTC)</li>
                    <li>• Duration is in seconds (0 for missed/unanswered calls)</li>
                    <li>• <code>phonebookName</code> is populated if caller is in contacts</li>
                    <li>• <code>recUrl</code> may be null if no recording available</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4 mt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg">
              <Lock className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                Security Notice
              </h4>
              <p className="text-xs text-gray-600">
                Keep your API key secure and never commit it to version control.
                Rotate keys regularly and use environment variables in production.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}