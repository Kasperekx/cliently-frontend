"use client";

import { type FormEvent, useId, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, Eye, EyeSlash } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    {
      id: "length",
      label: "Minimum 8 znaków",
      passed: password.length >= 8,
    },
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
    <div className="flex items-center gap-2 text-xs">
      <span
        className={cn(
          "flex size-5 items-center justify-center rounded-full border transition-colors",
          passed
            ? "border-accent/40 bg-accent/10 text-accent"
            : "border-border/70 bg-background text-muted-foreground"
        )}
      >
        <CheckCircle className="size-3.5" weight="fill" />
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
      const { error } = await signUp.email({
        name: trimmedName,
        email: trimmedEmail,
        password,
      });

      if (error) {
        setSubmitError(mapSignUpError(error.code, error.message ?? ""));
        return;
      }

      router.push("/onboarding");
      router.refresh();
    });
  }

  return (
    <Card className="shadow-card border-border/70 bg-card/95 w-full overflow-hidden rounded-xl border backdrop-blur-sm">
      <div className="from-accent/8 via-background to-background bg-linear-to-b">
        <CardHeader className="px-6 pt-6 pb-5 sm:px-8">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground bg-background/80 border-border/60 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-medium tracking-[0.22em] uppercase">
              <span className="bg-accent size-1.5 rounded-full" />
              Rejestracja
            </span>
          </div>
          <CardTitle className="mt-5 text-[1.75rem] font-semibold tracking-tight sm:text-[2rem]">
            Utwórz konto
          </CardTitle>
          <CardDescription className="mt-2 max-w-md text-sm leading-relaxed">
            Zacznij od danych logowania. Po założeniu konta przeprowadzimy Cię przez krótki
            onboarding w trzech krokach: organizacja, branding i zespół.
          </CardDescription>
        </CardHeader>

        <form id={formId} onSubmit={handleSubmit} noValidate>
          <CardContent className="px-6 pb-6 sm:px-8">
            <FieldGroup className="gap-6">
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
                    className="border-border/70 bg-background/80 h-11 rounded-md px-4 text-sm"
                  />
                </FieldContent>
                <FieldDescription>
                  Tak będziesz widoczny dla zespołu i klientów w Cliently.
                </FieldDescription>
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
                    className="border-border/70 bg-background/80 h-11 rounded-md px-4 text-sm"
                  />
                </FieldContent>
                <FieldDescription>
                  Najlepiej użyj adresu, którego będziesz używać do pracy z klientami.
                </FieldDescription>
              </Field>

              <div className="grid gap-5">
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
                        className="border-border/70 bg-background/80 h-11 rounded-md px-4 pr-12 text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground absolute top-1 right-1 size-9 rounded-md active:translate-y-0"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                        aria-pressed={showPassword}
                      >
                        {showPassword ? (
                          <EyeSlash className="size-4" weight="duotone" />
                        ) : (
                          <Eye className="size-4" weight="duotone" />
                        )}
                      </Button>
                    </div>
                  </FieldContent>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {passwordChecks.map((check) => (
                      <RequirementRow key={check.id} passed={check.passed} label={check.label} />
                    ))}
                  </div>
                </Field>
              </div>

              <div className="bg-muted/35 border-border/60 rounded-md border p-4">
                <Field orientation="horizontal" className="items-start gap-3 text-left">
                  <Checkbox
                    id={`${formId}-terms`}
                    checked={termsAccepted}
                    onCheckedChange={(value) => setTermsAccepted(value === true)}
                    className="mt-0.5 rounded-md"
                  />
                  <div className="space-y-2">
                    <label
                      htmlFor={`${formId}-terms`}
                      className="text-foreground block cursor-pointer text-sm leading-relaxed"
                    >
                      Akceptuję{" "}
                      <Link
                        href="/terms"
                        className="text-accent font-medium underline underline-offset-2 hover:opacity-90"
                      >
                        regulamin
                      </Link>{" "}
                      i{" "}
                      <Link
                        href="/privacy"
                        className="text-accent font-medium underline underline-offset-2 hover:opacity-90"
                      >
                        politykę prywatności
                      </Link>
                      .
                    </label>
                  </div>
                </Field>
              </div>
            </FieldGroup>

            {submitError ? <FieldError className="mt-4">{submitError}</FieldError> : null}
          </CardContent>

          <CardFooter className="border-border/60 bg-background/80 flex flex-col gap-4 border-t px-6 py-5 sm:px-8">
            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="h-11 w-full rounded-md text-sm font-semibold"
            >
              {isPending ? "Tworzymy konto..." : "Załóż konto"}
              {!isPending ? <ArrowRight className="size-4" weight="bold" /> : null}
            </Button>

            <p className="text-muted-foreground text-center text-xs">
              Masz już konto?{" "}
              <Link
                href="/login"
                className="text-accent font-medium underline underline-offset-4 hover:opacity-90"
              >
                Zaloguj się
              </Link>
            </p>
          </CardFooter>
        </form>
      </div>
    </Card>
  );
}
