"use client";

import { useId } from "react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  INDUSTRY_OPTIONS,
  TEAM_SIZE_OPTIONS,
  type IndustryValue,
  type OrganizationData,
  type TeamSizeValue,
} from "./types";

type StepOrganizationProps = {
  data: OrganizationData;
  onChange: (data: OrganizationData) => void;
};

function ChipOption<T extends string>({
  isActive,
  label,
  onSelect,
}: {
  isActive: boolean;
  label: string;
  onSelect: () => void;
} & { value: T }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={cn(
        "border-border/70 bg-background/70 hover:border-accent/40 hover:text-foreground inline-flex items-center justify-center rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
        "focus-visible:ring-accent/40 focus-visible:ring-2 focus-visible:outline-none",
        isActive ? "border-accent bg-accent/10 text-foreground shadow-sm" : "text-muted-foreground"
      )}
    >
      {label}
    </button>
  );
}

export function StepOrganization({ data, onChange }: StepOrganizationProps) {
  const formId = useId();

  return (
    <FieldGroup className="gap-7">
      <Field>
        <FieldLabel htmlFor={`${formId}-name`}>Nazwa firmy</FieldLabel>
        <FieldContent>
          <Input
            id={`${formId}-name`}
            name="organization-name"
            type="text"
            autoComplete="organization"
            placeholder="np. Studio Klientowe"
            required
            value={data.name}
            onChange={(event) => onChange({ ...data, name: event.target.value })}
            className="border-border/70 bg-background/80 h-11 rounded-md px-4 text-sm"
          />
        </FieldContent>
        <FieldDescription>
          Tak będziesz widoczny dla zespołu i klientów w Cliently.
        </FieldDescription>
      </Field>

      <Field>
        <FieldLabel className="text-foreground text-sm font-medium">Branża</FieldLabel>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Branża">
          {INDUSTRY_OPTIONS.map((option) => (
            <ChipOption<IndustryValue>
              key={option.value}
              value={option.value}
              label={option.label}
              isActive={data.industry === option.value}
              onSelect={() => onChange({ ...data, industry: option.value })}
            />
          ))}
        </div>
        <FieldDescription>
          Pomoże nam dopasować szablony i sugestie pól w klientach.
        </FieldDescription>
      </Field>

      <Field>
        <FieldLabel className="text-foreground text-sm font-medium">Wielkość zespołu</FieldLabel>
        <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label="Wielkość zespołu">
          {TEAM_SIZE_OPTIONS.map((option) => (
            <ChipOption<TeamSizeValue>
              key={option.value}
              value={option.value}
              label={option.label}
              isActive={data.teamSize === option.value}
              onSelect={() => onChange({ ...data, teamSize: option.value })}
            />
          ))}
        </div>
      </Field>
    </FieldGroup>
  );
}

export function isOrganizationValid(data: OrganizationData): boolean {
  return data.name.trim().length > 0 && data.industry !== null && data.teamSize !== null;
}
