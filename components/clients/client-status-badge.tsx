import { Badge, BadgeDot } from "@/components/ui/badge";
import type { ClientStatus } from "@/lib/clients";

type ClientStatusBadgeProps = {
  status: ClientStatus;
  archived?: boolean;
  size?: "sm" | "default";
};

const STATUS_TONE: Record<ClientStatus, "success" | "accent" | "muted"> = {
  active: "success",
  prospect: "accent",
  inactive: "muted",
};

const STATUS_VARIANT: Record<ClientStatus, "success" | "accent" | "muted"> = {
  active: "success",
  prospect: "accent",
  inactive: "muted",
};

const STATUS_LABELS: Record<ClientStatus, string> = {
  active: "Aktywny",
  prospect: "Potencjalny",
  inactive: "Nieaktywny",
};

export function ClientStatusBadge({ status, archived, size = "default" }: ClientStatusBadgeProps) {
  if (archived) {
    return (
      <Badge variant="muted" size={size}>
        <BadgeDot tone="muted" />
        Archiwum
      </Badge>
    );
  }

  return (
    <Badge variant={STATUS_VARIANT[status]} size={size}>
      <BadgeDot tone={STATUS_TONE[status]} />
      {STATUS_LABELS[status]}
    </Badge>
  );
}
