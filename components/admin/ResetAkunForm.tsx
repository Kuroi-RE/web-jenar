"use client";

import { useActionState } from "react";
import {
  resetOtherPasswordAction,
  type ResetState,
} from "@/lib/admin/auth-actions";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-black/10 bg-surface px-3.5 py-2.5 text-ink outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-white/15";
const labelClass = "block text-sm font-semibold text-ink";

export function ResetAkunForm({
  accounts,
}: {
  accounts: { username: string; role: string }[];
}) {
  const [state, formAction, pending] = useActionState<ResetState, FormData>(
    resetOtherPasswordAction,
    {},
  );

  if (accounts.length === 0) {
    return (
      <p className="rounded-2xl border border-black/5 bg-surface p-5 text-sm text-ink-soft shadow-soft dark:border-white/10">
        Belum ada akun lain. Jalankan{" "}
        <code className="font-mono">npm run db:seed-admins</code> untuk membuat
        akun <strong>admin</strong> dan <strong>superadmin</strong>.
      </p>
    );
  }

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
      {state.success && (
        <p
          role="status"
          className="rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-medium text-primary-800 dark:border-primary-900/50 dark:bg-primary-900/20 dark:text-primary-200"
        >
          {state.success}
        </p>
      )}

      <section className="rounded-2xl border border-black/5 bg-surface p-6 shadow-soft dark:border-white/10">
        <div>
          <label htmlFor="target_username" className={labelClass}>
            Akun yang Diatur Ulang
          </label>
          <select
            id="target_username"
            name="target_username"
            required
            className={inputClass}
            defaultValue={accounts[0]?.username}
          >
            {accounts.map((a) => (
              <option key={a.username} value={a.username}>
                {a.username} ({a.role})
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="reset_password" className={labelClass}>
              Kata Sandi Baru
            </label>
            <input
              id="reset_password"
              name="reset_password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="reset_confirm" className={labelClass}>
              Ulangi Kata Sandi Baru
            </label>
            <input
              id="reset_confirm"
              name="reset_confirm"
              type="password"
              autoComplete="new-password"
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="own_password" className={labelClass}>
            Kata Sandi Anda (konfirmasi)
          </label>
          <input
            id="own_password"
            name="own_password"
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </div>

        <p className="mt-4 rounded-lg border border-accent-300 bg-accent-50 px-4 py-3 text-sm text-ink-soft dark:border-accent-900/50 dark:bg-accent-900/10">
          Sesi aktif akun tersebut akan otomatis berakhir setelah kata sandinya
          diubah. Sampaikan kata sandi baru melalui kanal yang aman.
        </p>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary shadow-card disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Atur Ulang Kata Sandi"}
        </button>
      </div>
    </form>
  );
}
