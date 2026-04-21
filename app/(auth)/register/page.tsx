import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Rejestracja — Cliently",
  description: "Załóż konto w Cliently",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center">
      <RegisterForm />
    </div>
  );
}
