"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { BeritaFormState } from "@/lib/admin/berita-actions";

type Action = (
  prev: BeritaFormState,
  formData: FormData,
) => Promise<BeritaFormState>;

export type BeritaFormValues = {
  slug?: string;
  title?: string;
  date?: string;
  category?: string;
  excerpt?: string;
  image?: string;
  imageAlt?: string;
  author?: string;
  body?: string;
};

const inputClass =
  "mt-1.5 w-full rounded-lg border border-black/10 bg-surface px-3.5 py-2.5 text-ink outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-white/15";

const labelClass = "block text-sm font-semibold text-ink";

export function BeritaForm({
  action,
  mode,
  values = {},
}: {
  action: Action;
  mode: "create" | "edit";
  values?: BeritaFormValues;
}) {
  const [state, formAction, pending] = useActionState<BeritaFormState, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300"
        >
          {state.error}
        </p>
      )}

      {mode === "edit" && (
        <input type="hidden" name="slug" defaultValue={values.slug} />
      )}

      <div>
        <label htmlFor="title" className={labelClass}>
          Judul <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={values.title}
          className={inputClass}
        />
        {mode === "edit" && (
          <p className="mt-1 text-xs text-ink-soft">
            Slug: <code className="font-mono">{values.slug}</code> (tetap)
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className={labelClass}>
            Tanggal <span className="text-red-500">*</span>
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={values.date}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="category" className={labelClass}>
            Kategori
          </label>
          <input
            id="category"
            name="category"
            type="text"
            defaultValue={values.category ?? "Umum"}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="author" className={labelClass}>
          Penulis
        </label>
        <input
          id="author"
          name="author"
          type="text"
          defaultValue={values.author ?? "Pemerintah Desa Sidoharjo"}
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="image" className={labelClass}>
            Path Gambar
          </label>
          <input
            id="image"
            name="image"
            type="text"
            placeholder="/images/hero/slide-1.jpeg"
            defaultValue={values.image}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-ink-soft">
            Path relatif ke folder <code className="font-mono">public/</code>.
          </p>
        </div>
        <div>
          <label htmlFor="imageAlt" className={labelClass}>
            Teks Alternatif Gambar
          </label>
          <input
            id="imageAlt"
            name="imageAlt"
            type="text"
            defaultValue={values.imageAlt}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="excerpt" className={labelClass}>
          Ringkasan <span className="text-red-500">*</span>
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          rows={2}
          defaultValue={values.excerpt}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="body" className={labelClass}>
          Isi Berita (Markdown) <span className="text-red-500">*</span>
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={16}
          defaultValue={values.body}
          className={`${inputClass} font-mono text-sm`}
          placeholder={"## Sub Judul\n\nTulis isi berita di sini. Dukung **tebal**, _miring_, daftar, dan > kutipan."}
        />
        <p className="mt-1 text-xs text-ink-soft">
          Format Markdown: <code className="font-mono">##</code> judul,{" "}
          <code className="font-mono">**tebal**</code>,{" "}
          <code className="font-mono">- daftar</code>,{" "}
          <code className="font-mono">&gt; kutipan</code>.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : mode === "create" ? "Terbitkan" : "Simpan Perubahan"}
        </button>
        <Link
          href="/admin/berita"
          className="rounded-lg border border-black/10 px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
