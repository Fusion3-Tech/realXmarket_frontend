'use client';

import { Button } from '@/components/ui/button';

type PaginationProps = {
  currentPage?: number;
  totalPages?: number;
};

export default function Pagination(_: PaginationProps) {
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
            className="h-9 px-3 rounded-full text-sm"
          >
            ‹
          </Button>
        </li>

        <li>
          <Button
            variant="outline"
            size="md"
            aria-current="page"
            className="h-9 px-3 rounded-full text-sm bg-primary text-white hover:bg-primary hover:text-white"
          >
            1
          </Button>
        </li>

        <li>
          <Button variant="outline" size="md" className="h-9 px-3 rounded-full text-sm">
            2
          </Button>
        </li>
        <li>
          <Button variant="outline" size="md" className="h-9 px-3 rounded-full text-sm">
            3
          </Button>
        </li>

        <li>
          <Button
            variant="outline"
            size="md"
            aria-label="Next page"
            className="h-9 px-3 rounded-full text-sm"
          >
            ›
          </Button>
        </li>
      </ul>

      <div className="text-sm text-muted-foreground">
        Page <span className="text-foreground font-medium">1</span> of{' '}
        <span className="text-foreground font-medium">3</span>
      </div>
    </nav>
  );
}
