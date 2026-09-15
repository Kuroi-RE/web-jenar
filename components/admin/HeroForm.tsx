"use client";

import { useActionState } from "react";
import {
  saveHeroAction,
  type HeroFormState,
} from "@/lib/admin/hero-actions";
import type { HeroSettings } from "@/lib/store";
import { ImageField } from "./ImageField";

const MAX_SLIDES = 6;

const inputClass =
  "mt-1.5 w-full rounded-lg border border-black/10 bg-surface px-3.5 py-2.5 text-ink outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-white/15";
const labelClass = "block text-sm font-semibold text-ink";

export function HeroForm({
  hero,
  villageName,
}: {
  hero: HeroSettings;
  villageName: string;
}) {
  const [state, formAction, pending] = useActionState<HeroFormState, FormData>(
    saveHeroAction,
    {},
  );

  const rows = Array.from({ length: MAX_SLIDES }, (_, i) => hero.slides[i]);

  return (
    <form action={formAction} className="space-y-6">
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
          Hero berhasil disimpan.
        </p>
      )}

      <section className="rounded-2xl border border-black/5 bg-surface p-6 shadow-soft dark:border-white/10">
        <h2 className="text-lg font-bold text-ink">Teks Hero</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Judul besar Hero memakai <strong>Nama Kecamatan</strong> (
          <code className="font-mono">{villageName}</code>) yang diubah di menu{" "}
          <strong>Pengaturan Umum</strong>.
        </p>
        <div className="mt-4 space-y-5">
          <div>
            <label htmlFor="eyebrow" className={labelClass}>
              Label Kecil (eyebrow)
            </label>
            <input
              id="eyebrow"
              name="eyebrow"
              type="text"
              defaultValue={hero.eyebrow}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="subtitle" className={labelClass}>
              Subjudul
            </label>
            <input
              id="subtitle"
              name="subtitle"
              type="text"
              defaultValue={hero.subtitle}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={hero.description}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-surface p-6 shadow-soft dark:border-white/10">
        <h2 className="text-lg font-bold text-ink">Slide Gambar</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Upload gambar untuk ditampilkan pada slides beranda, dengan maximal 6 foto.
        </p>
        <div className="mt-4 space-y-4">
          {rows.map((slide, i) => (
            <div
              key={i}
              className="grid gap-3 rounded-xl border border-black/5 p-4 dark:border-white/10 sm:grid-cols-2"
            >
              <ImageField
                name={`slide_img_${i}`}
                label={`Slide ${i + 1} — Gambar`}
                defaultValue={slide?.img}
              />
              <div>
                <label htmlFor={`slide_alt_${i}`} className={labelClass}>
                  Teks Alternatif
                </label>
                <input
                  id={`slide_alt_${i}`}
                  name={`slide_alt_${i}`}
                  type="text"
                  defaultValue={slide?.alt ?? ""}
                  className={inputClass}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary shadow-card disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Simpan Hero"}
        </button>
      </div>
    </form>
  );
}
