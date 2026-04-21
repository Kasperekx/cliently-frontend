"use client";

import { Check } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

export type StepKey = "organization" | "branding" | "team";

type StepDefinition = {
  key: StepKey;
  index: number;
  label: string;
};

export const ONBOARDING_STEPS: StepDefinition[] = [
  { key: "organization", index: 1, label: "Organizacja" },
  { key: "branding", index: 2, label: "Branding" },
  { key: "team", index: 3, label: "Zespół" },
];

type OnboardingStepperProps = {
  current: StepKey;
  completed: StepKey[];
};

function getStepStatus(
  step: StepDefinition,
  current: StepKey,
  completed: StepKey[]
): "completed" | "active" | "upcoming" {
  if (completed.includes(step.key)) return "completed";
  if (step.key === current) return "active";
  return "upcoming";
}

export function OnboardingStepper({ current, completed }: OnboardingStepperProps) {
  return (
    <ol className="flex items-center gap-2" aria-label="Postęp onboardingu">
      {ONBOARDING_STEPS.map((step, i) => {
        const status = getStepStatus(step, current, completed);
        return (
          <li
            key={step.key}
            className="flex items-center gap-2"
            aria-current={status === "active" ? "step" : undefined}
          >
            <span
              className={cn(
                "relative flex size-5 items-center justify-center rounded-full border text-[10px] font-semibold transition-colors duration-200",
                status === "completed" && "border-foreground bg-foreground text-background",
                status === "active" && "border-foreground bg-background text-foreground",
                status === "upcoming" && "border-border bg-background text-muted-foreground"
              )}
            >
              {status === "completed" ? <Check className="size-2.5" weight="bold" /> : step.index}
            </span>
            <span
              className={cn(
                "hidden text-[12px] transition-colors sm:inline",
                status === "upcoming" ? "text-muted-foreground" : "text-foreground font-medium"
              )}
            >
              {step.label}
            </span>
            {i < ONBOARDING_STEPS.length - 1 ? (
              <span aria-hidden className="bg-border mx-1 h-px w-6 sm:w-8" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
