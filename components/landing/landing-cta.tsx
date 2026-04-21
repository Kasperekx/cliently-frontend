import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";

import { Button } from "@/components/ui/button";
import { LandingAmbient } from "./landing-ambient";

export function LandingCta() {
  return (
    <section className="border-border relative isolate overflow-hidden border-t">
      <LandingAmbient intensity="cta" />
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center px-6 py-24 text-center sm:px-10 sm:py-32">
        <h2 className="text-foreground text-[30px] leading-[1.1] font-semibold tracking-[-0.02em] sm:text-[40px]">
          Zacznij od pierwszego klienta.
        </h2>
        <p className="text-muted-foreground mt-5 max-w-[480px] text-[14.5px] leading-[1.6] sm:text-[15.5px]">
          Dwie minuty setup. Zero karty kredytowej. Wyjdziesz z bety z dożywotnim rabatem.
        </p>
        <Button asChild variant="primary" size="xl" className="mt-8">
          <Link href="/register" className="gap-1.5">
            Załóż konto
            <ArrowRight weight="bold" className="size-3.5" />
          </Link>
        </Button>
        <p className="text-muted-foreground mt-5 text-[11.5px]">
          Masz pytania?{" "}
          <a
            href="mailto:hello@cliently.app"
            className="text-foreground hover:text-accent underline-offset-2 transition-colors hover:underline"
          >
            hello@cliently.app
          </a>
        </p>
      </div>
    </section>
  );
}
