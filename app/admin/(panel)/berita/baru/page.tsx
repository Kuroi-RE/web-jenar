import Link from "next/link";
import { BeritaForm } from "@/components/admin/BeritaForm";
import { createBeritaAction } from "@/lib/admin/berita-actions";

export const dynamic = "force-dynamic";

export default function BeritaBaruPage() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="max-w-5xl">
      <Link
        href="/admin/berita"
        className="text-sm font-medium text-ink-soft transition hover:text-primary-700 dark:hover:text-primary-300"
      >
        ← Kembali ke daftar berita
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">
        Berita Baru
      </h1>
      <p className="mt-1 text-ink-soft">
        Isi formulir berikut untuk menerbitkan berita baru.
      </p>

      <div className="mt-6 rounded-2xl border border-black/5 bg-surface p-6 shadow-soft dark:border-white/10 sm:p-8">
        <BeritaForm
          mode="create"
          action={createBeritaAction}
          values={{ date: today }}
        />
      </div>
    </div>
  );
}
