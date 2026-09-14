"use client";

import { useActionState } from "react";
import {
  savePpidAction,
  type KontenFormState,
} from "@/lib/admin/konten-actions";
import type { PpidSettings, PpidStrukturS, KategoriInfoS } from "@/lib/store";
import { Field, Textarea, Section, FormStatus, SubmitBar } from "./fields";
import { RepeatableRows, RemoveRowButton } from "./RepeatableRows";

const EMPTY_STRUKTUR: PpidStrukturS = { jabatan: "", keterangan: "" };
const EMPTY_INFO: KategoriInfoS = { judul: "", deskripsi: "" };

export function PpidForm({ ppid }: { ppid: PpidSettings }) {
  const [state, formAction, pending] = useActionState<KontenFormState, FormData>(
    savePpidAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-6">
      <FormStatus state={state} successText="PPID berhasil disimpan." />

      <Section title="Profil PPID">
        <Textarea
          name="ppid_profil"
          label="Deskripsi Profil"
          defaultValue={ppid.profil}
          rows={4}
        />
      </Section>

      <Section
        title="Struktur PPID"
        description="Tambah/hapus baris struktur sesuai kebutuhan."
      >
        <RepeatableRows
          initialItems={ppid.struktur}
          emptyItem={EMPTY_STRUKTUR}
          min={0}
          addLabel="Tambah Struktur"
          renderItem={({ item: s, index: i, remove, canRemove }) => (
            <div className="rounded-xl border border-black/5 p-4 dark:border-white/10">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  Struktur {i + 1}
                </p>
                <RemoveRowButton onClick={remove} disabled={!canRemove} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  name={`str_jabatan_${i}`}
                  label="Jabatan"
                  defaultValue={s.jabatan}
                />
                <Field
                  name={`str_ket_${i}`}
                  label="Keterangan"
                  defaultValue={s.keterangan}
                />
              </div>
            </div>
          )}
        />
      </Section>

      <Section title="Tugas & Fungsi / Dasar Hukum">
        <Textarea
          name="ppid_tugas"
          label="Tugas & Fungsi"
          defaultValue={ppid.tugas.join("\n")}
          rows={5}
          hint="Satu poin per baris."
        />
        <Textarea
          name="ppid_dasar"
          label="Dasar Hukum"
          defaultValue={ppid.dasarHukum.join("\n")}
          rows={5}
          hint="Satu dasar hukum per baris."
        />
      </Section>

      <Section
        title="Klasifikasi Informasi Publik"
        description="Tambah/hapus kategori informasi sesuai kebutuhan."
      >
        <RepeatableRows
          initialItems={ppid.dataInformasi}
          emptyItem={EMPTY_INFO}
          min={0}
          addLabel="Tambah Kategori"
          renderItem={({ item: info, index: i, remove, canRemove }) => (
            <div className="rounded-xl border border-black/5 p-4 dark:border-white/10">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  Kategori {i + 1}
                </p>
                <RemoveRowButton onClick={remove} disabled={!canRemove} />
              </div>
              <Field
                name={`info_judul_${i}`}
                label="Judul"
                defaultValue={info.judul}
              />
              <div className="mt-3">
                <Textarea
                  name={`info_desk_${i}`}
                  label="Deskripsi"
                  defaultValue={info.deskripsi}
                  rows={2}
                />
              </div>
            </div>
          )}
        />
      </Section>

      <SubmitBar pending={pending} label="Simpan PPID" />
    </form>
  );
}
