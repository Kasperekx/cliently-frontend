"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "@/lib/auth-client";

type RequiredSession = "authenticated" | "guest";

type SessionGateProps = {
  children: ReactNode;
  /**
   * - "authenticated": user must be signed in; guests redirect to /login
   * - "guest": user must be signed out; signed-in users redirect to /dashboard or /onboarding
   */
  require: RequiredSession;
  /**
   * When true and the user is authenticated but has not finished onboarding,
   * redirect them to /onboarding. Use this on /dashboard.
   */
  requireOnboarded?: boolean;
  /**
   * When true and the user has already completed onboarding, redirect them to /dashboard.
   * Use this on /onboarding.
   */
  redirectIfOnboarded?: boolean;
};

function Loader() {
  return (
    <div
      className="text-muted-foreground flex min-h-dvh items-center justify-center text-sm"
      role="status"
      aria-live="polite"
    >
      Ładowanie…
    </div>
  );
}

export function SessionGate({
  children,
  require,
  requireOnboarded,
  redirectIfOnboarded,
}: SessionGateProps) {
  const router = useRouter();
  const { data, isPending } = useSession();

  const user = data?.user as { onboardingCompleted?: boolean } | null | undefined;
  const isAuthenticated = Boolean(user);
  const onboardingCompleted = Boolean(user?.onboardingCompleted);

  useEffect(() => {
    if (isPending) return;

    if (require === "authenticated" && !isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (require === "guest" && isAuthenticated) {
      router.replace(onboardingCompleted ? "/dashboard" : "/onboarding");
      return;
    }

    if (
      require === "authenticated" &&
      isAuthenticated &&
      requireOnboarded &&
      !onboardingCompleted
    ) {
      router.replace("/onboarding");
      return;
    }

    if (
      require === "authenticated" &&
      isAuthenticated &&
      redirectIfOnboarded &&
      onboardingCompleted
    ) {
      router.replace("/dashboard");
    }
  }, [
    isPending,
    isAuthenticated,
    onboardingCompleted,
    require,
    requireOnboarded,
    redirectIfOnboarded,
    router,
  ]);

  if (isPending) return <Loader />;

  if (require === "authenticated" && !isAuthenticated) return <Loader />;
  if (require === "guest" && isAuthenticated) return <Loader />;
  if (require === "authenticated" && requireOnboarded && !onboardingCompleted) {
    return <Loader />;
  }
  if (require === "authenticated" && redirectIfOnboarded && onboardingCompleted) {
    return <Loader />;
  }

  return <>{children}</>;
}
