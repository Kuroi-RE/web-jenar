import "server-only";
import path from "node:path";

/** Folder fisik penyimpanan foto yang diunggah lewat panel admin. */
export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Pola nama file yang dibuat route upload:
 * `${Date.now()}-${16 hex}.${ext}`, contoh 1793082258793-e24ee1f6093d4e52.jpg
 */
export const UPLOAD_FILENAME_RE = /^\d{10,16}-[a-f0-9]{16}\.(jpg|png|gif|webp)$/;

export const UPLOAD_CONTENT_TYPES = {
  jpg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
} as const;

export type UploadExt = keyof typeof UPLOAD_CONTENT_TYPES;
