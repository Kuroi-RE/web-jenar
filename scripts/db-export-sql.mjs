// Hasilkan file SQL (skema + seed lengkap) untuk diimpor manual via phpMyAdmin.
// Tidak butuh koneksi database — membaca lib/content/* dan content/berita/*.md.
// Jalankan: npm run db:export-sql  → menghasilkan scripts/init.sql
//
// Kompatibel MySQL 5.7 (tanpa row alias `AS new`, tanpa DEFAULT pada JSON).
//
// Kredensial admin seed dapat diatur lewat env:
//   SEED_ADMIN_USERNAME / SEED_ADMIN_PASSWORD           (peran "admin")
//   SEED_SUPERADMIN_USERNAME / SEED_SUPERADMIN_PASSWORD (peran "superadmin")
import { promises as fs } from "node:fs";
import path from "node:path";
import mysql from "mysql2";
import matter from "gray-matter";
import { defaultSettings } from "../lib/content/defaults.ts";
import { hashPassword } from "../lib/password.ts";

const BERITA_DIR = path.join(process.cwd(), "content", "berita");
const OUT_FILE = path.join(process.cwd(), "scripts", "init.sql");

const ADMIN_ACCOUNTS = [
  {
    username: process.env.SEED_ADMIN_USERNAME || "admin",
    password: process.env.SEED_ADMIN_PASSWORD || "admin123",
    role: "admin",
  },
  {
    username: process.env.SEED_SUPERADMIN_USERNAME || "superadmin",
    password: process.env.SEED_SUPERADMIN_PASSWORD || "superadmin123",
    role: "superadmin",
  },
];

const SCHEMA = `
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY,
  data JSON NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE IF NOT EXISTS admin_credentials (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_admin_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`.trim();

// Migrasi aditif untuk database yang dibuat versi lama (sebelum multi-akun).
// `CREATE TABLE IF NOT EXISTS` tidak mengubah tabel yang sudah ada, sehingga
// tanpa blok ini impor akan gagal: "Unknown column 'role' in 'field list'".
// MySQL 5.7 tak punya `ADD COLUMN IF NOT EXISTS`, jadi dipakai prepared
// statement bersyarat lewat information_schema. Semuanya idempoten.
const MIGRATIONS = [
  {
    label: "kolom `role`",
    check: `SELECT COUNT(*) FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'admin_credentials'
        AND COLUMN_NAME = 'role'`,
    apply:
      "ALTER TABLE admin_credentials ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT ''admin''",
  },
  {
    label: "`id` AUTO_INCREMENT",
    check: `SELECT COUNT(*) FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'admin_credentials'
        AND COLUMN_NAME = 'id' AND EXTRA LIKE '%auto_increment%'`,
    apply: "ALTER TABLE admin_credentials MODIFY id INT NOT NULL AUTO_INCREMENT",
  },
  {
    label: "indeks unik username",
    check: `SELECT COUNT(*) FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'admin_credentials'
        AND INDEX_NAME = 'uniq_admin_username'`,
    apply:
      "ALTER TABLE admin_credentials ADD UNIQUE KEY uniq_admin_username (username)",
  },
];

function migrationSql() {
  const out = [];
  for (const m of MIGRATIONS) {
    const check = m.check.replace(/\s+/g, " ").trim();
    out.push(`-- Migrasi: ${m.label} (dilewati bila sudah ada).`);
    out.push(
      `SET @m := (${check.replace("SELECT COUNT(*)", `SELECT IF(COUNT(*) = 0, '${m.apply}', 'DO 0')`)});`,
    );
    out.push("PREPARE s FROM @m; EXECUTE s; DEALLOCATE PREPARE s;");
    out.push("");
  }
  return out.join("\n").trim();
}

function toIso(value) {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

async function build() {
  const lines = [];
  lines.push(
    "-- Inisialisasi database Website Kecamatan (impor via phpMyAdmin).",
  );
  lines.push("-- Dihasilkan otomatis oleh scripts/db-export-sql.mjs.");
  lines.push("-- Target: MySQL 5.7+ / MariaDB 10.2+ (utf8mb4).");
  lines.push("-- Pilih database tujuan lebih dulu, lalu Import file ini.");
  lines.push(
    "-- Semua seed memakai INSERT IGNORE: aman diimpor ulang, data yang sudah",
  );
  lines.push("-- diubah lewat panel admin tidak akan tertimpa.");
  lines.push("");
  lines.push("SET NAMES utf8mb4;");
  lines.push("");
  lines.push("-- =========== SKEMA ===========");
  lines.push(SCHEMA);
  lines.push("");
  lines.push("-- =========== MIGRASI (database versi lama) ===========");
  lines.push(migrationSql());
  lines.push("");

  // ---- Seed pengaturan situs (seluruh konten yang editable via panel) ----
  lines.push("-- =========== SEED PENGATURAN SITUS ===========");
  lines.push(
    "-- Isi lengkap: identitas, jam pelayanan, tautan, Tentang, Hero, Layanan,",
  );
  lines.push(
    "-- Penjabat, Statistik, Profil (visi/misi/nilai/tupoksi), PPID, Produk",
  );
  lines.push("-- Hukum, Galeri, dan detail halaman Layanan.");
  lines.push(
    "INSERT IGNORE INTO site_settings (id, data) VALUES (1, " +
      `${mysql.escape(JSON.stringify(defaultSettings))});`,
  );
  lines.push("");

  // ---- Seed kredensial admin ----
  lines.push("-- =========== SEED AKUN ADMIN ===========");
  lines.push(
    "-- Dua akun: operator (admin) dan pengembang (superadmin). Bedanya hanya",
  );
  lines.push(
    "-- superadmin boleh mengatur ulang kata sandi akun lain di menu Akun Admin.",
  );
  lines.push(
    "-- PENTING: segera ganti kedua kata sandi lewat panel setelah login.",
  );
  lines.push("-- Kata sandi disimpan sebagai hash scrypt, bukan plaintext.");
  for (const acc of ADMIN_ACCOUNTS) {
    lines.push(`-- ${acc.role}: ${acc.username} / ${acc.password}`);
    lines.push(
      "INSERT IGNORE INTO admin_credentials (username, password_hash, role) VALUES (" +
        `${mysql.escape(acc.username)}, ${mysql.escape(hashPassword(acc.password))}, ` +
        `${mysql.escape(acc.role)});`,
    );
  }
  lines.push("");

  // ---- Seed berita ----
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
      data.author ?? "Pemerintah Kecamatan Jenar",
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
    `✓ SQL ditulis ke ${path.relative(process.cwd(), OUT_FILE)} ` +
      `(pengaturan situs + ${ADMIN_ACCOUNTS.length} akun admin + ${files.length} berita).`,
  );
}

build().catch((err) => {
  console.error("Gagal membuat SQL:", err.message);
  process.exitCode = 1;
});
