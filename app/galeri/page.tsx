import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/lib/content/site";
import { getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Galeri dokumentasi kegiatan, pelayanan, dan momen penting di desa.",
  alternates: { canonical: "/galeri" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Beranda", item: site.url },
    {
      "@type": "ListItem",
      position: 2,
      name: "Galeri",
      item: `${site.url}/galeri`,
    },
  ],
};

export default async function GaleriPage() {
  const { galeri: galeriItems } = await getSettings();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Dokumentasi"
        title="Galeri Desa"
        description="Kumpulan dokumentasi kegiatan dan pelayanan desa."
        breadcrumb={[{ label: "Galeri" }]}
      />

      <section className="bg-surface py-16 lg:py-24">
        <div className="container-desa">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galeriItems.map((item, i) => (
              <figure
                key={`${item.judul}-${i}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/5 shadow-soft dark:border-white/10"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-300 motion-safe:group-hover:scale-105"
                />
                {/* Overlay caption */}
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4">
                  {item.kategori && (
                    <span className="inline-flex rounded-md bg-accent-500 px-2 py-0.5 text-xs font-semibold text-accent-900">
                      {item.kategori}
                    </span>
                  )}
                  <p className="mt-1.5 font-semibold text-white">
                    {item.judul}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-12 text-center text-sm text-ink-soft">
            Dokumentasi akan diperbarui dengan foto kegiatan terbaru desa.
          </p>
        </div>
      </section>
    </>
  );
}
