"use client";

import { useActionState } from "react";
import {
  saveSakipAction,
  type KontenFormState,
} from "@/lib/admin/konten-actions";
import type { SakipItemS } from "@/lib/store";
import { Field, FormStatus, SubmitBar } from "./fields";
import { DocumentField } from "./DocumentField";
import { RepeatableRows, RemoveRowButton } from "./RepeatableRows";

const EMPTY: SakipItemS = {
  nama: "",
  href: "",
};

export function SakipForm({ sakip }: { sakip: SakipItemS[] }) {
  const [state, formAction, pending] = useActionState<KontenFormState, FormData>(
    saveSakipAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      <FormStatus state={state} successText="Dokumen SAKIP berhasil disimpan." />
      <p className="text-sm text-ink-soft">
        Gunakan <strong>Tambah Dokumen</strong> / <strong>Hapus</strong> untuk
        mengelola daftar dokumen SAKIP. Setiap dokumen wajib memiliki nama dokumen dan
        berkas PDF yang diunggah.
      </p>

      <RepeatableRows
        initialItems={sakip}
        emptyItem={EMPTY}
        min={0}
        addLabel="Tambah Dokumen"
        renderItem={({ item: doc, index: i, remove, canRemove }) => (
          <section className="rounded-2xl border border-black/5 bg-surface p-5 shadow-soft dark:border-white/10">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Dokumen {i + 1}
              </p>
              <RemoveRowButton onClick={remove} disabled={!canRemove} />
            </div>
            <div className="space-y-4">
              <Field
                name={`sakip_nama_${i}`}
                label="Nama Dokumen"
                defaultValue={doc.nama}
                placeholder="Contoh: Laporan Kinerja Instansi Pemerintah (LKjIP) Tahun 2026"
              />
              <DocumentField
                name={`sakip_href_${i}`}
                label="Upload File Dokumen (PDF)"
                defaultValue={doc.href}
              />
            </div>
          </section>
        )}
      />

      <SubmitBar pending={pending} label="Simpan Dokumen SAKIP" />
    </form>
  );
}
