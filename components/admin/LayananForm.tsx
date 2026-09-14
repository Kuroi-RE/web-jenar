"use client";

import { useActionState } from "react";
import {
  saveLayananAction,
  type KontenFormState,
} from "@/lib/admin/konten-actions";
import type { LayananItemS } from "@/lib/store";
import { Field, FormStatus, SubmitBar, labelClass, inputClass } from "./fields";
import { RepeatableRows, RemoveRowButton } from "./RepeatableRows";

const EMPTY: LayananItemS = { title: "", desc: "", href: "", icon: "" };

export function LayananForm({ layanan }: { layanan: LayananItemS[] }) {
  const [state, formAction, pending] = useActionState<KontenFormState, FormData>(
    saveLayananAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      <FormStatus state={state} successText="Layanan berhasil disimpan." />
      <p className="text-sm text-ink-soft">
        Kartu layanan pada beranda. Gunakan tombol{" "}
        <strong>Tambah Layanan</strong> untuk menambah kartu dan{" "}
        <strong>Hapus</strong> untuk menghilangkannya. Ikon dipertahankan
        otomatis. Minimal satu layanan harus terisi.
      </p>

      <RepeatableRows
        initialItems={layanan}
        emptyItem={EMPTY}
        min={1}
        addLabel="Tambah Layanan"
        renderItem={({ item, index, remove, canRemove }) => (
          <section className="rounded-2xl border border-black/5 bg-surface p-5 shadow-soft dark:border-white/10">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Layanan {index + 1}
              </p>
              <RemoveRowButton onClick={remove} disabled={!canRemove} />
            </div>
            <input
              type="hidden"
              name={`icon_${index}`}
              defaultValue={item.icon}
            />
            <div className="space-y-4">
              <Field
                name={`title_${index}`}
                label="Judul"
                defaultValue={item.title}
              />
              <div>
                <label htmlFor={`desc_${index}`} className={labelClass}>
                  Deskripsi
                </label>
                <textarea
                  id={`desc_${index}`}
                  name={`desc_${index}`}
                  rows={2}
                  defaultValue={item.desc}
                  className={inputClass}
                />
              </div>
              <Field
                name={`href_${index}`}
                label="Tautan"
                defaultValue={item.href}
                placeholder="/layanan#sop atau https://..."
              />
            </div>
          </section>
        )}
      />

      <SubmitBar pending={pending} label="Simpan Layanan" />
    </form>
  );
}
