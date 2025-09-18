export default function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <div className="h-5 w-40 bg-gray-200 rounded"></div>
          <div className="h-4 w-28 bg-gray-200 rounded"></div>
        </div>
        {/* Applied count placeholder */}
        {/* <div className="h-5 w-16 bg-gray-200 rounded-full"></div> */}
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gray-200 w-8 h-8"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gray-200 w-8 h-8"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gray-200 w-8 h-8"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-6">
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center">
        <div className="h-3 w-24 bg-gray-200 rounded"></div>
        <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}
