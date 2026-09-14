import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/lib/content/site";
import { getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Tugas Pokok & Fungsi",
  description:
    "Tugas pokok dan fungsi perangkat Pemerintah Desa sesuai Permendagri No. 84 Tahun 2015 tentang Susunan Organisasi dan Tata Kerja Pemerintah Desa.",
  alternates: { canonical: "/profil/tugas-pokok-fungsi" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Beranda", item: site.url },
    {
      "@type": "ListItem",
      position: 2,
      name: "Profil",
      item: `${site.url}/profil/tugas-pokok-fungsi`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Tugas Pokok & Fungsi",
      item: `${site.url}/profil/tugas-pokok-fungsi`,
    },
  ],
};

export default async function TupoksiPage() {
  const { profil } = await getSettings();
  const tugasPokokFungsi = profil.tupoksi;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Profil Desa"
        title="Tugas Pokok & Fungsi"
        description="Uraian tugas pokok dan fungsi masing-masing perangkat pemerintah desa."
        breadcrumb={[{ label: "Profil" }, { label: "Tugas Pokok & Fungsi" }]}
      />

      <section className="bg-surface py-16 lg:py-24">
        <div className="container-desa">
          <div className="grid gap-6 lg:grid-cols-2">
            {tugasPokokFungsi.map((item, idx) => (
              <article
                key={`${item.jabatan}-${idx}`}
                className="flex flex-col rounded-2xl border border-black/5 bg-surface-muted p-6 shadow-soft dark:border-white/10 lg:p-8"
              >
                <h2 className="text-xl font-bold text-ink">{item.jabatan}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {item.ringkasan}
                </p>
                <ul className="mt-5 space-y-3">
                  {item.tugas.map((tugas, i) => (
                    <li key={i} className="flex gap-3 text-sm text-ink-soft">
                      <svg
                        className="mt-0.5 size-5 shrink-0 text-primary-600 dark:text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m5 13 4 4L19 7"
                        />
                      </svg>
                      <span>{tugas}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-ink-soft">
            Uraian tugas mengacu pada Peraturan Menteri Dalam Negeri Nomor 84
            Tahun 2015 dan dapat disesuaikan dengan Peraturan Desa yang berlaku.
          </p>
        </div>
      </section>
    </>
  );
}
