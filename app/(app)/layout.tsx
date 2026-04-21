import { AppShell } from "@/components/app/app-shell";
import { SessionGate } from "@/components/auth/session-gate";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGate require="authenticated" requireOnboarded>
      <AppShell>{children}</AppShell>
    </SessionGate>
  );
}
