import { formatAngka } from "@/lib/content/statistik";
import { getSettings } from "@/lib/store";

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

export async function Statistik() {
  const { statistik, site } = await getSettings();
  const { total, laki, perempuan, petaQuery } = statistik;

  const values: Record<string, number> = { total, laki, perempuan };
  const persenLaki = total ? (laki / total) * 100 : 0;
  const persenPerempuan = total ? (perempuan / total) * 100 : 0;
  const petaEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    petaQuery,
  )}&z=15&output=embed`;

  return (
    <section id="statistik" className="bg-surface-muted py-20 lg:py-28">
      <div className="container-desa">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Data Desa</span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            Statistik &amp; Peta Desa
          </h2>
          <p className="mt-4 text-ink-soft">
            Gambaran kependudukan serta lokasi Kantor Desa untuk memudahkan
            masyarakat mengakses layanan.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-10">
          {/* ==== Statistik ==== */}
          <div className="flex flex-col gap-6">
            <div className="grid gap-5 sm:grid-cols-3">
              {cardsMeta.map((kartu) => (
                <div
                  key={kartu.key}
                  className="rounded-2xl border border-black/5 bg-surface p-5 shadow-soft dark:border-white/10"
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
            <div className="rounded-2xl border border-black/5 bg-surface p-6 shadow-soft dark:border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-ink">
                  Distribusi Jenis Kelamin
                </h3>
                <span className="text-xs text-ink-soft">
                  Total {formatAngka(total)} jiwa
                </span>
              </div>

              <div
                className="mt-4 flex h-4 w-full overflow-hidden rounded-full"
                role="img"
                aria-label={`Laki-laki ${formatPersen(
                  persenLaki,
                )} persen, Perempuan ${formatPersen(persenPerempuan)} persen`}
              >
                <div
                  className="h-full bg-primary-600 dark:bg-primary-500"
                  style={{ width: `${persenLaki}%` }}
                />
                <div
                  className="h-full bg-accent-500"
                  style={{ width: `${persenPerempuan}%` }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-primary-600 dark:bg-primary-500" />
                  <span className="text-ink-soft">
                    Laki-laki{" "}
                    <span className="font-semibold text-ink">
                      {formatAngka(laki)}
                    </span>{" "}
                    ({formatPersen(persenLaki)}%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-accent-500" />
                  <span className="text-ink-soft">
                    Perempuan{" "}
                    <span className="font-semibold text-ink">
                      {formatAngka(perempuan)}
                    </span>{" "}
                    ({formatPersen(persenPerempuan)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ==== Peta ==== */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-surface shadow-card dark:border-white/10">
            <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:flex-1">
              <iframe
                title="Peta lokasi Kantor Desa"
                src={petaEmbedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 size-full border-0"
              />
            </div>
            <div className="flex items-start gap-3 border-t border-black/5 p-5 dark:border-white/10">
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                  />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">
                  Kantor {site.name}
                </p>
                <p className="mt-0.5 text-sm text-ink-soft">{site.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
