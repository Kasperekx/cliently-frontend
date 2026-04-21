import { SessionGate } from "@/components/auth/session-gate";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGate require="authenticated" redirectIfOnboarded>
      <div className="bg-background relative isolate flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="bg-accent/10 absolute top-0 left-1/2 h-120 w-120 -translate-x-1/2 rounded-full blur-3xl" />
          <div className="bg-primary/4 absolute -bottom-32 left-1/2 h-72 w-md -translate-x-1/2 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_45%)]" />
          <div className="border-border/50 absolute top-6 left-1/2 h-[calc(100%-3rem)] w-full max-w-3xl -translate-x-1/2 rounded-[2.5rem] border opacity-50" />
        </div>
        <div className="relative w-full max-w-3xl">{children}</div>
      </div>
    </SessionGate>
  );
}
