import {
  Bell,
  Buildings,
  Command,
  Gear,
  MagnifyingGlass,
  Plus,
  SquaresFour,
  UserCircle,
  Users,
} from "@phosphor-icons/react/ssr";

import { cn } from "@/lib/utils";
import { Badge, BadgeDot } from "@/components/ui/badge";
import { BrandMark } from "@/components/brand/brand-mark";
import { ClientAvatar } from "@/components/clients/client-avatar";

type PreviewClient = {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  status: "active" | "prospect" | "inactive";
  createdAt: string;
};

const CLIENTS: PreviewClient[] = [
  {
    id: "c-01",
    firstName: "Anna",
    lastName: "Kowalska",
    company: "Brewhouse Poznań",
    email: "anna@brewhouse.pl",
    status: "active",
    createdAt: "12 kwi 2026",
  },
  {
    id: "c-02",
    firstName: "Mateusz",
    lastName: "Nowak",
    company: "Studio Północ",
    email: "mateusz@polnoc.studio",
    status: "prospect",
    createdAt: "09 kwi 2026",
  },
  {
    id: "c-03",
    firstName: "Julia",
    lastName: "Wiśniewska",
    company: "Mapa Tygodnia",
    email: "julia@mapatygodnia.com",
    status: "active",
    createdAt: "04 kwi 2026",
  },
  {
    id: "c-04",
    firstName: "Piotr",
    lastName: "Zieliński",
    company: "Zielinski Legal",
    email: "kontakt@zielinski.legal",
    status: "inactive",
    createdAt: "28 mar 2026",
  },
  {
    id: "c-05",
    firstName: "Karolina",
    lastName: "Dąbrowska",
    company: "North Atelier",
    email: "k.dabrowska@northatelier.pl",
    status: "prospect",
    createdAt: "22 mar 2026",
  },
];

const STATUS_META: Record<
  PreviewClient["status"],
  { label: string; variant: "success" | "accent" | "muted"; tone: "success" | "accent" | "muted" }
> = {
  active: { label: "Aktywny", variant: "success", tone: "success" },
  prospect: { label: "Potencjalny", variant: "accent", tone: "accent" },
  inactive: { label: "Nieaktywny", variant: "muted", tone: "muted" },
};

type LandingProductPreviewProps = {
  className?: string;
};

export function LandingProductPreview({ className }: LandingProductPreviewProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "border-border/80 bg-card text-card-foreground relative overflow-hidden rounded-xl border shadow-sm",
        className
      )}
    >
      <div className="grid min-h-[460px] grid-cols-[220px_1fr]">
        <PreviewSidebar />
        <div className="flex min-w-0 flex-col">
          <PreviewTopbar />
          <PreviewToolbar />
          <PreviewTable />
        </div>
      </div>
      <div className="from-background/0 via-background/0 to-background pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-b" />
    </div>
  );
}

function PreviewSidebar() {
  return (
    <aside className="border-border bg-sidebar text-sidebar-foreground hidden border-r sm:flex sm:flex-col">
      <div className="border-border flex h-12 items-center gap-2 border-b px-4">
        <BrandMark />
        <span className="text-[13px] font-semibold tracking-tight">Cliently</span>
      </div>
      <nav className="flex flex-col gap-0.5 p-2 text-[12.5px]">
        <SidebarItem icon={<SquaresFour weight="regular" />} label="Pulpit" />
        <SidebarItem icon={<Users weight="fill" />} label="Klienci" active count={128} />
        <SidebarItem icon={<Buildings weight="regular" />} label="Firmy" count={42} />
        <SidebarItem icon={<UserCircle weight="regular" />} label="Zespół" />
        <SidebarItem icon={<Gear weight="regular" />} label="Ustawienia" />
      </nav>
      <div className="border-sidebar-border mt-auto border-t p-3">
        <div className="flex items-center gap-2">
          <span className="bg-muted text-foreground inline-flex size-7 items-center justify-center rounded-full text-[11px] font-semibold">
            PK
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium">Piotr Kasperek</p>
            <p className="text-muted-foreground truncate text-[11px]">North Studio</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  count,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  count?: number;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-2.5 py-1.5 transition-colors",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground"
      )}
    >
      <span
        className={cn(
          "inline-flex size-4 items-center justify-center",
          active ? "text-accent" : ""
        )}
      >
        {icon}
      </span>
      <span className={cn("flex-1 truncate", active && "font-medium")}>{label}</span>
      {typeof count === "number" ? (
        <span
          className={cn(
            "text-[10.5px] tabular-nums",
            active ? "text-muted-foreground" : "text-muted-foreground/70"
          )}
        >
          {count}
        </span>
      ) : null}
    </div>
  );
}

function PreviewTopbar() {
  return (
    <div className="border-border flex h-12 items-center justify-between gap-4 border-b px-5">
      <div className="text-muted-foreground flex items-center gap-2 text-[12px]">
        <span>Organizacja</span>
        <span className="opacity-40">/</span>
        <span className="text-foreground font-medium">Klienci</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="border-border bg-background/60 flex h-7 items-center gap-2 rounded-md border px-2.5 text-[12px]">
          <MagnifyingGlass weight="regular" className="text-muted-foreground size-3.5" />
          <span className="text-muted-foreground">Szukaj...</span>
          <span className="border-border text-muted-foreground ml-2 inline-flex items-center gap-0.5 rounded border px-1 font-mono text-[10px]">
            <Command weight="regular" className="size-2.5" />K
          </span>
        </div>
        <button
          type="button"
          aria-label="Powiadomienia"
          className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-7 items-center justify-center rounded-md transition-colors"
          tabIndex={-1}
        >
          <Bell weight="regular" className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

function PreviewToolbar() {
  return (
    <div className="border-border flex h-11 items-center justify-between gap-3 border-b px-5">
      <div className="flex items-center gap-2">
        <h2 className="text-[13px] font-semibold tracking-tight">Klienci</h2>
        <span className="border-border text-muted-foreground inline-flex h-[18px] items-center rounded-full border px-1.5 text-[10.5px] tabular-nums">
          128
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-[11.5px]">Wszyscy · Ostatnio dodani</span>
        <span className="bg-primary text-primary-foreground inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-[12px] font-medium">
          <Plus weight="bold" className="size-3" />
          Nowy klient
        </span>
      </div>
    </div>
  );
}

function PreviewTable() {
  return (
    <div className="flex-1 overflow-hidden">
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
          </tr>
        </thead>
        <tbody>
          {CLIENTS.map((client, idx) => {
            const status = STATUS_META[client.status];
            const name = `${client.firstName} ${client.lastName}`;
            const initials = `${client.firstName.charAt(0)}${client.lastName.charAt(0)}`;
            return (
              <tr
                key={client.id}
                className={cn(
                  "border-border border-b transition-colors last:border-0",
                  idx === 1 && "bg-muted/50"
                )}
              >
                <td className="px-5 py-3.5 align-middle">
                  <div className="flex min-w-0 items-center gap-3">
                    <ClientAvatar initials={initials} id={client.id} size="md" />
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-[13px] font-medium">{name}</p>
                      <p className="text-muted-foreground mt-0.5 truncate text-[12px] lg:hidden">
                        {client.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="text-muted-foreground hidden max-w-[200px] truncate px-4 py-3.5 align-middle text-[13px] md:table-cell">
                  {client.company}
                </td>
                <td className="text-muted-foreground hidden px-4 py-3.5 align-middle text-[13px] lg:table-cell">
                  <span className="truncate">{client.email}</span>
                </td>
                <td className="px-4 py-3.5 align-middle">
                  <Badge variant={status.variant} size="default">
                    <BadgeDot tone={status.tone} />
                    {status.label}
                  </Badge>
                </td>
                <td className="text-muted-foreground hidden px-4 py-3.5 align-middle text-[12.5px] tabular-nums md:table-cell">
                  {client.createdAt}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
