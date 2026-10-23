import { pageCountOf } from "@discordia/client-shared";

import { Pagination } from "./Pagination";

interface PaginationBarProps {
  /** 1-based. */
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

/** Paginador centrado al pie de un listado. No se muestra si entra todo en una página. */
export function PaginationBar({
  page,
  pageSize,
  total,
  onPageChange,
}: PaginationBarProps) {
  const pageCount = pageCountOf(total, pageSize);
  if (pageCount <= 1) return null;

  return (
    <div className="flex justify-center">
      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={onPageChange}
      />
    </div>
  );
}
