import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/lib/content/site";
import { getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Visi & Misi",
  description:
    "Visi dan Misi Pemerintah Kecamatan dalam mewujudkan wilayah yang maju, mandiri, dan sejahtera melalui pelayanan publik yang prima dan transparan.",
  alternates: { canonical: "/profil/visi-misi" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Beranda", item: site.url },
    { "@type": "ListItem", position: 2, name: "Profil", item: `${site.url}/profil/visi-misi` },
    {
      "@type": "ListItem",
      position: 3,
      name: "Visi & Misi",
      item: `${site.url}/profil/visi-misi`,
    },
  ],
};

export default async function VisiMisiPage() {
  const { profil, site } = await getSettings();
  const { visi, misi, nilai } = profil;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Profil Kecamatan"
        title="Visi & Misi"
        description={`Arah dan komitmen Pemerintah ${site.name} dalam melayani serta membangun wilayah.`}
        breadcrumb={[{ label: "Profil" }, { label: "Visi & Misi" }]}
      />

      <section className="bg-surface py-16 lg:py-24">
        <div className="container-desa">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Visi */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 rounded-3xl border border-black/5 bg-primary-900 p-8 text-white shadow-card dark:border-white/10 dark:bg-primary-950">
                <span className="eyebrow bg-white/10 text-accent-300">Visi</span>
                <p className="mt-5 text-xl font-semibold leading-relaxed sm:text-2xl">
                  &ldquo;{visi}&rdquo;
                </p>
              </div>
            </div>

            {/* Misi */}
            <div className="lg:col-span-7">
              <span className="eyebrow">Misi</span>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                Langkah Mewujudkan Visi
              </h2>
              <ol className="mt-8 space-y-4">
                {misi.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-4 rounded-2xl border border-black/5 bg-surface-muted p-5 shadow-soft dark:border-white/10"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-700 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <p className="text-ink-soft">{item}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Nilai pelayanan */}
          <div className="mt-16 lg:mt-24">
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">Nilai Pelayanan</span>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                Prinsip yang Kami Pegang
              </h2>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {nilai.map((nilaiItem) => (
                <div
                  key={nilaiItem.title}
                  className="rounded-2xl border border-black/5 bg-surface-muted p-6 text-center shadow-soft dark:border-white/10"
                >
                  <span className="mx-auto grid size-12 place-items-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
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
                        d={nilaiItem.icon}
                      />
                    </svg>
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-ink">
                    {nilaiItem.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft">
                    {nilaiItem.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
