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
        );
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
          author VARCHAR(150) NOT NULL DEFAULT 'Pemerintah Desa Sidoharjo',
          body MEDIUMTEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            ON UPDATE CURRENT_TIMESTAMP
        );
      `);
    })().catch((err) => {
      // Reset agar percobaan berikutnya dapat mencoba lagi.
      schemaReady = undefined;
      throw err;
    });
  }
  return schemaReady;
}
