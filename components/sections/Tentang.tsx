import { getSettings } from "@/lib/store";

export async function Tentang() {
  const { tentang, jamPelayanan, site } = await getSettings();
  const quickFacts = tentang.quickFacts;
  return (
    <section
      id="tentang"
      className="relative overflow-hidden bg-surface py-20 lg:py-28"
    >
      {/* Decorative soft background */}
      <div className="pointer-events-none absolute -left-32 top-10 -z-0 size-96 rounded-full bg-primary-50 blur-3xl dark:bg-primary-900/30" />

      <div className="container-desa relative">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* ==== Tentang Kami (text) ==== */}
          <div className="lg:col-span-7">
            <span className="eyebrow">Tentang Kami</span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
              Mengenal {site.name}
            </h2>

            <div className="mt-5 space-y-4 leading-relaxed text-ink-soft">
              <p>{tentang.paragraf1}</p>
              <p>{tentang.paragraf2}</p>
            </div>

            {/* Quick facts */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {quickFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-2xl border border-black/5 bg-surface-muted p-4 dark:border-white/10"
                >
                  <p className="text-2xl font-extrabold text-primary-700 dark:text-primary-300">
                    {fact.value}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">{fact.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a href="/profil/visi-misi" className="btn-primary">
                Profil Selengkapnya
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
              </a>
            </div>
          </div>

          {/* ==== Waktu Pelayanan (card) ==== */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-3xl bg-primary-900 text-primary-50 shadow-card">
              <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
                <span className="grid size-11 place-items-center rounded-xl bg-accent-500 text-accent-900">
                  <svg
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 7v5l3 2"
                    />
                  </svg>
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Waktu Pelayanan
                  </h3>
                  <p className="text-xs text-primary-50/70">
                    Kantor {site.name}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-white/10 px-6">
                {jamPelayanan.map((row) => (
                  <div
                    key={row.day}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div>
                      <p className="font-semibold text-white">{row.day}</p>
                      {row.rest && (
                        <p className="mt-0.5 text-xs text-primary-50/60">
                          {row.rest}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 rounded-lg bg-white/10 px-3 py-1 text-sm font-semibold text-accent-300">
                      {row.time}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-accent-500/90 px-6 py-3 text-sm font-semibold text-accent-900">
                <span className="size-1.5 rounded-full bg-accent-900" />
                Seluruh pelayanan umum tidak dipungut biaya (Gratis)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
