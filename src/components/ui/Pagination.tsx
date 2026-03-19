// ============================================================
// Pagination Component
// Renders page numbers with previous/next arrows.
// ============================================================

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build the page numbers array with ellipsis logic
  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [1, 2];

    if (currentPage > 3) pages.push("...");

    const middle = [currentPage - 1, currentPage, currentPage + 1].filter(
      (p) => p > 2 && p < totalPages - 1
    );
    pages.push(...middle);

    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages - 1, totalPages);

    return [...new Set(pages)];
  };

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-4"
      aria-label="Pagination"
    >
      {/* Previous page button */}
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={14} />
      </button>

      {/* Page number buttons */}
      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="pagination-btn border-transparent"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`pagination-btn ${currentPage === page ? "active" : ""}`}
            onClick={() => onPageChange(page as number)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Next page button */}
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={14} />
      </button>
    </nav>
  );
}
