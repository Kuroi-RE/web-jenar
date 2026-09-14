import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/lib/content/site";
import { jenisProdukHukum } from "@/lib/content/produk-hukum";
import { getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Produk Hukum",
  description:
    "Kumpulan produk hukum desa: Peraturan Desa, Peraturan Kepala Desa, dan Keputusan Kepala Desa.",
  alternates: { canonical: "/produk-hukum" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Beranda", item: site.url },
    {
      "@type": "ListItem",
      position: 2,
      name: "Produk Hukum",
      item: `${site.url}/produk-hukum`,
    },
  ],
};

export default async function ProdukHukumPage() {
  const { produkHukum } = await getSettings();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Dokumen"
        title="Produk Hukum Desa"
        description="Peraturan dan keputusan resmi yang menjadi landasan penyelenggaraan pemerintahan desa."
        breadcrumb={[{ label: "Produk Hukum" }]}
      />

      <section className="bg-surface py-16 lg:py-24">
        <div className="container-desa space-y-14">
          {jenisProdukHukum.map((jenis) => {
            const daftar = produkHukum.filter((p) => p.jenis === jenis);
            if (daftar.length === 0) return null;

            return (
              <div key={jenis}>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                    {jenis}
                  </h2>
                  <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                    {daftar.length} dokumen
                  </span>
                </div>

                <ul className="mt-6 space-y-3">
                  {daftar.map((produk, idx) => (
                    <li
                      key={`${produk.jenis}-${produk.nomor}-${produk.tahun}-${idx}`}
                      className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-surface-muted p-5 shadow-soft transition hover:shadow-card dark:border-white/10 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                          <svg
                            className="size-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12h6m-6 4h4m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.6a1 1 0 0 1 .7.3l5.4 5.4a1 1 0 0 1 .3.7V19a2 2 0 0 1-2 2Z"
                            />
                          </svg>
                        </span>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                            {produk.jenis} No. {produk.nomor} Tahun{" "}
                            {produk.tahun}
                          </p>
                          <p className="mt-1 font-semibold text-ink">
                            {produk.tentang}
                          </p>
                        </div>
                      </div>

                      {produk.href ? (
                        <a
                          href={produk.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary shrink-0 self-start sm:self-auto"
                        >
                          Unduh
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
                              d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                            />
                          </svg>
                        </a>
                      ) : (
                        <span className="shrink-0 self-start rounded-lg bg-black/5 px-3 py-1.5 text-xs font-medium text-ink-soft dark:bg-white/10 sm:self-auto">
                          Dokumen menyusul
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <p className="text-center text-sm text-ink-soft">
            Daftar produk hukum bersifat contoh dan akan diperbarui dengan
            dokumen resmi pemerintah desa.
          </p>
        </div>
      </section>
    </>
  );
}
