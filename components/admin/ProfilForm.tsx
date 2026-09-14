"use client";

import { useActionState } from "react";
import {
  saveProfilAction,
  type KontenFormState,
} from "@/lib/admin/konten-actions";
import type { ProfilSettings, NilaiProfilS, TupoksiS } from "@/lib/store";
import { Field, Textarea, Section, FormStatus, SubmitBar } from "./fields";
import { RepeatableRows, RemoveRowButton } from "./RepeatableRows";

const EMPTY_NILAI: NilaiProfilS = { title: "", description: "", icon: "" };
const EMPTY_TUPOKSI: TupoksiS = { jabatan: "", ringkasan: "", tugas: [] };

export function ProfilForm({ profil }: { profil: ProfilSettings }) {
  const [state, formAction, pending] = useActionState<KontenFormState, FormData>(
    saveProfilAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-6">
      <FormStatus state={state} successText="Profil berhasil disimpan." />

      <Section title="Visi & Misi">
        <Textarea name="visi" label="Visi" defaultValue={profil.visi} rows={3} />
        <Textarea
          name="misi"
          label="Misi"
          defaultValue={profil.misi.join("\n")}
          rows={6}
          hint="Satu poin misi per baris."
        />
      </Section>

      <Section
        title="Nilai Pelayanan"
        description="Tambah/hapus nilai sesuai kebutuhan. Ikon dipertahankan otomatis."
      >
        <RepeatableRows
          initialItems={profil.nilai}
          emptyItem={EMPTY_NILAI}
          min={0}
          addLabel="Tambah Nilai"
          renderItem={({ item: n, index: i, remove, canRemove }) => (
            <div className="rounded-xl border border-black/5 p-4 dark:border-white/10">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  Nilai {i + 1}
                </p>
                <RemoveRowButton onClick={remove} disabled={!canRemove} />
              </div>
              <input
                type="hidden"
                name={`nilai_icon_${i}`}
                defaultValue={n.icon}
              />
              <Field
                name={`nilai_title_${i}`}
                label="Judul"
                defaultValue={n.title}
              />
              <div className="mt-3">
                <Textarea
                  name={`nilai_desc_${i}`}
                  label="Deskripsi"
                  defaultValue={n.description}
                  rows={2}
                />
              </div>
            </div>
          )}
        />
      </Section>

      <Section
        title="Tugas Pokok & Fungsi"
        description="Tambah/hapus jabatan sesuai kebutuhan."
      >
        <RepeatableRows
          initialItems={profil.tupoksi}
          emptyItem={EMPTY_TUPOKSI}
          min={0}
          addLabel="Tambah Jabatan"
          renderItem={({ item: t, index: i, remove, canRemove }) => (
            <div className="rounded-xl border border-black/5 p-4 dark:border-white/10">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  Jabatan {i + 1}
                </p>
                <RemoveRowButton onClick={remove} disabled={!canRemove} />
              </div>
              <Field
                name={`tup_jabatan_${i}`}
                label="Jabatan"
                defaultValue={t.jabatan}
              />
              <div className="mt-3">
                <Textarea
                  name={`tup_ringkasan_${i}`}
                  label="Ringkasan"
                  defaultValue={t.ringkasan}
                  rows={2}
                />
              </div>
              <div className="mt-3">
                <Textarea
                  name={`tup_tugas_${i}`}
                  label="Rincian Tugas"
                  defaultValue={t.tugas.join("\n")}
                  rows={4}
                  hint="Satu tugas per baris."
                />
              </div>
            </div>
          )}
        />
      </Section>

      <SubmitBar pending={pending} label="Simpan Profil" />
    </form>
  );
}
