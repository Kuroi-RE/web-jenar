"use client";

import { useActionState } from "react";
import {
  saveStatistikAction,
  type KontenFormState,
} from "@/lib/admin/konten-actions";
import type { StatistikSettings } from "@/lib/store";
import { Field, FormStatus, SubmitBar, Section } from "./fields";

export function StatistikForm({
  statistik,
}: {
  statistik: StatistikSettings;
}) {
  const [state, formAction, pending] = useActionState<KontenFormState, FormData>(
    saveStatistikAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-6">
      <FormStatus state={state} successText="Statistik berhasil disimpan." />

      <Section
        title="Kependudukan"
        description="Angka digunakan pada beranda dan halaman Demografi; grafik jenis kelamin dihitung otomatis."
      >
        <Field
          name="total"
          label="Total Penduduk"
          type="number"
          defaultValue={statistik.total}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            name="laki"
            label="Laki-laki"
            type="number"
            defaultValue={statistik.laki}
          />
          <Field
            name="perempuan"
            label="Perempuan"
            type="number"
            defaultValue={statistik.perempuan}
          />
        </div>
      </Section>

      <Section
        title="Peta Lokasi"
        description="Kata kunci pencarian untuk embed Google Maps (mis. nama &amp; alamat kantor kecamatan)."
      >
        <Field
          name="petaQuery"
          label="Kueri Peta"
          defaultValue={statistik.petaQuery}
        />
      </Section>

      <SubmitBar pending={pending} label="Simpan Statistik" />
    </form>
  );
}
