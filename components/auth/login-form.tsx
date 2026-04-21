"use client";

import { type FormEvent, useId, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeSlash } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getSession, signIn } from "@/lib/auth-client";

function mapSignInError(code: string | undefined, fallback: string): string {
  switch (code) {
    case "INVALID_EMAIL_OR_PASSWORD":
    case "INVALID_CREDENTIALS":
    case "USER_NOT_FOUND":
      return "Nieprawidłowy e-mail lub hasło.";
    case "EMAIL_NOT_VERIFIED":
      return "Zweryfikuj swój adres e-mail, zanim się zalogujesz.";
    default:
      return fallback || "Nie udało się zalogować. Spróbuj ponownie.";
  }
}

export function LoginForm() {
  const formId = useId();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setSubmitError("Podaj adres e-mail i hasło.");
      return;
    }

    startTransition(async () => {
      const { error } = await signIn.email({ email: trimmedEmail, password });

      if (error) {
        setSubmitError(mapSignInError(error.code, error.message ?? ""));
        return;
      }

      const session = await getSession();
      const onboardingCompleted =
        session.data?.user &&
        "onboardingCompleted" in session.data.user &&
        Boolean((session.data.user as { onboardingCompleted?: boolean }).onboardingCompleted);

      router.push(onboardingCompleted ? "/dashboard" : "/onboarding");
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <header className="flex flex-col gap-2">
        <span className="text-accent text-[10.5px] font-medium tracking-widest uppercase">
          Logowanie
        </span>
        <h1 className="text-foreground text-[22px] leading-[1.15] font-semibold tracking-[-0.02em]">
          Witaj ponownie.
        </h1>
        <p className="text-muted-foreground text-[13px] leading-[1.55]">
          Zaloguj się i wróć do pracy z klientami.
        </p>
      </header>

      <form id={formId} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor={`${formId}-email`}>E-mail</FieldLabel>
            <FieldContent>
              <Input
                id={`${formId}-email`}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="jan@firma.pl"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FieldContent>
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor={`${formId}-password`}>Hasło</FieldLabel>
              <span className="text-muted-foreground/70 text-[11.5px]">
                Zapomniane? Napisz do nas.
              </span>
            </div>
            <FieldContent>
              <div className="relative">
                <Input
                  id={`${formId}-password`}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Wpisz hasło"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                  aria-pressed={showPassword}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring/40 absolute top-1/2 right-1 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
                >
                  {showPassword ? (
                    <EyeSlash weight="regular" className="size-4" />
                  ) : (
                    <Eye weight="regular" className="size-4" />
                  )}
                </button>
              </div>
            </FieldContent>
          </Field>
        </FieldGroup>

        {submitError ? <FieldError>{submitError}</FieldError> : null}

        <Button
          variant="primary"
          type="submit"
          size="lg"
          disabled={isPending}
          className="mt-1 w-full"
        >
          {isPending ? "Logowanie…" : "Zaloguj się"}
          {!isPending ? <ArrowRight weight="bold" /> : null}
        </Button>
      </form>

      <div className="border-border flex items-center justify-between border-t pt-5 text-[12.5px]">
        <span className="text-muted-foreground">Nie masz jeszcze konta?</span>
        <Link
          href="/register"
          className="text-foreground hover:text-accent inline-flex items-center gap-1 font-medium transition-colors"
        >
          Załóż konto
          <ArrowRight weight="bold" className="size-3" />
        </Link>
      </div>
    </div>
  );
}
