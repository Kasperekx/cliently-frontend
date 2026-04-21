import * as React from "react";

import { cn } from "@/lib/utils";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "border-border bg-muted text-muted-foreground inline-flex h-[18px] min-w-[18px] items-center justify-center gap-0.5 rounded-[4px] border px-1 font-sans text-[10.5px] leading-none font-medium tabular-nums select-none",
        "shadow-[0_1px_0_oklch(0_0_0/0.04)] dark:shadow-[inset_0_-1px_0_oklch(1_0_0/0.06)]",
        className
      )}
      {...props}
    />
  );
}

export { Kbd };
