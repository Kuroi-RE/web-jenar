import Link from "next/link";
import Image from "next/image";
import { getBeritaTerbaru } from "@/lib/berita";
import { getSettings } from "@/lib/store";

const layananLinks = [
  { label: "SOP Pelayanan Administrasi", href: "/layanan#sop" },
  { label: "Pelayanan & Persyaratan", href: "/layanan#persyaratan" },
  { label: "Maklumat Pelayanan", href: "/layanan#maklumat" },
  { label: "Layanan Pengaduan", href: "/pengaduan" },
  { label: "Alur Pengaduan Masyarakat", href: "/pengaduan#alur" },
];

const socialIcons = [
  {
    label: "Facebook",
    key: "facebook" as const,
    path: "M13.5 9H16l.5-3h-3V4.2c0-.8.3-1.2 1.3-1.2H16.5V.2C16.1.1 15 0 13.9 0 11.4 0 9.8 1.5 9.8 4v2H7v3h2.8v9h3.7V9Z",
  },
  {
    label: "Instagram",
    key: "instagram" as const,
    path: "M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.2-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.9C2.3 4 3.9 2.4 7.1 2.3 8.4 2.2 8.8 2.2 12 2.2Zm0 4.6a5.2 5.2 0 1 0 0 10.4 5.2 5.2 0 0 0 0-10.4Zm0 8.6a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8Zm5.4-8.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z",
  },
  {
    label: "YouTube",
    key: "youtube" as const,
    path: "M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 3.9 12 3.9 12 3.9s-7.5 0-9.4.5A3 3 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.5.5-5.5s0-3.6-.5-5.5ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z",
  },
];

export async function Footer() {
  const [beritaTerbaru, settings] = await Promise.all([
    getBeritaTerbaru(3),
    getSettings(),
  ]);
  const site = settings.site;
  const socials = socialIcons.map((s) => ({ ...s, href: site.social[s.key] }));
  return (
    <footer className="bg-primary-950 text-primary-50/80">
      <div className="container-desa py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand + address */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logos/logo-sragen.png"
                alt={`Logo ${site.name}`}
                width={44}
                height={44}
                className="size-11 shrink-0 object-contain"
              />
              <div className="leading-tight">
                <p className="text-base font-bold text-white">{site.name}</p>
                <p className="text-xs text-primary-50/60">{site.tagline}</p>
              </div>
            </div>
            <p className="mt-5 flex items-start gap-3 text-sm leading-relaxed">
              <svg
                className="mt-0.5 size-5 shrink-0 text-accent-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z"
                />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {site.address}
            </p>
          </div>

          {/* Layanan */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Layanan
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {layananLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 transition hover:text-accent-300"
                  >
                    <span className="size-1 rounded-full bg-accent-400" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Berita terbaru */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Berita Terbaru
            </h3>
            <ul className="mt-4 space-y-4 text-sm">
              {beritaTerbaru.map((news) => (
                <li key={news.slug}>
                  <Link href={`/berita/${news.slug}`} className="group block">
                    <span className="line-clamp-2 transition group-hover:text-accent-300">
                      {news.title}
                    </span>
                    <span className="mt-1 block text-xs text-primary-50/50">
                      {news.dateDisplay}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak + social */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Kontak
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 transition hover:text-accent-300"
                >
                  <svg
                    className="size-4 text-accent-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0-.83.67-1.5 1.5-1.5h16.5c.83 0 1.5.67 1.5 1.5v10.5c0 .83-.67 1.5-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5V6.75Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m3 7 9 6 9-6"
                    />
                  </svg>
                  Email
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.phoneIntl}`}
                  className="inline-flex items-center gap-2 transition hover:text-accent-300"
                >
                  <svg
                    className="size-4 text-accent-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.28 6.72 15 15 15h2.25a1.5 1.5 0 0 0 1.5-1.5v-2.06a1.5 1.5 0 0 0-1.16-1.46l-3.06-.72a1.5 1.5 0 0 0-1.5.56l-.9 1.2a12 12 0 0 1-5.4-5.4l1.2-.9a1.5 1.5 0 0 0 .56-1.5l-.72-3.06A1.5 1.5 0 0 0 8.31 4.5H6.25a1.5 1.5 0 0 0-1.5 1.5Z"
                    />
                  </svg>
                  {site.phone}
                </a>
              </li>
            </ul>
            <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-white">
              Ikuti Kami
            </h3>
            <div className="mt-3 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-lg bg-white/10 text-white transition hover:bg-accent-500 hover:text-accent-900"
                >
                  <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-desa flex flex-col items-center justify-between gap-2 py-5 text-xs text-primary-50/60 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.legalName}. Seluruh hak cipta
            dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <p>{site.region}</p>
            <span className="hidden h-3 w-px bg-white/15 sm:block" />
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 font-medium transition hover:text-accent-300"
            >
              <svg
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M18 15l3-3m0 0-3-3m3 3H9"
                />
              </svg>
              Login Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
