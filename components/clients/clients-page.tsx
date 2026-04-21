"use client";

import { useState, useTransition } from "react";
import { Warning } from "@phosphor-icons/react";

import { ApiError } from "@/lib/api";
import { archiveClient, restoreClient, type Client } from "@/lib/clients";
import { useClients, useDebouncedValue } from "@/lib/use-clients";

import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { ClientsEmptyState } from "./clients-empty-state";
import { ClientsTable } from "./clients-table";
import { ClientsTableSkeleton } from "./clients-table-skeleton";
import { ClientsToolbar } from "./clients-toolbar";

const PAGE_SIZE = 20;

export function ClientsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [includeArchived, setIncludeArchived] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 250);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const { data, isLoading, error, refetch, removeFromCache } = useClients({
    q: debouncedQuery.trim() || undefined,
    page,
    pageSize: PAGE_SIZE,
    includeArchived,
  });

  function handleQueryChange(value: string) {
    setQuery(value);
    setPage(1);
  }

  function handleIncludeArchivedChange(value: boolean) {
    setIncludeArchived(value);
    setPage(1);
  }

  async function runMutation(client: Client, mode: "archive" | "restore") {
    setMutationError(null);
    setPendingId(client.id);
    try {
      if (mode === "archive") {
        await archiveClient(client.id);
      } else {
        await restoreClient(client.id);
      }
      startTransition(() => {
        if (mode === "archive" && !includeArchived) {
          removeFromCache(client.id);
        }
        void refetch();
      });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : mode === "archive"
            ? "Nie udało się zarchiwizować klienta."
            : "Nie udało się przywrócić klienta.";
      setMutationError(message);
    } finally {
      setPendingId(null);
    }
  }

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const hasQuery = debouncedQuery.trim().length > 0;

  return (
    <div className="flex flex-col">
      <div className="border-border bg-background/90 sticky top-[52px] z-20 border-b backdrop-blur-md">
        <div className="mx-auto w-full max-w-6xl px-6 py-4 md:px-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <h1 className="text-foreground text-[20px] font-semibold tracking-tight">
                  Klienci
                </h1>
                {!isLoading && !error ? (
                  <Badge variant="muted" size="default" data-slot="numeric">
                    {total}
                  </Badge>
                ) : null}
              </div>
              <p className="text-muted-foreground hidden text-[12.5px] sm:block">
                Zarządzaj bazą kontaktów, statusami i notatkami.
              </p>
            </div>
            <ClientsToolbar
              query={query}
              onQueryChange={handleQueryChange}
              includeArchived={includeArchived}
              onIncludeArchivedChange={handleIncludeArchivedChange}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-6 md:px-10">
        {mutationError ? (
          <div
            role="alert"
            className="border-destructive/40 bg-destructive/5 text-destructive mb-4 flex items-start gap-2 rounded-md border px-3 py-2 text-[12.5px]"
          >
            <Warning className="mt-0.5 size-4 shrink-0" weight="regular" />
            <span>{mutationError}</span>
          </div>
        ) : null}

        <section className="border-border bg-card overflow-hidden rounded-lg border shadow-xs">
          {isLoading ? (
            <ClientsTableSkeleton />
          ) : error ? (
            <div
              role="alert"
              className="border-destructive/40 bg-destructive/5 text-destructive m-4 flex items-start gap-2 rounded-md border px-3 py-3 text-[13px]"
            >
              <Warning className="mt-0.5 size-4 shrink-0" weight="regular" />
              <div className="flex flex-col gap-2">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="text-foreground hover:text-destructive text-[12.5px] font-medium underline underline-offset-2"
                >
                  Spróbuj ponownie
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <ClientsEmptyState hasQuery={hasQuery} onClearQuery={() => handleQueryChange("")} />
          ) : (
            <>
              <ClientsTable
                clients={items}
                onArchive={(client) => void runMutation(client, "archive")}
                onRestore={(client) => void runMutation(client, "restore")}
                pendingId={pendingId}
              />
              <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
