import type { Metadata } from "next";

import { LandingAutoRedirect } from "@/components/landing/landing-auto-redirect";
import { LandingCta } from "@/components/landing/landing-cta";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingPricing } from "@/components/landing/landing-pricing";
import { LandingStats } from "@/components/landing/landing-stats";

export const metadata: Metadata = {
  title: "Cliently — CRM dla freelancerów i małych zespołów",
  description:
    "Lekki, szybki CRM zrobiony z myślą o freelancerach i małych zespołach. Klawiatura first, 13 px baseline, ciemny i jasny motyw.",
  openGraph: {
    title: "Cliently — CRM dla freelancerów i małych zespołów",
    description:
      "Lekki, szybki CRM zrobiony z myślą o freelancerach i małych zespołach. Klawiatura first, 13 px baseline, ciemny i jasny motyw.",
    type: "website",
    locale: "pl_PL",
  },
};

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <LandingAutoRedirect />
      <LandingNav />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingStats />
        <LandingPricing />
        <LandingFaq />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
