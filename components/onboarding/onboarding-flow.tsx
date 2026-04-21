"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Warning } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const STEP_COPY: Record<StepKey, { eyebrow: string; title: string; description: string }> = {
  organization: {
    eyebrow: "Krok 1 z 3",
    title: "Powiedz nam o organizacji",
    description:
      "Te trzy informacje pozwolą nam dostosować Cliently do tego, jak pracujesz z klientami.",
  },
  branding: {
    eyebrow: "Krok 2 z 3",
    title: "Ubierz Cliently w swoją markę",
    description:
      "Kolor akcentu pojawi się w portalach klientów i wiadomościach wysyłanych z aplikacji. Logo dodamy, gdy włączymy zapis plików.",
  },
  team: {
    eyebrow: "Krok 3 z 3",
    title: "Zaproś swój zespół",
    description:
      "Opcjonalnie — dodaj osoby do swojej przestrzeni. Zaproszenia zostaną wysłane po zakończeniu konfiguracji.",
  },
};

function createInitialData(): OnboardingData {
  return {
    organization: { name: "", industry: null, teamSize: null },
    branding: { logoDataUrl: null, logoName: null, accentColor: DEFAULT_ACCENT },
    team: { invites: [] },
  };
}

type CompleteResponse = {
  organizationId: string;
  slug: string;
};

function buildCompletePayload(data: OnboardingData) {
  return {
    organization: {
      name: data.organization.name.trim(),
      slug: slugify(data.organization.name),
      industry: data.organization.industry ?? undefined,
      teamSize: data.organization.teamSize ?? undefined,
    },
    branding: {
      accentColor: data.branding.accentColor,
    },
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
        // Refresh better-auth's cached session so onboardingCompleted=true
        // is visible to every useSession() consumer before we redirect.
        await getSession();
        setState("done");
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.status === 409) {
            // User already onboarded — zip straight to dashboard.
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

    if (state === "organization") {
      setState("branding");
      return;
    }
    if (state === "branding") {
      setState("team");
      return;
    }
    if (state === "team") {
      finalize();
    }
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

  return (
    <Card className="shadow-card border-border/70 bg-card/95 w-full overflow-hidden rounded-xl border backdrop-blur-sm">
      <div className="from-accent/8 via-background to-background bg-linear-to-b">
        <CardHeader className="px-6 pt-6 pb-5 sm:px-8">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground bg-background/80 border-border/60 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-medium tracking-[0.22em] uppercase">
              <span className="bg-accent size-1.5 rounded-full" />
              Onboarding
            </span>
            {state !== "done" ? (
              <span className="text-muted-foreground text-[11px]">
                {STEP_COPY[currentStep].eyebrow}
              </span>
            ) : null}
          </div>

          <div className="mt-6">
            <OnboardingStepper
              current={currentStep}
              completed={state === "done" ? STEP_ORDER : completed}
            />
          </div>

          {state !== "done" ? (
            <div className="mt-6">
              <CardTitle className="text-[1.5rem] font-semibold tracking-tight sm:text-[1.75rem]">
                {STEP_COPY[currentStep].title}
              </CardTitle>
              <CardDescription className="mt-2 max-w-md text-sm leading-relaxed">
                {STEP_COPY[currentStep].description}
              </CardDescription>
            </div>
          ) : null}
        </CardHeader>

        <CardContent className="px-6 pb-6 sm:px-8">
          <div key={state} className="animate-in fade-in slide-in-from-right-2 duration-400">
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

            {state === "done" ? <OnboardingSuccess data={data} /> : null}
          </div>

          {submitError && state !== "done" ? (
            <div
              role="alert"
              className="border-destructive/40 bg-destructive/5 text-destructive mt-5 flex items-start gap-2 rounded-md border px-3 py-2 text-xs"
            >
              <Warning className="mt-0.5 size-4 shrink-0" weight="duotone" />
              <span>{submitError}</span>
            </div>
          ) : null}
        </CardContent>

        {state !== "done" ? (
          <CardFooter className="border-border/60 bg-background/80 flex items-center justify-between gap-3 border-t px-6 py-5 sm:px-8">
            {state !== "organization" ? (
              <Button
                type="button"
                variant="ghost"
                size="lg"
                disabled={isSubmitting}
                className="text-muted-foreground hover:text-foreground h-11 rounded-md px-3 text-sm"
                onClick={goBack}
              >
                <ArrowLeft className="size-4" weight="bold" />
                Wstecz
              </Button>
            ) : (
              <span className="text-muted-foreground text-xs">
                Możesz wrócić do tych ustawień później w Cliently.
              </span>
            )}

            <Button
              type="button"
              size="lg"
              className="h-11 min-w-40 rounded-md text-sm font-semibold"
              onClick={goNext}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "Zapisywanie..." : primaryLabel}
              {!isSubmitting ? <ArrowRight className="size-4" weight="bold" /> : null}
            </Button>
          </CardFooter>
        ) : null}
      </div>
    </Card>
  );
}
