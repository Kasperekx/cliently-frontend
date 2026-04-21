"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "@/lib/auth-client";

export default function RootPage() {
  const router = useRouter();
  const { data, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;
    const user = data?.user as { onboardingCompleted?: boolean } | undefined;
    if (!user) {
      router.replace("/login");
      return;
    }
    router.replace(user.onboardingCompleted ? "/dashboard" : "/onboarding");
  }, [isPending, data, router]);

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
