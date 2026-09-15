import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAuthenticated } from "@/lib/auth";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Masuk Admin",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  const { site } = await getSettings();

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Image
            src="/logos/logo-sragen.png"
            alt="Logo"
            width={56}
            height={56}
            priority
            className="mx-auto size-14 object-contain"
          />
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">
            Panel Admin Kecamatan
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Masuk untuk mengelola konten website {site.name}.
          </p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-surface p-6 shadow-card dark:border-white/10 sm:p-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
