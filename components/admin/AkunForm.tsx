"use client";

import { useActionState } from "react";
import {
  changeCredentialsAction,
  type AkunState,
} from "@/lib/admin/auth-actions";
import { FormStatus } from "./fields";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-black/10 bg-surface px-3.5 py-2.5 text-ink outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-white/15";
const labelClass = "block text-sm font-semibold text-ink";

export function AkunForm({ username }: { username: string }) {
  const [state, formAction, pending] = useActionState<AkunState, FormData>(
    changeCredentialsAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-6">
      <FormStatus state={state} successText="Akun berhasil diperbarui." />

      <section className="rounded-2xl border border-black/5 bg-surface p-6 shadow-soft dark:border-white/10">
        <h2 className="text-lg font-bold text-ink">Username</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Nama pengguna untuk masuk ke panel admin. Minimal 3 karakter.
        </p>
        <div className="mt-4">
          <label htmlFor="username" className={labelClass}>
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            defaultValue={username}
            required
            minLength={3}
            className={inputClass}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-surface p-6 shadow-soft dark:border-white/10">
        <h2 className="text-lg font-bold text-ink">Ubah Kata Sandi</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Kosongkan kolom kata sandi baru bila hanya ingin mengubah username.
          Kata sandi baru minimal 8 karakter.
        </p>
        <div className="mt-4 space-y-5">
          <div>
            <label htmlFor="new_password" className={labelClass}>
              Kata Sandi Baru
            </label>
            <input
              id="new_password"
              name="new_password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="confirm_password" className={labelClass}>
              Ulangi Kata Sandi Baru
            </label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-accent-300 bg-accent-50 p-6 shadow-soft dark:border-accent-900/50 dark:bg-accent-900/10">
        <h2 className="text-lg font-bold text-ink">Konfirmasi</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Masukkan kata sandi Anda saat ini untuk menyimpan perubahan.
        </p>
        <div className="mt-4">
          <label htmlFor="current_password" className={labelClass}>
            Kata Sandi Saat Ini
          </label>
          <input
            id="current_password"
            name="current_password"
            type="password"
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </div>
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary shadow-card disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
