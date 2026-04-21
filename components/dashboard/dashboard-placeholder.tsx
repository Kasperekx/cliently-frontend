"use client";

import Link from "next/link";
import { ArrowRight, Check, FileText, Plus, Sparkle, UsersThree } from "@phosphor-icons/react";

import { useSession } from "@/lib/auth-client";

function PageContainer({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10 md:py-12">{children}</div>;
}

function PageHeader({ name }: { name: string }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 5 ? "Dobranoc" : hour < 12 ? "Dzień dobry" : hour < 18 ? "Hej" : "Dobry wieczór";

  return (
    <header className="flex flex-col gap-1.5">
      <p className="text-muted-foreground text-[12px] font-medium tracking-wider uppercase">
        Overview
      </p>
      <h1 className="text-foreground text-[32px] leading-tight font-semibold tracking-tight">
        {greeting}, {name}.
      </h1>
      <p className="text-muted-foreground text-[14px]">
        Krótki podgląd Twojego konta. Dodaj klientów i zaplanuj następny krok.
      </p>
    </header>
  );
}

function QuickAction({
  href,
  title,
  description,
  icon: Icon,
  cta,
}: {
  href: string;
  title: string;
  description: string;
  icon: typeof UsersThree;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group border-border bg-card hover:border-foreground/20 hover:bg-card flex flex-col gap-3 rounded-lg border p-5 shadow-xs transition-[border-color,background-color] duration-150"
    >
      <span className="border-border bg-background text-foreground flex size-9 items-center justify-center rounded-md border">
        <Icon weight="regular" className="size-4" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-foreground text-[14px] font-semibold tracking-tight">{title}</p>
        <p className="text-muted-foreground text-[13px] leading-relaxed">{description}</p>
      </div>
      <span className="text-foreground/80 group-hover:text-foreground mt-auto inline-flex items-center gap-1 text-[12.5px] font-medium transition-colors">
        {cta}
        <ArrowRight
          weight="bold"
          className="size-3 transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

type ChecklistItem = {
  title: string;
  description: string;
  href?: string;
  done?: boolean;
};

const CHECKLIST: ChecklistItem[] = [
  {
    title: "Dodaj pierwszego klienta",
    description: "Stwórz kontakt z imieniem, emailem i statusem.",
    href: "/clients/new",
  },
  {
    title: "Zaproś członka zespołu",
    description: "Współpracuj z innymi osobami w swojej organizacji.",
  },
  {
    title: "Skonfiguruj markę",
    description: "Ustaw nazwę organizacji, logo i akcenty (wkrótce).",
  },
];

function GettingStarted() {
  return (
    <section className="border-border bg-card rounded-lg border shadow-xs">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-[14px] font-semibold tracking-tight">Getting started</p>
          <p className="text-muted-foreground text-[12.5px]">
            Trzy kroki do pełnego wykorzystania Cliently.
          </p>
        </div>
      </div>
      <div className="border-border border-t">
        {CHECKLIST.map((item, i) => (
          <div
            key={item.title}
            className={`flex items-start gap-3 px-5 py-4 ${i > 0 ? "border-border border-t" : ""}`}
          >
            <span
              aria-hidden
              className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${
                item.done
                  ? "text-background border-emerald-500 bg-emerald-500"
                  : "border-border bg-background"
              }`}
            >
              {item.done ? <Check weight="bold" className="size-3" /> : null}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="text-foreground text-[13px] font-medium">{item.title}</p>
              <p className="text-muted-foreground text-[12.5px] leading-relaxed">
                {item.description}
              </p>
            </div>
            {item.href ? (
              <Link
                href={item.href}
                className="text-foreground hover:bg-muted inline-flex shrink-0 items-center gap-1 self-center rounded-md px-2 py-1 text-[12px] font-medium transition-colors"
              >
                Otwórz <ArrowRight weight="bold" className="size-3" />
              </Link>
            ) : (
              <span className="border-border bg-background text-muted-foreground shrink-0 self-center rounded-md border px-2 py-0.5 text-[11px] font-medium">
                Wkrótce
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export function DashboardPlaceholder() {
  const { data } = useSession();
  const name = data?.user?.name?.split(" ")[0] ?? data?.user?.email?.split("@")[0] ?? "tam";

  return (
    <PageContainer>
      <div className="flex flex-col gap-10">
        <PageHeader name={name} />

        <section className="flex flex-col gap-3">
          <h2 className="text-muted-foreground text-[12px] font-medium tracking-wider uppercase">
            Szybkie akcje
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <QuickAction
              href="/clients/new"
              title="Nowy klient"
              description="Dodaj kontakt, status i notatki w kilka sekund."
              icon={Plus}
              cta="Dodaj klienta"
            />
            <QuickAction
              href="/clients"
              title="Klienci"
              description="Przeglądaj bazę klientów, filtruj i edytuj."
              icon={UsersThree}
              cta="Przejdź do listy"
            />
            <div className="border-border bg-background relative flex flex-col gap-3 rounded-lg border border-dashed p-5">
              <span className="border-border bg-background text-muted-foreground flex size-9 items-center justify-center rounded-md border">
                <Sparkle weight="regular" className="size-4" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-foreground text-[14px] font-semibold tracking-tight">
                  Projekty & AI
                </p>
                <p className="text-muted-foreground text-[13px] leading-relaxed">
                  Wkrótce: projekty, portal klienta i kopilot AI.
                </p>
              </div>
              <span className="border-border bg-background text-muted-foreground mt-auto inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[11px] font-medium">
                Wkrótce
              </span>
            </div>
          </div>
        </section>

        <GettingStarted />

        <footer className="text-muted-foreground flex items-center gap-2 text-[12px]">
          <FileText weight="regular" className="size-3.5" />
          <span>Potrzebujesz pomocy? Dokumentacja i przewodniki są w drodze.</span>
        </footer>
      </div>
    </PageContainer>
  );
}
