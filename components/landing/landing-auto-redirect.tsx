"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "@/lib/auth-client";

export function LandingAutoRedirect() {
  const router = useRouter();
  const { data, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;
    const user = data?.user as { onboardingCompleted?: boolean } | undefined;
    if (!user) return;
    router.replace(user.onboardingCompleted ? "/dashboard" : "/onboarding");
  }, [isPending, data, router]);

  return null;
}
