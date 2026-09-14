import Link from "next/link";
import { getAllBerita } from "@/lib/berita";
import { deleteBeritaAction } from "@/lib/admin/berita-actions";
import { DeleteBeritaButton } from "@/components/admin/DeleteBeritaButton";

export const dynamic = "force-dynamic";

export default async function AdminBeritaPage() {
  const berita = await getAllBerita();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            Berita
          </h1>
          <p className="mt-1 text-ink-soft">
            {berita.length} berita dipublikasikan.
          </p>
        </div>
        <Link href="/admin/berita/baru" className="btn-primary">
          + Berita Baru
        </Link>
      </div>

      {berita.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-black/15 bg-surface p-10 text-center text-ink-soft dark:border-white/15">
          Belum ada berita. Klik <strong>Berita Baru</strong> untuk membuat.
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {berita.map((news) => (
            <li
              key={news.slug}
              className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-surface p-4 shadow-soft dark:border-white/10 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                    {news.category}
                  </span>
                  <span className="text-xs text-ink-soft">
                    {news.dateDisplay}
                  </span>
                </div>
                <p className="mt-1 truncate font-semibold text-ink">
                  {news.title}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/berita/${news.slug}`}
                  target="_blank"
                  className="rounded-lg border border-black/10 px-3 py-1.5 text-sm font-medium text-ink-soft transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                >
                  Lihat
                </Link>
                <Link
                  href={`/admin/berita/${news.slug}`}
                  className="rounded-lg border border-black/10 px-3 py-1.5 text-sm font-semibold text-ink transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                >
                  Ubah
                </Link>
                <DeleteBeritaButton
                  slug={news.slug}
                  title={news.title}
                  action={deleteBeritaAction}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
