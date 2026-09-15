import Image from "next/image";
import Link from "next/link";
import { initials } from "@/lib/content/perangkat";
import { getSettings } from "@/lib/store";

export async function Perangkat() {
  const { perangkat, site } = await getSettings();
  return (
    <section
      id="perangkat"
      className="relative overflow-hidden bg-surface py-20 lg:py-28"
    >
      {/* Decorative soft background */}
      <div className="pointer-events-none absolute -left-32 bottom-10 -z-0 size-96 rounded-full bg-primary-50 blur-3xl dark:bg-primary-900/30" />

      <div className="container-desa relative">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Struktur Organisasi</span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            Penjabat {site.name}
          </h2>
          <p className="mt-4 text-ink-soft">
            Aparatur pemerintah yang melayani masyarakat dengan amanah,
            profesional, dan bertanggung jawab.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {perangkat.map((person, i) => {
            const hasName = Boolean(person.name);
            return (
              <div
                key={`${person.position}-${i}`}
                className={`group flex flex-col items-center rounded-2xl border bg-surface-muted p-6 text-center shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-card ${
                  person.featured
                    ? "border-accent-300 dark:border-accent-900/60"
                    : "border-black/5 dark:border-white/10"
                }`}
              >
                {/* Avatar */}
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

                {/* Name */}
                <h3 className="mt-5 text-lg font-bold text-ink">
                  {hasName ? (
                    person.name
                  ) : (
                    <span className="text-ink-soft">Nama menyusul</span>
                  )}
                </h3>

                {/* Position */}
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

        {/* Footer action */}
        <div className="mt-12 text-center">
          <Link href="/profil/struktur-organisasi" className="btn-primary">
            Lihat Struktur Lengkap
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
          </Link>
        </div>
      </div>
    </section>
  );
}
