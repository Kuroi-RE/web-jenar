"use client";

import { useState } from "react";
import { labelClass } from "./fields";

export function DocumentField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string;
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
        throw new Error(data.error ?? "Gagal mengunggah dokumen PDF.");
      }
      setUrl(data.url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengunggah dokumen PDF.",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input type="hidden" name={name} value={url} />

      <div className="mt-1.5 flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-black/10 px-3.5 py-2 text-sm font-semibold text-ink transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10">
          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
          <svg
            className="size-4 text-primary-600 dark:text-primary-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          {uploading
            ? "Mengunggah…"
            : url
              ? "Ganti File PDF"
              : "Unggah File (PDF)"}
        </label>

        {url ? (
          <div className="flex items-center gap-3 text-xs">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-primary-700 underline dark:text-primary-300"
            >
              <svg
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
              Lihat File Terunggah
            </a>
            <button
              type="button"
              onClick={() => setUrl("")}
              className="font-medium text-red-600 hover:underline dark:text-red-400"
            >
              Hapus
            </button>
          </div>
        ) : (
          <span className="text-xs text-ink-soft">
            Belum ada file dipilih (Khusus PDF, maks. 10MB)
          </span>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
