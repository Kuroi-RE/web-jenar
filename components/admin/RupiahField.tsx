"use client";

import { useState } from "react";
import { labelClass } from "./fields";

/** Ambil hanya digit dari sebuah string. */
function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Format digit menjadi ribuan gaya Indonesia (1.759.314.000). */
function formatRibuan(digits: string): string {
  if (!digits) return "";
  return Number(digits).toLocaleString("id-ID");
}

/**
 * Field input Rupiah dengan pemformatan ribuan otomatis saat mengetik.
 *
 * - Menampilkan awalan "Rp" dan pemisah ribuan agar mudah dibaca.
 * - Hanya menerima angka (karakter non-digit diabaikan).
 * - Nilai yang dikirim ke server (`name`) berupa **digit murni** tanpa titik,
 *   sehingga aman diparse menjadi angka.
 */
export function RupiahField({
  name,
  label,
  defaultValue,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  hint?: string;
}) {
  const [digits, setDigits] = useState<string>(
    onlyDigits(String(defaultValue ?? "")),
  );

  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>

      {/* Nilai sebenarnya (digit murni) yang dikirim ke server. */}
      <input type="hidden" name={name} value={digits} />

      <div className="relative mt-1.5">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-soft">
          Rp
        </span>
        <input
          id={name}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={formatRibuan(digits)}
          onChange={(e) => setDigits(onlyDigits(e.target.value))}
          placeholder="0"
          className="w-full rounded-lg border border-black/10 bg-surface py-2.5 pl-10 pr-3.5 text-ink outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-white/15"
        />
      </div>

      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}
