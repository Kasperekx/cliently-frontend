import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none tracking-tight whitespace-nowrap select-none transition-colors [&_svg]:pointer-events-none [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-border bg-background text-foreground",
        muted: "border-transparent bg-muted text-muted-foreground",
        accent: "border-accent/20 bg-accent/10 text-accent",
        success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        warning: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
        destructive: "border-destructive/20 bg-destructive/10 text-destructive",
        outline: "border-border bg-transparent text-foreground",
      },
      size: {
        sm: "h-5 px-1.5 text-[10.5px]",
        default: "h-[22px] px-2 text-[11px]",
        lg: "h-6 px-2.5 text-[12px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function BadgeDot({
  className,
  tone = "muted",
  ...props
}: React.ComponentProps<"span"> & {
  tone?: "muted" | "accent" | "success" | "warning" | "destructive";
}) {
  const toneClass = {
    muted: "bg-muted-foreground/60",
    accent: "bg-accent",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    destructive: "bg-destructive",
  }[tone];
  return (
    <span
      aria-hidden
      className={cn("inline-block size-1.5 rounded-full", toneClass, className)}
      {...props}
    />
  );
}

export { Badge, BadgeDot, badgeVariants };
