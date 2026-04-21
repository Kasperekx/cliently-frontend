import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-border bg-background text-foreground flex h-9 w-full min-w-0 rounded-md border px-3 py-1.5 text-[13px] shadow-xs transition-[border-color,box-shadow,background-color] duration-150 outline-none",
        "placeholder:text-muted-foreground/80",
        "file:text-foreground file:mr-3 file:inline-flex file:h-7 file:items-center file:border-0 file:bg-transparent file:text-[12px] file:font-medium",
        "hover:border-foreground/20",
        "focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-2",
        "disabled:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/25 aria-invalid:ring-2",
        "dark:bg-input/40",
        className
      )}
      {...props}
    />
  );
}

export { Input };
