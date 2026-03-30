import { redirect } from "next/navigation";

import { AuthForm } from "@/components/AuthForm";
import { getSessionUserFromCookies } from "@/lib/auth";

export default async function RegisterPage() {
  const user = await getSessionUserFromCookies();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#F9FBFF_0%,#EFF6FF_50%,#FFF7ED_100%)] px-4 py-10">
      <AuthForm mode="register" />
    </main>
  );
}
