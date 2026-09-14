"use client";

import { useActionState, useState } from "react";
import {
  savePerangkatAction,
  type KontenFormState,
} from "@/lib/admin/konten-actions";
import type { PerangkatItemS } from "@/lib/store";
import { Field, FormStatus, SubmitBar } from "./fields";
import { ImageField } from "./ImageField";
import { RemoveRowButton } from "./RepeatableRows";

const EMPTY: PerangkatItemS = {
  name: "",
  position: "",
  featured: false,
  photo: "",
};

let uid = 0;
type Slot = { key: number; item: PerangkatItemS };

export function PerangkatForm({
  perangkat,
}: {
  perangkat: PerangkatItemS[];
}) {
  const [state, formAction, pending] = useActionState<KontenFormState, FormData>(
    savePerangkatAction,
    {},
  );

  // Bangun state awal satu kali: slot baris (key stabil) + kunci Kepala Desa.
  const [data, setData] = useState<{ slots: Slot[]; featuredKey: number | null }>(
    () => {
      const base = perangkat.length > 0 ? perangkat : [EMPTY];
      const slots = base.map((item) => ({ key: uid++, item }));
      const featuredKey = slots.find((s) => s.item.featured)?.key ?? null;
      return { slots, featuredKey };
    },
  );
  const { slots, featuredKey } = data;

  const add = () =>
    setData((d) => ({
      ...d,
      slots: [...d.slots, { key: uid++, item: EMPTY }],
    }));

  const remove = (key: number) =>
    setData((d) =>
      d.slots.length <= 1
        ? d
        : {
            slots: d.slots.filter((x) => x.key !== key),
            featuredKey: d.featuredKey === key ? null : d.featuredKey,
          },
    );

  const setFeatured = (key: number, checked: boolean) =>
    setData((d) => ({ ...d, featuredKey: checked ? key : null }));

  const canRemove = slots.length > 1;
  const hasFeatured = featuredKey !== null;

  return (
    <form action={formAction} className="space-y-5">
      <FormStatus state={state} successText="Perangkat desa berhasil disimpan." />
      <p className="text-sm text-ink-soft">
        Susunan perangkat desa. Gunakan <strong>Tambah Perangkat</strong> /{" "}
        <strong>Hapus</strong> untuk mengatur daftar. Kosongkan nama bila belum
        ada pejabat (tampil &ldquo;Nama menyusul&rdquo;). Hanya{" "}
        <strong>satu</strong> perangkat yang dapat ditandai sebagai{" "}
        <strong>Kepala Desa</strong>; setelah dipilih, pilihan pada perangkat
        lain dinonaktifkan. Minimal satu jabatan.
      </p>

      <div className="space-y-4">
        {slots.map((slot, i) => {
          const p = slot.item;
          const isFeatured = featuredKey === slot.key;
          // Nonaktifkan bila sudah ada Kepala Desa lain yang dipilih.
          const featuredDisabled = hasFeatured && !isFeatured;
          return (
            <section
              key={slot.key}
              className="rounded-2xl border border-black/5 bg-surface p-5 shadow-soft dark:border-white/10"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  Perangkat {i + 1}
                </p>
                <RemoveRowButton
                  onClick={() => remove(slot.key)}
                  disabled={!canRemove}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  name={`position_${i}`}
                  label="Jabatan"
                  defaultValue={p.position}
                />
                <Field name={`name_${i}`} label="Nama" defaultValue={p.name} />
              </div>
              <div className="mt-3">
                <ImageField
                  name={`photo_${i}`}
                  label="Foto (opsional)"
                  defaultValue={p.photo}
                />
              </div>
              <label
                className={`mt-3 inline-flex items-center gap-2 text-sm ${
                  featuredDisabled
                    ? "cursor-not-allowed text-ink-soft/60"
                    : "text-ink"
                }`}
              >
                <input
                  type="checkbox"
                  name={`featured_${i}`}
                  checked={isFeatured}
                  disabled={featuredDisabled}
                  onChange={(e) => setFeatured(slot.key, e.target.checked)}
                  className="size-4 rounded border-black/20 text-primary-700 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20"
                />
                Tandai sebagai unggulan (Kepala Desa)
              </label>
              {featuredDisabled && (
                <p className="mt-1 text-xs text-ink-soft">
                  Kepala Desa sudah ditetapkan pada perangkat lain. Hapus centang
                  di sana untuk memindahkannya.
                </p>
              )}
            </section>
          );
        })}
      </div>

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3.5 py-2 text-sm font-semibold text-primary-800 transition hover:bg-primary-100 dark:border-primary-900/50 dark:bg-primary-900/20 dark:text-primary-200 dark:hover:bg-primary-900/40"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Tambah Perangkat
      </button>

      <SubmitBar pending={pending} label="Simpan Perangkat" />
    </form>
  );
}
