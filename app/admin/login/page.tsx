import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Masuk Admin",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-700 text-white shadow-soft">
            <svg
              className="size-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10.5 12 3l9 7.5M5 9.5V20h14V9.5M9.5 20v-5h5v5"
              />
            </svg>
          </span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">
            Panel Admin Desa
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Masuk untuk mengelola konten website Desa Sidoharjo.
          </p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-surface p-6 shadow-card dark:border-white/10 sm:p-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
