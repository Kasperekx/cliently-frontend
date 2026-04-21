import Link from "next/link";

import { SessionGate } from "@/components/auth/session-gate";
import { BrandMark } from "@/components/brand/brand-mark";
import { LandingAmbient } from "@/components/landing/landing-ambient";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGate require="guest">
      <div className="bg-background relative isolate flex min-h-dvh flex-col overflow-hidden">
        <LandingAmbient intensity="hero" />

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
            <div className="border-border/80 bg-card/70 supports-backdrop-filter:bg-card/60 rounded-xl border p-7 shadow-sm backdrop-blur-sm sm:p-8">
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
