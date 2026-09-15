"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import type { BeritaFormState } from "@/lib/admin/berita-actions";
import { renderMarkdownSync } from "@/lib/markdown";
import { ImageField } from "./ImageField";

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

  // Isi Markdown dijadikan state agar pratinjau ikut berubah saat diketik.
  const [body, setBody] = useState(values.body ?? "");
  // Pratinjau di layar kecil ditampilkan lewat tombol; di desktop selalu tampil.
  const [showPreview, setShowPreview] = useState(false);

  // Dirender dengan util yang sama seperti halaman publik, jadi hasilnya identik
  // (raw HTML dibuang, protokol tautan dibatasi).
  const html = useMemo(() => renderMarkdownSync(body), [body]);

  const previewPane = (
    <div className="rounded-2xl border border-black/5 bg-surface p-5 shadow-soft dark:border-white/10">
      <div className="mb-3 flex items-center justify-between border-b border-black/5 pb-2 dark:border-white/10">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Pratinjau
        </span>
        <span className="text-xs text-ink-soft">
          {body.trim().length === 0 ? "belum ada isi" : `${body.length} karakter`}
        </span>
      </div>
      {body.trim().length === 0 ? (
        <p className="text-sm text-ink-soft">
          Tulis isi berita untuk melihat pratinjaunya di sini.
        </p>
      ) : (
        <div
          className="prose-desa max-w-none"
          // Aman: HTML berasal dari renderMarkdownSync yang membuang raw HTML.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </div>
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
          defaultValue={values.author ?? "Pemerintah Kecamatan Jenar"}
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <ImageField
          name="image"
          label="Gambar Berita"
          defaultValue={values.image}
          allowManualPath={false}
        />
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
          <p className="mt-1 text-xs text-ink-soft">
            Jelaskan isi foto secara singkat, mis. &ldquo;Camat menyerahkan
            dokumen kepada warga&rdquo;.
          </p>
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

      {/* Editor + pratinjau: dua kolom di desktop, satu kolom di layar kecil. */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <label htmlFor="body" className={labelClass}>
            Isi Berita (Markdown) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="body"
            name="body"
            required
            rows={18}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={`${inputClass} font-mono text-sm`}
            placeholder={
              "## Sub Judul\n\nTulis isi berita di sini. Dukung **tebal**, _miring_, daftar, dan > kutipan."
            }
          />
          <p className="mt-1 text-xs text-ink-soft">
            Format Markdown: <code className="font-mono">##</code> judul,{" "}
            <code className="font-mono">**tebal**</code>,{" "}
            <code className="font-mono">- daftar</code>,{" "}
            <code className="font-mono">&gt; kutipan</code>.
          </p>
        </div>

        {/* Desktop: pratinjau menempel di kanan dan ikut menggulir. */}
        <div className="hidden lg:block">
          <span className={labelClass}>Hasil Tampilan</span>
          <div className="mt-1.5 lg:sticky lg:top-24">{previewPane}</div>
        </div>
      </div>

      {/* Layar kecil: pratinjau muncul saat tombol ditekan. */}
      {showPreview && <div className="lg:hidden">{previewPane}</div>}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary disabled:opacity-60"
        >
          {pending
            ? "Menyimpan…"
            : mode === "create"
              ? "Terbitkan"
              : "Simpan Perubahan"}
        </button>

        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          aria-expanded={showPreview}
          className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-black/5 lg:hidden dark:border-white/15 dark:hover:bg-white/10"
        >
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
            />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {showPreview ? "Tutup Pratinjau" : "Pratinjau"}
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
