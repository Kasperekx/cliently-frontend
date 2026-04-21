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
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#111214" : "#ffffff";
}

export function StepBranding({ data, companyName, onChange }: StepBrandingProps) {
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [hexDraft, setHexDraft] = useState<string>(data.accentColor);

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
    <div className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
      <FieldGroup className="gap-6">
        <Field>
          <FieldLabel>Logo</FieldLabel>
          <FieldContent>
            <label
              htmlFor={`${formId}-logo`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                "border-border bg-background relative flex h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-dashed text-center transition-colors duration-150",
                "hover:border-foreground/20",
                isDragging && "border-foreground/40 bg-muted/50"
              )}
            >
              {data.logoDataUrl ? (
                <div className="flex items-center gap-3 px-4">
                  <div className="border-border bg-background relative size-12 overflow-hidden rounded-md border">
                    <Image
                      src={data.logoDataUrl}
                      alt="Podgląd logo"
                      fill
                      sizes="48px"
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-foreground text-[13px] font-medium">
                      {data.logoName ?? "Twoje logo"}
                    </p>
                    <p className="text-muted-foreground text-[12px]">Kliknij, aby zmienić.</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <span className="border-border bg-background text-muted-foreground flex size-8 items-center justify-center rounded-md border">
                    <ImageSquare weight="regular" className="size-4" />
                  </span>
                  <p className="text-foreground text-[13px] font-medium">
                    Przeciągnij i upuść lub kliknij
                  </p>
                  <p className="text-muted-foreground text-[11.5px]">PNG, JPG lub SVG, do 2 MB</p>
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
                className="text-muted-foreground hover:text-destructive mt-2 self-start"
                onClick={clearLogo}
              >
                <Trash weight="regular" />
                Usuń logo
              </Button>
            ) : null}
          </FieldContent>
          {logoError ? <FieldError className="mt-1">{logoError}</FieldError> : null}
        </Field>

        <Field>
          <FieldLabel>Kolor akcentu</FieldLabel>
          <div
            className="mt-1 flex flex-wrap items-center gap-2"
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
                    "relative size-7 rounded-full border transition-transform duration-150",
                    "focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none",
                    active
                      ? "border-foreground ring-foreground ring-offset-background ring-2 ring-offset-2"
                      : "border-black/10 hover:scale-110"
                  )}
                  style={{ backgroundColor: preset.value }}
                />
              );
            })}
          </div>
          <FieldContent className="mt-3">
            <div className="flex items-center gap-2">
              <span
                className="border-border size-9 rounded-md border"
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
                aria-invalid={!HEX_COLOR_REGEX.test(hexDraft)}
                className="h-9 max-w-40 font-mono uppercase"
              />
            </div>
          </FieldContent>
          <FieldDescription>Używany w portalach klientów, e-mailach i CTA.</FieldDescription>
        </Field>
      </FieldGroup>

      <div className="border-border bg-card flex flex-col gap-3 rounded-lg border p-5 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
            Podgląd
          </p>
          <span className="text-muted-foreground text-[11px]">Portal klienta</span>
        </div>

        <div className="border-border bg-background flex flex-col gap-4 overflow-hidden rounded-md border p-4">
          <div className="flex items-center gap-3">
            <div
              className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md text-[12.5px] font-semibold"
              style={{ backgroundColor: previewAccent, color: previewForeground }}
            >
              {data.logoDataUrl ? (
                <Image
                  src={data.logoDataUrl}
                  alt=""
                  fill
                  sizes="36px"
                  className="object-contain p-1"
                  unoptimized
                />
              ) : (
                previewName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-foreground text-[13px] font-semibold tracking-tight">
                {previewName}
              </span>
              <span className="text-muted-foreground text-[11.5px]">Witamy w portalu</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div
              className="h-1.5 w-full rounded-full"
              style={{ backgroundColor: previewAccent, opacity: 0.2 }}
            />
            <div className="bg-muted h-1.5 w-3/5 rounded-full" />
            <div className="bg-muted h-1.5 w-2/5 rounded-full" />
          </div>

          <button
            type="button"
            disabled
            className="inline-flex h-8 items-center justify-center rounded-md px-3 text-[12.5px] font-semibold tracking-tight"
            style={{ backgroundColor: previewAccent, color: previewForeground }}
          >
            Otwórz brief
          </button>
        </div>
      </div>
    </div>
  );
}

export function isBrandingValid(data: BrandingData): boolean {
  return HEX_COLOR_REGEX.test(data.accentColor);
}
