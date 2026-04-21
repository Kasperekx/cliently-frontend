"use client";

import { type KeyboardEvent, useId, useState } from "react";
import { Plus, X } from "@phosphor-icons/react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    const newInvite: TeamInvite = { id: createInviteId(), email: trimmed, role: "member" };
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
      onChange({ invites: data.invites.slice(0, -1) });
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
    <FieldGroup className="gap-6">
      <Field>
        <FieldLabel htmlFor={`${formId}-email`}>E-mail</FieldLabel>
        <FieldContent>
          <div className="flex gap-2">
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
              disabled={!canAddMore}
              placeholder={data.invites.length === 0 ? "kolega@firma.pl" : "Dodaj kolejny e-mail"}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              disabled={!canAddMore || draft.trim().length === 0}
              onClick={() => commitDraft()}
            >
              <Plus weight="bold" />
              Dodaj
            </Button>
          </div>
        </FieldContent>
        <div className="mt-1 flex items-center justify-between gap-3">
          <FieldDescription className="m-0">Wpisz e-mail i naciśnij Enter.</FieldDescription>
          <span className="text-muted-foreground text-[11.5px] tabular-nums" data-slot="numeric">
            {data.invites.length} / {MAX_INVITES}
          </span>
        </div>
        {draftError ? <FieldError className="mt-1">{draftError}</FieldError> : null}
      </Field>

      {data.invites.length > 0 ? (
        <ul className="divide-border border-border bg-card flex flex-col divide-y rounded-lg border shadow-xs">
          {data.invites.map((invite) => {
            const valid = EMAIL_REGEX.test(invite.email);
            return (
              <li
                key={invite.id}
                className={cn("flex items-center gap-3 px-4 py-2.5", !valid && "bg-destructive/5")}
              >
                <span
                  className={cn(
                    "flex-1 truncate text-[13px] font-medium",
                    valid ? "text-foreground" : "text-destructive"
                  )}
                >
                  {invite.email}
                </span>
                <Select
                  value={invite.role}
                  onValueChange={(next) => changeRole(invite.id, next as TeamRole)}
                >
                  <SelectTrigger
                    size="sm"
                    aria-label={`Rola dla ${invite.email}`}
                    className="h-7 w-[120px]"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  onClick={() => removeInvite(invite.id)}
                  aria-label={`Usuń ${invite.email}`}
                  className="text-muted-foreground hover:bg-muted hover:text-destructive focus-visible:ring-ring/40 inline-flex size-7 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  <X weight="bold" className="size-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className="border-border bg-muted/30 rounded-md border p-4">
        <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
          Role
        </p>
        <ul className="text-muted-foreground mt-2 grid gap-1.5 text-[12.5px] leading-relaxed sm:grid-cols-3">
          <li>
            <span className="text-foreground font-medium">{ROLE_LABEL.admin}</span> — pełen dostęp.
          </li>
          <li>
            <span className="text-foreground font-medium">{ROLE_LABEL.manager}</span> — prowadzi
            klientów.
          </li>
          <li>
            <span className="text-foreground font-medium">{ROLE_LABEL.member}</span> — pracuje na
            projektach.
          </li>
        </ul>
      </div>
    </FieldGroup>
  );
}

export function isTeamValid(data: TeamData): boolean {
  return data.invites.every((invite) => EMAIL_REGEX.test(invite.email));
}
