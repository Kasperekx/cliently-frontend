"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Warning } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { ApiError, apiFetch } from "@/lib/api";
import { getSession } from "@/lib/auth-client";
import { slugify } from "@/lib/slug";

import { isOrganizationValid, StepOrganization } from "./step-organization";
import { isBrandingValid, StepBranding } from "./step-branding";
import { isTeamValid, StepTeam } from "./step-team";
import { OnboardingStepper, type StepKey } from "./onboarding-stepper";
import { OnboardingSuccess } from "./onboarding-success";
import { DEFAULT_ACCENT, type OnboardingData } from "./types";

type FlowState = StepKey | "done";

const STEP_ORDER: StepKey[] = ["organization", "branding", "team"];

const STEP_COPY: Record<StepKey, { title: string; description: string }> = {
  organization: {
    title: "Powiedz nam o organizacji",
    description:
      "Te trzy informacje pozwolą nam dostosować Cliently do tego, jak pracujesz z klientami.",
  },
  branding: {
    title: "Dopasuj markę",
    description:
      "Kolor akcentu pojawi się w portalach klientów i wiadomościach wysyłanych z aplikacji. Logo dodamy, gdy włączymy zapis plików.",
  },
  team: {
    title: "Zaproś zespół",
    description:
      "Opcjonalnie — dodaj osoby do swojej przestrzeni. Zaproszenia wyślemy po zakończeniu konfiguracji.",
  },
};

function createInitialData(): OnboardingData {
  return {
    organization: { name: "", industry: null, teamSize: null },
    branding: { logoDataUrl: null, logoName: null, accentColor: DEFAULT_ACCENT },
    team: { invites: [] },
  };
}

type CompleteResponse = { organizationId: string; slug: string };

function buildCompletePayload(data: OnboardingData) {
  return {
    organization: {
      name: data.organization.name.trim(),
      slug: slugify(data.organization.name),
      industry: data.organization.industry ?? undefined,
      teamSize: data.organization.teamSize ?? undefined,
    },
    branding: { accentColor: data.branding.accentColor },
    team: {
      invites: data.team.invites.map((invite) => ({
        email: invite.email.trim().toLowerCase(),
        role: invite.role,
      })),
    },
  };
}

export function OnboardingFlow() {
  const router = useRouter();
  const [state, setState] = useState<FlowState>("organization");
  const [data, setData] = useState<OnboardingData>(createInitialData);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, startTransition] = useTransition();

  const completed = useMemo<StepKey[]>(() => {
    if (state === "done") return STEP_ORDER;
    const currentIndex = STEP_ORDER.indexOf(state);
    return STEP_ORDER.slice(0, currentIndex);
  }, [state]);

  const currentStep = state === "done" ? "team" : state;
  const isValid =
    state === "organization"
      ? isOrganizationValid(data.organization)
      : state === "branding"
        ? isBrandingValid(data.branding)
        : state === "team"
          ? isTeamValid(data.team)
          : true;

  const slugPreview = slugify(data.organization.name);
  const slugValid = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/.test(slugPreview);

  function finalize() {
    if (!slugValid) {
      setSubmitError("Nazwa organizacji musi zawierać litery lub cyfry (minimum 2 znaki).");
      return;
    }
    setSubmitError(null);
    startTransition(async () => {
      try {
        await apiFetch<CompleteResponse>("/api/v1/onboarding/complete", {
          method: "POST",
          json: buildCompletePayload(data),
        });
        await getSession();
        setState("done");
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.status === 409) {
            router.replace("/dashboard");
            return;
          }
          if (error.status === 401) {
            router.replace("/login");
            return;
          }
          setSubmitError(error.message);
          return;
        }
        setSubmitError(
          "Nie udało się zakończyć konfiguracji. Sprawdź połączenie i spróbuj ponownie."
        );
      }
    });
  }

  function goNext() {
    if (!isValid || isSubmitting) return;
    if (state === "organization") setState("branding");
    else if (state === "branding") setState("team");
    else if (state === "team") finalize();
  }

  function goBack() {
    if (isSubmitting) return;
    if (state === "branding") setState("organization");
    else if (state === "team") setState("branding");
  }

  const primaryLabel =
    state === "team"
      ? data.team.invites.length === 0
        ? "Pomiń i zakończ"
        : "Zakończ konfigurację"
      : "Dalej";

  const currentIndex = STEP_ORDER.indexOf(currentStep);

  if (state === "done") {
    return (
      <div className="flex flex-col gap-8">
        <OnboardingStepper current="team" completed={STEP_ORDER} />
        <OnboardingSuccess data={data} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-3">
        <OnboardingStepper current={currentStep} completed={completed} />
        <span className="text-muted-foreground text-[12px] tabular-nums" data-slot="numeric">
          Krok {currentIndex + 1} z {STEP_ORDER.length}
        </span>
      </div>

      <header className="flex flex-col gap-1.5">
        <h1 className="text-foreground text-[24px] leading-tight font-semibold tracking-tight">
          {STEP_COPY[currentStep].title}
        </h1>
        <p className="text-muted-foreground max-w-lg text-[13px] leading-relaxed">
          {STEP_COPY[currentStep].description}
        </p>
      </header>

      <section key={state} className="animate-in fade-in slide-in-from-right-1 duration-200">
        {state === "organization" ? (
          <StepOrganization
            data={data.organization}
            onChange={(organization) => setData({ ...data, organization })}
          />
        ) : null}

        {state === "branding" ? (
          <StepBranding
            data={data.branding}
            companyName={data.organization.name}
            onChange={(branding) => setData({ ...data, branding })}
          />
        ) : null}

        {state === "team" ? (
          <StepTeam data={data.team} onChange={(team) => setData({ ...data, team })} />
        ) : null}
      </section>

      {submitError ? (
        <div
          role="alert"
          className="border-destructive/40 bg-destructive/5 text-destructive flex items-start gap-2 rounded-md border px-3 py-2 text-[12.5px]"
        >
          <Warning className="mt-0.5 size-4 shrink-0" weight="regular" />
          <span>{submitError}</span>
        </div>
      ) : null}

      <div className="border-border flex items-center justify-between gap-3 border-t pt-6">
        {state !== "organization" ? (
          <Button type="button" variant="ghost" onClick={goBack} disabled={isSubmitting}>
            <ArrowLeft weight="bold" />
            Wstecz
          </Button>
        ) : (
          <span className="text-muted-foreground text-[12.5px]">
            Ustawienia można zmienić później w Cliently.
          </span>
        )}

        <Button type="button" onClick={goNext} disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Zapisywanie…" : primaryLabel}
          {!isSubmitting ? <ArrowRight weight="bold" /> : null}
        </Button>
      </div>
    </div>
  );
}
