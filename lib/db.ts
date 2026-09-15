import "server-only";
import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";

// Singleton pool (tahan hot-reload dev via globalThis).
const globalForDb = globalThis as unknown as { _mysqlPool?: Pool };

function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL belum diset.");
  }
  if (!globalForDb._mysqlPool) {
    const url = new URL(connectionString);
    globalForDb._mysqlPool = mysql.createPool({
      host: url.hostname,
      port: url.port ? Number(url.port) : 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ""),
      ssl:
        process.env.DATABASE_SSL === "true"
          ? { rejectUnauthorized: false }
          : undefined,
      connectionLimit: 5,
      waitForConnections: true,
    });
  }
  return globalForDb._mysqlPool;
}

/** Jalankan query dan kembalikan baris hasil. */
export async function query<T = RowDataPacket>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const [rows] = await getPool().query(text, params);
  return rows as T[];
}

// Pastikan skema tabel ada (idempoten, dijalankan sekali per proses).
let schemaReady: Promise<void> | undefined;

/**
 * Migrasi aditif untuk database yang dibuat sebelum dukungan multi-akun.
 * MySQL 5.7 tidak punya `ADD COLUMN IF NOT EXISTS`, jadi keberadaan kolom/indeks
 * diperiksa lewat information_schema lebih dulu. Semua langkah idempoten.
 */
async function migrateAdminCredentials(pool: Pool): Promise<void> {
  const [cols] = await pool.query<RowDataPacket[]>(
    `SELECT COLUMN_NAME AS name, EXTRA AS extra
       FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'admin_credentials'`,
  );
  const names = new Set(cols.map((c) => String(c.name)));

  if (!names.has("role")) {
    await pool.query(
      "ALTER TABLE admin_credentials ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'admin'",
    );
    console.info("[db] admin_credentials: kolom `role` ditambahkan.");
  }

  const idCol = cols.find((c) => String(c.name) === "id");
  if (idCol && !String(idCol.extra ?? "").includes("auto_increment")) {
    await pool.query(
      "ALTER TABLE admin_credentials MODIFY id INT NOT NULL AUTO_INCREMENT",
    );
    console.info("[db] admin_credentials: `id` dijadikan AUTO_INCREMENT.");
  }

  const [idx] = await pool.query<RowDataPacket[]>(
    `SELECT INDEX_NAME AS name
       FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'admin_credentials'
        AND INDEX_NAME = 'uniq_admin_username'`,
  );
  if (idx.length === 0) {
    await pool.query(
      "ALTER TABLE admin_credentials ADD UNIQUE KEY uniq_admin_username (username)",
    );
    console.info("[db] admin_credentials: indeks unik username ditambahkan.");
  }
}

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const pool = getPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS site_settings (
          id INT PRIMARY KEY,
          data JSON NOT NULL,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS berita (
          slug VARCHAR(80) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          date VARCHAR(20) NOT NULL,
          category VARCHAR(100) NOT NULL DEFAULT 'Umum',
          excerpt TEXT NOT NULL,
          image VARCHAR(255) NULL,
          image_alt VARCHAR(255) NULL,
          author VARCHAR(150) NOT NULL DEFAULT 'Pemerintah Kecamatan Jenar',
          body MEDIUMTEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS admin_credentials (
          id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(150) NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT 'admin',
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY uniq_admin_username (username)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      await migrateAdminCredentials(pool);
    })().catch((err) => {
      // Reset agar percobaan berikutnya dapat mencoba lagi.
      schemaReady = undefined;
      throw err;
    });
  }
  return schemaReady;
}
