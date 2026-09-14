import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/lib/content/site";
import { getSettings } from "@/lib/store";

export const metadata: Metadata = {
  title: "PPID",
  description:
    "Pejabat Pengelola Informasi dan Dokumentasi (PPID) desa: profil, struktur, tugas dan fungsi, dasar hukum, serta klasifikasi informasi publik.",
  alternates: { canonical: "/ppid" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Beranda", item: site.url },
    { "@type": "ListItem", position: 2, name: "PPID", item: `${site.url}/ppid` },
  ],
};

const daftarSeksi = [
  { href: "#profil", label: "Profil PPID" },
  { href: "#struktur", label: "Struktur PPID" },
  { href: "#tugas", label: "Tugas & Fungsi" },
  { href: "#dasar-hukum", label: "Dasar Hukum" },
  { href: "#data", label: "Data & Informasi" },
];

export default async function PpidPage() {
  const { ppid, site } = await getSettings();
  const {
    profil: ppidProfil,
    struktur: ppidStruktur,
    tugas: ppidTugas,
    dasarHukum: ppidDasarHukum,
    dataInformasi: ppidDataInformasi,
  } = ppid;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow="Keterbukaan Informasi"
        title={`PPID ${site.name}`}
        description="Pejabat Pengelola Informasi dan Dokumentasi — mewujudkan pemerintahan desa yang terbuka dan akuntabel."
        breadcrumb={[{ label: "PPID" }]}
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

      {/* Profil PPID */}
      <section id="profil" className="scroll-mt-20 bg-surface py-16 lg:py-24">
        <div className="container-desa max-w-3xl">
          <span className="eyebrow">Profil</span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Profil PPID
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            {ppidProfil}
          </p>
        </div>
      </section>

      {/* Struktur PPID */}
      <section
        id="struktur"
        className="scroll-mt-20 bg-surface-muted py-16 lg:py-24"
      >
        <div className="container-desa">
          <span className="eyebrow">Organisasi</span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Struktur PPID
          </h2>
          <ul className="mt-8 space-y-4">
            {ppidStruktur.map((item, i) => (
              <li
                key={`${item.jabatan}-${i}`}
                className="flex items-start gap-4 rounded-2xl border border-black/5 bg-surface p-5 shadow-soft dark:border-white/10"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-700 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold text-ink">{item.jabatan}</p>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    {item.keterangan}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tugas & Fungsi */}
      <section id="tugas" className="scroll-mt-20 bg-surface py-16 lg:py-24">
        <div className="container-desa">
          <span className="eyebrow">Tugas & Fungsi</span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Tugas & Fungsi PPID
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {ppidTugas.map((tugas, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-2xl border border-black/5 bg-surface-muted p-5 text-sm text-ink-soft shadow-soft dark:border-white/10"
              >
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
        </div>
      </section>

      {/* Dasar Hukum */}
      <section
        id="dasar-hukum"
        className="scroll-mt-20 bg-surface-muted py-16 lg:py-24"
      >
        <div className="container-desa max-w-3xl">
          <span className="eyebrow">Landasan</span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Dasar Hukum
          </h2>
          <ol className="mt-8 space-y-3">
            {ppidDasarHukum.map((dasar, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-2xl border border-black/5 bg-surface p-5 text-sm text-ink-soft shadow-soft dark:border-white/10"
              >
                <span className="font-bold text-primary-700 dark:text-primary-300">
                  {i + 1}.
                </span>
                <span>{dasar}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Data & Informasi Publik */}
      <section id="data" className="scroll-mt-20 bg-surface py-16 lg:py-24">
        <div className="container-desa">
          <span className="eyebrow">Klasifikasi</span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Data & Informasi Publik
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Klasifikasi informasi publik yang dikelola PPID {site.name}.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {ppidDataInformasi.map((kategori, i) => (
              <div
                key={`${kategori.judul}-${i}`}
                className="rounded-2xl border border-black/5 bg-surface-muted p-6 shadow-soft dark:border-white/10"
              >
                <h3 className="text-lg font-bold text-ink">{kategori.judul}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {kategori.deskripsi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
