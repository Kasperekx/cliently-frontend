import { cn } from "@/lib/utils";

type ClientAvatarProps = {
  initials: string;
  id?: string;
  archived?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_CLASSES: Record<NonNullable<ClientAvatarProps["size"]>, string> = {
  sm: "size-7 text-[10.5px]",
  md: "size-9 text-[12px]",
  lg: "size-10 text-[13px]",
};

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Deterministic cool-neutral tint: picks a hue around the indigo spectrum (220–290),
// caps chroma at ~0.06 so avatars stay subtle. Light and dark values come straight
// from oklch so we don't need separate palettes.
function tint(seed: string): { bg: string; fg: string } {
  const h = 210 + (hashSeed(seed) % 100); // 210..309
  return {
    bg: `oklch(0.94 0.03 ${h})`,
    fg: `oklch(0.32 0.08 ${h})`,
  };
}

export function ClientAvatar({
  initials,
  id,
  archived,
  size = "md",
  className,
}: ClientAvatarProps) {
  const seed = (id ?? initials ?? "?").toString();
  const { bg, fg } = tint(seed);

  const style: React.CSSProperties | undefined = archived
    ? undefined
    : { backgroundColor: bg, color: fg };

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-tight select-none",
        archived && "bg-muted text-muted-foreground",
        SIZE_CLASSES[size],
        className
      )}
      style={style}
      aria-hidden
    >
      {initials || "?"}
    </span>
  );
}
