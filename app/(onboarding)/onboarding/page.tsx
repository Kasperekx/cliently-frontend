import type { Metadata } from "next";

import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export const metadata: Metadata = {
  title: "Onboarding — Cliently",
  description: "Skonfiguruj swoją organizację, branding i zespół w trzech krokach.",
};

export default function OnboardingPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
      <OnboardingFlow />
    </div>
  );
}
