"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      data-slot="toaster"
      theme="system"
      position="bottom-right"
      gap={8}
      toastOptions={{
        classNames: {
          toast:
            "group pointer-events-auto flex w-full items-start gap-3 rounded-md border border-border bg-popover p-3 text-[13px] text-popover-foreground shadow-pop",
          title: "font-medium",
          description: "text-[12px] text-muted-foreground",
          actionButton:
            "inline-flex h-7 items-center rounded-md bg-primary px-2.5 text-[12px] font-medium text-primary-foreground hover:bg-primary/90",
          cancelButton:
            "inline-flex h-7 items-center rounded-md border border-border bg-background px-2.5 text-[12px] font-medium text-foreground hover:bg-muted",
          closeButton:
            "!inline-flex !size-6 !items-center !justify-center !rounded-md !border-0 !bg-transparent !text-muted-foreground hover:!bg-muted",
          success: "[&>[data-icon]]:text-emerald-500",
          error: "[&>[data-icon]]:text-destructive",
          info: "[&>[data-icon]]:text-accent",
          warning: "[&>[data-icon]]:text-amber-500",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
export { toast } from "sonner";
