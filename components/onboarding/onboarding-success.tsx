"use client";

import Image from "next/image";
import { ArrowRight, Buildings, Palette, Users } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

import { INDUSTRY_OPTIONS, type OnboardingData, ROLE_LABEL, TEAM_SIZE_OPTIONS } from "./types";

type OnboardingSuccessProps = {
  data: OnboardingData;
};

function findLabel<T extends string>(
  options: { value: T; label: string }[],
  value: T | null
): string {
  if (!value) return "—";
  return options.find((option) => option.value === value)?.label ?? "—";
}

export function OnboardingSuccess({ data }: OnboardingSuccessProps) {
  const { organization, branding, team } = data;
  const accent = branding.accentColor;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <span
          className="inline-flex size-14 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accent}1f`, color: accent }}
          aria-hidden
        >
          <span className="size-3.5 rounded-full" style={{ backgroundColor: accent }} />
        </span>
        <div className="flex flex-col gap-2">
          <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
            Wszystko gotowe, {organization.name.trim() || "do dzieła"}.
          </h2>
          <p className="text-muted-foreground mx-auto max-w-md text-sm leading-relaxed">
            Twoja przestrzeń jest skonfigurowana. Możesz wejść do Cliently i zacząć pracę z
            klientami w swoim brandingu.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="border-border/60 bg-background/70 flex flex-col gap-2 rounded-md border p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-semibold tracking-[0.22em] uppercase">
            <Buildings className="size-3.5" weight="duotone" />
            Organizacja
          </div>
          <p className="text-foreground text-sm font-semibold">{organization.name.trim() || "—"}</p>
          <p className="text-muted-foreground text-xs">
            {findLabel(INDUSTRY_OPTIONS, organization.industry)} ·{" "}
            {findLabel(TEAM_SIZE_OPTIONS, organization.teamSize)}
          </p>
        </div>

        <div className="border-border/60 bg-background/70 flex flex-col gap-2 rounded-md border p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-semibold tracking-[0.22em] uppercase">
            <Palette className="size-3.5" weight="duotone" />
            Branding
          </div>
          <div className="flex items-center gap-2">
            <span
              className="border-border/70 relative inline-flex size-7 overflow-hidden rounded-md border"
              style={{ backgroundColor: accent }}
              aria-hidden
            >
              {branding.logoDataUrl ? (
                <Image
                  src={branding.logoDataUrl}
                  alt=""
                  fill
                  sizes="28px"
                  className="object-contain p-0.5"
                  unoptimized
                />
              ) : null}
            </span>
            <p className="text-foreground text-sm font-semibold">{accent.toUpperCase()}</p>
          </div>
          <p className="text-muted-foreground text-xs">{branding.logoName ?? "Logo gotowe"}</p>
        </div>

        <div className="border-border/60 bg-background/70 flex flex-col gap-2 rounded-md border p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-semibold tracking-[0.22em] uppercase">
            <Users className="size-3.5" weight="duotone" />
            Zespół
          </div>
          <p className="text-foreground text-sm font-semibold">
            {team.invites.length} {team.invites.length === 1 ? "zaproszenie" : "zaproszeń"}
          </p>
          <p className="text-muted-foreground line-clamp-2 text-xs">
            {team.invites
              .slice(0, 3)
              .map((invite) => `${invite.email} (${ROLE_LABEL[invite.role]})`)
              .join(", ")}
            {team.invites.length > 3 ? "…" : ""}
          </p>
        </div>
      </div>

      <Button
        type="button"
        size="lg"
        className="h-11 w-full rounded-md text-sm font-semibold"
        onClick={() => {
          // Hard navigation so every SessionGate re-reads the now-fresh
          // onboardingCompleted flag from the cookie-backed session.
          window.location.assign("/dashboard");
        }}
      >
        Wejdź do Cliently
        <ArrowRight className="size-4" weight="bold" />
      </Button>
    </div>
  );
}
