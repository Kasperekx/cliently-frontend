"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArrowCounterClockwise,
  DotsThreeVertical,
  PencilSimple,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { clientDisplayName, clientInitials, type Client } from "@/lib/clients";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClientAvatar } from "./client-avatar";
import { ClientStatusBadge } from "./client-status-badge";

type ClientsTableProps = {
  clients: Client[];
  onArchive: (client: Client) => void;
  onRestore: (client: Client) => void;
  pendingId: string | null;
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "—";
  return date.toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ClientsTable({ clients, onArchive, onRestore, pendingId }: ClientsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[13px]">
        <thead className="bg-muted/40 text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
          <tr className="border-border border-b">
            <th scope="col" className="px-5 py-2.5 font-medium">
              Klient
            </th>
            <th scope="col" className="hidden px-4 py-2.5 font-medium md:table-cell">
              Firma
            </th>
            <th scope="col" className="hidden px-4 py-2.5 font-medium lg:table-cell">
              Kontakt
            </th>
            <th scope="col" className="px-4 py-2.5 font-medium">
              Status
            </th>
            <th scope="col" className="hidden px-4 py-2.5 font-medium md:table-cell">
              Dodano
            </th>
            <th scope="col" className="w-[56px] px-3 py-2.5 text-right font-medium">
              <span className="sr-only">Akcje</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <ClientRow
              key={client.id}
              client={client}
              onArchive={onArchive}
              onRestore={onRestore}
              isPending={pendingId === client.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type ClientRowProps = {
  client: Client;
  onArchive: (client: Client) => void;
  onRestore: (client: Client) => void;
  isPending: boolean;
};

function ClientRow({ client, onArchive, onRestore, isPending }: ClientRowProps) {
  const router = useRouter();
  const archived = Boolean(client.archivedAt);
  const name = clientDisplayName(client);

  function handleRowClick() {
    router.push(`/clients/${client.id}`);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTableRowElement>) {
    if (event.defaultPrevented) return;
    const target = event.target as HTMLElement | null;
    if (target && target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleRowClick();
    }
  }

  return (
    <tr
      role="link"
      tabIndex={0}
      onClick={handleRowClick}
      onKeyDown={handleKeyDown}
      aria-label={`Otwórz kartę klienta ${name}`}
      className={cn(
        "group/row border-border cursor-pointer border-b transition-colors duration-150 last:border-0",
        "hover:bg-muted/60",
        "focus-visible:bg-muted/60 focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset",
        archived && "opacity-70",
        isPending && "pointer-events-none opacity-50"
      )}
    >
      <td className="px-5 py-3.5 align-middle">
        <div className="flex min-w-0 items-center gap-3">
          <ClientAvatar
            initials={clientInitials(client)}
            id={client.id}
            archived={archived}
            size="md"
          />
          <div className="min-w-0">
            <Link
              href={`/clients/${client.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-foreground block truncate text-[13px] font-medium underline-offset-2 hover:underline"
            >
              {name}
            </Link>
            {client.email ? (
              <p className="text-muted-foreground mt-0.5 truncate text-[12px] lg:hidden">
                {client.email}
              </p>
            ) : null}
          </div>
        </div>
      </td>
      <td className="text-muted-foreground hidden max-w-[200px] truncate px-4 py-3.5 align-middle text-[13px] md:table-cell">
        {client.company || "—"}
      </td>
      <td className="text-muted-foreground hidden px-4 py-3.5 align-middle text-[13px] lg:table-cell">
        <div className="flex min-w-0 flex-col gap-0.5">
          {client.email ? <span className="truncate">{client.email}</span> : null}
          {client.phone ? <span className="truncate tabular-nums">{client.phone}</span> : null}
          {!client.email && !client.phone ? <span>—</span> : null}
        </div>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <ClientStatusBadge status={client.status} archived={archived} />
      </td>
      <td className="text-muted-foreground hidden px-4 py-3.5 align-middle text-[12.5px] tabular-nums md:table-cell">
        {formatDate(client.createdAt)}
      </td>
      <td className="w-[56px] px-3 py-3.5 text-right align-middle">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Akcje"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-foreground"
            >
              <DotsThreeVertical weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem asChild>
              <Link href={`/clients/${client.id}?edit=1`}>
                <PencilSimple weight="regular" />
                Edytuj
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {archived ? (
              <DropdownMenuItem onClick={() => onRestore(client)}>
                <ArrowCounterClockwise weight="regular" />
                Przywróć
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem variant="destructive" onClick={() => onArchive(client)}>
                <Archive weight="regular" />
                Archiwizuj
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
