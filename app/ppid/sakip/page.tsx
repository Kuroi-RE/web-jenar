import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/lib/content/site";
import { getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Dokumen SAKIP",
  description:
    "Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP) Kecamatan Jenar: kumpulan dokumen perencanaan, pengukuran, dan pelaporan kinerja.",
  alternates: { canonical: "/ppid/sakip" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Beranda", item: site.url },
    {
      "@type": "ListItem",
      position: 2,
      name: "PPID",
      item: `${site.url}/ppid`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "SAKIP",
      item: `${site.url}/ppid/sakip`,
    },
  ],
};

export default async function SakipPage() {
  const { sakip } = await getSettings();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Keterbukaan Informasi"
        title="Dokumen SAKIP"
        description="Sistem Akuntabilitas Kinerja Instansi Pemerintah — publikasi dokumen perencanaan, pengukuran, dan pelaporan kinerja kecamatan secara transparan dan akuntabel."
        breadcrumb={[{ label: "PPID", href: "/ppid" }, { label: "SAKIP" }]}
      />

      <section className="bg-surface py-16 lg:py-24">
        <div className="container-desa space-y-10">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                Daftar Dokumen SAKIP
              </h2>
              <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                {sakip.length} dokumen
              </span>
            </div>

            {sakip.length > 0 ? (
              <ul className="mt-6 space-y-3">
                {sakip.map((dok, idx) => (
                  <li
                    key={`${dok.nama}-${idx}`}
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
                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                          />
                        </svg>
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                          Dokumen Akuntabilitas
                        </p>
                        <p className="mt-1 font-semibold text-ink">
                          {dok.nama}
                        </p>
                      </div>
                    </div>

                    {dok.href ? (
                      <a
                        href={dok.href}
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
            ) : (
              <div className="mt-6 rounded-2xl border border-black/5 bg-surface-muted p-8 text-center text-ink-soft dark:border-white/10">
                <svg
                  className="mx-auto size-12 text-ink-soft/60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
                <p className="mt-3 font-semibold text-ink">
                  Belum ada dokumen SAKIP
                </p>
                <p className="mt-1 text-sm">
                  Dokumen Sistem Akuntabilitas Kinerja Instansi Pemerintah akan
                  segera diperbarui.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
