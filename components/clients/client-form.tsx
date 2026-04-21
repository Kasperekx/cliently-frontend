"use client";

import { type FormEvent, useId, useState, useTransition } from "react";
import { ArrowRight, FloppyDisk } from "@phosphor-icons/react";

import { ApiError } from "@/lib/api";
import {
  createClient,
  updateClient,
  type Client,
  type ClientFormValues,
  type ClientStatus,
} from "@/lib/clients";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES: { value: ClientStatus; label: string }[] = [
  { value: "active", label: "Aktywny" },
  { value: "prospect", label: "Potencjalny" },
  { value: "inactive", label: "Nieaktywny" },
];

const EMPTY_VALUES: ClientFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  status: "active",
  notes: "",
};

function valuesFromClient(client: Client): ClientFormValues {
  return {
    firstName: client.firstName,
    lastName: client.lastName,
    email: client.email ?? "",
    phone: client.phone ?? "",
    company: client.company ?? "",
    status: client.status,
    notes: client.notes ?? "",
  };
}

type ClientFormProps = {
  mode: "create" | "edit";
  initialClient?: Client;
  submitLabel?: string;
  onSuccess: (client: Client) => void;
  onCancel?: () => void;
};

export function ClientForm({
  mode,
  initialClient,
  submitLabel,
  onSuccess,
  onCancel,
}: ClientFormProps) {
  const formId = useId();
  const [values, setValues] = useState<ClientFormValues>(() =>
    initialClient ? valuesFromClient(initialClient) : EMPTY_VALUES
  );
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function setField<K extends keyof ClientFormValues>(field: K, value: ClientFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (values.firstName.trim().length === 0) {
      setErrorMessage("Podaj imię klienta.");
      return;
    }
    if (values.lastName.trim().length === 0) {
      setErrorMessage("Podaj nazwisko klienta.");
      return;
    }

    startTransition(async () => {
      try {
        const result =
          mode === "create" || !initialClient
            ? await createClient(values)
            : await updateClient(initialClient.id, values);
        onSuccess(result);
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : "Nie udało się zapisać klienta. Spróbuj ponownie.";
        setErrorMessage(message);
      }
    });
  }

  const defaultSubmit = mode === "create" ? "Dodaj klienta" : "Zapisz zmiany";

  return (
    <form id={formId} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <FieldGroup className="gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={`${formId}-firstName`}>Imię</FieldLabel>
            <FieldContent>
              <Input
                id={`${formId}-firstName`}
                value={values.firstName}
                onChange={(event) => setField("firstName", event.target.value)}
                placeholder="Anna"
                maxLength={80}
                required
                autoComplete="off"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor={`${formId}-lastName`}>Nazwisko</FieldLabel>
            <FieldContent>
              <Input
                id={`${formId}-lastName`}
                value={values.lastName}
                onChange={(event) => setField("lastName", event.target.value)}
                placeholder="Kowalska"
                maxLength={80}
                required
                autoComplete="off"
              />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor={`${formId}-company`}>Firma</FieldLabel>
          <FieldContent>
            <Input
              id={`${formId}-company`}
              value={values.company}
              onChange={(event) => setField("company", event.target.value)}
              placeholder="np. Studio Kowalska"
              maxLength={120}
              autoComplete="off"
            />
          </FieldContent>
          <FieldDescription>
            Opcjonalnie — pomaga odróżnić klientów z tej samej branży.
          </FieldDescription>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={`${formId}-email`}>E-mail</FieldLabel>
            <FieldContent>
              <Input
                id={`${formId}-email`}
                type="email"
                inputMode="email"
                value={values.email}
                onChange={(event) => setField("email", event.target.value)}
                placeholder="anna@firma.pl"
                autoComplete="off"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor={`${formId}-phone`}>Telefon</FieldLabel>
            <FieldContent>
              <Input
                id={`${formId}-phone`}
                type="tel"
                inputMode="tel"
                value={values.phone}
                onChange={(event) => setField("phone", event.target.value)}
                placeholder="+48 500 123 456"
                autoComplete="off"
              />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor={`${formId}-status`}>Status</FieldLabel>
          <FieldContent>
            <Select
              value={values.status}
              onValueChange={(next) => setField("status", next as ClientStatus)}
            >
              <SelectTrigger id={`${formId}-status`} aria-label="Status klienta">
                <SelectValue placeholder="Wybierz status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
          <FieldDescription>Określa etap relacji z klientem.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor={`${formId}-notes`}>Notatka</FieldLabel>
          <FieldContent>
            <Textarea
              id={`${formId}-notes`}
              value={values.notes}
              onChange={(event) => setField("notes", event.target.value)}
              placeholder="Krótki kontekst: czym się zajmują, historia współpracy, preferencje kontaktu."
              maxLength={2000}
              rows={4}
            />
          </FieldContent>
          <FieldDescription>Do 2000 znaków. Widoczne tylko dla Ciebie i zespołu.</FieldDescription>
        </Field>
      </FieldGroup>

      {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
            Anuluj
          </Button>
        ) : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Zapisywanie…" : (submitLabel ?? defaultSubmit)}
          {!isPending ? (
            mode === "create" ? (
              <ArrowRight weight="bold" />
            ) : (
              <FloppyDisk weight="bold" />
            )
          ) : null}
        </Button>
      </div>
    </form>
  );
}
