// Konfigurasi Turnstile yang dibaca BERSAMA oleh server dan klien.
//
// Sengaja TANPA "server-only" dan tanpa menyentuh secret, karena berkas ini
// ikut masuk ke bundel browser (dipakai components/admin/LoginForm.tsx).
//
// Saklar on/off memakai satu variabel yang sama untuk server dan klien agar
// keduanya tidak mungkin berbeda pendapat. Nilainya memang terbaca browser,
// dan itu tidak masalah: keberadaan widget di halaman login sudah menunjukkan
// hal yang sama. Yang menentukan penerimaan login tetap sisi server, dan
// server membaca variabel dari proses miliknya sendiri — bukan dari request.

/** Nilai yang dianggap "matikan". Selain ini dianggap aktif. */
const NILAI_MATI = new Set(["false", "0", "off", "no", "disabled"]);

/**
 * Apakah verifikasi Turnstile diaktifkan?
 *
 * Default **aktif** (aman secara bawaan). Matikan secara eksplisit dengan
 * `NEXT_PUBLIC_TURNSTILE_ENABLED=false` di `.env`.
 */
export function isTurnstileEnabled(): boolean {
  const raw = process.env.NEXT_PUBLIC_TURNSTILE_ENABLED?.trim().toLowerCase();
  if (raw && NILAI_MATI.has(raw)) return false;
  return true;
}

/** Sitekey publik, sudah di-trim (spasi di ujung membuat widget gagal). */
export function turnstileSitekey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY?.trim();
  return key && key.length > 0 ? key : undefined;
}
