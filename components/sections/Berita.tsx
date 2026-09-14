import Image from "next/image";
import Link from "next/link";
import { getBeritaTerbaru } from "@/lib/berita";
import { getSettings } from "@/lib/store";

export async function Berita() {
  const [berita, { site }] = await Promise.all([
    getBeritaTerbaru(3),
    getSettings(),
  ]);

  if (berita.length === 0) return null;

  return (
    <section id="berita" className="relative bg-surface-muted py-20 lg:py-28">
      <div className="container-desa">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">Kabar Desa</span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
              Berita Terbaru
            </h2>
            <p className="mt-4 text-ink-soft">
              Informasi kegiatan, pengumuman, dan perkembangan terkini seputar
              Pemerintah {site.name}.
            </p>
          </div>

          <Link
            href="/berita"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary-700 transition hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200"
          >
            Semua Berita
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14m-6-6 6 6-6 6"
              />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {berita.map((news) => (
            <article
              key={news.slug}
              className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-surface shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-card dark:border-white/10"
            >
              <Link
                href={`/berita/${news.slug}`}
                className="relative block aspect-[16/10] overflow-hidden"
              >
                {news.image ? (
                  <Image
                    src={news.image}
                    alt={news.imageAlt ?? news.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-300 motion-safe:group-hover:scale-105"
                  />
                ) : (
                  <div className="size-full bg-primary-100 dark:bg-primary-900/40" />
                )}
                {news.category && (
                  <span className="absolute left-3 top-3 rounded-lg bg-primary-700/95 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                    {news.category}
                  </span>
                )}
              </Link>

              <div className="flex flex-1 flex-col p-6">
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
                  <svg
                    className="size-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 2v3m8-3v3M3.5 9h17M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                    />
                  </svg>
                  {news.dateDisplay}
                </p>

                <h3 className="mt-3 text-lg font-bold leading-snug text-ink">
                  <Link
                    href={`/berita/${news.slug}`}
                    className="transition group-hover:text-primary-700 dark:group-hover:text-primary-300"
                  >
                    {news.title}
                  </Link>
                </h3>

                {news.excerpt && (
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-soft">
                    {news.excerpt}
                  </p>
                )}

                <Link
                  href={`/berita/${news.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 dark:text-primary-300"
                >
                  Baca Selengkapnya
                  <svg
                    className="size-4 transition group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14m-6-6 6 6-6 6"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
