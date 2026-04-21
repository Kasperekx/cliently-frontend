"use client";

import { type FormEvent, useId, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeSlash } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      const { error } = await signIn.email({
        email: trimmedEmail,
        password,
      });

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
    <Card className="shadow-card border-border/70 bg-card/95 w-full overflow-hidden rounded-xl border backdrop-blur-sm">
      <div className="from-accent/8 via-background to-background bg-linear-to-b">
        <CardHeader className="px-6 pt-6 pb-5 sm:px-8">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground bg-background/80 border-border/60 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-medium tracking-[0.22em] uppercase">
              <span className="bg-accent size-1.5 rounded-full" />
              Logowanie
            </span>
          </div>
          <CardTitle className="mt-5 text-[1.75rem] font-semibold tracking-tight sm:text-[2rem]">
            Witaj ponownie
          </CardTitle>
          <CardDescription className="mt-2 max-w-md text-sm leading-relaxed">
            Zaloguj się, aby wrócić do swojego Cliently.
          </CardDescription>
        </CardHeader>

        <form id={formId} onSubmit={handleSubmit} noValidate>
          <CardContent className="px-6 pb-6 sm:px-8">
            <FieldGroup className="gap-6">
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
              </Field>
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
              {isPending ? "Logowanie..." : "Zaloguj się"}
              {!isPending ? <ArrowRight className="size-4" weight="bold" /> : null}
            </Button>

            <p className="text-muted-foreground text-center text-xs">
              Nie masz konta?{" "}
              <Link
                href="/register"
                className="text-accent font-medium underline underline-offset-4 hover:opacity-90"
              >
                Załóż konto
              </Link>
            </p>
          </CardFooter>
        </form>
      </div>
    </Card>
  );
}
