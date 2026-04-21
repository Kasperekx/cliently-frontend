import {
  ArrowRight,
  CheckCircle,
  Command,
  Envelope,
  Lightning,
  Plus,
  Users,
} from "@phosphor-icons/react/ssr";

import { cn } from "@/lib/utils";
import { Badge, BadgeDot } from "@/components/ui/badge";
import { ClientAvatar } from "@/components/clients/client-avatar";

export function LandingFeatures() {
  return (
    <section id="features" className="border-border border-t">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-20 sm:px-10 sm:py-28">
        <header className="max-w-[640px]">
          <span className="text-accent text-[10.5px] font-medium tracking-[0.1em] uppercase">
            Produkt
          </span>
          <h2 className="text-foreground mt-3 text-[26px] leading-[1.15] font-semibold tracking-[-0.015em] sm:text-[34px]">
            Wszystko czego potrzebujesz. Nic czego nie.
          </h2>
          <p className="text-muted-foreground mt-4 text-[14.5px] leading-[1.6] sm:text-[15.5px]">
            Zbudowane dla zespołów które pracują gęsto. Klawiatura first. 13 px baseline. Ciemny
            motyw o północy, jasny rano.
          </p>
        </header>

        <div className="mt-14 flex flex-col gap-20 sm:mt-20 sm:gap-28">
          <FeatureBlock
            eyebrow="Klienci"
            title="Wszystkie dane klienta w jednym widoku."
            description="Karta klienta z historią kontaktów, statusem i notatkami. Tab, Enter — gotowe. Nic się nie gubi, nic się nie duplikuje."
            bullets={[
              "Status, notatki i metadane na jednym ekranie",
              "Archiwizacja z pełną historią zmian",
              "Skróty klawiaturowe dla każdej akcji",
            ]}
            preview={<ClientDetailPreview />}
          />

          <FeatureBlock
            reverse
            eyebrow="Zespół"
            title="Dziel się dostępem, nie plikami Excela."
            description="Zapraszaj członków zespołu, nadawaj role, widź kto co zmienił. Wielotenant od pierwszego dnia — każda organizacja ma swoje dane odseparowane."
            bullets={[
              "Zaproszenia e-mailem w dwóch klikach",
              "Role admin / member — czytelny model",
              "Jedno konto, wiele organizacji",
            ]}
            preview={<TeamPreview />}
          />

          <FeatureBlock
            eyebrow="Szybkość"
            title="Zero mgły. Zero lagów."
            description="Linear-level density. Skróty które zapamiętasz w godzinę. Server components tam gdzie pasują, client tam gdzie trzeba. Przewijanie jak masło."
            bullets={[
              "⌘K command palette wszędzie",
              "Wbudowane tryby jasny i ciemny",
              "Optymistyczne aktualizacje bez migotania",
            ]}
            preview={<CommandPreview />}
          />
        </div>
      </div>
    </section>
  );
}

type FeatureBlockProps = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  preview: React.ReactNode;
  reverse?: boolean;
};

function FeatureBlock({
  eyebrow,
  title,
  description,
  bullets,
  preview,
  reverse,
}: FeatureBlockProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
        reverse && "lg:[&>*:first-child]:order-2"
      )}
    >
      <div className="max-w-[480px]">
        <span className="text-accent text-[10.5px] font-medium tracking-[0.1em] uppercase">
          {eyebrow}
        </span>
        <h3 className="text-foreground mt-3 text-[22px] leading-[1.2] font-semibold tracking-[-0.015em] sm:text-[28px]">
          {title}
        </h3>
        <p className="text-muted-foreground mt-4 text-[14px] leading-[1.65]">{description}</p>
        <ul className="mt-6 flex flex-col gap-2.5">
          {bullets.map((b) => (
            <li key={b} className="text-foreground flex items-start gap-2.5 text-[13px]">
              <CheckCircle
                weight="fill"
                className="text-accent mt-0.5 size-4 shrink-0"
                aria-hidden
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>{preview}</div>
    </div>
  );
}

function ClientDetailPreview() {
  return (
    <div className="border-border/80 bg-card relative overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border flex items-center justify-between border-b px-5 py-3">
        <div className="flex items-center gap-3">
          <ClientAvatar initials="AK" id="ak" size="md" />
          <div>
            <p className="text-foreground text-[13.5px] font-semibold">Anna Kowalska</p>
            <p className="text-muted-foreground text-[11.5px]">Brewhouse Poznań</p>
          </div>
        </div>
        <Badge variant="success" size="default">
          <BadgeDot tone="success" />
          Aktywny
        </Badge>
      </div>
      <dl className="grid grid-cols-2 gap-x-5 gap-y-4 px-5 py-5 text-[12.5px]">
        <div>
          <dt className="text-muted-foreground text-[10.5px] font-medium tracking-[0.1em] uppercase">
            E-mail
          </dt>
          <dd className="text-foreground mt-1 truncate">anna@brewhouse.pl</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-[10.5px] font-medium tracking-[0.1em] uppercase">
            Telefon
          </dt>
          <dd className="text-foreground mt-1 tabular-nums">+48 600 120 045</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-[10.5px] font-medium tracking-[0.1em] uppercase">
            Dodano
          </dt>
          <dd className="text-foreground mt-1 tabular-nums">12 kwi 2026</dd>
        </div>
        <div>
          <dt className="text-muted-foreground text-[10.5px] font-medium tracking-[0.1em] uppercase">
            Ostatni kontakt
          </dt>
          <dd className="text-foreground mt-1 tabular-nums">2 dni temu</dd>
        </div>
      </dl>
      <div className="border-border border-t px-5 py-4">
        <p className="text-muted-foreground text-[10.5px] font-medium tracking-[0.1em] uppercase">
          Notatki
        </p>
        <p className="text-foreground mt-2 text-[12.5px] leading-[1.55]">
          Potwierdzenie umowy 2026/Q2. Brief na nową identyfikację wizualną wysłany, oczekujemy
          feedbacku do piątku.
        </p>
      </div>
    </div>
  );
}

function TeamPreview() {
  const members: {
    name: string;
    email: string;
    initials: string;
    id: string;
    role: "Admin" | "Member";
    pending?: boolean;
  }[] = [
    {
      name: "Piotr Kasperek",
      email: "piotr@northstudio.pl",
      initials: "PK",
      id: "m1",
      role: "Admin",
    },
    {
      name: "Olga Lewandowska",
      email: "olga@northstudio.pl",
      initials: "OL",
      id: "m2",
      role: "Member",
    },
    { name: "Marek Szyc", email: "marek@northstudio.pl", initials: "MS", id: "m3", role: "Member" },
    {
      name: "zaproszenie@northstudio.pl",
      email: "Oczekuje na akceptację",
      initials: "?",
      id: "m4",
      role: "Member",
      pending: true,
    },
  ];
  return (
    <div className="border-border/80 bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border flex items-center justify-between border-b px-5 py-3">
        <div className="flex items-center gap-2">
          <Users weight="regular" className="text-muted-foreground size-4" />
          <h4 className="text-foreground text-[13px] font-semibold">Zespół — North Studio</h4>
        </div>
        <span className="bg-primary text-primary-foreground inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-[12px] font-medium">
          <Plus weight="bold" className="size-3" />
          Zaproś
        </span>
      </div>
      <ul className="divide-border divide-y">
        {members.map((m) => (
          <li key={m.id} className="flex items-center gap-3 px-5 py-3">
            {m.pending ? (
              <span className="bg-muted text-muted-foreground inline-flex size-9 items-center justify-center rounded-full">
                <Envelope weight="regular" className="size-4" />
              </span>
            ) : (
              <ClientAvatar initials={m.initials} id={m.id} size="md" />
            )}
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "truncate text-[13px] font-medium",
                  m.pending ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {m.name}
              </p>
              <p className="text-muted-foreground truncate text-[11.5px]">{m.email}</p>
            </div>
            {m.pending ? (
              <Badge variant="muted" size="sm">
                <BadgeDot tone="warning" />
                Oczekuje
              </Badge>
            ) : (
              <Badge variant={m.role === "Admin" ? "accent" : "outline"} size="sm">
                {m.role}
              </Badge>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CommandPreview() {
  const items: { icon: React.ReactNode; label: string; hint?: string; active?: boolean }[] = [
    { icon: <Plus weight="bold" />, label: "Nowy klient", hint: "N", active: true },
    { icon: <Users weight="regular" />, label: "Przejdź do: Klienci", hint: "G K" },
    { icon: <Envelope weight="regular" />, label: "Zaproś członka zespołu", hint: "⌘ I" },
    { icon: <Lightning weight="regular" />, label: "Archiwizuj klienta", hint: "⌘ ⌫" },
  ];
  return (
    <div className="border-border/80 bg-card shadow-pop mx-auto max-w-[480px] overflow-hidden rounded-xl border">
      <div className="border-border flex h-11 items-center gap-2.5 border-b px-4">
        <Command weight="regular" className="text-muted-foreground size-4" />
        <span className="text-muted-foreground text-[13px]">Wpisz polecenie...</span>
        <span className="ml-auto inline-flex items-center gap-1">
          <kbd className="border-border text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 font-mono text-[10px]">
            ⌘
          </kbd>
          <kbd className="border-border text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 font-mono text-[10px]">
            K
          </kbd>
        </span>
      </div>
      <div className="p-2">
        <p className="text-muted-foreground px-2.5 py-1.5 text-[10.5px] font-medium tracking-[0.1em] uppercase">
          Sugestie
        </p>
        <ul className="flex flex-col gap-0.5">
          {items.map((it) => (
            <li
              key={it.label}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px]",
                it.active ? "bg-muted text-foreground" : "text-foreground/80"
              )}
            >
              <span
                className={cn(
                  "inline-flex size-4 items-center justify-center",
                  it.active ? "text-accent" : "text-muted-foreground"
                )}
              >
                {it.icon}
              </span>
              <span className="flex-1">{it.label}</span>
              {it.hint ? (
                <span className="text-muted-foreground inline-flex items-center gap-1 font-mono text-[10.5px]">
                  {it.hint}
                </span>
              ) : null}
              {it.active ? <ArrowRight weight="bold" className="text-accent size-3" /> : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
