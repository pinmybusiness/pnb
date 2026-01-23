// components/ui/Pagination.jsx
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const Pagination = ({ 
  pagination, 
  onPageChange, 
  loading = false,
  itemsLabel = "items",
  showItemsCount = true,
  showPageInfo = true,
  className = ""
}) => {
  // If no pagination data or only one page, don't render
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages, total, limit } = pagination;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-orange-100 bg-gray-50/50 ${className}`}>
      {/* Items count - Optional */}
      {showItemsCount && (
        <div className="text-sm text-gray-600">
          Showing <span className="font-bold">{startItem}-{endItem}</span> of{" "}
          <span className="font-bold">{total}</span> {itemsLabel}
        </div>
      )}

      {/* Pagination buttons */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1 || loading}
          className={`p-2 rounded-lg transition-all duration-200 ${
            page === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-orange-100 hover:text-[#FF5211]"
          }`}
          aria-label="Go to first page"
        >
          <ChevronsLeft className="w-5 h-5" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1 || loading}
          className={`p-2 rounded-lg transition-all duration-200 ${
            page === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-orange-100 hover:text-[#FF5211]"
          }`}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {/* Always show first page if not visible */}
          {page > 2 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                disabled={loading}
                className={`w-8 h-8 rounded-lg font-medium text-sm transition-all duration-200 ${
                  page === 1
                    ? "bg-gradient-to-r from-[#FF5211] to-orange-600 text-white"
                    : "text-gray-700 hover:bg-orange-100 hover:text-[#FF5211]"
                }`}
              >
                1
              </button>
              {page > 3 && <span className="text-gray-400">...</span>}
            </>
          )}

          {/* Show current and surrounding pages */}
          {[...Array(pages)].map((_, i) => {
            const pageNum = i + 1;
            // Show only: current page, one before, one after
            if (
              pageNum === page ||
              pageNum === page - 1 ||
              pageNum === page + 1
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  disabled={loading}
                  className={`w-8 h-8 rounded-lg font-medium text-sm transition-all duration-200 ${
                    page === pageNum
                      ? "bg-gradient-to-r from-[#FF5211] to-orange-600 text-white"
                      : "text-gray-700 hover:bg-orange-100 hover:text-[#FF5211]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            }
            return null;
          })}

          {/* Always show last page if not visible */}
          {page < pages - 1 && (
            <>
              {page < pages - 2 && <span className="text-gray-400">...</span>}
              <button
                onClick={() => onPageChange(pages)}
                disabled={loading}
                className={`w-8 h-8 rounded-lg font-medium text-sm transition-all duration-200 ${
                  page === pages
                    ? "bg-gradient-to-r from-[#FF5211] to-orange-600 text-white"
                    : "text-gray-700 hover:bg-orange-100 hover:text-[#FF5211]"
                }`}
              >
                {pages}
              </button>
            </>
          )}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages || loading}
          className={`p-2 rounded-lg transition-all duration-200 ${
            page === pages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-orange-100 hover:text-[#FF5211]"
          }`}
          aria-label="Go to next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(pages)}
          disabled={page === pages || loading}
          className={`p-2 rounded-lg transition-all duration-200 ${
            page === pages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-orange-100 hover:text-[#FF5211]"
          }`}
          aria-label="Go to last page"
        >
          <ChevronsRight className="w-5 h-5" />
        </button>
      </div>

      {/* Page info - Optional */}
      {showPageInfo && (
        <div className="text-sm text-gray-600 font-medium">
          Page <span className="text-[#FF5211]">{page}</span> of {pages}
        </div>
      )}
    </div>
  );
};

export default Pagination;