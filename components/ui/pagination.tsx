"use client";

import { CaretLeft, CaretRight } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  return (
    <div className="border-border text-muted-foreground flex items-center justify-between gap-4 border-t px-5 py-3 text-[12px]">
      <p data-slot="numeric">
        {total === 0 ? (
          "Brak wyników"
        ) : (
          <>
            Pokazano{" "}
            <span className="text-foreground font-medium">
              {start}–{end}
            </span>{" "}
            z <span className="text-foreground font-medium">{total}</span>
          </>
        )}
      </p>
      <div className="flex items-center gap-2">
        <span className="hidden tabular-nums sm:inline">
          Strona {page} z {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Poprzednia strona"
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            <CaretLeft weight="bold" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Następna strona"
            disabled={page >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          >
            <CaretRight weight="bold" />
          </Button>
        </div>
      </div>
    </div>
  );
}
