// Hasilkan file SQL (skema + seed berita) untuk diimpor manual via phpMyAdmin.
// Tidak butuh koneksi database — hanya membaca content/berita/*.md.
// Jalankan: npm run db:export-sql  → menghasilkan scripts/init.sql
import { promises as fs } from "node:fs";
import path from "node:path";
import mysql from "mysql2";
import matter from "gray-matter";

const BERITA_DIR = path.join(process.cwd(), "content", "berita");
const OUT_FILE = path.join(process.cwd(), "scripts", "init.sql");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY,
  data JSON NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_credentials (
  id INT PRIMARY KEY,
  username VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`.trim();

function toIso(value) {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

async function build() {
  const lines = [];
  lines.push("-- Inisialisasi database Website Desa (impor via phpMyAdmin).");
  lines.push("-- Dihasilkan otomatis oleh scripts/db-export-sql.mjs.");
  lines.push("-- Pilih database tujuan lebih dulu, lalu Import file ini.");
  lines.push("");
  lines.push("SET NAMES utf8mb4;");
  lines.push("");
  lines.push("-- =========== SKEMA ===========");
  lines.push(SCHEMA);
  lines.push("");
  lines.push("-- =========== SEED BERITA ===========");

  let files = [];
  try {
    files = (await fs.readdir(BERITA_DIR)).filter((f) => f.endsWith(".md"));
  } catch {
    console.log("• Folder content/berita tidak ditemukan, seed berita dilewati.");
  }

  for (const file of files) {
    const raw = await fs.readFile(path.join(BERITA_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, "");
    const values = [
      slug,
      data.title ?? slug,
      toIso(data.date),
      data.category ?? "Umum",
      data.excerpt ?? "",
      data.image ?? null,
      data.imageAlt ?? null,
      data.author ?? "Pemerintah Desa Sidoharjo",
      content.trim(),
    ];
    const escaped = values.map((v) => mysql.escape(v)).join(", ");
    lines.push(
      "INSERT IGNORE INTO berita " +
        "(slug, title, date, category, excerpt, image, image_alt, author, body) " +
        `VALUES (${escaped});`,
    );
  }

  await fs.writeFile(OUT_FILE, lines.join("\n") + "\n", "utf8");
  console.log(
    `✓ SQL ditulis ke ${path.relative(process.cwd(), OUT_FILE)} (${files.length} berita).`,
  );
}

build().catch((err) => {
  console.error("Gagal membuat SQL:", err.message);
  process.exitCode = 1;
});
