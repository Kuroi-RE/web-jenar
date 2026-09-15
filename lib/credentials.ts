import "server-only";
import crypto from "node:crypto";
import { query, ensureSchema } from "@/lib/db";

// Kredensial default (bootstrap) dari environment. Dipakai hanya bila belum
// ada baris kredensial di database — begitu admin menyimpan lewat panel,
// nilai dari database yang berlaku.
export const envUsername = process.env.ADMIN_USERNAME || "admin";
export const envPassword = process.env.ADMIN_PASSWORD || "admin123";

export type StoredCredentials = { username: string; passwordHash: string };

const SCRYPT_KEYLEN = 64;

/** Hash kata sandi dengan scrypt + salt acak. Format: "scrypt$<salt>$<hash>". */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

/** Verifikasi kata sandi terhadap hash tersimpan (perbandingan waktu-konstan). */
export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, hashHex] = parts;
  const expected = Buffer.from(hashHex, "hex");
  let actual: Buffer;
  try {
    actual = crypto.scryptSync(password, salt, expected.length);
  } catch {
    return false;
  }
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

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
    `INSERT INTO admin_credentials (id, username, password_hash) VALUES (1, ?, ?) AS new
     ON DUPLICATE KEY UPDATE username = new.username, password_hash = new.password_hash`,
    [username, passwordHash],
  );
}
