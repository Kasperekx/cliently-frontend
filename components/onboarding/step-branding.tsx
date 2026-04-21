"use client";

import Image from "next/image";
import { type ChangeEvent, type DragEvent, useId, useRef, useState } from "react";
import { ImageSquare, Trash } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { ACCENT_PRESETS, type BrandingData, DEFAULT_ACCENT, HEX_COLOR_REGEX } from "./types";

const MAX_LOGO_BYTES = 2 * 1024 * 1024;

type StepBrandingProps = {
  data: BrandingData;
  companyName: string;
  onChange: (data: BrandingData) => void;
};

function readableForeground(hex: string): string {
  const normalized =
    hex.length === 4
      ? `#${hex
          .slice(1)
          .split("")
          .map((c) => c + c)
          .join("")}`
      : hex;
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  // Relative luminance approximation
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1a1713" : "#ffffff";
}

export function StepBranding({ data, companyName, onChange }: StepBrandingProps) {
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [hexDraft, setHexDraft] = useState<string>(data.accentColor);

  const isPresetActive = ACCENT_PRESETS.some(
    (preset) => preset.value.toLowerCase() === data.accentColor.toLowerCase()
  );

  function handleFiles(files: FileList | null) {
    setLogoError(null);
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      setLogoError("Wybierz plik graficzny (PNG, JPG, SVG).");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError("Maksymalny rozmiar pliku to 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        onChange({ ...data, logoDataUrl: result, logoName: file.name });
      }
    };
    reader.onerror = () => setLogoError("Nie udało się odczytać pliku.");
    reader.readAsDataURL(file);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleFiles(event.target.files);
    event.target.value = "";
  }

  function clearLogo() {
    setLogoError(null);
    onChange({ ...data, logoDataUrl: null, logoName: null });
  }

  function selectPreset(value: string) {
    setHexDraft(value);
    onChange({ ...data, accentColor: value });
  }

  function handleHexChange(event: ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;
    setHexDraft(next);
    if (HEX_COLOR_REGEX.test(next)) {
      onChange({ ...data, accentColor: next });
    }
  }

  const previewName = companyName.trim() || "Twoja firma";
  const previewAccent = HEX_COLOR_REGEX.test(data.accentColor) ? data.accentColor : DEFAULT_ACCENT;
  const previewForeground = readableForeground(previewAccent);

  return (
    <div className="grid gap-7 @md/field-group:grid-cols-[1.1fr_1fr]">
      <FieldGroup className="gap-7">
        <Field>
          <FieldLabel className="text-foreground text-sm font-medium">Logo</FieldLabel>
          <FieldContent>
            <label
              htmlFor={`${formId}-logo`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "border-border/70 bg-background/70 hover:border-accent/50 hover:bg-background relative flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed text-center transition-colors",
                isDragging && "border-accent bg-accent/5"
              )}
            >
              {data.logoDataUrl ? (
                <div className="flex items-center gap-3 px-4">
                  <div className="border-border/70 bg-background relative size-14 overflow-hidden rounded-md border">
                    <Image
                      src={data.logoDataUrl}
                      alt="Podgląd logo"
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-foreground text-sm font-medium">
                      {data.logoName ?? "Twoje logo"}
                    </p>
                    <p className="text-muted-foreground text-xs">Kliknij, aby zmienić plik.</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="bg-accent/10 text-accent flex size-9 items-center justify-center rounded-full">
                    <ImageSquare className="size-5" weight="duotone" />
                  </span>
                  <p className="text-foreground text-sm font-medium">
                    Przeciągnij i upuść lub kliknij
                  </p>
                  <p className="text-muted-foreground text-xs">
                    PNG, JPG lub SVG, do 2 MB · zapis logo dodamy wkrótce
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                id={`${formId}-logo`}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleInputChange}
              />
            </label>
            {data.logoDataUrl ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive mt-2 h-8 self-start rounded-md px-2 text-xs"
                onClick={clearLogo}
              >
                <Trash className="size-3.5" weight="duotone" />
                Usuń logo
              </Button>
            ) : null}
          </FieldContent>
          {logoError ? <FieldError className="mt-1">{logoError}</FieldError> : null}
        </Field>

        <Field>
          <FieldLabel className="text-foreground text-sm font-medium">Kolor akcentu</FieldLabel>
          <div
            className="mt-2 flex flex-wrap items-center gap-3"
            role="radiogroup"
            aria-label="Kolor akcentu"
          >
            {ACCENT_PRESETS.map((preset) => {
              const active = preset.value.toLowerCase() === data.accentColor.toLowerCase();
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => selectPreset(preset.value)}
                  aria-pressed={active}
                  aria-label={preset.label}
                  title={preset.label}
                  className={cn(
                    "relative size-9 rounded-full border border-black/10 transition-all",
                    "focus-visible:ring-accent/50 focus-visible:ring-2 focus-visible:outline-none",
                    active
                      ? "ring-accent shadow-sm ring-2 ring-offset-2 ring-offset-[var(--background)]"
                      : "hover:scale-105"
                  )}
                  style={{ backgroundColor: preset.value }}
                />
              );
            })}
          </div>
          <FieldContent className="mt-3">
            <div className="flex items-center gap-3">
              <span
                className="border-border/70 size-9 rounded-md border"
                style={{ backgroundColor: previewAccent }}
                aria-hidden
              />
              <Input
                value={hexDraft}
                onChange={handleHexChange}
                placeholder="#7BA088"
                inputMode="text"
                autoComplete="off"
                spellCheck={false}
                className={cn(
                  "border-border/70 bg-background/80 h-10 max-w-40 rounded-md px-3 font-mono text-sm uppercase",
                  !HEX_COLOR_REGEX.test(hexDraft) && "border-destructive/60"
                )}
              />
              {!isPresetActive && HEX_COLOR_REGEX.test(hexDraft) ? (
                <span className="text-muted-foreground text-xs">Własny odcień</span>
              ) : null}
            </div>
          </FieldContent>
          <FieldDescription>
            Użyjemy tego koloru w portalach klientów, e-mailach i CTA.
          </FieldDescription>
        </Field>
      </FieldGroup>

      <div className="border-border/60 bg-background/70 relative flex flex-col gap-4 rounded-xl border p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground bg-background border-border/60 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-medium tracking-[0.22em] uppercase">
            <span className="bg-accent size-1.5 rounded-full" />
            Live preview
          </span>
          <span className="text-muted-foreground text-[11px]">Portal klienta</span>
        </div>

        <div
          className="border-border/70 bg-background flex flex-col gap-4 overflow-hidden rounded-lg border p-4"
          style={{ ["--brand" as string]: previewAccent }}
        >
          <div className="flex items-center gap-3">
            <div
              className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md text-sm font-semibold"
              style={{ backgroundColor: previewAccent, color: previewForeground }}
            >
              {data.logoDataUrl ? (
                <Image
                  src={data.logoDataUrl}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                  unoptimized
                />
              ) : (
                previewName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-foreground text-sm font-semibold tracking-tight">
                {previewName}
              </span>
              <span className="text-muted-foreground text-[11px]">Witamy w portalu</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div
              className="h-2 w-full rounded-full opacity-25"
              style={{ backgroundColor: previewAccent }}
            />
            <div className="bg-muted/60 h-2 w-3/5 rounded-full" />
            <div className="bg-muted/60 h-2 w-2/5 rounded-full" />
          </div>

          <button
            type="button"
            disabled
            className="inline-flex h-9 items-center justify-center rounded-md px-4 text-xs font-semibold tracking-tight"
            style={{ backgroundColor: previewAccent, color: previewForeground }}
          >
            Otwórz brief
          </button>
        </div>

        <p className="text-muted-foreground text-[11px] leading-relaxed">
          Tak Twoja marka będzie wyglądać w mailach, portalu klienta i widokach publicznych.
        </p>
      </div>
    </div>
  );
}

export function isBrandingValid(data: BrandingData): boolean {
  return HEX_COLOR_REGEX.test(data.accentColor);
}
