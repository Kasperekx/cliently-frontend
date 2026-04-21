import Link from "next/link";

import { SessionGate } from "@/components/auth/session-gate";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGate require="guest">
      <div className="bg-background relative isolate flex min-h-dvh flex-col overflow-hidden">
        <AmbientBackground />

        <header className="relative flex h-14 shrink-0 items-center justify-between px-6 sm:px-10">
          <Link
            href="/"
            className="group text-foreground inline-flex items-center gap-2"
            aria-label="Cliently"
          >
            <BrandMark />
            <span className="text-[13.5px] font-semibold tracking-tight">Cliently</span>
          </Link>

          <nav className="text-muted-foreground flex items-center gap-5 text-[12.5px]">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Regulamin
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Prywatność
            </Link>
          </nav>
        </header>

        <main className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 sm:py-16">
          <div className="w-full max-w-[400px]">
            <div className="border-border/80 bg-card/70 supports-[backdrop-filter]:bg-card/60 rounded-xl border p-7 shadow-sm backdrop-blur-sm sm:p-8">
              {children}
            </div>
          </div>
        </main>

        <footer className="relative flex h-12 shrink-0 items-center justify-center px-6">
          <p className="text-muted-foreground text-[11.5px]">
            © {new Date().getFullYear()} Cliently
          </p>
        </footer>
      </div>
    </SessionGate>
  );
}

function BrandMark() {
  return (
    <span
      aria-hidden
      className="bg-foreground text-background grid size-6 place-items-center rounded-[6px] shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset]"
    >
      <span className="text-[11px] font-bold tracking-tight">C</span>
    </span>
  );
}

function AmbientBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--dot-color)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent_75%)] [background-size:22px_22px] opacity-60 dark:opacity-[0.35]"
        style={
          {
            ["--dot-color" as string]: "color-mix(in oklch, var(--border) 85%, transparent)",
          } as React.CSSProperties
        }
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[1100px] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background: "radial-gradient(closest-side, oklch(0.78 0.09 270 / 0.22), transparent 70%)",
        }}
      />

      <div
        aria-hidden
        className="via-border pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent to-transparent"
      />
    </>
  );
}
