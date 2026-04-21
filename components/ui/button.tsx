import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-transparent",
    "text-[13px] font-medium whitespace-nowrap tracking-tight select-none outline-none",
    "transition-[background-color,border-color,color,box-shadow] duration-150 ease-[var(--ease-out-quick,ease-out)]",
    "focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/85",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70 aria-expanded:bg-secondary/70",
        outline:
          "border-border bg-background text-foreground hover:bg-muted hover:border-border aria-expanded:bg-muted",
        ghost: "text-foreground hover:bg-muted aria-expanded:bg-muted",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/15 focus-visible:ring-destructive/40",
        link: "h-auto text-accent underline-offset-4 hover:underline px-0",
      },
      size: {
        xs: "h-6 px-2 text-[12px] [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 px-2.5 text-[12px] [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-9 px-3 text-[13px]",
        lg: "h-10 px-3.5 text-[13px]",
        xl: "h-11 px-4 text-sm",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
