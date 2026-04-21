import type { Metadata } from "next";

import { NewClientView } from "@/components/clients/new-client-view";

export const metadata: Metadata = {
  title: "Nowy klient — Cliently",
};

export default function Page() {
  return <NewClientView />;
}
