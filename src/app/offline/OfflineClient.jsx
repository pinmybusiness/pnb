'use client';

import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflineClient() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <div className="max-w-md w-full text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-xl surface mx-auto mb-5">
          <WifiOff size={24} className="text-slate-400" />
        </div>
        <h1 className="text-[24px] font-semibold text-white tracking-tight mb-2">You&apos;re offline</h1>
        <p className="text-[14px] text-slate-400 mb-7 max-w-sm mx-auto">
          Check your internet connection and try again. Our tools work locally, but the initial
          load needs a connection.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[14px] font-medium text-white bg-indigo-500 hover:bg-indigo-400 rounded-md transition-colors"
        >
          <RefreshCw size={14} /> Try again
        </button>
      </div>
    </div>
  );
}
