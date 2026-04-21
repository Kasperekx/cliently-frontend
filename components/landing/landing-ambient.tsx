import { cn } from "@/lib/utils";

type LandingAmbientProps = {
  /**
   * - "hero": strong radial glow near the top (used on landing hero and auth screens).
   * - "cta": softer, lower-placed glow for the final CTA section.
   */
  intensity?: "hero" | "cta";
  className?: string;
};

export function LandingAmbient({ intensity = "hero", className }: LandingAmbientProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(var(--dot-color)_1px,transparent_1px)] mask-[radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent_75%)] bg-size-[22px_22px] opacity-60 dark:opacity-[0.35]"
        style={
          {
            ["--dot-color" as string]: "color-mix(in oklch, var(--border) 85%, transparent)",
          } as React.CSSProperties
        }
      />
      <div
        className={cn(
          "absolute left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full blur-3xl",
          intensity === "hero" ? "-top-40 opacity-70" : "top-1/2 -translate-y-1/2 opacity-50"
        )}
        style={{
          background: "radial-gradient(closest-side, oklch(0.78 0.09 270 / 0.22), transparent 70%)",
        }}
      />
    </div>
  );
}
