import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Polityka prywatności — Cliently",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-6 py-12 md:py-16">
      <Link
        href="/register"
        className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 text-[12.5px] transition-colors"
      >
        <span aria-hidden>←</span>
        Wróć do rejestracji
      </Link>
      <h1 className="text-foreground mt-6 text-[28px] leading-tight font-semibold tracking-tight">
        Polityka prywatności
      </h1>
      <p className="text-muted-foreground mt-3 text-[13.5px] leading-relaxed">
        Szczegóły przetwarzania danych opublikujemy wkrótce.
      </p>
    </div>
  );
}
