import type { Metadata } from "next";

import { ClientDetailView } from "@/components/clients/client-detail-view";

export const metadata: Metadata = {
  title: "Klient — Cliently",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <ClientDetailView id={id} />;
}
