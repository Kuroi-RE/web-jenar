// Inisialisasi database MySQL: buat tabel + impor berita dari content/berita/*.md.
// Jalankan: npm run db:init  (memuat .env.local via --env-file)
import { promises as fs } from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";
import matter from "gray-matter";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL belum diset. Isi di .env.local terlebih dulu.");
  process.exit(1);
}

const url = new URL(connectionString);
const pool = mysql.createPool({
  host: url.hostname,
  port: url.port ? Number(url.port) : 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.replace(/^\//, ""),
  ssl:
    process.env.DATABASE_SSL === "true"
      ? { rejectUnauthorized: false }
      : undefined,
});

const BERITA_DIR = path.join(process.cwd(), "content", "berita");

async function createTables() {
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
  console.log("✓ Tabel site_settings & berita siap.");
}

function toIso(value) {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

async function importBerita() {
  let files = [];
  try {
    files = (await fs.readdir(BERITA_DIR)).filter((f) => f.endsWith(".md"));
  } catch {
    console.log("• Tidak ada folder content/berita, lewati impor.");
    return;
  }

  let imported = 0;
  for (const file of files) {
    const raw = await fs.readFile(path.join(BERITA_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, "");
    const [res] = await pool.query(
      `INSERT IGNORE INTO berita
         (slug, title, date, category, excerpt, image, image_alt, author, body)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        slug,
        data.title ?? slug,
        toIso(data.date),
        data.category ?? "Umum",
        data.excerpt ?? "",
        data.image ?? null,
        data.imageAlt ?? null,
        data.author ?? "Pemerintah Desa Sidoharjo",
        content.trim(),
      ],
    );
    if (res.affectedRows > 0) imported += 1;
  }
  console.log(
    `✓ Impor berita: ${imported} baru, ${files.length - imported} sudah ada.`,
  );
}

try {
  await createTables();
  await importBerita();
  console.log("Selesai. Database siap digunakan.");
} catch (err) {
  console.error("Gagal inisialisasi database:", err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
