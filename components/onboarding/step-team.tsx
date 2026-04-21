"use client";

import { type KeyboardEvent, useId, useState } from "react";
import { CaretDown, Plus, X } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  EMAIL_REGEX,
  MAX_INVITES,
  ROLE_LABEL,
  ROLE_OPTIONS,
  type TeamData,
  type TeamInvite,
  type TeamRole,
} from "./types";

type StepTeamProps = {
  data: TeamData;
  onChange: (data: TeamData) => void;
};

function createInviteId(): string {
  return `invite-${Math.random().toString(36).slice(2, 9)}`;
}

export function StepTeam({ data, onChange }: StepTeamProps) {
  const formId = useId();
  const [draft, setDraft] = useState("");
  const [draftError, setDraftError] = useState<string | null>(null);

  const remainingSlots = MAX_INVITES - data.invites.length;
  const canAddMore = remainingSlots > 0;

  function commitDraft(): boolean {
    const trimmed = draft.trim().replace(/,$/, "").trim();
    if (!trimmed) {
      setDraftError(null);
      return false;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setDraftError("Wpisz poprawny adres e-mail.");
      return false;
    }
    if (data.invites.some((invite) => invite.email.toLowerCase() === trimmed.toLowerCase())) {
      setDraftError("Ten e-mail już jest na liście.");
      return false;
    }
    if (!canAddMore) {
      setDraftError(`Możesz zaprosić maksymalnie ${MAX_INVITES} osób na tym etapie.`);
      return false;
    }

    const newInvite: TeamInvite = {
      id: createInviteId(),
      email: trimmed,
      role: "member",
    };
    onChange({ invites: [...data.invites, newInvite] });
    setDraft("");
    setDraftError(null);
    return true;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitDraft();
      return;
    }
    if (event.key === "Backspace" && draft === "" && data.invites.length > 0) {
      const next = data.invites.slice(0, -1);
      onChange({ invites: next });
    }
  }

  function removeInvite(id: string) {
    onChange({ invites: data.invites.filter((invite) => invite.id !== id) });
  }

  function changeRole(id: string, role: TeamRole) {
    onChange({
      invites: data.invites.map((invite) => (invite.id === id ? { ...invite, role } : invite)),
    });
  }

  return (
    <FieldGroup className="gap-7">
      <Field>
        <FieldLabel htmlFor={`${formId}-email`}>Zaproś zespół</FieldLabel>
        <FieldContent>
          <div
            className={cn(
              "border-border/70 bg-background/80 focus-within:border-accent/60 focus-within:ring-accent/30 flex flex-wrap items-center gap-2 rounded-md border p-2 transition-shadow focus-within:ring-2"
            )}
          >
            {data.invites.map((invite) => {
              const valid = EMAIL_REGEX.test(invite.email);
              return (
                <span
                  key={invite.id}
                  className={cn(
                    "border-border/70 bg-background inline-flex items-center gap-1 rounded-full border py-1 pr-1 pl-2.5 text-xs",
                    !valid && "border-destructive/60 text-destructive"
                  )}
                >
                  <span className="text-foreground">{invite.email}</span>
                  <span className="bg-border/70 mx-1 h-3.5 w-px" aria-hidden />
                  <span className="relative inline-flex items-center">
                    <select
                      value={invite.role}
                      onChange={(event) => changeRole(invite.id, event.target.value as TeamRole)}
                      aria-label={`Rola dla ${invite.email}`}
                      className="text-muted-foreground hover:text-foreground focus-visible:ring-accent/40 cursor-pointer appearance-none rounded-md bg-transparent py-0.5 pr-5 pl-1.5 text-xs font-medium focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {ROLE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <CaretDown
                      className="text-muted-foreground pointer-events-none absolute right-0.5 size-3"
                      weight="bold"
                    />
                  </span>
                  <button
                    type="button"
                    onClick={() => removeInvite(invite.id)}
                    aria-label={`Usuń ${invite.email}`}
                    className="text-muted-foreground hover:text-destructive ml-0.5 inline-flex size-5 items-center justify-center rounded-full transition-colors"
                  >
                    <X className="size-3" weight="bold" />
                  </button>
                </span>
              );
            })}

            {canAddMore ? (
              <Input
                id={`${formId}-email`}
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value);
                  if (draftError) setDraftError(null);
                }}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (draft.trim()) commitDraft();
                }}
                type="email"
                inputMode="email"
                autoComplete="off"
                placeholder={data.invites.length === 0 ? "kolega@firma.pl" : "Dodaj kolejny e-mail"}
                className="h-8 min-w-40 flex-1 border-0 bg-transparent px-1.5 text-sm shadow-none focus-visible:ring-0"
              />
            ) : null}
          </div>
        </FieldContent>
        <div className="mt-1 flex items-center justify-between gap-3">
          <FieldDescription className="m-0">
            Wpisz e-mail i naciśnij Enter. Rolę zmienisz, klikając w nią obok adresu.
          </FieldDescription>
          <span className="text-muted-foreground text-[11px] tabular-nums">
            {data.invites.length} / {MAX_INVITES}
          </span>
        </div>
        {draftError ? <FieldError className="mt-1">{draftError}</FieldError> : null}
      </Field>

      <div className="bg-muted/30 border-border/60 flex flex-col gap-3 rounded-md border p-4">
        <p className="text-foreground text-xs font-semibold tracking-[0.18em] uppercase">
          Co oznaczają role
        </p>
        <ul className="text-muted-foreground grid gap-1.5 text-xs leading-relaxed sm:grid-cols-3">
          <li>
            <span className="text-foreground font-medium">{ROLE_LABEL.admin}</span> — pełen dostęp i
            konfiguracja przestrzeni.
          </li>
          <li>
            <span className="text-foreground font-medium">{ROLE_LABEL.manager}</span> — prowadzi
            klientów i zaprasza zespół.
          </li>
          <li>
            <span className="text-foreground font-medium">{ROLE_LABEL.member}</span> — pracuje na
            przypisanych projektach.
          </li>
        </ul>
      </div>

      {canAddMore && draft === "" && data.invites.length === 0 ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground self-start rounded-md text-xs"
          onClick={() => {
            const input = document.getElementById(`${formId}-email`);
            input?.focus();
          }}
        >
          <Plus className="size-3.5" weight="bold" />
          Dodaj pierwsze zaproszenie
        </Button>
      ) : null}
    </FieldGroup>
  );
}

export function isTeamValid(data: TeamData): boolean {
  return data.invites.every((invite) => EMAIL_REGEX.test(invite.email));
}
