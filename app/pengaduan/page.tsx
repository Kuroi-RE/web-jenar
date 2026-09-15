import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { alurPengaduan } from "@/lib/content/pengaduan";
import { getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Layanan Pengaduan",
  description:
    "Layanan pengaduan masyarakat kecamatan. Sampaikan keluhan dan aspirasi terkait pelayanan publik melalui kanal resmi beserta alur penanganannya.",
  alternates: { canonical: "/pengaduan" },
};

const CHAT_ICON =
  "M8 10h8M8 14h5m-9 6 3.5-3H18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14Z";
const SHIELD_ICON =
  "M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z M9.5 12l1.8 1.8L15 10";
const PHONE_ICON =
  "M2.25 6.75c0 8.28 6.72 15 15 15h1.5a2.25 2.25 0 0 0 2.25-2.25v-1.37a1.5 1.5 0 0 0-1.14-1.46l-3.5-.88a1.5 1.5 0 0 0-1.54.6l-.7 1a11.3 11.3 0 0 1-5.1-5.1l1-.7a1.5 1.5 0 0 0 .6-1.54l-.88-3.5A1.5 1.5 0 0 0 6.87 3H5.5A2.25 2.25 0 0 0 3.25 5.25Z";

export default async function PengaduanPage() {
  const { site, externalLinks } = await getSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Layanan Pengaduan",
        item: `${site.url}/pengaduan`,
      },
    ],
  };

  const kanal: {
    nama: string;
    keterangan: string;
    href: string;
    iconPath: string;
    external?: boolean;
  }[] = [
    {
      nama: "Formulir Pengaduan Online",
      keterangan: "Sampaikan aduan Anda melalui formulir daring resmi kecamatan.",
      href: site.links.aduan || "#",
      external: true,
      iconPath: CHAT_ICON,
    },
    ...externalLinks.map((l) => ({
      nama: l.label,
      keterangan: `Akses ${l.label} secara daring.`,
      href: l.url,
      external: true,
      iconPath: SHIELD_ICON,
    })),
    {
      nama: "Datang Langsung / Telepon",
      keterangan: `Kunjungi kantor kecamatan pada jam pelayanan atau hubungi ${site.phone}.`,
      href: `tel:${site.phoneIntl}`,
      iconPath: PHONE_ICON,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Layanan Publik"
        title="Layanan Pengaduan Masyarakat"
        description="Suara Anda penting. Sampaikan keluhan, saran, dan aspirasi untuk pelayanan kecamatan yang lebih baik."
        breadcrumb={[{ label: "Layanan Pengaduan" }]}
      />

      {/* Kanal pengaduan */}
      <section className="bg-surface py-16 lg:py-24">
        <div className="container-desa">
          <span className="eyebrow">Kanal Pengaduan</span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Cara Menyampaikan Pengaduan
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Pilih kanal yang paling mudah bagi Anda. Seluruh aduan ditangani
            secara rahasia dan bertanggung jawab.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {kanal.map((kanal) => (
              <a
                key={kanal.nama}
                href={kanal.href}
                target={kanal.external ? "_blank" : undefined}
                rel={kanal.external ? "noopener noreferrer" : undefined}
                className="group flex flex-col rounded-2xl border border-black/5 bg-surface-muted p-6 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-card dark:border-white/10"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-primary-50 text-primary-700 transition group-hover:bg-primary-700 group-hover:text-white dark:bg-primary-900/40 dark:text-primary-300 dark:group-hover:bg-primary-600 dark:group-hover:text-white">
                  <svg
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={kanal.iconPath}
                    />
                  </svg>
                </span>
                <h3 className="mt-5 text-lg font-bold text-ink">{kanal.nama}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                  {kanal.keterangan}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 dark:text-primary-300">
                  Buka
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
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Alur pengaduan */}
      <section id="alur" className="scroll-mt-20 bg-surface-muted py-16 lg:py-24">
        <div className="container-desa">
          <span className="eyebrow">Alur</span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Alur Pengaduan Masyarakat
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Tahapan penanganan pengaduan dari penyampaian hingga penyelesaian.
          </p>

          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {alurPengaduan.map((alur, i) => (
              <li
                key={alur.judul}
                className="relative rounded-2xl border border-black/5 bg-surface p-6 shadow-soft dark:border-white/10"
              >
                <span className="grid size-10 place-items-center rounded-full bg-accent-500 text-sm font-bold text-accent-900">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-bold text-ink">
                  {alur.judul}
                </h3>
                <p className="mt-1.5 text-sm text-ink-soft">{alur.deskripsi}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl bg-primary-900 p-8 text-center dark:bg-primary-950 sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h3 className="text-lg font-bold text-white">
                Siap menyampaikan pengaduan?
              </h3>
              <p className="mt-1 text-sm text-primary-50/80">
                Gunakan formulir pengaduan online resmi pemerintah kecamatan.
              </p>
            </div>
            <a
              href={site.links.aduan}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent shrink-0"
            >
              Buat Pengaduan
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
                  d="M5 12h14m-6-6 6 6-6 6"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
