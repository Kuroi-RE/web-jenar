"use client";

import { useActionState } from "react";
import {
  saveProdukHukumAction,
  type KontenFormState,
} from "@/lib/admin/konten-actions";
import type { ProdukHukumS } from "@/lib/store";
import { Field, FormStatus, SubmitBar } from "./fields";
import { RepeatableRows, RemoveRowButton } from "./RepeatableRows";

const EMPTY: ProdukHukumS = {
  jenis: "Peraturan Desa",
  nomor: "",
  tahun: 0,
  tentang: "",
  href: "",
};

export function ProdukHukumForm({
  produkHukum,
}: {
  produkHukum: ProdukHukumS[];
}) {
  const [state, formAction, pending] = useActionState<KontenFormState, FormData>(
    saveProdukHukumAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      <FormStatus state={state} successText="Produk hukum berhasil disimpan." />
      <p className="text-sm text-ink-soft">
        Gunakan <strong>Tambah Dokumen</strong> / <strong>Hapus</strong> untuk
        mengatur daftar. Baris tanpa kolom &ldquo;Tentang&rdquo; diabaikan.
        Kosongkan Tautan bila dokumen belum tersedia.
      </p>

      <RepeatableRows
        initialItems={produkHukum}
        emptyItem={EMPTY}
        min={0}
        addLabel="Tambah Dokumen"
        renderItem={({ item: p, index: i, remove, canRemove }) => (
          <section className="rounded-2xl border border-black/5 bg-surface p-5 shadow-soft dark:border-white/10">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Dokumen {i + 1}
              </p>
              <RemoveRowButton onClick={remove} disabled={!canRemove} />
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_90px_90px]">
              <Field
                name={`ph_jenis_${i}`}
                label="Jenis"
                defaultValue={p.jenis}
              />
              <Field
                name={`ph_nomor_${i}`}
                label="Nomor"
                defaultValue={p.nomor}
              />
              <Field
                name={`ph_tahun_${i}`}
                label="Tahun"
                type="number"
                defaultValue={p.tahun || ""}
              />
            </div>
            <div className="mt-3">
              <Field
                name={`ph_tentang_${i}`}
                label="Tentang"
                defaultValue={p.tentang}
              />
            </div>
            <div className="mt-3">
              <Field
                name={`ph_href_${i}`}
                label="Tautan Dokumen (opsional)"
                defaultValue={p.href}
                placeholder="https://..."
              />
            </div>
          </section>
        )}
      />

      <SubmitBar pending={pending} label="Simpan Produk Hukum" />
    </form>
  );
}
