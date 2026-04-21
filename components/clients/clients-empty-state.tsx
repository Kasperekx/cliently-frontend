import Link from "next/link";
import { Plus } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  EmptyClientsIllustration,
  SearchEmptyIllustration,
} from "@/components/illustrations/empty-clients";

type ClientsEmptyStateProps = {
  hasQuery?: boolean;
  onClearQuery?: () => void;
};

export function ClientsEmptyState({ hasQuery, onClearQuery }: ClientsEmptyStateProps) {
  if (hasQuery) {
    return (
      <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
        <SearchEmptyIllustration className="text-muted-foreground h-14 w-auto" />
        <div className="flex max-w-sm flex-col gap-1.5">
          <p className="text-foreground text-[14px] font-semibold tracking-tight">
            Nic nie znaleziono
          </p>
          <p className="text-muted-foreground text-[13px] leading-relaxed">
            Spróbuj innej frazy albo wyczyść wyszukiwanie.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onClearQuery}>
          Wyczyść wyszukiwanie
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 px-6 py-20 text-center">
      <EmptyClientsIllustration className="text-muted-foreground h-16 w-auto" />
      <div className="flex max-w-sm flex-col gap-1.5">
        <p className="text-foreground text-[15px] font-semibold tracking-tight">
          Jeszcze żadnych klientów
        </p>
        <p className="text-muted-foreground text-[13px] leading-relaxed">
          Dodaj pierwszy kontakt — zaczniesz budować bazę klientów, statusy i notatki.
        </p>
      </div>
      <Button asChild size="default">
        <Link href="/clients/new">
          <Plus weight="bold" />
          Dodaj pierwszego klienta
        </Link>
      </Button>
    </div>
  );
}
