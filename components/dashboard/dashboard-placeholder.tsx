"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { SignOut } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";

export function DashboardPlaceholder() {
  const router = useRouter();
  const { data } = useSession();
  const [isPending, startTransition] = useTransition();

  const name = data?.user?.name ?? data?.user?.email ?? "there";

  function handleSignOut() {
    startTransition(async () => {
      await signOut();
      router.replace("/login");
      router.refresh();
    });
  }

  return (
    <div className="bg-background relative isolate min-h-dvh">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="bg-accent/8 absolute top-0 left-1/2 h-96 w-160 -translate-x-1/2 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_45%)]" />
      </div>

      <header className="border-border/60 bg-background/80 relative z-10 border-b backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="bg-accent size-2 rounded-full" />
            <span className="text-sm font-semibold tracking-tight">Cliently</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={isPending}
            className="text-muted-foreground hover:text-foreground h-9 gap-2 rounded-md text-xs"
          >
            <SignOut className="size-4" weight="duotone" />
            {isPending ? "Wylogowywanie..." : "Wyloguj"}
          </Button>
        </div>
      </header>

      <main className="relative mx-auto flex min-h-[calc(100dvh-4rem)] max-w-3xl flex-col items-start justify-center gap-6 px-6 py-16">
        <span className="text-muted-foreground bg-background/80 border-border/60 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-medium tracking-[0.22em] uppercase">
          <span className="bg-accent size-1.5 rounded-full" />
          Dashboard
        </span>
        <h1 className="text-[2rem] font-semibold tracking-tight sm:text-[2.5rem]">
          Cześć, {name} 👋
        </h1>
        <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
          Konto i organizacja są gotowe. Tutaj wkrótce pojawią się moduły CRM, portale klientów,
          wnioski i kopilot AI. Na razie możesz wylogować się i zalogować ponownie, żeby
          przetestować cały przepływ.
        </p>
      </main>
    </div>
  );
}
