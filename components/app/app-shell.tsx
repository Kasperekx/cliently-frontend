"use client";

import { type ReactNode, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Gear,
  House,
  List as ListIcon,
  MagnifyingGlass,
  SignOut,
  UsersThree,
  X,
  type Icon,
} from "@phosphor-icons/react";

import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme/theme-toggle";

type NavItem = {
  href: string;
  label: string;
  icon: Icon;
  match: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: House,
    match: (p) => p === "/dashboard",
  },
  {
    href: "/clients",
    label: "Klienci",
    icon: UsersThree,
    match: (p) => p === "/clients" || p.startsWith("/clients/"),
  },
];

function getUserInitials(name?: string | null, email?: string | null): string {
  const source = (name ?? email ?? "").trim();
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  }
  const base = parts[0] ?? source;
  return base.slice(0, 2).toUpperCase();
}

function UserMenu() {
  const router = useRouter();
  const { data } = useSession();
  const [isPending, startTransition] = useTransition();

  const user = data?.user;
  const name = user?.name ?? user?.email ?? "Użytkownik";
  const email = user?.email ?? "";

  function handleSignOut() {
    startTransition(async () => {
      await signOut();
      router.replace("/login");
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="text-foreground hover:bg-muted focus-visible:ring-ring/40 inline-flex h-9 items-center gap-2 rounded-md border border-transparent px-1.5 text-[13px] transition-colors focus-visible:ring-2 focus-visible:outline-none"
          aria-label="Menu użytkownika"
        >
          <Avatar className="border-border size-7 rounded-full border">
            <AvatarFallback>{getUserInitials(user?.name, user?.email)}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[140px] truncate pr-1 text-left sm:inline">{name}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[220px]">
        <DropdownMenuLabel className="px-2 py-2 text-[11px] tracking-normal normal-case">
          <p className="text-foreground truncate text-[13px] font-medium normal-case">{name}</p>
          {email ? (
            <p className="text-muted-foreground truncate text-[12px] font-normal normal-case">
              {email}
            </p>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Gear weight="regular" />
          Ustawienia
          <span className="text-muted-foreground ml-auto text-[11px]">Wkrótce</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleSignOut} disabled={isPending}>
          <SignOut weight="regular" />
          {isPending ? "Wylogowywanie…" : "Wyloguj"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarItem({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors duration-150",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "bg-accent absolute top-1/2 left-0 h-4 w-[2px] -translate-y-1/2 rounded-full transition-opacity",
          active ? "opacity-100" : "opacity-0"
        )}
      />
      <Icon
        weight={active ? "fill" : "regular"}
        className={cn(
          "size-4 shrink-0 transition-colors",
          active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
        )}
      />
      <span>{item.label}</span>
    </Link>
  );
}

function Brand() {
  return (
    <Link href="/dashboard" className="text-foreground flex items-center gap-2">
      <span className="bg-primary text-primary-foreground grid size-6 place-items-center rounded-[6px]">
        <span className="text-[11px] font-bold tracking-tight">C</span>
      </span>
      <span className="text-[14px] font-semibold tracking-tight">Cliently</span>
    </Link>
  );
}

function buildBreadcrumb(pathname: string): { label: string; href?: string }[] {
  if (pathname === "/dashboard") return [{ label: "Overview" }];
  if (pathname === "/clients") return [{ label: "Klienci" }];
  if (pathname === "/clients/new")
    return [{ label: "Klienci", href: "/clients" }, { label: "Nowy klient" }];
  if (pathname.startsWith("/clients/"))
    return [{ label: "Klienci", href: "/clients" }, { label: "Szczegóły" }];
  return [{ label: "Cliently" }];
}

function SearchTrigger() {
  return (
    <button
      type="button"
      disabled
      className="group/search border-border bg-background text-muted-foreground hover:border-foreground/20 focus-visible:ring-ring/40 hidden h-8 min-w-[220px] items-center gap-2 rounded-md border px-2.5 text-[12.5px] transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-80 md:inline-flex"
      aria-label="Wyszukaj"
    >
      <MagnifyingGlass weight="regular" className="size-3.5" />
      <span className="flex-1 text-left">Szukaj…</span>
      <Kbd>⌘K</Kbd>
    </button>
  );
}

function Breadcrumb({ pathname }: { pathname: string }) {
  const crumbs = useMemo(() => buildBreadcrumb(pathname), [pathname]);
  return (
    <nav
      aria-label="Ścieżka"
      className="text-muted-foreground flex min-w-0 items-center gap-1.5 text-[13px]"
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-muted-foreground/50">/</span>}
            {crumb.href && !isLast ? (
              <Link href={crumb.href} className="hover:text-foreground truncate transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className={cn("truncate", isLast && "text-foreground font-medium")}>
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

function Sidebar({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="bg-sidebar border-sidebar-border flex h-full w-[248px] shrink-0 flex-col border-r">
      <div className="flex h-[52px] items-center px-4">
        <Brand />
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 px-2 py-2">
        <p className="text-muted-foreground px-2 pt-2 pb-1 text-[10.5px] font-medium tracking-wider uppercase">
          Workspace
        </p>
        {NAV_ITEMS.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            active={item.match(pathname)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
      <div className="border-sidebar-border text-muted-foreground border-t px-4 py-3 text-[11px]">
        <p className="text-[10px] font-medium tracking-wider uppercase">Wkrótce</p>
        <p className="mt-1 leading-relaxed">Projekty · Portal · AI</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-background flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh md:block">
        <Sidebar pathname={pathname} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Zamknij menu"
            className="bg-foreground/20 absolute inset-0 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="animate-in slide-in-from-left-4 absolute inset-y-0 left-0 flex duration-150">
            <Sidebar pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border bg-background/90 sticky top-0 z-30 flex h-[52px] shrink-0 items-center gap-3 border-b px-4 backdrop-blur-md md:px-6">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"}
          >
            {mobileOpen ? <X weight="bold" /> : <ListIcon weight="bold" />}
          </Button>
          <div className="md:hidden">
            <Brand />
          </div>
          <div className="hidden min-w-0 flex-1 md:block">
            <Breadcrumb pathname={pathname} />
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <SearchTrigger />
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
