"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/admin/auth-actions";

const navItems = [
  { href: "/admin", label: "Dasbor", exact: true },
  { href: "/admin/berita", label: "Berita" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/layanan", label: "Layanan" },
  { href: "/admin/layanan-detail", label: "Halaman Layanan" },
  { href: "/admin/perangkat", label: "Penjabat" },
  { href: "/admin/statistik", label: "Statistik" },
  { href: "/admin/profil", label: "Profil" },
  { href: "/admin/ppid", label: "PPID" },
  { href: "/admin/produk-hukum", label: "Produk Hukum" },
  { href: "/admin/galeri", label: "Galeri" },
  { href: "/admin/pengaturan", label: "Pengaturan Umum" },
  { href: "/admin/akun", label: "Akun Admin" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-surface-muted">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-surface/90 backdrop-blur dark:border-white/10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            {/*<span className="grid size-9 place-items-center rounded-lg bg-primary-700 text-white">
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10.5 12 3l9 7.5M5 9.5V20h14V9.5"
                />
              </svg>
            </span>*/}
            <span className="font-bold text-ink">Admin Management</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden text-sm font-medium text-ink-soft transition hover:text-primary-700 sm:inline dark:hover:text-primary-300"
            >
              Lihat Website
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-black/10 px-3 py-1.5 text-sm font-semibold text-ink transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row">
        {/* Sidebar */}
        <aside className="lg:w-56 lg:shrink-0">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                  isActive(item.href, item.exact)
                    ? "bg-primary-700 text-white"
                    : "text-ink-soft hover:bg-black/5 hover:text-ink dark:hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
