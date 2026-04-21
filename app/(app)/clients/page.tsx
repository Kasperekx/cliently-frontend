import type { Metadata } from "next";

import { ClientsPage } from "@/components/clients/clients-page";

export const metadata: Metadata = {
  title: "Klienci — Cliently",
};

export default function Page() {
  return <ClientsPage />;
}
