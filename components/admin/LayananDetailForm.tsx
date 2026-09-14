"use client";

import { useActionState } from "react";
import {
  saveLayananDetailAction,
  type KontenFormState,
} from "@/lib/admin/konten-actions";
import type {
  LayananDetailSettings,
  SopLangkahS,
  PersyaratanLayananS,
} from "@/lib/store";
import { Field, Textarea, Section, FormStatus, SubmitBar } from "./fields";
import { RepeatableRows, RemoveRowButton } from "./RepeatableRows";

const EMPTY_SOP: SopLangkahS = { judul: "", deskripsi: "" };
const EMPTY_PERSYARATAN: PersyaratanLayananS = { nama: "", berkas: [] };

export function LayananDetailForm({
  layananDetail,
}: {
  layananDetail: LayananDetailSettings;
}) {
  const [state, formAction, pending] = useActionState<KontenFormState, FormData>(
    saveLayananDetailAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-6">
      <FormStatus
        state={state}
        successText="Halaman Layanan Publik berhasil disimpan."
      />

      <Section
        title="SOP Pelayanan Administrasi"
        description="Langkah-langkah alur pelayanan. Tambah/hapus langkah sesuai kebutuhan."
      >
        <RepeatableRows
          initialItems={layananDetail.sop}
          emptyItem={EMPTY_SOP}
          min={0}
          addLabel="Tambah Langkah"
          renderItem={({ item: s, index: i, remove, canRemove }) => (
            <div className="rounded-xl border border-black/5 p-4 dark:border-white/10">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  Langkah {i + 1}
                </p>
                <RemoveRowButton onClick={remove} disabled={!canRemove} />
              </div>
              <Field
                name={`sop_judul_${i}`}
                label="Judul Langkah"
                defaultValue={s.judul}
              />
              <div className="mt-3">
                <Textarea
                  name={`sop_deskripsi_${i}`}
                  label="Deskripsi"
                  defaultValue={s.deskripsi}
                  rows={2}
                />
              </div>
            </div>
          )}
        />
      </Section>

      <Section
        title="Jenis Pelayanan & Persyaratan"
        description="Daftar jenis layanan beserta berkas yang perlu disiapkan. Tambah/hapus sesuai kebutuhan."
      >
        <RepeatableRows
          initialItems={layananDetail.persyaratan}
          emptyItem={EMPTY_PERSYARATAN}
          min={0}
          addLabel="Tambah Jenis Layanan"
          renderItem={({ item: p, index: i, remove, canRemove }) => (
            <div className="rounded-xl border border-black/5 p-4 dark:border-white/10">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  Layanan {i + 1}
                </p>
                <RemoveRowButton onClick={remove} disabled={!canRemove} />
              </div>
              <Field
                name={`pl_nama_${i}`}
                label="Nama Layanan"
                defaultValue={p.nama}
              />
              <div className="mt-3">
                <Textarea
                  name={`pl_berkas_${i}`}
                  label="Berkas / Persyaratan"
                  defaultValue={p.berkas.join("\n")}
                  rows={4}
                  hint="Satu berkas per baris."
                />
              </div>
            </div>
          )}
        />
      </Section>

      <Section title="Maklumat Pelayanan">
        <Textarea
          name="maklumat"
          label="Pernyataan Maklumat"
          defaultValue={layananDetail.maklumat}
          rows={4}
        />
        <Textarea
          name="maklumatPoin"
          label="Poin Komitmen"
          defaultValue={layananDetail.maklumatPoin.join("\n")}
          rows={5}
          hint="Satu poin per baris."
        />
      </Section>

      <Section title="Pengadaan Barang & Jasa">
        <Textarea
          name="pengadaanPoin"
          label="Poin Pengadaan"
          defaultValue={layananDetail.pengadaanPoin.join("\n")}
          rows={5}
          hint="Satu poin per baris."
        />
      </Section>

      <SubmitBar pending={pending} label="Simpan Halaman Layanan" />
    </form>
  );
}
