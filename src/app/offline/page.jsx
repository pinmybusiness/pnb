'use client';

import Link from 'next/link';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-[80vh] bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-100 mx-auto mb-6">
          <WifiOff size={36} className="text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">You&apos;re offline</h1>
        <p className="text-slate-600 mb-8 max-w-sm mx-auto">
          Check your internet connection and try again. Our tools work locally, but the initial
          load needs a connection.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md transition-all"
        >
          <RefreshCw size={15} /> Try Again
        </button>
      </div>
    </div>
  );
}
