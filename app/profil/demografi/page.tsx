import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { formatAngka } from "@/lib/content/statistik";
import { site } from "@/lib/content/site";
import { getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Demografi",
  description:
    "Data demografi dan kependudukan desa: jumlah penduduk, komposisi laki-laki dan perempuan.",
  alternates: { canonical: "/profil/demografi" },
};

const cardsMeta = [
  {
    key: "total" as const,
    label: "Total Penduduk",
    caption: "Jiwa terdaftar",
    tone: "primary" as const,
    iconPath:
      "M17 20h5v-1a4 4 0 0 0-3-3.87M9 20H4v-1a4 4 0 0 1 3-3.87m10-4.13a3 3 0 1 0-4-4M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm3 9a3 3 0 0 0-6 0v0",
  },
  {
    key: "laki" as const,
    label: "Laki-laki",
    caption: "Penduduk laki-laki",
    tone: "primary" as const,
    iconPath:
      "M10 20a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM14.25 9.75 21 3M16 3h5v5",
  },
  {
    key: "perempuan" as const,
    label: "Perempuan",
    caption: "Penduduk perempuan",
    tone: "accent" as const,
    iconPath: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM12 15v6M9 18h6",
  },
];

function formatPersen(value: number): string {
  return value.toLocaleString("id-ID", { maximumFractionDigits: 1 });
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Beranda", item: site.url },
    {
      "@type": "ListItem",
      position: 2,
      name: "Profil",
      item: `${site.url}/profil/demografi`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Demografi",
      item: `${site.url}/profil/demografi`,
    },
  ],
};

export default async function DemografiPage() {
  const { statistik } = await getSettings();
  const { total, laki, perempuan } = statistik;
  const values: Record<string, number> = { total, laki, perempuan };
  const persenLaki = total ? (laki / total) * 100 : 0;
  const persenPerempuan = total ? (perempuan / total) * 100 : 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Profil Desa"
        title="Demografi"
        description="Gambaran kependudukan desa berdasarkan data terkini."
        breadcrumb={[{ label: "Profil" }, { label: "Demografi" }]}
      />

      <section className="bg-surface py-16 lg:py-24">
        <div className="container-desa">
          {/* Kartu statistik */}
          <div className="grid gap-5 sm:grid-cols-3">
            {cardsMeta.map((kartu) => (
              <div
                key={kartu.key}
                className="rounded-2xl border border-black/5 bg-surface-muted p-6 shadow-soft dark:border-white/10"
              >
                <span
                  className={`grid size-11 place-items-center rounded-xl ${
                    kartu.tone === "accent"
                      ? "bg-accent-50 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300"
                      : "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
                  }`}
                >
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
                      d={kartu.iconPath}
                    />
                  </svg>
                </span>
                <p className="mt-4 text-3xl font-extrabold tracking-tight text-ink">
                  {formatAngka(values[kartu.key])}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">
                  {kartu.label}
                </p>
                <p className="text-xs text-ink-soft">{kartu.caption}</p>
              </div>
            ))}
          </div>

          {/* Distribusi jenis kelamin */}
          <div className="mt-8 rounded-2xl border border-black/5 bg-surface-muted p-6 shadow-soft dark:border-white/10 lg:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink">
                Komposisi Jenis Kelamin
              </h2>
              <span className="text-sm text-ink-soft">
                Total {formatAngka(total)} jiwa
              </span>
            </div>

            <div
              className="mt-5 flex h-5 w-full overflow-hidden rounded-full"
              role="img"
              aria-label={`Laki-laki ${formatPersen(
                persenLaki,
              )} persen, Perempuan ${formatPersen(persenPerempuan)} persen`}
            >
              <div
                className="flex h-full items-center justify-center bg-primary-600 text-xs font-semibold text-white dark:bg-primary-500"
                style={{ width: `${persenLaki}%` }}
              >
                {formatPersen(persenLaki)}%
              </div>
              <div
                className="flex h-full items-center justify-center bg-accent-500 text-xs font-semibold text-accent-900"
                style={{ width: `${persenPerempuan}%` }}
              >
                {formatPersen(persenPerempuan)}%
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-surface p-4 dark:bg-white/5">
                <span className="size-3 rounded-full bg-primary-600 dark:bg-primary-500" />
                <span className="text-sm text-ink-soft">
                  Laki-laki:{" "}
                  <span className="font-bold text-ink">
                    {formatAngka(laki)}
                  </span>{" "}
                  jiwa
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-surface p-4 dark:bg-white/5">
                <span className="size-3 rounded-full bg-accent-500" />
                <span className="text-sm text-ink-soft">
                  Perempuan:{" "}
                  <span className="font-bold text-ink">
                    {formatAngka(perempuan)}
                  </span>{" "}
                  jiwa
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
