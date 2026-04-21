import { apiFetch } from "./api";

export type ClientStatus = "active" | "prospect" | "inactive";

export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: ClientStatus;
  notes: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClientListResponse = {
  items: Client[];
  total: number;
  page: number;
  pageSize: number;
};

export type ClientFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  status: ClientStatus;
  notes: string;
};

export type ListClientsParams = {
  q?: string;
  page?: number;
  pageSize?: number;
  includeArchived?: boolean;
};

const BASE = "/api/v1/clients";

function buildListUrl({
  q,
  page = 1,
  pageSize = 20,
  includeArchived = false,
}: ListClientsParams): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  if (includeArchived) params.set("includeArchived", "true");
  return `${BASE}?${params.toString()}`;
}

export async function listClients(
  params: ListClientsParams,
  signal?: AbortSignal
): Promise<ClientListResponse> {
  return apiFetch<ClientListResponse>(buildListUrl(params), { signal });
}

export async function getClient(id: string): Promise<Client> {
  return apiFetch<Client>(`${BASE}/${id}`);
}

function toPayload(values: ClientFormValues) {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim() || null,
    phone: values.phone.trim() || null,
    company: values.company.trim() || null,
    status: values.status,
    notes: values.notes.trim() || null,
  };
}

export async function createClient(values: ClientFormValues): Promise<Client> {
  return apiFetch<Client>(BASE, { method: "POST", json: toPayload(values) });
}

export async function updateClient(id: string, values: ClientFormValues): Promise<Client> {
  return apiFetch<Client>(`${BASE}/${id}`, {
    method: "PATCH",
    json: toPayload(values),
  });
}

export async function archiveClient(id: string): Promise<Client> {
  return apiFetch<Client>(`${BASE}/${id}`, { method: "DELETE" });
}

export async function restoreClient(id: string): Promise<Client> {
  return apiFetch<Client>(`${BASE}/${id}/restore`, { method: "POST" });
}

export function clientDisplayName(client: Client): string {
  return `${client.firstName} ${client.lastName}`.trim();
}

export function clientInitials(client: Client): string {
  const first = client.firstName.charAt(0);
  const last = client.lastName.charAt(0);
  return `${first}${last}`.toUpperCase() || "?";
}
