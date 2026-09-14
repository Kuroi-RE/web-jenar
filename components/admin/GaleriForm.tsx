"use client";

import { useActionState } from "react";
import {
  saveGaleriAction,
  type KontenFormState,
} from "@/lib/admin/konten-actions";
import type { GaleriItemS } from "@/lib/store";
import { ImageField } from "./ImageField";
import { Field, FormStatus, SubmitBar } from "./fields";
import { RepeatableRows, RemoveRowButton } from "./RepeatableRows";

const EMPTY: GaleriItemS = { src: "", judul: "", alt: "", kategori: "" };

export function GaleriForm({ galeri }: { galeri: GaleriItemS[] }) {
  const [state, formAction, pending] = useActionState<KontenFormState, FormData>(
    saveGaleriAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      <FormStatus state={state} successText="Galeri berhasil disimpan." />
      <p className="text-sm text-ink-soft">
        Gunakan <strong>Tambah Foto</strong> / <strong>Hapus</strong> untuk
        mengatur dokumentasi foto. Baris tanpa gambar diabaikan.
      </p>

      <RepeatableRows
        initialItems={galeri}
        emptyItem={EMPTY}
        min={0}
        addLabel="Tambah Foto"
        renderItem={({ item: g, index: i, remove, canRemove }) => (
          <section className="rounded-2xl border border-black/5 bg-surface p-5 shadow-soft dark:border-white/10">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Foto {i + 1}
              </p>
              <RemoveRowButton onClick={remove} disabled={!canRemove} />
            </div>
            <ImageField
              name={`gal_src_${i}`}
              label="Gambar"
              defaultValue={g.src}
            />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field
                name={`gal_judul_${i}`}
                label="Judul"
                defaultValue={g.judul}
              />
              <Field
                name={`gal_kategori_${i}`}
                label="Kategori"
                defaultValue={g.kategori}
              />
            </div>
            <div className="mt-3">
              <Field
                name={`gal_alt_${i}`}
                label="Teks Alternatif"
                defaultValue={g.alt}
              />
            </div>
          </section>
        )}
      />

      <SubmitBar pending={pending} label="Simpan Galeri" />
    </form>
  );
}
