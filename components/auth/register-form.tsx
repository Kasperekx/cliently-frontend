"use client";

import { type FormEvent, useId, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeSlash } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type PasswordCheck = {
  id: string;
  label: string;
  passed: boolean;
};

function getPasswordChecks(password: string): PasswordCheck[] {
  return [
    { id: "length", label: "8+ znaków", passed: password.length >= 8 },
    {
      id: "case",
      label: "Aa",
      passed: /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
    {
      id: "complexity",
      label: "Cyfra / znak",
      passed: /\d/.test(password) || /[^A-Za-z0-9]/.test(password),
    },
  ];
}

function mapSignUpError(code: string | undefined, fallback: string): string {
  switch (code) {
    case "USER_ALREADY_EXISTS":
    case "EMAIL_TAKEN":
      return "Konto z tym adresem e-mail już istnieje. Zaloguj się.";
    case "INVALID_EMAIL":
      return "Nieprawidłowy adres e-mail.";
    case "PASSWORD_TOO_SHORT":
    case "INVALID_PASSWORD":
      return "Hasło nie spełnia wymagań bezpieczeństwa.";
    default:
      return fallback || "Nie udało się utworzyć konta. Spróbuj ponownie.";
  }
}

export function RegisterForm() {
  const formId = useId();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const passwordChecks = useMemo(() => getPasswordChecks(password), [password]);
  const allPasswordChecksPassed = passwordChecks.every((check) => check.passed);
  const passedCount = passwordChecks.filter((c) => c.passed).length;
  const showChecks = password.length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setSubmitError("Podaj swoje imię i nazwisko (min. 2 znaki).");
      return;
    }
    if (!trimmedEmail) {
      setSubmitError("Podaj adres e-mail.");
      return;
    }
    if (!allPasswordChecksPassed) {
      setSubmitError("Hasło nie spełnia wymagań bezpieczeństwa.");
      return;
    }
    if (!termsAccepted) {
      setSubmitError("Musisz zaakceptować regulamin i politykę prywatności.");
      return;
    }

    startTransition(async () => {
      const { error } = await signUp.email({ name: trimmedName, email: trimmedEmail, password });
      if (error) {
        setSubmitError(mapSignUpError(error.code, error.message ?? ""));
        return;
      }
      router.push("/onboarding");
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <header className="flex flex-col gap-2">
        <span className="text-accent text-[10.5px] font-medium tracking-widest uppercase">
          Nowe konto
        </span>
        <h1 className="text-foreground text-[22px] leading-[1.15] font-semibold tracking-[-0.02em]">
          Zacznij od pierwszego klienta.
        </h1>
        <p className="text-muted-foreground text-[13px] leading-[1.55]">
          Dwie minuty setup. Potem krótki onboarding w trzech krokach.
        </p>
      </header>

      <form id={formId} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor={`${formId}-name`}>Imię i nazwisko</FieldLabel>
            <FieldContent>
              <Input
                id={`${formId}-name`}
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Jan Kowalski"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </FieldContent>
          </Field>

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
              {showChecks ? (
                <span className="text-muted-foreground text-[11px] tabular-nums">
                  {passedCount}/3
                </span>
              ) : null}
            </div>
            <FieldContent>
              <div className="relative">
                <Input
                  id={`${formId}-password`}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 8 znaków"
                  minLength={8}
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
            <div
              className={cn(
                "flex items-center gap-3 overflow-hidden transition-all duration-200",
                showChecks ? "mt-2 max-h-8 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              {passwordChecks.map((check) => (
                <div key={check.id} className="flex items-center gap-1.5 text-[11.5px]">
                  <span
                    className={cn(
                      "size-1.5 rounded-full transition-colors",
                      check.passed ? "bg-accent" : "bg-border"
                    )}
                  />
                  <span
                    className={cn(
                      "transition-colors",
                      check.passed ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          </Field>

          <Field
            orientation="horizontal"
            className="border-border items-start gap-2.5 border-t pt-4 text-left"
          >
            <Checkbox
              id={`${formId}-terms`}
              checked={termsAccepted}
              onCheckedChange={(value) => setTermsAccepted(value === true)}
              className="mt-0.5"
            />
            <label
              htmlFor={`${formId}-terms`}
              className="text-muted-foreground cursor-pointer text-[12.5px] leading-normal"
            >
              Akceptuję{" "}
              <Link
                href="/terms"
                className="text-foreground hover:text-accent underline-offset-2 hover:underline"
              >
                regulamin
              </Link>{" "}
              i{" "}
              <Link
                href="/privacy"
                className="text-foreground hover:text-accent underline-offset-2 hover:underline"
              >
                politykę prywatności
              </Link>
              .
            </label>
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
          {isPending ? "Tworzymy konto…" : "Załóż konto"}
          {!isPending ? <ArrowRight weight="bold" /> : null}
        </Button>
      </form>

      <div className="border-border flex items-center justify-between border-t pt-5 text-[12.5px]">
        <span className="text-muted-foreground">Masz już konto?</span>
        <Link
          href="/login"
          className="text-foreground hover:text-accent inline-flex items-center gap-1 font-medium transition-colors"
        >
          Zaloguj się
          <ArrowRight weight="bold" className="size-3" />
        </Link>
      </div>
    </div>
  );
}
