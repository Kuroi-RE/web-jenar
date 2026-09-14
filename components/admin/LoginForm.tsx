"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/admin/auth-actions";

const initial: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300"
        >
          {state.error}
        </p>
      )}

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-semibold text-ink"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="mt-1.5 w-full rounded-lg border border-black/10 bg-surface px-3.5 py-2.5 text-ink outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-white/15"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-semibold text-ink"
        >
          Kata Sandi
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1.5 w-full rounded-lg border border-black/10 bg-surface px-3.5 py-2.5 text-ink outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-white/15"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full justify-center disabled:opacity-60"
      >
        {pending ? "Memproses…" : "Masuk"}
      </button>
    </form>
  );
}
