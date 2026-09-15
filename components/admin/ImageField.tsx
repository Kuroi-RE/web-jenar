"use client";

import { useState } from "react";
import { inputClass, labelClass } from "./fields";

export function ImageField({
  name,
  label,
  defaultValue,
  allowManualPath = true,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  /** Tampilkan kolom path manual. Matikan bila hanya boleh unggah berkas. */
  allowManualPath?: boolean;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Gagal mengunggah gambar.");
      }
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah gambar.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className={labelClass}>{label}</label>

      {/* Nilai yang dikirim ke server action */}
      <input type="hidden" name={name} value={url} />

      <div className="mt-1.5 flex items-center gap-3">
        <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-black/10 bg-surface-muted dark:border-white/15">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Pratinjau" className="size-full object-cover" />
          ) : (
            <svg
              className="size-6 text-ink-soft"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.6-4.6a2 2 0 0 1 2.8 0L16 16m-2-2 1.6-1.6a2 2 0 0 1 2.8 0L20 14M4 6h16v12H4z"
              />
            </svg>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="inline-flex w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-black/10 px-3 py-1.5 text-sm font-semibold text-ink transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? "Mengunggah…" : "Unggah Foto"}
          </label>
          {url && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="w-fit text-xs font-medium text-red-600 hover:underline dark:text-red-400"
            >
              Hapus gambar
            </button>
          )}
        </div>
      </div>

      {/* Path manual (opsional) */}
      {allowManualPath && (
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="/uploads/... atau /images/..."
          className={`${inputClass} mt-2 text-sm`}
        />
      )}

      {error && (
        <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
