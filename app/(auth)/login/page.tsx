import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Logowanie — Cliently",
  description: "Zaloguj się do Cliently",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center">
      <LoginForm />
    </div>
  );
}
