import Link from "next/link";
import { ArrowRight, Check } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";

const INCLUDED: string[] = [
  "Pełny dostęp do aplikacji",
  "Zaproszenia członków zespołu",
  "Eksport danych do CSV",
  "Dożywotni rabat po wyjściu z bety",
];

export function LandingPricing() {
  return (
    <section id="pricing" className="relative">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-24 sm:px-10 sm:py-32">
        <header className="mx-auto max-w-[640px] text-center">
          <span className="text-accent text-[10.5px] font-medium tracking-[0.1em] uppercase">
            Cennik
          </span>
          <h2 className="text-foreground mt-3 text-[26px] leading-[1.15] font-semibold tracking-[-0.015em] sm:text-[34px]">
            Darmowe w fazie beta.
          </h2>
          <p className="text-muted-foreground mt-4 text-[14.5px] leading-[1.6] sm:text-[15.5px]">
            Zapisz się teraz. Otrzymasz dostęp do pełnej wersji, dożywotni rabat i będziesz
            kształtować produkt razem z nami.
          </p>
        </header>

        <div className="mx-auto mt-12 max-w-[560px]">
          <div className="border-border/80 bg-card overflow-hidden rounded-xl border shadow-sm">
            <div className="flex flex-col gap-5 p-8 sm:p-10">
              <div className="flex items-baseline gap-2">
                <span className="text-foreground text-[44px] leading-none font-semibold tracking-[-0.02em]">
                  0 zł
                </span>
                <span className="text-muted-foreground text-[13px]">/ bezterminowo w beta</span>
              </div>
              <p className="text-muted-foreground text-[13.5px] leading-[1.55]">
                Bez zobowiązań. Bez karty kredytowej. Bez ukrytych limitów.
              </p>
              <ul className="flex flex-col gap-2.5">
                {INCLUDED.map((item) => (
                  <li key={item} className="text-foreground flex items-center gap-2.5 text-[13px]">
                    <Check weight="bold" className="text-accent size-3.5 shrink-0" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="primary" size="lg" className="mt-2 w-full">
                <Link href="/register" className="gap-1.5">
                  Załóż konto
                  <ArrowRight weight="bold" className="size-3.5" />
                </Link>
              </Button>
              <p className="text-muted-foreground text-center text-[11px]">
                Cennik po wyjściu z bety ogłosimy z wyprzedzeniem.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
