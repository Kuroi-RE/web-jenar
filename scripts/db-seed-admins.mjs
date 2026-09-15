// Seed dua akun panel admin: "admin" (operator) dan "superadmin" (pengembang).
// Jalankan: npm run db:seed-admins
//
// Kata sandi diambil dari env:
//   SEED_ADMIN_PASSWORD       (default "admin123" HANYA di luar produksi)
//   SEED_SUPERADMIN_PASSWORD  (default "superadmin123" HANYA di luar produksi)
// Nama akun dapat diganti lewat SEED_ADMIN_USERNAME / SEED_SUPERADMIN_USERNAME.
//
// Sifat idempoten: upsert berdasarkan username, jadi aman dijalankan berulang.
// Akun lain yang sudah ada (mis. "jenar") TIDAK disentuh.
import mysql from "mysql2/promise";
import { hashPassword } from "../lib/password.ts";

const isProd = process.env.NODE_ENV === "production";

const ACCOUNTS = [
  {
    username: process.env.SEED_ADMIN_USERNAME || "admin",
    password: process.env.SEED_ADMIN_PASSWORD,
    fallback: "admin123",
    role: "admin",
    envName: "SEED_ADMIN_PASSWORD",
  },
  {
    username: process.env.SEED_SUPERADMIN_USERNAME || "superadmin",
    password: process.env.SEED_SUPERADMIN_PASSWORD,
    fallback: "superadmin123",
    role: "superadmin",
    envName: "SEED_SUPERADMIN_PASSWORD",
  },
];

function resolvePassword(acc) {
  if (acc.password && acc.password.length > 0) {
    if (acc.password.length < 8) {
      throw new Error(`${acc.envName} minimal 8 karakter.`);
    }
    return { value: acc.password, source: acc.envName };
  }
  if (isProd) {
    throw new Error(
      `${acc.envName} wajib diisi saat NODE_ENV=production (menolak memakai kata sandi default).`,
    );
  }
  return { value: acc.fallback, source: "default pengembangan" };
}

function connectionOptions() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL belum diset.");
  const url = new URL(raw);
  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    ssl:
      process.env.DATABASE_SSL === "true"
        ? { rejectUnauthorized: false }
        : undefined,
  };
}

/** Skema + migrasi aditif, selaras dengan lib/db.ts (idempoten, MySQL 5.7). */
async function ensureSchema(conn) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS admin_credentials (
      id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(150) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'admin',
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_admin_username (username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const [cols] = await conn.query(
    `SELECT COLUMN_NAME AS name, EXTRA AS extra
       FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'admin_credentials'`,
  );
  const names = new Set(cols.map((c) => String(c.name)));

  if (!names.has("role")) {
    await conn.query(
      "ALTER TABLE admin_credentials ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'admin'",
    );
    console.log("• kolom `role` ditambahkan.");
  }

  const idCol = cols.find((c) => String(c.name) === "id");
  if (idCol && !String(idCol.extra ?? "").includes("auto_increment")) {
    await conn.query(
      "ALTER TABLE admin_credentials MODIFY id INT NOT NULL AUTO_INCREMENT",
    );
    console.log("• `id` dijadikan AUTO_INCREMENT.");
  }

  const [idx] = await conn.query(
    `SELECT INDEX_NAME FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'admin_credentials'
        AND INDEX_NAME = 'uniq_admin_username'`,
  );
  if (idx.length === 0) {
    await conn.query(
      "ALTER TABLE admin_credentials ADD UNIQUE KEY uniq_admin_username (username)",
    );
    console.log("• indeks unik username ditambahkan.");
  }
}

async function main() {
  const resolved = ACCOUNTS.map((acc) => ({
    ...acc,
    resolved: resolvePassword(acc),
  }));

  const conn = await mysql.createConnection(connectionOptions());
  try {
    await ensureSchema(conn);

    for (const acc of resolved) {
      const [res] = await conn.query(
        `INSERT INTO admin_credentials (username, password_hash, role)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE
           password_hash = VALUES(password_hash),
           role = VALUES(role)`,
        [acc.username, hashPassword(acc.resolved.value), acc.role],
      );
      // affectedRows: 1 = baris baru, 2 = diperbarui.
      const aksi = res.affectedRows >= 2 ? "diperbarui" : "dibuat";
      console.log(
        `✓ akun "${acc.username}" (${acc.role}) ${aksi} — kata sandi dari ${acc.resolved.source}.`,
      );
    }

    const [rows] = await conn.query(
      "SELECT id, username, role FROM admin_credentials ORDER BY id ASC",
    );
    console.log("\nAkun panel admin saat ini:");
    for (const r of rows) console.log(`  #${r.id}  ${r.username}  (${r.role})`);
    console.log(
      "\nGanti kata sandi default lewat panel /admin/akun sebelum dipakai di internet.",
    );
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error("Gagal seed akun:", err.message);
  process.exitCode = 1;
});
