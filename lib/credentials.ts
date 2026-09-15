import "server-only";
import { query, ensureSchema } from "@/lib/db";
import { hashPassword } from "@/lib/password";

// Kredensial default (bootstrap) dari environment. Dipakai HANYA bila tabel
// admin_credentials masih kosong atau database tak terjangkau — begitu ada
// akun tersimpan, nilai dari database yang berlaku.
export const envUsername = process.env.ADMIN_USERNAME || "admin";
export const envPassword = process.env.ADMIN_PASSWORD || "admin123";

/**
 * `superadmin` = akun kedua untuk pengembang; satu-satunya perbedaan hak
 * adalah boleh mengatur ulang kata sandi akun lain (menu Akun Admin).
 * Tidak ada pembatasan menu lain antara `admin` dan `superadmin`.
 */
export type AdminRole = "admin" | "superadmin";

export type AdminAccount = {
  /** `null` untuk akun bootstrap dari environment (belum ada di DB). */
  id: number | null;
  username: string;
  role: AdminRole;
};

export type StoredCredentials = AdminAccount & { passwordHash: string };

// Re-export agar konsumen lama (mis. lib/auth.ts) tak perlu berubah.
export { hashPassword, verifyPassword } from "@/lib/password";

function toRole(value: unknown): AdminRole {
  return String(value) === "superadmin" ? "superadmin" : "admin";
}

type Row = {
  id: number;
  username: string;
  password_hash: string;
  role: string;
};

/** Cari akun berdasarkan username. */
export async function getCredentialsByUsername(
  username: string,
): Promise<StoredCredentials | null> {
  await ensureSchema();
  const rows = await query<Row>(
    "SELECT id, username, password_hash, role FROM admin_credentials WHERE username = ?",
    [username],
  );
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    role: toRole(row.role),
  };
}

/** Jumlah akun tersimpan; 0 berarti kredensial env masih dipakai. */
export async function countAdmins(): Promise<number> {
  await ensureSchema();
  const rows = await query<{ total: number }>(
    "SELECT COUNT(*) AS total FROM admin_credentials",
  );
  return Number(rows[0]?.total ?? 0);
}

/** Daftar akun (tanpa hash) untuk panel superadmin. */
export async function listAdmins(): Promise<
  (AdminAccount & { updatedAt: string | null })[]
> {
  await ensureSchema();
  const rows = await query<{
    id: number;
    username: string;
    role: string;
    updated_at: Date | string | null;
  }>(
    "SELECT id, username, role, updated_at FROM admin_credentials ORDER BY id ASC",
  );
  return rows.map((r) => ({
    id: r.id,
    username: r.username,
    role: toRole(r.role),
    updatedAt:
      r.updated_at instanceof Date
        ? r.updated_at.toISOString()
        : (r.updated_at ?? null),
  }));
}

/** Buat/perbarui akun berdasarkan username (dipakai script seed & bootstrap). */
export async function upsertAdmin(
  username: string,
  password: string,
  role: AdminRole = "admin",
): Promise<void> {
  await ensureSchema();
  await query(
    `INSERT INTO admin_credentials (username, password_hash, role)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE
       password_hash = VALUES(password_hash),
       role = VALUES(role)`,
    [username, hashPassword(password), role],
  );
}

/** Ubah username dan/atau kata sandi akun tertentu. */
export async function updateAdmin(
  id: number,
  next: { username?: string; password?: string },
): Promise<void> {
  await ensureSchema();
  if (next.username && next.password) {
    await query(
      "UPDATE admin_credentials SET username = ?, password_hash = ? WHERE id = ?",
      [next.username, hashPassword(next.password), id],
    );
    return;
  }
  if (next.username) {
    await query("UPDATE admin_credentials SET username = ? WHERE id = ?", [
      next.username,
      id,
    ]);
    return;
  }
  if (next.password) {
    await query(
      "UPDATE admin_credentials SET password_hash = ? WHERE id = ?",
      [hashPassword(next.password), id],
    );
  }
}
