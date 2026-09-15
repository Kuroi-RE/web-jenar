import Link from "next/link";
import { notFound } from "next/navigation";
import { BeritaForm } from "@/components/admin/BeritaForm";
import { updateBeritaAction } from "@/lib/admin/berita-actions";
import { getBeritaSource } from "@/lib/berita";

export const dynamic = "force-dynamic";

export default async function BeritaEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const berita = await getBeritaSource(slug);

  if (!berita) {
    notFound();
  }

  return (
    <div className="max-w-5xl">
      <Link
        href="/admin/berita"
        className="text-sm font-medium text-ink-soft transition hover:text-primary-700 dark:hover:text-primary-300"
      >
        ← Kembali ke daftar berita
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">
        Ubah Berita
      </h1>
      <p className="mt-1 text-ink-soft">Perbarui informasi dan isi berita.</p>

      <div className="mt-6 rounded-2xl border border-black/5 bg-surface p-6 shadow-soft dark:border-white/10 sm:p-8">
        <BeritaForm
          mode="edit"
          action={updateBeritaAction}
          values={{
            slug: berita.slug,
            title: berita.title,
            date: berita.date,
            category: berita.category,
            excerpt: berita.excerpt,
            image: berita.image,
            imageAlt: berita.imageAlt,
            author: berita.author,
            body: berita.body,
          }}
        />
      </div>
    </div>
  );
}
