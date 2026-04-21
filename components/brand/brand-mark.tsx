import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
};

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "bg-foreground text-background grid size-6 place-items-center rounded-[6px] shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset]",
        className
      )}
    >
      <span className="text-[11px] font-bold tracking-tight">C</span>
    </span>
  );
}
