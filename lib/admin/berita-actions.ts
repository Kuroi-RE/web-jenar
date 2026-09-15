"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import {
  saveBerita,
  deleteBerita,
  beritaSlugExists,
  slugify,
  type BeritaInput,
} from "@/lib/berita";

export type BeritaFormState = { error?: string };

function parseForm(formData: FormData): BeritaInput {
  return {
    slug: (formData.get("slug") as string | null)?.trim() || undefined,
    title: String(formData.get("title") ?? "").trim(),
    date: String(formData.get("date") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim() || undefined,
    imageAlt: String(formData.get("imageAlt") ?? "").trim() || undefined,
    author:
      String(formData.get("author") ?? "").trim() || "Pemerintah Kecamatan Jenar",
    body: String(formData.get("body") ?? ""),
  };
}

function revalidateBerita(slug: string): void {
  revalidatePath("/");
  revalidatePath("/berita");
  revalidatePath(`/berita/${slug}`);
  revalidatePath("/sitemap.xml");
}

/** Buat berita baru (mode: slug diturunkan dari judul, harus unik). */
export async function createBeritaAction(
  _prev: BeritaFormState,
  formData: FormData,
): Promise<BeritaFormState> {
  await requireAuth();
  const input = parseForm(formData);

  if (!input.title || !input.date || !input.excerpt || !input.body.trim()) {
    return { error: "Judul, tanggal, ringkasan, dan isi wajib diisi." };
  }

  const slug = slugify(input.title);
  if (!slug) return { error: "Judul tidak dapat dijadikan slug yang valid." };
  if (await beritaSlugExists(slug)) {
    return {
      error: "Sudah ada berita dengan judul/slug serupa. Ubah judulnya.",
    };
  }

  let finalSlug: string;
  try {
    finalSlug = await saveBerita({ ...input, slug });
  } catch {
    return { error: "Gagal menyimpan berita." };
  }

  revalidateBerita(finalSlug);
  redirect("/admin/berita");
}

/** Perbarui berita yang ada (slug tetap, dari field tersembunyi). */
export async function updateBeritaAction(
  _prev: BeritaFormState,
  formData: FormData,
): Promise<BeritaFormState> {
  await requireAuth();
  const input = parseForm(formData);

  if (!input.slug) return { error: "Slug tidak ditemukan." };
  if (!input.title || !input.date || !input.excerpt || !input.body.trim()) {
    return { error: "Judul, tanggal, ringkasan, dan isi wajib diisi." };
  }

  let finalSlug: string;
  try {
    finalSlug = await saveBerita(input);
  } catch {
    return { error: "Gagal menyimpan berita." };
  }

  revalidateBerita(finalSlug);
  redirect("/admin/berita");
}

/** Hapus berita. */
export async function deleteBeritaAction(formData: FormData): Promise<void> {
  await requireAuth();
  const slug = String(formData.get("slug") ?? "").trim();
  if (slug) {
    await deleteBerita(slug);
    revalidateBerita(slug);
  }
  redirect("/admin/berita");
}
