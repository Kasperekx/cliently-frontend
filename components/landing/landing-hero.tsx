import Link from "next/link";
import { ArrowRight, Sparkle } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { LandingAmbient } from "./landing-ambient";
import { LandingProductPreview } from "./landing-product-preview";

export function LandingHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <LandingAmbient intensity="hero" />

      <div className="mx-auto w-full max-w-[1200px] px-6 pt-16 pb-10 sm:px-10 sm:pt-24 sm:pb-14">
        <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          <span className="border-border/80 bg-card/60 supports-backdrop-filter:bg-card/40 text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-medium tracking-[0.1em] uppercase backdrop-blur-sm">
            <Sparkle weight="fill" className="text-accent size-3" />
            Beta · CRM dla freelancerów
          </span>

          <h1 className="text-foreground mt-6 text-[34px] leading-[1.05] font-semibold tracking-[-0.02em] sm:text-[44px] md:text-[54px]">
            Prowadź klientów
            <br />
            <span className="from-foreground via-foreground/80 to-foreground/60 bg-linear-to-br bg-clip-text text-transparent">
              bez tarcia.
            </span>
          </h1>

          <p className="text-muted-foreground mt-6 max-w-[580px] text-[15px] leading-[1.6] sm:text-[16px]">
            Cliently to CRM dla freelancerów i małych zespołów — lekki, szybki i zrobiony z myślą o
            ludziach, którzy wolą pracować niż konfigurować.
          </p>

          <div className="mt-8 flex flex-col items-center gap-2.5 sm:flex-row sm:gap-3">
            <Button asChild variant="primary" size="lg">
              <Link href="/register" className="gap-1.5">
                Załóż konto
                <ArrowRight weight="bold" className="size-3.5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href="#features">Zobacz jak to działa</a>
            </Button>
          </div>

          <p className="text-muted-foreground mt-5 text-[11.5px] tracking-tight">
            Bez karty kredytowej · Darmowe w fazie beta · Polski interfejs
          </p>
        </div>

        <div className="relative mx-auto mt-16 sm:mt-20">
          <div
            aria-hidden
            className="from-accent/0 via-accent/30 to-accent/0 absolute -inset-px -z-10 rounded-xl bg-linear-to-br opacity-40 blur-xl"
          />
          <LandingProductPreview className="mx-auto max-w-[1100px]" />
        </div>
      </div>
    </section>
  );
}
