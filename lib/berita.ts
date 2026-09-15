import "server-only";
import { query, ensureSchema } from "@/lib/db";
import { renderMarkdown } from "@/lib/markdown";

export type BeritaMeta = {
  slug: string;
  title: string;
  /** Tanggal ISO (mis. "2026-06-13"). */
  date: string;
  /** Tanggal siap tampil (mis. "13 Juni 2026"). */
  dateDisplay: string;
  category: string;
  excerpt: string;
  image?: string;
  imageAlt?: string;
  author: string;
};

export type BeritaPost = BeritaMeta & {
  /** Isi artikel dalam bentuk HTML hasil render Markdown. */
  contentHtml: string;
};

export type BeritaInput = {
  slug?: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image?: string;
  imageAlt?: string;
  author: string;
  body: string;
};

type BeritaRow = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string | null;
  image_alt: string | null;
  author: string;
  body: string;
};

/** Format tanggal ISO ke gaya Indonesia panjang, mis. "13 Juni 2026". */
export function formatTanggal(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function rowToMeta(row: BeritaRow): BeritaMeta {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date,
    dateDisplay: formatTanggal(row.date),
    category: row.category,
    excerpt: row.excerpt,
    image: row.image ?? undefined,
    imageAlt: row.image_alt ?? undefined,
    author: row.author,
  };
}

const SELECT_COLS =
  "slug, title, date, category, excerpt, image, image_alt, author, body";

/** Metadata seluruh berita, terurut dari terbaru. Toleran bila DB tak tersedia. */
export async function getAllBerita(): Promise<BeritaMeta[]> {
  try {
    await ensureSchema();
    const rows = await query<BeritaRow>(
      `SELECT ${SELECT_COLS} FROM berita ORDER BY date DESC, title ASC`,
    );
    return rows.map(rowToMeta);
  } catch (err) {
    console.error("[berita] getAllBerita gagal:", err);
    return [];
  }
}

/** Ambil beberapa berita terbaru (default 3). */
export async function getBeritaTerbaru(limit = 3): Promise<BeritaMeta[]> {
  const all = await getAllBerita();
  return all.slice(0, limit);
}

/** Seluruh slug untuk generateStaticParams. */
export async function getBeritaSlugs(): Promise<string[]> {
  try {
    await ensureSchema();
    const rows = await query<{ slug: string }>("SELECT slug FROM berita");
    return rows.map((r) => r.slug);
  } catch (err) {
    console.error("[berita] getBeritaSlugs gagal:", err);
    return [];
  }
}

/** Satu berita lengkap dengan HTML isi; null bila tidak ada. */
export async function getBeritaBySlug(
  slug: string,
): Promise<BeritaPost | null> {
  try {
    await ensureSchema();
    const rows = await query<BeritaRow>(
      `SELECT ${SELECT_COLS} FROM berita WHERE slug = ?`,
      [slug],
    );
    const row = rows[0];
    if (!row) return null;
    const contentHtml = await renderMarkdown(row.body);
    return { ...rowToMeta(row), contentHtml };
  } catch (err) {
    console.error("[berita] getBeritaBySlug gagal:", err);
    return null;
  }
}

/** Berita beserta body Markdown mentah (untuk form edit). */
export async function getBeritaSource(
  slug: string,
): Promise<(BeritaMeta & { body: string }) | null> {
  try {
    await ensureSchema();
    const rows = await query<BeritaRow>(
      `SELECT ${SELECT_COLS} FROM berita WHERE slug = ?`,
      [slug],
    );
    const row = rows[0];
    if (!row) return null;
    return { ...rowToMeta(row), body: row.body };
  } catch (err) {
    console.error("[berita] getBeritaSource gagal:", err);
    return null;
  }
}

/** Ubah teks menjadi slug URL-aman (huruf kecil, tanda hubung). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function assertSafeSlug(slug: string): void {
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("Slug tidak valid.");
  }
}

/** Apakah slug sudah dipakai berita lain. */
export async function beritaSlugExists(slug: string): Promise<boolean> {
  await ensureSchema();
  const rows = await query<{ slug: string }>(
    "SELECT slug FROM berita WHERE slug = ?",
    [slug],
  );
  return rows.length > 0;
}

/** Buat/timpa berita (upsert). Mengembalikan slug final. */
export async function saveBerita(input: BeritaInput): Promise<string> {
  const slug = (input.slug?.trim() || slugify(input.title)).toLowerCase();
  assertSafeSlug(slug);

  await ensureSchema();
  await query(
    `INSERT INTO berita
       (slug, title, date, category, excerpt, image, image_alt, author, body)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       title = VALUES(title),
       date = VALUES(date),
       category = VALUES(category),
       excerpt = VALUES(excerpt),
       image = VALUES(image),
       image_alt = VALUES(image_alt),
       author = VALUES(author),
       body = VALUES(body)`,
    [
      slug,
      input.title.trim(),
      input.date,
      input.category.trim() || "Umum",
      input.excerpt.trim(),
      input.image?.trim() || null,
      input.imageAlt?.trim() || null,
      input.author.trim() || "Pemerintah Kecamatan Jenar",
      input.body.trim(),
    ],
  );
  return slug;
}

/** Hapus berita berdasarkan slug. */
export async function deleteBerita(slug: string): Promise<void> {
  assertSafeSlug(slug);
  await ensureSchema();
  await query("DELETE FROM berita WHERE slug = ?", [slug]);
}
