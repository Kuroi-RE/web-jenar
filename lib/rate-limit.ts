import "server-only";
import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

// Penyimpanan in-memory (per instance). Cocok untuk deploy single-container.
// Untuk multi-instance, ganti dengan Redis/Upstash.
const store = new Map<string, Bucket>();

export type RateResult = { ok: boolean; retryAfter: number };

/**
 * Batasi jumlah aksi per `key` dalam jendela waktu tertentu.
 * @param limit jumlah maksimal dalam window
 * @param windowMs panjang window (ms)
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateResult {
  const now = Date.now();

  // Bersihkan entri kedaluwarsa secara oportunistik agar Map tidak membengkak.
  if (store.size > 5000) {
    for (const [k, v] of store) {
      if (now > v.resetAt) store.delete(k);
    }
  }

  const bucket = store.get(key);
  if (!bucket || now > bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

/** Ambil IP klien dari header proxy (X-Forwarded-For / X-Real-IP). */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "unknown";
}
