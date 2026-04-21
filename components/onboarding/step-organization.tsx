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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        "inline-flex items-center justify-center rounded-md border px-2.5 py-1.5 text-[12.5px] font-medium transition-colors duration-150",
        "focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none",
        isActive
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

export function StepOrganization({ data, onChange }: StepOrganizationProps) {
  const formId = useId();

  return (
    <FieldGroup className="gap-6">
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
          />
        </FieldContent>
        <FieldDescription>
          Tak będziesz widoczny dla zespołu i klientów w Cliently.
        </FieldDescription>
      </Field>

      <Field>
        <FieldLabel>Branża</FieldLabel>
        <div className="mt-1 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Branża">
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
        <FieldDescription>Pomoże dopasować szablony i sugestie pól w klientach.</FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor={`${formId}-team-size`}>Wielkość zespołu</FieldLabel>
        <FieldContent>
          <Select
            value={data.teamSize ?? undefined}
            onValueChange={(next) => onChange({ ...data, teamSize: next as TeamSizeValue })}
          >
            <SelectTrigger id={`${formId}-team-size`} aria-label="Wielkość zespołu">
              <SelectValue placeholder="Wybierz rozmiar" />
            </SelectTrigger>
            <SelectContent>
              {TEAM_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>
    </FieldGroup>
  );
}

export function isOrganizationValid(data: OrganizationData): boolean {
  return data.name.trim().length > 0 && data.industry !== null && data.teamSize !== null;
}
