"use client";

import { useActionState } from "react";
import {
  saveApbdesAction,
  type KontenFormState,
} from "@/lib/admin/konten-actions";
import type { ApbdesSettings, ApbdesPostS } from "@/lib/store";
import { Field, FormStatus, SubmitBar, Section } from "./fields";
import { RupiahField } from "./RupiahField";
import { RepeatableRows, RemoveRowButton } from "./RepeatableRows";

const EMPTY_POST: ApbdesPostS = { code: "", label: "", amount: 0 };

export function ApbdesForm({ apbdes }: { apbdes: ApbdesSettings }) {
  const [state, formAction, pending] = useActionState<KontenFormState, FormData>(
    saveApbdesAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-6">
      <FormStatus state={state} successText="APBDes berhasil disimpan." />

      <Section
        title="Ringkasan Anggaran"
        description="Nominal otomatis diformat ke ribuan Rupiah. Defisit/surplus dihitung otomatis."
      >
        <Field
          name="tahun"
          label="Tahun Anggaran"
          type="number"
          defaultValue={apbdes.tahun}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <RupiahField
            name="pendapatan"
            label="Total Pendapatan"
            defaultValue={apbdes.pendapatan}
          />
          <RupiahField
            name="belanja"
            label="Total Belanja"
            defaultValue={apbdes.belanja}
          />
        </div>
      </Section>

      <Section
        title="Rincian Sumber Pendapatan"
        description="Baris kode contoh: PAD, ADD, DD, BHP, BANPROV. Tambah/hapus baris sesuai kebutuhan."
      >
        <RepeatableRows
          initialItems={apbdes.rincian}
          emptyItem={EMPTY_POST}
          min={0}
          addLabel="Tambah Sumber Pendapatan"
          renderItem={({ item: post, index: i, remove, canRemove }) => (
            <div className="rounded-xl border border-black/5 p-4 dark:border-white/10">
              <div className="grid gap-3 sm:grid-cols-[100px_1fr_180px]">
                <Field name={`code_${i}`} label="Kode" defaultValue={post.code} />
                <Field
                  name={`label_${i}`}
                  label="Nama"
                  defaultValue={post.label}
                />
                <RupiahField
                  name={`amount_${i}`}
                  label="Nominal"
                  defaultValue={post.amount || ""}
                />
              </div>
              <div className="mt-3 flex justify-end">
                <RemoveRowButton onClick={remove} disabled={!canRemove} />
              </div>
            </div>
          )}
        />
      </Section>

      <SubmitBar pending={pending} label="Simpan APBDes" />
    </form>
  );
}
