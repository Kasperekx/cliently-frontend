import { SessionGate } from "@/components/auth/session-gate";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGate require="authenticated" requireOnboarded>
      {children}
    </SessionGate>
  );
}
