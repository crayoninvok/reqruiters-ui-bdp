import React from "react";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
}) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg shadow-xl px-4 py-3 flex items-center justify-between sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={!pagination.hasPrevPage}
          className="relative inline-flex items-center px-4 py-2 border border-gray-600/30 text-sm font-medium rounded-md text-gray-200 bg-gray-700/50 hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={!pagination.hasNextPage}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600/30 text-sm font-medium rounded-md text-gray-200 bg-gray-700/50 hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm transition-colors"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-300">
            Showing{" "}
            <span className="font-medium text-white">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-white">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-white">{pagination.total}</span>{" "}
            results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600/30 bg-gray-700/50 text-sm font-medium text-gray-400 hover:bg-gray-600/50 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm transition-colors"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Page Numbers */}
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                const pageNumber = Math.max(
                  1,
                  Math.min(
                    pagination.page - 2 + i,
                    pagination.totalPages - 4 + i
                  )
                );

                if (pageNumber > pagination.totalPages) return null;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => onPageChange(pageNumber)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors backdrop-blur-sm ${
                      pagination.page === pageNumber
                        ? "z-10 bg-blue-900/30 border-blue-400/20 text-blue-300"
                        : "bg-gray-700/50 border-gray-600/30 text-gray-400 hover:bg-gray-600/50 hover:text-gray-200"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }
            )}

            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600/30 bg-gray-700/50 text-sm font-medium text-gray-400 hover:bg-gray-600/50 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm transition-colors"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
