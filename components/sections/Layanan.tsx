import { getSettings } from "@/lib/store";
import { SmartLink } from "@/components/layout/SmartLink";

export async function Layanan() {
  const { layanan, site } = await getSettings();
  return (
    <section id="layanan" className="relative bg-surface-muted py-20 lg:py-28">
      <div className="container-desa">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Layanan Publik</span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            Layanan Unggulan Kecamatan
          </h2>
          <p className="mt-4 text-ink-soft">
            Berbagai layanan administrasi dan informasi publik {site.name} yang
            dapat diakses warga dengan mudah, cepat, dan tanpa biaya.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {layanan.map((svc) => (
            <SmartLink
              key={svc.title}
              href={svc.href}
              className="group relative flex flex-col rounded-2xl border border-black/5 bg-surface p-6 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-card dark:border-white/10"
            >
              <span className="grid size-12 place-items-center rounded-xl bg-primary-50 text-primary-700 transition group-hover:bg-primary-700 group-hover:text-white dark:bg-primary-900/40 dark:text-primary-300 dark:group-hover:bg-primary-600 dark:group-hover:text-white">
                <svg
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={svc.icon}
                  />
                </svg>
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink">{svc.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                {svc.desc}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 dark:text-primary-300">
                Selengkapnya
                <svg
                  className="size-4 transition group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14m-6-6 6 6-6 6"
                  />
                </svg>
              </span>
            </SmartLink>
          ))}
        </div>

        {/* Footer action */}
        <div className="mt-12 text-center">
          <SmartLink href="/layanan" className="btn-primary">
            Lihat Semua Layanan
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14m-6-6 6 6-6 6"
              />
            </svg>
          </SmartLink>
        </div>
      </div>
    </section>
  );
}
