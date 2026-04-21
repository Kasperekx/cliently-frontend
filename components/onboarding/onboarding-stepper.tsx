"use client";

import { Check } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

export type StepKey = "organization" | "branding" | "team";

type StepDefinition = {
  key: StepKey;
  index: number;
  label: string;
  caption: string;
};

export const ONBOARDING_STEPS: StepDefinition[] = [
  { key: "organization", index: 1, label: "Organizacja", caption: "Twoja firma" },
  { key: "branding", index: 2, label: "Branding", caption: "Wizualna tożsamość" },
  { key: "team", index: 3, label: "Zespół", caption: "Pierwsze zaproszenia" },
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
  const currentIndex = ONBOARDING_STEPS.findIndex((step) => step.key === current);
  const completedCount = completed.length;
  const totalSegments = ONBOARDING_STEPS.length - 1;
  const progressBase = totalSegments === 0 ? 0 : completedCount / totalSegments;
  const partial = currentIndex > completedCount ? 0.5 / totalSegments : 0;
  const progress = Math.min(1, progressBase + partial);

  return (
    <div className="w-full">
      <div className="relative px-2 sm:px-4">
        <div className="bg-border/70 absolute top-4 right-6 left-6 h-px" aria-hidden />
        <div
          className="bg-accent absolute top-4 left-6 h-px transition-all duration-500"
          style={{ width: `calc((100% - 3rem) * ${progress})` }}
          aria-hidden
        />

        <ol className="relative flex items-start justify-between gap-2">
          {ONBOARDING_STEPS.map((step) => {
            const status = getStepStatus(step, current, completed);

            return (
              <li
                key={step.key}
                className="flex flex-1 flex-col items-center gap-3 text-center"
                aria-current={status === "active" ? "step" : undefined}
              >
                <span
                  className={cn(
                    "bg-background relative flex size-8 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-300",
                    status === "completed" && "border-accent bg-accent text-accent-foreground",
                    status === "active" &&
                      "border-accent text-foreground ring-accent/25 shadow-sm ring-4",
                    status === "upcoming" && "border-border/70 text-muted-foreground"
                  )}
                >
                  {status === "completed" ? <Check className="size-4" weight="bold" /> : step.index}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span
                    className={cn(
                      "text-[10px] font-semibold tracking-[0.22em] uppercase transition-colors",
                      status === "upcoming" ? "text-muted-foreground" : "text-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="text-muted-foreground hidden text-[11px] sm:block">
                    {step.caption}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
