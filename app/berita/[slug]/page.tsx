import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/lib/content/site";
import { jsonLdString } from "@/lib/jsonld";
import { getSettings } from "@/lib/store";
import {
  getBeritaBySlug,
  getBeritaSlugs,
  getBeritaTerbaru,
} from "@/lib/berita";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getBeritaSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const berita = await getBeritaBySlug(slug);

  if (!berita) {
    return { title: "Berita Tidak Ditemukan" };
  }

  const url = `${site.url}/berita/${berita.slug}`;
  return {
    title: berita.title,
    description: berita.excerpt,
    alternates: { canonical: `/berita/${berita.slug}` },
    openGraph: {
      type: "article",
      title: berita.title,
      description: berita.excerpt,
      url,
      publishedTime: berita.date,
      authors: [berita.author],
      images: berita.image ? [{ url: berita.image }] : undefined,
    },
  };
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const berita = await getBeritaBySlug(slug);

  if (!berita) {
    notFound();
  }

  const { site: siteS } = await getSettings();

  const lainnya = (await getBeritaTerbaru(4)).filter(
    (b) => b.slug !== berita.slug,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: berita.title,
    description: berita.excerpt,
    datePublished: berita.date,
    dateModified: berita.date,
    image: berita.image ? [`${siteS.url}${berita.image}`] : undefined,
    author: { "@type": "Organization", name: berita.author },
    publisher: {
      "@type": "GovernmentOrganization",
      name: siteS.legalName,
      url: siteS.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteS.url}/berita/${berita.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />

      <PageHero
        eyebrow={berita.category}
        title={berita.title}
        breadcrumb={[
          { label: "Berita", href: "/berita" },
          { label: berita.title },
        ]}
      />

      <article className="bg-surface py-16 lg:py-24">
        <div className="container-desa max-w-3xl">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <svg
                className="size-4"
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
              {berita.dateDisplay}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5Z"
                />
              </svg>
              {berita.author}
            </span>
          </div>

          {/* Cover */}
          {berita.image && (
            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-black/5 dark:border-white/10">
              <Image
                src={berita.image}
                alt={berita.imageAlt ?? berita.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Isi artikel */}
          <div
            className="prose-desa mt-8"
            dangerouslySetInnerHTML={{ __html: berita.contentHtml }}
          />

          {/* Kembali */}
          <div className="mt-12 border-t border-black/5 pt-8 dark:border-white/10">
            <Link
              href="/berita"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 transition hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200"
            >
              <svg
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 12H5m6-6-6 6 6 6"
                />
              </svg>
              Kembali ke Berita
            </Link>
          </div>
        </div>
      </article>

      {/* Berita lainnya */}
      {lainnya.length > 0 && (
        <section className="bg-surface-muted py-16 lg:py-20">
          <div className="container-desa">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">
              Berita Lainnya
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {lainnya.slice(0, 3).map((news) => (
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
                    <span className="absolute left-3 top-3 rounded-lg bg-primary-700/95 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                      {news.category}
                    </span>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-medium text-ink-soft">
                      {news.dateDisplay}
                    </p>
                    <h3 className="mt-2 text-base font-bold leading-snug text-ink">
                      <Link
                        href={`/berita/${news.slug}`}
                        className="transition group-hover:text-primary-700 dark:group-hover:text-primary-300"
                      >
                        {news.title}
                      </Link>
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
