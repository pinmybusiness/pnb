// app/offline/page.js
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">You're Offline</h1>
        <p className="text-lg text-gray-600 mb-6">
          Please check your internet connection.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#FF5211] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#E04A0F] transition-colors"
        >
          Try Again
        </button>
        <Link href="/dashboard/tracking/missed-calls" className="block mt-4 text-[#FF5211] hover:text-[#E04A0F]">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}