"use client";

import Image from "next/image";
import { ArrowRight, Buildings, Check, Palette, Users } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

import { INDUSTRY_OPTIONS, type OnboardingData, ROLE_LABEL, TEAM_SIZE_OPTIONS } from "./types";

type OnboardingSuccessProps = { data: OnboardingData };

function findLabel<T extends string>(
  options: { value: T; label: string }[],
  value: T | null
): string {
  if (!value) return "—";
  return options.find((option) => option.value === value)?.label ?? "—";
}

export function OnboardingSuccess({ data }: OnboardingSuccessProps) {
  const { organization, branding, team } = data;

  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <span
          className="inline-flex size-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          aria-hidden
        >
          <Check weight="bold" className="size-5" />
        </span>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-foreground text-[24px] leading-tight font-semibold tracking-tight">
            Wszystko gotowe{organization.name.trim() ? `, ${organization.name.trim()}` : ""}.
          </h2>
          <p className="text-muted-foreground mx-auto max-w-md text-[13px] leading-relaxed">
            Twoja przestrzeń jest skonfigurowana. Wejdź do Cliently i zacznij pracę z klientami.
          </p>
        </div>
      </div>

      <div className="grid w-full gap-2 sm:grid-cols-3">
        <SummaryCard
          icon={<Buildings weight="regular" />}
          label="Organizacja"
          primary={organization.name.trim() || "—"}
          secondary={`${findLabel(INDUSTRY_OPTIONS, organization.industry)} · ${findLabel(TEAM_SIZE_OPTIONS, organization.teamSize)}`}
        />
        <SummaryCard
          icon={<Palette weight="regular" />}
          label="Branding"
          primary={branding.accentColor.toUpperCase()}
          secondary={branding.logoName ?? "Logo gotowe"}
          accent={branding.accentColor}
          logo={branding.logoDataUrl}
        />
        <SummaryCard
          icon={<Users weight="regular" />}
          label="Zespół"
          primary={`${team.invites.length} ${team.invites.length === 1 ? "zaproszenie" : "zaproszeń"}`}
          secondary={
            team.invites
              .slice(0, 2)
              .map((invite) => `${invite.email} (${ROLE_LABEL[invite.role]})`)
              .join(", ") + (team.invites.length > 2 ? "…" : "")
          }
        />
      </div>

      <Button
        type="button"
        size="default"
        className="w-full sm:w-auto sm:min-w-60"
        onClick={() => window.location.assign("/dashboard")}
      >
        Wejdź do Cliently
        <ArrowRight weight="bold" />
      </Button>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  primary,
  secondary,
  accent,
  logo,
}: {
  icon: React.ReactNode;
  label: string;
  primary: string;
  secondary: string;
  accent?: string;
  logo?: string | null;
}) {
  return (
    <div className="border-border bg-card flex flex-col items-start gap-2 rounded-md border p-4 text-left shadow-xs">
      <div className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-medium tracking-wider uppercase [&_svg]:size-3">
        {icon}
        {label}
      </div>
      <div className="flex items-center gap-2">
        {accent ? (
          <span
            className="border-border relative inline-flex size-6 overflow-hidden rounded-md border"
            style={{ backgroundColor: accent }}
            aria-hidden
          >
            {logo ? (
              <Image
                src={logo}
                alt=""
                fill
                sizes="24px"
                className="object-contain p-0.5"
                unoptimized
              />
            ) : null}
          </span>
        ) : null}
        <p className="text-foreground text-[13px] font-semibold">{primary}</p>
      </div>
      <p className="text-muted-foreground line-clamp-2 text-[12px]">{secondary}</p>
    </div>
  );
}
