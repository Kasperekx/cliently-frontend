import { SessionGate } from "@/components/auth/session-gate";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGate require="authenticated" redirectIfOnboarded>
      <div className="bg-background flex min-h-dvh flex-col">
        <header className="border-border flex h-[52px] items-center border-b px-6">
          <div className="mx-auto flex w-full max-w-3xl items-center gap-2">
            <span className="bg-primary text-primary-foreground grid size-6 place-items-center rounded-[6px]">
              <span className="text-[11px] font-bold tracking-tight">C</span>
            </span>
            <span className="text-[14px] font-semibold tracking-tight">Cliently</span>
          </div>
        </header>
        <main className="flex flex-1 items-start justify-center px-6 py-10 md:py-14">
          <div className="w-full max-w-3xl">{children}</div>
        </main>
      </div>
    </SessionGate>
  );
}
