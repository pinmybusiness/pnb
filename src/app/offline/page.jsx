// app/offline/page.js
'use client';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Offline</h1>
        <p className="text-gray-600 mb-6">Check your internet connection.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#FF5211] text-white px-6 py-2 rounded"
        >
          Retry
        </button>
      </div>
    </div>
  );
}