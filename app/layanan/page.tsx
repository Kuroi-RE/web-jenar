import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "Layanan Publik",
  description:
    "Informasi layanan publik desa: SOP pelayanan administrasi, jenis pelayanan dan persyaratan, maklumat pelayanan, serta pengadaan barang dan jasa.",
  alternates: { canonical: "/layanan" },
};

function buildJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Layanan Publik",
        item: `${siteUrl}/layanan`,
      },
    ],
  };
}

const daftarSeksi = [
  { href: "#sop", label: "SOP Pelayanan" },
  { href: "#persyaratan", label: "Pelayanan & Persyaratan" },
  { href: "#maklumat", label: "Maklumat Pelayanan" },
  { href: "#pengadaan", label: "Pengadaan Barang & Jasa" },
];

export default async function LayananPage() {
  const { site, layananDetail } = await getSettings();
  const {
    sop: sopLangkah,
    persyaratan: persyaratanLayanan,
    maklumat: maklumatPelayanan,
    maklumatPoin,
    pengadaanPoin,
  } = layananDetail;
  const jsonLd = buildJsonLd(site.url);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Layanan Publik"
        title="Layanan Publik Desa"
        description="Layanan administrasi desa diselenggarakan secara mudah, cepat, dan tanpa biaya."
        breadcrumb={[{ label: "Layanan Publik" }]}
      />

      {/* Navigasi seksi */}
      <div className="sticky top-0 z-30 border-b border-black/5 bg-surface/90 backdrop-blur dark:border-white/10">
        <div className="container-desa flex flex-wrap gap-2 py-3">
          {daftarSeksi.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="rounded-full bg-surface-muted px-4 py-1.5 text-sm font-medium text-ink-soft transition hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-white/10 dark:hover:text-primary-300"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* SOP */}
      <section id="sop" className="scroll-mt-20 bg-surface py-16 lg:py-24">
        <div className="container-desa">
          <span className="eyebrow">Prosedur</span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            SOP Pelayanan Administrasi
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Alur standar pelayanan administrasi bagi masyarakat desa.
          </p>

          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {sopLangkah.map((langkah, i) => (
              <li
                key={langkah.judul}
                className="relative rounded-2xl border border-black/5 bg-surface-muted p-5 shadow-soft dark:border-white/10"
              >
                <span className="grid size-10 place-items-center rounded-full bg-primary-700 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-bold text-ink">
                  {langkah.judul}
                </h3>
                <p className="mt-1.5 text-sm text-ink-soft">
                  {langkah.deskripsi}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Persyaratan */}
      <section
        id="persyaratan"
        className="scroll-mt-20 bg-surface-muted py-16 lg:py-24"
      >
        <div className="container-desa">
          <span className="eyebrow">Persyaratan</span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Jenis Pelayanan & Persyaratan
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Berkas yang perlu disiapkan untuk setiap jenis layanan administrasi.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {persyaratanLayanan.map((layanan) => (
              <div
                key={layanan.nama}
                className="rounded-2xl border border-black/5 bg-surface p-6 shadow-soft dark:border-white/10"
              >
                <h3 className="text-base font-bold text-ink">{layanan.nama}</h3>
                <ul className="mt-4 space-y-2">
                  {layanan.berkas.map((berkas, i) => (
                    <li
                      key={i}
                      className="flex gap-2.5 text-sm text-ink-soft"
                    >
                      <svg
                        className="mt-0.5 size-4 shrink-0 text-primary-600 dark:text-primary-400"
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
                      <span>{berkas}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maklumat */}
      <section id="maklumat" className="scroll-mt-20 bg-surface py-16 lg:py-24">
        <div className="container-desa">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Komitmen</span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Maklumat Pelayanan
            </h2>
            <blockquote className="mt-8 rounded-3xl border border-primary-100 bg-primary-50 p-8 text-lg font-medium leading-relaxed text-primary-900 dark:border-primary-900/50 dark:bg-primary-900/20 dark:text-primary-100">
              &ldquo;{maklumatPelayanan}&rdquo;
            </blockquote>
          </div>

          <ul className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            {maklumatPoin.map((poin, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-2xl border border-black/5 bg-surface-muted p-5 text-sm text-ink-soft shadow-soft dark:border-white/10"
              >
                <svg
                  className="mt-0.5 size-5 shrink-0 text-accent-600 dark:text-accent-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <span>{poin}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pengadaan */}
      <section
        id="pengadaan"
        className="scroll-mt-20 bg-surface-muted py-16 lg:py-24"
      >
        <div className="container-desa">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <span className="eyebrow">Transparansi</span>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                Pengadaan Barang & Jasa
              </h2>
              <p className="mt-3 text-ink-soft">
                Pengelolaan pengadaan barang dan jasa di lingkungan pemerintah
                desa mengedepankan prinsip transparansi dan akuntabilitas.
              </p>
            </div>
            <ul className="space-y-4">
              {pengadaanPoin.map((poin, i) => (
                <li
                  key={i}
                  className="flex gap-4 rounded-2xl border border-black/5 bg-surface p-5 shadow-soft dark:border-white/10"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
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
                        d="M20 7 12 3 4 7m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </span>
                  <p className="text-sm text-ink-soft">{poin}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
