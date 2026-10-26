import { pageCountOf } from "@discordia/client-shared";

import { rangeLabel } from "@/utils/pagination";

import { Pagination } from "./Pagination";

interface PaginationBarProps {
  /** 1-based. */
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function PaginationBar({
  page,
  pageSize,
  total,
  onPageChange,
}: PaginationBarProps) {
  const pageCount = pageCountOf(total, pageSize);
  if (pageCount <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p
        aria-live="polite"
        className="text-content-muted text-[13px] tabular-nums"
      >
        {rangeLabel(page, pageSize, total)}
      </p>
      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={onPageChange}
      />
    </div>
  );
}
