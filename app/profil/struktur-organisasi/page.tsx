import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { initials } from "@/lib/content/perangkat";
import { site } from "@/lib/content/site";
import { getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Struktur Organisasi",
  description:
    "Struktur organisasi dan susunan perangkat Pemerintah Desa.",
  alternates: { canonical: "/profil/struktur-organisasi" },
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
      item: `${site.url}/profil/struktur-organisasi`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Struktur Organisasi",
      item: `${site.url}/profil/struktur-organisasi`,
    },
  ],
};

export default async function StrukturOrganisasiPage() {
  const { perangkat } = await getSettings();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Profil Desa"
        title="Struktur Organisasi"
        description="Susunan aparatur pemerintah desa yang melayani masyarakat."
        breadcrumb={[{ label: "Profil" }, { label: "Struktur Organisasi" }]}
      />

      <section className="bg-surface py-16 lg:py-24">
        <div className="container-desa">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {perangkat.map((person, i) => {
              const hasName = Boolean(person.name);
              return (
                <div
                  key={`${person.position}-${i}`}
                  className={`flex flex-col items-center rounded-2xl border bg-surface-muted p-6 text-center shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-card ${
                    person.featured
                      ? "border-accent-300 dark:border-accent-900/60"
                      : "border-black/5 dark:border-white/10"
                  }`}
                >
                  <div
                    className={`relative grid size-24 place-items-center overflow-hidden rounded-full ring-4 ${
                      person.featured
                        ? "ring-accent-200 dark:ring-accent-900/50"
                        : "ring-primary-50 dark:ring-primary-900/40"
                    }`}
                  >
                    {person.photo ? (
                      <Image
                        src={person.photo}
                        alt={person.name || person.position}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : hasName ? (
                      <span className="flex size-full items-center justify-center bg-primary-100 text-xl font-extrabold text-primary-700 dark:bg-primary-900/50 dark:text-primary-200">
                        {initials(person.name)}
                      </span>
                    ) : (
                      <span className="flex size-full items-center justify-center bg-surface text-ink-soft dark:bg-white/5">
                        <svg
                          className="size-10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5Z"
                          />
                        </svg>
                      </span>
                    )}
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-ink">
                    {hasName ? (
                      person.name
                    ) : (
                      <span className="text-ink-soft">Nama menyusul</span>
                    )}
                  </h2>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      person.featured
                        ? "text-accent-700 dark:text-accent-300"
                        : "text-primary-700 dark:text-primary-300"
                    }`}
                  >
                    {person.position}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-10 text-center text-sm text-ink-soft">
            Data perangkat desa akan diperbarui sesuai keputusan resmi
            pemerintah desa.
          </p>
        </div>
      </section>
    </>
  );
}
