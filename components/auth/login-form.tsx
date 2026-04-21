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
    <div className="flex flex-col gap-7">
      <header className="flex flex-col items-center gap-1.5 text-center">
        <h1 className="text-foreground text-[24px] leading-[1.15] font-semibold tracking-[-0.02em]">
          Zaloguj się do Cliently
        </h1>
        <p className="text-muted-foreground text-[13px] leading-relaxed">
          Witaj ponownie. Wróć do pracy z klientami.
        </p>
      </header>

      <form id={formId} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <FieldGroup className="gap-5">
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
            <FieldLabel htmlFor={`${formId}-password`}>Hasło</FieldLabel>
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

        <Button type="submit" size="lg" disabled={isPending} className="w-full">
          {isPending ? "Logowanie…" : "Zaloguj się"}
          {!isPending ? <ArrowRight weight="bold" /> : null}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-[12.5px]">
        Nie masz jeszcze konta?{" "}
        <Link
          href="/register"
          className="text-foreground hover:text-accent font-medium underline-offset-4 hover:underline"
        >
          Załóż konto
        </Link>
      </p>
    </div>
  );
}
