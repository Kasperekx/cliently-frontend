import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-border bg-background text-foreground flex min-h-[88px] w-full rounded-md border px-3 py-2 text-[13px] leading-relaxed shadow-xs transition-[border-color,box-shadow,background-color] duration-150 outline-none",
        "placeholder:text-muted-foreground/80",
        "hover:border-foreground/20",
        "focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-2",
        "disabled:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/25 aria-invalid:ring-2",
        "dark:bg-input/40",
        "field-sizing-content resize-y",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
