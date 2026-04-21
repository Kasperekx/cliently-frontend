import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Regulamin — Cliently",
};

export default function TermsPage() {
  return (
    <div className="bg-background text-foreground mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Regulamin</h1>
      <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
        Treść regulaminu pojawi się wkrótce. W razie pytań skontaktuj się z nami.
      </p>
      <p className="mt-8">
        <Link
          href="/register"
          className="text-accent text-sm font-medium underline underline-offset-4"
        >
          Wróć do rejestracji
        </Link>
      </p>
    </div>
  );
}
