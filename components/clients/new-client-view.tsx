"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ClientForm } from "./client-form";

export function NewClientView() {
  const router = useRouter();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-8 md:px-10 md:py-10">
      <div className="flex flex-col gap-1.5">
        <nav
          aria-label="Ścieżka"
          className="text-muted-foreground flex items-center gap-1.5 text-[12.5px]"
        >
          <Link href="/clients" className="hover:text-foreground transition-colors">
            Klienci
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="text-foreground">Nowy klient</span>
        </nav>
        <h1 className="text-foreground text-[24px] leading-tight font-semibold tracking-tight">
          Dodaj klienta
        </h1>
        <p className="text-muted-foreground text-[13px] leading-relaxed">
          Wystarczy imię i nazwisko. Resztę możesz uzupełnić później.
        </p>
      </div>

      <section className="border-border bg-card rounded-lg border p-6 shadow-xs md:p-8">
        <ClientForm
          mode="create"
          onSuccess={(client) => {
            router.push(`/clients/${client.id}`);
            router.refresh();
          }}
          onCancel={() => router.push("/clients")}
        />
      </section>
    </div>
  );
}
