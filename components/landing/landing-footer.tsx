import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";

const COLUMNS: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    title: "Produkt",
    links: [
      { href: "#features", label: "Funkcje" },
      { href: "#pricing", label: "Cennik" },
      { href: "#faq", label: "FAQ" },
    ],
  },
  {
    title: "Zasoby",
    links: [
      { href: "/terms", label: "Regulamin" },
      { href: "/privacy", label: "Prywatność" },
    ],
  },
  {
    title: "Konto",
    links: [
      { href: "/login", label: "Zaloguj się" },
      { href: "/register", label: "Załóż konto" },
    ],
  },
];

export function LandingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-border border-t">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-12 sm:px-10 sm:py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 sm:gap-6">
          <div className="col-span-2 max-w-[260px] sm:col-span-1">
            <Link href="/" className="text-foreground inline-flex items-center gap-2">
              <BrandMark />
              <span className="text-[13.5px] font-semibold tracking-tight">Cliently</span>
            </Link>
            <p className="text-muted-foreground mt-4 text-[12.5px] leading-[1.55]">
              CRM dla freelancerów i małych zespołów. Lekki, szybki, polski.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-foreground text-[12px] font-semibold tracking-tight">
                {col.title}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("#") ? (
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground text-[12.5px] transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground text-[12.5px] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-border mt-10 flex flex-col items-start justify-between gap-2 border-t pt-6 sm:mt-14 sm:flex-row sm:items-center">
          <p className="text-muted-foreground text-[11.5px]">
            © {year} Cliently · Zbudowane w Polsce.
          </p>
          <p className="text-muted-foreground text-[11.5px]">Wersja beta</p>
        </div>
      </div>
    </footer>
  );
}
