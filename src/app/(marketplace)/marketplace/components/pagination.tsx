'use client';

import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Function to change page while preserving other search params
  const goToPage = (page: number) => {
    // Clamp page to valid range
    const clamped = Math.max(1, Math.min(totalPages, page));
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', clamped.toString());
    // Only push when page actually changes
    if (clamped !== currentPage) {
      router.push(`?${params.toString()}`);
    }
  };

  // Determine which page numbers to show
  // Simple approach: show current page and neighbors
  const getPageNumbers = () => {
    const pages: number[] = [];

    // Always show first page
    pages.push(1);

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Always show last page if there's more than 1 page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      aria-label="Pagination"
      className="flex w-full flex-col items-center gap-3 border-t border-border/40 pt-6"
    >
      <ul className="flex items-center gap-2">
        <li>
          <Button
            variant="outline"
            size="md"
            aria-label="Previous page"
            className="h-9 rounded-full px-3 text-sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </Button>
        </li>

        {pageNumbers.map((pageNum, index) => {
          // Add ellipsis if there's a gap
          const prevPage = index > 0 ? pageNumbers[index - 1] : 0;
          const showEllipsis = pageNum - prevPage > 1;

          return (
            <li key={pageNum} className="flex items-center gap-2">
              {showEllipsis && (
                <span
                  key={`ellipsis-${pageNum}`}
                  className="px-2 text-sm text-muted-foreground"
                >
                  ...
                </span>
              )}
              <Button
                variant="outline"
                size="md"
                aria-current={pageNum === currentPage ? 'page' : undefined}
                className={`h-9 rounded-full px-3 text-sm ${
                  pageNum === currentPage
                    ? 'bg-primary text-white hover:bg-primary hover:text-white'
                    : ''
                }`}
                onClick={() => goToPage(pageNum)}
              >
                {pageNum}
              </Button>
            </li>
          );
        })}

        <li>
          <Button
            variant="outline"
            size="md"
            aria-label="Next page"
            className="h-9 rounded-full px-3 text-sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </Button>
        </li>
      </ul>

      <div className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{currentPage}</span> of{' '}
        <span className="font-medium text-foreground">{totalPages}</span>
      </div>
    </nav>
  );
}
