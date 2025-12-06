// src/components/blog/Pagination.jsx
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({ currentPage, hasNextPage, totalPages }) {
  const searchParams = useSearchParams();
  const nextPage = currentPage + 1;
  const prevPage = currentPage > 1 ? currentPage - 1 : 1;

  const createQueryString = (name, value) => {
    const params = new URLSearchParams(searchParams);
    params.set(name, value);
    return params.toString();
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Maximum page numbers to show
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination with ellipsis
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-6 mt-12">
      {/* Main Pagination */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {/* First Page Button */}
        {currentPage > 1 ? (
          <Link
            href={`/blog?${createQueryString('page', 1)}`}
            className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-orange-200 hover:border-orange-300 bg-white hover:bg-orange-50 text-gray-700 hover:text-[#FF5211] transition-all duration-300 hover:scale-110 group"
            title="First page"
          >
            <ChevronsLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <button
            disabled
            className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}

        {/* Previous Page Button */}
        {currentPage > 1 ? (
          <Link
            href={`/blog?${createQueryString('page', prevPage)}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-orange-200 hover:border-orange-300 bg-white hover:bg-orange-50 text-gray-700 hover:text-[#FF5211] font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Previous</span>
          </Link>
        ) : (
          <button
            disabled
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-400 font-semibold cursor-not-allowed opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>
        )}

        {/* Page Numbers */}
        <div className="flex items-center gap-2">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 font-bold"
                >
                  •••
                </span>
              );
            }

            const isActive = page === currentPage;
            
            return (
              <Link
                key={page}
                href={`/blog?${createQueryString('page', page)}`}
                className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF5211] to-orange-600 text-white shadow-lg shadow-orange-500/30 scale-110'
                    : 'border-2 border-orange-200 hover:border-orange-300 bg-white hover:bg-orange-50 text-gray-700 hover:text-[#FF5211] hover:scale-105'
                }`}
              >
                {page}
              </Link>
            );
          })}
        </div>

        {/* Next Page Button */}
        {hasNextPage ? (
          <Link
            href={`/blog?${createQueryString('page', nextPage)}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-orange-200 hover:border-orange-300 bg-white hover:bg-orange-50 text-gray-700 hover:text-[#FF5211] font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <button
            disabled
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-400 font-semibold cursor-not-allowed opacity-50"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Last Page Button */}
        {hasNextPage ? (
          <Link
            href={`/blog?${createQueryString('page', totalPages)}`}
            className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-orange-200 hover:border-orange-300 bg-white hover:bg-orange-50 text-gray-700 hover:text-[#FF5211] transition-all duration-300 hover:scale-110 group"
            title="Last page"
          >
            <ChevronsRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <button
            disabled
            className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Info Text */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Showing page <span className="font-bold text-[#FF5211]">{currentPage}</span> of{' '}
          <span className="font-bold text-gray-900">{totalPages}</span>
        </p>
      </div>

      {/* Mobile Quick Navigation */}
      <div className="md:hidden flex items-center gap-3 w-full max-w-xs">
        {currentPage > 1 && (
          <Link
            href={`/blog?${createQueryString('page', prevPage)}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-orange-200 hover:border-orange-300 text-gray-700 hover:text-[#FF5211] font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Link>
        )}
        {hasNextPage && (
          <Link
            href={`/blog?${createQueryString('page', nextPage)}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#FF5211] to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}