import "server-only";
import { query, ensureSchema } from "@/lib/db";
import { hashPassword } from "@/lib/password";

// Kredensial default (bootstrap) dari environment. Dipakai hanya bila belum
// ada baris kredensial di database — begitu admin menyimpan lewat panel,
// nilai dari database yang berlaku.
export const envUsername = process.env.ADMIN_USERNAME || "admin";
export const envPassword = process.env.ADMIN_PASSWORD || "admin123";

export type StoredCredentials = { username: string; passwordHash: string };

// Re-export agar konsumen lama (mis. lib/auth.ts) tak perlu berubah.
export { hashPassword, verifyPassword } from "@/lib/password";

/** Baca kredensial tersimpan dari DB; null bila belum ada. */
export async function getStoredCredentials(): Promise<StoredCredentials | null> {
  await ensureSchema();
  const rows = await query<{ username: string; password_hash: string }>(
    "SELECT username, password_hash FROM admin_credentials WHERE id = 1",
  );
  const row = rows[0];
  if (!row) return null;
  return { username: row.username, passwordHash: row.password_hash };
}

/** Simpan (upsert) kredensial admin. Kata sandi selalu di-hash. */
export async function saveCredentials(
  username: string,
  password: string,
): Promise<void> {
  await ensureSchema();
  const passwordHash = hashPassword(password);
  await query(
    `INSERT INTO admin_credentials (id, username, password_hash) VALUES (1, ?, ?)
     ON DUPLICATE KEY UPDATE username = VALUES(username), password_hash = VALUES(password_hash)`,
    [username, passwordHash],
  );
}
