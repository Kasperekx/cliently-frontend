"use client";

import { type FormEvent, useId, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Eye, EyeSlash } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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
    { id: "length", label: "Minimum 8 znaków", passed: password.length >= 8 },
    {
      id: "case",
      label: "Małe i wielkie litery",
      passed: /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
    {
      id: "complexity",
      label: "Cyfra lub znak specjalny",
      passed: /\d/.test(password) || /[^A-Za-z0-9]/.test(password),
    },
  ];
}

function RequirementRow({ passed, label }: { passed: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[12px]">
      <span
        className={cn(
          "inline-flex size-3.5 items-center justify-center rounded-full transition-colors",
          passed
            ? "text-background bg-emerald-500"
            : "border-border bg-background text-muted-foreground border"
        )}
      >
        {passed ? <Check weight="bold" className="size-2.5" /> : null}
      </span>
      <span className={passed ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </div>
  );
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
    <div className="flex flex-col gap-7">
      <header className="flex flex-col items-center gap-1.5 text-center">
        <h1 className="text-foreground text-[24px] leading-[1.15] font-semibold tracking-[-0.02em]">
          Załóż konto w Cliently
        </h1>
        <p className="text-muted-foreground text-[13px] leading-relaxed">
          Potem krótki onboarding w trzech krokach.
        </p>
      </header>

      <form id={formId} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <FieldGroup className="gap-5">
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
            <FieldDescription>
              Najlepiej użyj adresu, którego używasz do pracy z klientami.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor={`${formId}-password`}>Hasło</FieldLabel>
            <FieldContent>
              <div className="relative">
                <Input
                  id={`${formId}-password`}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Wpisz hasło"
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
            <div className="mt-2 grid gap-1.5 sm:grid-cols-3">
              {passwordChecks.map((check) => (
                <RequirementRow key={check.id} passed={check.passed} label={check.label} />
              ))}
            </div>
          </Field>

          <Field orientation="horizontal" className="items-start gap-2 text-left">
            <Checkbox
              id={`${formId}-terms`}
              checked={termsAccepted}
              onCheckedChange={(value) => setTermsAccepted(value === true)}
              className="mt-0.5"
            />
            <label
              htmlFor={`${formId}-terms`}
              className="text-muted-foreground cursor-pointer text-[13px] leading-relaxed"
            >
              Akceptuję{" "}
              <Link
                href="/terms"
                className="text-foreground hover:text-accent font-medium underline underline-offset-2"
              >
                regulamin
              </Link>{" "}
              i{" "}
              <Link
                href="/privacy"
                className="text-foreground hover:text-accent font-medium underline underline-offset-2"
              >
                politykę prywatności
              </Link>
              .
            </label>
          </Field>
        </FieldGroup>

        {submitError ? <FieldError>{submitError}</FieldError> : null}

        <Button type="submit" size="lg" disabled={isPending} className="w-full">
          {isPending ? "Tworzymy konto…" : "Załóż konto"}
          {!isPending ? <ArrowRight weight="bold" /> : null}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-[12.5px]">
        Masz już konto?{" "}
        <Link
          href="/login"
          className="text-foreground hover:text-accent font-medium underline-offset-4 hover:underline"
        >
          Zaloguj się
        </Link>
      </p>
    </div>
  );
}
