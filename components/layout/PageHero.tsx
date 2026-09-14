import Link from "next/link";

export type Crumb = { label: string; href?: string };

type PageHeroProps = {
  title: string;
  description?: string;
  /** Breadcrumb tanpa item "Beranda" (ditambah otomatis di awal). */
  breadcrumb?: Crumb[];
  /** Label eyebrow kecil di atas judul. */
  eyebrow?: string;
};

export function PageHero({
  title,
  description,
  breadcrumb = [],
  eyebrow,
}: PageHeroProps) {
  const crumbs: Crumb[] = [{ label: "Beranda", href: "/" }, ...breadcrumb];

  return (
    <section className="relative overflow-hidden bg-primary-900 dark:bg-primary-950">
      {/* Dekorasi latar */}
      <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary-700/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/4 size-80 rounded-full bg-accent-500/10 blur-3xl" />

      <div className="container-desa relative py-14 lg:py-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-primary-100/80">
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="transition hover:text-accent-300"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className={isLast ? "font-semibold text-white" : undefined}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && (
                    <svg
                      className="size-3.5 text-primary-100/40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 6l6 6-6 6"
                      />
                    </svg>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {eyebrow && (
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-300 backdrop-blur">
            {eyebrow}
          </span>
        )}

        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {description && (
          <p className="mt-4 max-w-2xl text-primary-50/80">{description}</p>
        )}
      </div>
    </section>
  );
}
