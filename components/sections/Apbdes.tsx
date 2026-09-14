import { formatRupiah, formatRupiahRingkas } from "@/lib/content/apbdes";
import { getSettings } from "@/lib/store";

export async function Apbdes() {
  const { apbdes } = await getSettings();
  const { tahun, pendapatan, belanja, rincian } = apbdes;
  const defisit = belanja - pendapatan;

  const summaryCards = [
    {
      key: "pendapatan",
      title: "Pendapatan Desa",
      amount: pendapatan,
      caption: "Total penerimaan tahun anggaran berjalan",
      path: "M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",
    },
    {
      key: "belanja",
      title: "Belanja Desa",
      amount: belanja,
      caption: "Total pengeluaran untuk program & operasional",
      path: "M12 21V9m0 0 4 4m-4-4-4 4M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2",
    },
  ];

  return (
    <section id="apbdes" className="relative overflow-hidden bg-surface py-20 lg:py-28">
      {/* Decorative soft background */}
      <div className="pointer-events-none absolute -right-32 top-16 -z-0 size-96 rounded-full bg-accent-100 blur-3xl dark:bg-accent-900/20" />

      <div className="container-desa relative">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Transparansi Anggaran</span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            APBDes Tahun {tahun}
          </h2>
          <p className="mt-4 text-ink-soft">
            Ringkasan Anggaran Pendapatan dan Belanja Desa sebagai wujud
            komitmen keterbukaan pengelolaan keuangan kepada masyarakat.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* ==== Kartu ringkasan ==== */}
          <div className="lg:col-span-5">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {summaryCards.map((card) => (
                <div
                  key={card.key}
                  className="rounded-2xl border border-black/5 bg-surface-muted p-6 shadow-soft dark:border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                      <svg
                        className="size-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d={card.path}
                        />
                      </svg>
                    </span>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                      {card.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                    {formatRupiah(card.amount)}
                  </p>
                  <p className="mt-2 text-sm text-ink-soft">{card.caption}</p>
                </div>
              ))}
            </div>

            {/* Catatan defisit/surplus */}
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-accent-200 bg-accent-50 p-5 dark:border-accent-900/50 dark:bg-accent-900/20">
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-accent-500 text-accent-900">
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
                  />
                </svg>
              </span>
              <p className="text-sm leading-relaxed text-ink-soft">
                Anggaran tahun {tahun} mengalami{" "}
                <span className="font-semibold text-ink">
                  {defisit >= 0 ? "defisit" : "surplus"}
                </span>{" "}
                sebesar{" "}
                <span className="font-semibold text-accent-700 dark:text-accent-300">
                  {formatRupiah(Math.abs(defisit))}
                </span>
                {defisit >= 0
                  ? " yang ditutup dari pembiayaan desa (SiLPA)."
                  : "."}
              </p>
            </div>
          </div>

          {/* ==== Rincian pendapatan (progress bars) ==== */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-black/5 bg-surface-muted p-6 shadow-card dark:border-white/10 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-ink">
                  Rincian Sumber Pendapatan
                </h3>
                <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                  TA {tahun}
                </span>
              </div>

              <ul className="mt-6 space-y-6">
                {rincian.map((post) => {
                  const percent =
                    pendapatan > 0 ? (post.amount / pendapatan) * 100 : 0;
                  return (
                    <li key={post.code}>
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-primary-700 px-2 py-0.5 text-xs font-bold text-white">
                            {post.code}
                          </span>
                          <span className="text-sm font-medium text-ink">
                            {post.label}
                          </span>
                        </div>
                        <span className="shrink-0 text-sm font-semibold text-ink">
                          {formatRupiahRingkas(post.amount)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <div
                          className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/10"
                          role="progressbar"
                          aria-label={`Proporsi ${post.label}`}
                          aria-valuenow={Math.round(percent)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="h-full rounded-full bg-primary-600 motion-safe:animate-fade-in dark:bg-primary-500"
                            style={{ width: `${Math.min(percent, 100)}%` }}
                          />
                        </div>
                        <span className="w-12 shrink-0 text-right text-xs font-semibold text-ink-soft">
                          {percent.toLocaleString("id-ID", {
                            maximumFractionDigits: 1,
                          })}
                          %
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 flex items-center justify-between gap-4 border-t border-black/5 pt-5 dark:border-white/10">
                <span className="text-sm font-semibold text-ink-soft">
                  Total Pendapatan
                </span>
                <span className="text-lg font-extrabold tracking-tight text-primary-700 dark:text-primary-300">
                  {formatRupiah(pendapatan)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
