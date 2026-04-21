"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { MagnifyingGlass, Plus, X } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Switch } from "@/components/ui/switch";

type ClientsToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  includeArchived: boolean;
  onIncludeArchivedChange: (value: boolean) => void;
};

export function ClientsToolbar({
  query,
  onQueryChange,
  includeArchived,
  onIncludeArchivedChange,
}: ClientsToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const archivedId = useId();

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (event.key !== "/" || event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      const isTyping = tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable === true;
      if (isTyping) return;
      event.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <MagnifyingGlass
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2"
            weight="regular"
            aria-hidden
          />
          <Input
            ref={inputRef}
            type="search"
            inputMode="search"
            placeholder="Szukaj klientów"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="h-9 pr-14 pl-8 text-[13px]"
            aria-label="Szukaj klientów"
          />
          <div className="absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center gap-1">
            {query ? (
              <button
                type="button"
                aria-label="Wyczyść wyszukiwanie"
                onClick={() => onQueryChange("")}
                className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring/40 inline-flex size-6 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <X weight="bold" className="size-3" />
              </button>
            ) : (
              <Kbd className="pointer-events-none">/</Kbd>
            )}
          </div>
        </div>

        <label
          htmlFor={archivedId}
          className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-2 text-[13px] transition-colors select-none"
        >
          <Switch
            id={archivedId}
            checked={includeArchived}
            onCheckedChange={(value) => onIncludeArchivedChange(Boolean(value))}
          />
          Pokaż archiwum
        </label>
      </div>

      <Button asChild size="default">
        <Link href="/clients/new">
          <Plus weight="bold" />
          Nowy klient
        </Link>
      </Button>
    </div>
  );
}
