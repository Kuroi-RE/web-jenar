import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/lib/content/site";
import { getAllBerita } from "@/lib/berita";

export const metadata: Metadata = {
  title: "Berita Desa",
  description:
    "Kumpulan berita, pengumuman, dan informasi kegiatan terkini pemerintah desa.",
  alternates: { canonical: "/berita" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Beranda", item: site.url },
    {
      "@type": "ListItem",
      position: 2,
      name: "Berita Desa",
      item: `${site.url}/berita`,
    },
  ],
};

export default async function BeritaPage() {
  const berita = await getAllBerita();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Kabar Desa"
        title="Berita Desa"
        description="Informasi kegiatan, pengumuman, dan perkembangan terkini seputar desa."
        breadcrumb={[{ label: "Berita" }]}
      />

      <section className="bg-surface py-16 lg:py-24">
        <div className="container-desa">
          {berita.length === 0 ? (
            <p className="text-center text-ink-soft">
              Belum ada berita yang dipublikasikan.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {berita.map((news) => (
                <article
                  key={news.slug}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-surface-muted shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-card dark:border-white/10"
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
                    <span className="absolute left-3 top-3 rounded-lg bg-primary-700/95 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                      {news.category}
                    </span>
                  </Link>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft">
                      <svg
                        className="size-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 2v3m8-3v3M3.5 9h17M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                        />
                      </svg>
                      {news.dateDisplay}
                    </p>

                    <h2 className="mt-3 text-lg font-bold leading-snug text-ink">
                      <Link
                        href={`/berita/${news.slug}`}
                        className="transition group-hover:text-primary-700 dark:group-hover:text-primary-300"
                      >
                        {news.title}
                      </Link>
                    </h2>

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
                        aria-hidden="true"
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
          )}
        </div>
      </section>
    </>
  );
}
