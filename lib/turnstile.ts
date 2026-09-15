import "server-only";

// Verifikasi token Cloudflare Turnstile (anti-bot pada form login admin).
// Dokumentasi: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Batas waktu tunggu ke Cloudflare agar Server Action tidak menggantung. */
const TIMEOUT_MS = 10_000;

export type TurnstileResult = { ok: true } | { ok: false; codes: string[] };

/**
 * Verifikasi token Turnstile ke Cloudflare.
 *
 * Bersifat **fail-closed**: bila secret belum diset, token kosong, atau
 * Cloudflare tak dapat dihubungi, hasilnya gagal. Ini disengaja — jika
 * fail-open, penyerang cukup memblokir akses ke Cloudflare untuk melewati
 * verifikasi.
 *
 * Untuk pengembangan lokal pakai dummy key Cloudflare (lihat `.env.example`);
 * dengan begitu jalur kode di dev dan produksi tetap sama.
 */
export async function verifyTurnstile(
  token: string,
  ip?: string,
): Promise<TurnstileResult> {
  // Di-trim: spasi/CR di ujung nilai env (umum saat edit .env lewat FTP)
  // akan membuat Cloudflare menolak dengan `invalid-input-secret`.
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    console.error(
      "[turnstile] TURNSTILE_SECRET_KEY belum diset — verifikasi ditolak.",
    );
    return { ok: false, codes: ["missing-input-secret"] };
  }
  if (!token) return { ok: false, codes: ["missing-input-response"] };

  const body = new URLSearchParams({ secret, response: token });
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`[turnstile] siteverify HTTP ${res.status}`);
      return { ok: false, codes: ["internal-error"] };
    }
    const data = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    if (data.success) return { ok: true };
    return { ok: false, codes: data["error-codes"] ?? [] };
  } catch (err) {
    console.error("[turnstile] gagal menghubungi siteverify:", err);
    return { ok: false, codes: ["network-error"] };
  }
}

/** Pesan berbahasa Indonesia untuk ditampilkan ke operator. */
export function turnstileErrorMessage(codes: string[]): string {
  if (codes.includes("missing-input-response")) {
    return "Selesaikan verifikasi keamanan terlebih dahulu.";
  }
  if (codes.includes("timeout-or-duplicate")) {
    return "Verifikasi keamanan kedaluwarsa. Silakan coba lagi.";
  }
  if (
    codes.includes("missing-input-secret") ||
    codes.includes("invalid-input-secret")
  ) {
    return "Verifikasi keamanan belum dikonfigurasi dengan benar. Hubungi pengelola teknis.";
  }
  if (codes.includes("network-error") || codes.includes("internal-error")) {
    return "Layanan verifikasi keamanan tidak dapat dihubungi. Coba lagi beberapa saat.";
  }
  return "Verifikasi keamanan gagal. Silakan coba lagi.";
}
