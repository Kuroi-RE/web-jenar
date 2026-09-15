"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useTheme } from "next-themes";
import { loginAction, type LoginState } from "@/lib/admin/auth-actions";

const initial: LoginState = {};

// Nilai env di-trim: spasi/CR di ujung (umum terjadi saat mengedit .env lewat
// editor teks atau FTP) akan ditolak Turnstile dengan pesan yang membingungkan.
const SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY?.trim();

// Subset API Turnstile yang dipakai di sini.
type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      theme?: "light" | "dark" | "auto";
      language?: string;
      size?: "normal" | "flexible" | "compact";
    },
  ) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);
  const { resolvedTheme } = useTheme();

  // Mounted guard: tema baru diketahui setelah mount (hindari hydration mismatch).
  const [mounted, setMounted] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  // Tema yang dipakai widget yang sedang tampil, agar tidak render berulang.
  const renderedTheme = useRef<"light" | "dark" | null>(null);

  // Hindari mismatch hidrasi: tema baru diketahui setelah mount
  // (pola sama seperti components/layout/ThemeToggle.tsx).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Render widget sekali per nilai tema. Iframe Turnstile tidak bisa di-retema
  // setelah dibuat, jadi saat tema berubah widget lama dibuang lalu dibuat ulang.
  // PENTING: menunggu `resolvedTheme` terisi — bila dirender lebih dulu lalu
  // langsung diganti, tantangan yang sedang berjalan batal dan token tak terbit.
  useEffect(() => {
    if (!scriptReady || !mounted || !SITEKEY || !resolvedTheme) return;
    const theme = resolvedTheme === "dark" ? "dark" : "light";
    if (renderedTheme.current === theme) return;

    const el = boxRef.current;
    const api = window.turnstile;
    if (!el || !api) return;

    if (widgetId.current !== null) {
      api.remove(widgetId.current);
      widgetId.current = null;
    }
    widgetId.current = api.render(el, {
      sitekey: SITEKEY,
      theme,
      language: "id",
    });
    renderedTheme.current = theme;
  }, [scriptReady, mounted, resolvedTheme]);

  // Token Turnstile sekali pakai & berlaku 5 menit. Setelah login gagal,
  // widget WAJIB direset — tanpa ini percobaan berikutnya selalu ditolak
  // dengan "timeout-or-duplicate" meski kredensialnya benar.
  useEffect(() => {
    if (state.error && widgetId.current !== null) {
      window.turnstile?.reset(widgetId.current);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      {SITEKEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setScriptReady(true)}
        />
      )}

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

      {/* Verifikasi keamanan (Cloudflare Turnstile) */}
      {SITEKEY ? (
        <div>
          <span className="block text-sm font-semibold text-ink">
            Verifikasi Keamanan
          </span>
          <div ref={boxRef} className="mt-1.5 min-h-[65px]" />
          {!scriptReady && (
            <p className="mt-1 text-xs text-ink-soft">
              Memuat verifikasi keamanan…
            </p>
          )}
        </div>
      ) : (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200">
          Verifikasi keamanan belum dikonfigurasi
          (<code className="font-mono">NEXT_PUBLIC_TURNSTILE_SITEKEY</code>).
          Hubungi pengelola teknis.
        </p>
      )}

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
