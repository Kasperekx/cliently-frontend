"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand/brand-mark";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "#features", label: "Produkt" },
  { href: "#pricing", label: "Cennik" },
  { href: "#faq", label: "FAQ" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      data-scrolled={scrolled ? "true" : "false"}
      className={cn(
        "bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full backdrop-blur-md transition-colors duration-200",
        "data-[scrolled=true]:border-border border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between px-6 sm:px-10">
        <Link
          href="/"
          className="text-foreground inline-flex items-center gap-2"
          aria-label="Cliently — strona główna"
        >
          <BrandMark />
          <span className="text-[13.5px] font-semibold tracking-tight">Cliently</span>
        </Link>

        <nav
          aria-label="Nawigacja główna"
          className="text-muted-foreground absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 text-[12.5px] md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="hidden items-center gap-1.5 md:flex">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Zaloguj się</Link>
            </Button>
            <Button asChild variant="primary" size="sm">
              <Link href="/register">Załóż konto</Link>
            </Button>
          </div>

          <div className="flex items-center gap-1.5 md:hidden">
            <ThemeToggle />
            <Button asChild variant="primary" size="sm">
              <Link href="/register">Załóż</Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={open ? "Zamknij menu" : "Otwórz menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X weight="regular" /> : <List weight="regular" />}
            </Button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="border-border bg-background/95 supports-backdrop-filter:bg-background/80 border-t backdrop-blur-md md:hidden">
          <nav
            aria-label="Nawigacja mobilna"
            className="mx-auto flex w-full max-w-[1200px] flex-col gap-1 px-4 py-3"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-foreground hover:bg-muted rounded-md px-3 py-2 text-[13px] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="border-border mt-2 border-t pt-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:bg-muted hover:text-foreground block rounded-md px-3 py-2 text-[13px] transition-colors"
              >
                Zaloguj się
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
