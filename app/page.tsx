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
      className="bg-background flex min-h-dvh flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden
        className="border-border border-t-foreground inline-block size-4 animate-spin rounded-full border-2"
      />
      <span className="text-muted-foreground text-[12.5px]">Ładowanie…</span>
    </div>
  );
}
