"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Archive,
  ArrowCounterClockwise,
  Buildings,
  EnvelopeSimple,
  PencilSimple,
  Phone,
  Warning,
} from "@phosphor-icons/react";

import { ApiError } from "@/lib/api";
import {
  archiveClient,
  clientDisplayName,
  clientInitials,
  getClient,
  restoreClient,
  type Client,
} from "@/lib/clients";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

import { ClientAvatar } from "./client-avatar";
import { ClientForm } from "./client-form";
import { ClientStatusBadge } from "./client-status-badge";

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "—";
  return date.toLocaleString("pl-PL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "—";
  return date.toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type DetailState = {
  client: Client | null;
  isLoading: boolean;
  error: string | null;
};

const INITIAL: DetailState = {
  client: null,
  isLoading: true,
  error: null,
};

export function ClientDetailView({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [{ client, isLoading, error }, setState] = useState<DetailState>(INITIAL);
  const [editOverride, setEditOverride] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isActionPending, startActionTransition] = useTransition();

  const load = useCallback(async () => {
    try {
      const result = await getClient(id);
      setState({ client: result, isLoading: false, error: null });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Nie udało się pobrać klienta.";
      setState({ client: null, isLoading: false, error: message });
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const isEditing = editOverride || searchParams?.get("edit") === "1";

  function handleArchiveToggle() {
    if (!client) return;
    setActionError(null);
    startActionTransition(async () => {
      try {
        const next = client.archivedAt
          ? await restoreClient(client.id)
          : await archiveClient(client.id);
        setState((prev) => ({ ...prev, client: next }));
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Nie udało się wykonać akcji.";
        setActionError(message);
      }
    });
  }

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !client) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-10 md:px-10">
        <nav className="text-muted-foreground mb-6 flex items-center gap-1.5 text-[12.5px]">
          <Link href="/clients" className="hover:text-foreground transition-colors">
            Klienci
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="text-foreground">Nie znaleziono</span>
        </nav>
        <div
          role="alert"
          className="border-destructive/40 bg-destructive/5 text-destructive flex items-start gap-2 rounded-md border px-4 py-3 text-[13px]"
        >
          <Warning className="mt-0.5 size-4 shrink-0" weight="regular" />
          <div className="flex flex-col gap-2">
            <span>{error ?? "Nie znaleziono klienta."}</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => void load()}
                className="hover:text-destructive text-[12.5px] font-medium underline underline-offset-2"
              >
                Spróbuj ponownie
              </button>
              <button
                type="button"
                onClick={() => router.push("/clients")}
                className="hover:text-destructive text-[12.5px] font-medium underline underline-offset-2"
              >
                Wróć do listy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const archived = Boolean(client.archivedAt);
  const name = clientDisplayName(client);

  return (
    <div className="flex flex-col">
      <div className="border-border bg-background border-b">
        <div className="mx-auto w-full max-w-5xl px-6 py-6 md:px-10 md:py-7">
          <nav
            aria-label="Ścieżka"
            className="text-muted-foreground mb-4 flex items-center gap-1.5 text-[12.5px]"
          >
            <Link href="/clients" className="hover:text-foreground transition-colors">
              Klienci
            </Link>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground truncate">{name}</span>
          </nav>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-4">
              <ClientAvatar
                initials={clientInitials(client)}
                id={client.id}
                archived={archived}
                size="lg"
                className="size-12 text-[15px]"
              />
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-foreground text-[24px] leading-tight font-semibold tracking-tight">
                    {name}
                  </h1>
                  <ClientStatusBadge status={client.status} archived={archived} />
                </div>
                <p className="text-muted-foreground text-[13px] leading-relaxed">
                  {client.company ? `${client.company} · ` : ""}
                  Dodany {formatDate(client.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isEditing ? null : (
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() => setEditOverride(true)}
                >
                  <PencilSimple weight="regular" />
                  Edytuj
                </Button>
              )}

              {archived ? (
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  disabled={isActionPending}
                  onClick={handleArchiveToggle}
                >
                  <ArrowCounterClockwise weight="regular" />
                  {isActionPending ? "Przywracanie…" : "Przywróć"}
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive" size="default">
                      <Archive weight="regular" />
                      Archiwizuj
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Zarchiwizować klienta?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Klient zostanie ukryty z głównej listy. W każdej chwili możesz go przywrócić
                        z widoku „Pokaż archiwum”.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Anuluj</AlertDialogCancel>
                      <AlertDialogAction onClick={handleArchiveToggle} disabled={isActionPending}>
                        {isActionPending ? "Archiwizowanie…" : "Archiwizuj"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          {actionError ? (
            <div
              role="alert"
              className="border-destructive/40 bg-destructive/5 text-destructive mt-4 flex items-start gap-2 rounded-md border px-3 py-2 text-[12.5px]"
            >
              <Warning className="mt-0.5 size-4 shrink-0" weight="regular" />
              <span>{actionError}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-6 py-8 md:px-10 md:py-10">
        <div className={cn("grid gap-6 lg:grid-cols-[1fr_320px]", archived && "opacity-95")}>
          <main className="flex min-w-0 flex-col gap-6">
            {isEditing ? (
              <section className="border-border bg-card rounded-lg border p-6 shadow-xs md:p-7">
                <ClientForm
                  key={client.id}
                  mode="edit"
                  initialClient={client}
                  onSuccess={(updated) => {
                    setState({ client: updated, isLoading: false, error: null });
                    setEditOverride(false);
                    router.replace(`/clients/${updated.id}`);
                  }}
                  onCancel={() => {
                    setEditOverride(false);
                    router.replace(`/clients/${client.id}`);
                  }}
                />
              </section>
            ) : (
              <ClientReadOnly client={client} />
            )}
          </main>

          <aside className="flex flex-col gap-4">
            <MetaCard client={client} archived={archived} />
          </aside>
        </div>
      </div>
    </div>
  );
}

function ClientReadOnly({ client }: { client: Client }) {
  return (
    <>
      <section className="border-border bg-card rounded-lg border shadow-xs">
        <div className="border-border border-b px-5 py-3">
          <h2 className="text-foreground text-[13px] font-semibold tracking-tight">Kontakt</h2>
        </div>
        <dl className="divide-border grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <InfoRow
            icon={<EnvelopeSimple weight="regular" />}
            label="E-mail"
            value={client.email ?? "—"}
            href={client.email ? `mailto:${client.email}` : undefined}
          />
          <InfoRow
            icon={<Phone weight="regular" />}
            label="Telefon"
            value={client.phone ?? "—"}
            href={client.phone ? `tel:${client.phone.replace(/\s+/g, "")}` : undefined}
            mono
          />
        </dl>
        <div className="border-border border-t">
          <InfoRow
            icon={<Buildings weight="regular" />}
            label="Firma"
            value={client.company ?? "—"}
          />
        </div>
      </section>

      <section className="border-border bg-card rounded-lg border shadow-xs">
        <div className="border-border flex items-center justify-between gap-3 border-b px-5 py-3">
          <h2 className="text-foreground text-[13px] font-semibold tracking-tight">Notatka</h2>
          {client.notes ? (
            <span className="text-muted-foreground text-[11.5px] tabular-nums" data-slot="numeric">
              {client.notes.length}/2000
            </span>
          ) : null}
        </div>
        <div className="px-5 py-4">
          {client.notes ? (
            <p className="text-foreground text-[13px] leading-relaxed whitespace-pre-wrap">
              {client.notes}
            </p>
          ) : (
            <p className="text-muted-foreground text-[13px] leading-relaxed">
              Brak notatki. Użyj „Edytuj”, aby dodać kontekst.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

function MetaCard({ client, archived }: { client: Client; archived: boolean }) {
  const rows: { label: string; value: string }[] = [
    { label: "Dodany", value: formatDateTime(client.createdAt) },
    { label: "Zmieniony", value: formatDateTime(client.updatedAt) },
  ];
  if (client.archivedAt) {
    rows.push({ label: "Zarchiwizowany", value: formatDateTime(client.archivedAt) });
  }

  return (
    <section className="border-border bg-card rounded-lg border shadow-xs">
      <div className="border-border border-b px-5 py-3">
        <h2 className="text-muted-foreground text-[12px] font-medium tracking-wider uppercase">
          Meta
        </h2>
      </div>
      <dl className="flex flex-col">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={cn(
              "flex items-start justify-between gap-3 px-5 py-3",
              i > 0 && "border-border border-t"
            )}
          >
            <dt className="text-muted-foreground text-[12.5px]">{row.label}</dt>
            <dd
              className="text-foreground text-[12.5px] font-medium tabular-nums"
              data-slot="numeric"
            >
              {row.value}
            </dd>
          </div>
        ))}
        <div className="border-border flex items-start justify-between gap-3 border-t px-5 py-3">
          <dt className="text-muted-foreground text-[12.5px]">Status</dt>
          <dd>
            <ClientStatusBadge status={client.status} archived={archived} size="sm" />
          </dd>
        </div>
        <div className="border-border flex items-start justify-between gap-3 border-t px-5 py-3">
          <dt className="text-muted-foreground text-[12.5px]">ID</dt>
          <dd>
            <Badge variant="outline" size="sm" className="font-mono tracking-tight">
              {client.id.slice(0, 8)}
            </Badge>
          </dd>
        </div>
      </dl>
    </section>
  );
}

function InfoRow({
  icon,
  label,
  value,
  href,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  mono?: boolean;
}) {
  const body = (
    <div className="flex min-w-0 flex-col gap-0.5 px-5 py-4">
      <dt className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-medium tracking-wider uppercase [&_svg]:size-3">
        {icon}
        {label}
      </dt>
      <dd
        className={cn(
          "text-foreground mt-0.5 text-[13px] font-medium break-words",
          mono && "tabular-nums"
        )}
      >
        {value}
      </dd>
    </div>
  );
  if (!href) return body;
  return (
    <a
      href={href}
      className="hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:ring-ring/40 block transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
    >
      {body}
    </a>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="border-border border-b">
        <div className="mx-auto w-full max-w-5xl px-6 py-6 md:px-10 md:py-7">
          <Skeleton className="mb-4 h-3 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-5xl px-6 py-8 md:px-10 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
