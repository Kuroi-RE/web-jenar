"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { MobileDrawer } from "./MobileDrawer";
import { SmartLink } from "./SmartLink";
import { dropdowns, simpleLinks } from "@/lib/content/nav";
import type { SiteSettings, ExternalLink } from "@/lib/store";

function HouseLogo() {
  return (
    <svg
      className="size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 9.5V20h14V9.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 20v-5h5v5" />
    </svg>
  );
}

export function Navbar({
  site,
  externalLinks,
}: {
  site: SiteSettings;
  externalLinks: ExternalLink[];
}) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ============ TOP BAR (scrolls away) ============ */}
      <div className="hidden bg-primary-900 text-primary-50 lg:block">
        <div className="container-desa flex h-10 items-center justify-between text-xs">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-500/90 px-3 py-1 font-semibold text-accent-900">
            <span className="size-1.5 rounded-full bg-accent-900" />
            {site.slogan}
          </span>
          <div className="flex items-center gap-4">
            {externalLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                {link.label}
              </a>
            ))}
            {externalLinks.length > 0 && (
              <span className="text-primary-50/30">|</span>
            )}
            <Link href="/profil/demografi" className="hover:text-white">
              Statistik Desa
            </Link>
          </div>
        </div>
      </div>

      {/* ============ MAIN NAV (sticky) ============ */}
      <nav className="sticky top-0 z-50 border-b border-black/10 bg-surface/85 shadow-soft backdrop-blur-md dark:border-white/10">
        <div className="container-desa">
          <div className="flex h-18 items-center justify-between gap-4 py-3">
            {/* Logo / Brand */}
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-primary-700 text-white shadow-soft">
                <HouseLogo />
              </span>
              <span className="leading-tight">
                <span className="block text-base font-bold text-ink">
                  {site.name}
                </span>
                <span className="block text-xs text-ink-soft">
                  {site.tagline}
                </span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div
              className="hidden items-center gap-1 xl:flex"
              onMouseLeave={() => setOpenMenu(null)}
            >
              <Link
                href="/"
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink transition hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-white/10 dark:hover:text-primary-300"
              >
                Beranda
              </Link>

              {dropdowns.map((menu) => (
                <div
                  key={menu.key}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(menu.key)}
                >
                  <button className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink transition hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-white/10 dark:hover:text-primary-300">
                    {menu.label}
                    <svg
                      className={`size-4 transition ${
                        openMenu === menu.key ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m6 9 6 6 6-6"
                      />
                    </svg>
                  </button>
                  {openMenu === menu.key && (
                    <div className="absolute left-0 top-full w-72 rounded-xl border border-black/5 bg-surface p-2 shadow-card dark:border-white/10">
                      {menu.items.map((item) => (
                        <SmartLink
                          key={item.label}
                          href={item.href}
                          className="block rounded-lg px-3 py-2 text-sm text-ink-soft transition hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-white/10 dark:hover:text-primary-300"
                        >
                          {item.label}
                        </SmartLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {simpleLinks.map((link) => (
                <SmartLink
                  key={link.label}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-ink transition hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-white/10 dark:hover:text-primary-300"
                >
                  {link.label}
                </SmartLink>
              ))}
            </div>

            {/* Right cluster */}
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={site.links.aduan}
                className="btn-primary hidden sm:inline-flex"
              >
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h8M8 14h5m-9 6 3.5-3H18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14Z"
                  />
                </svg>
                Aduan Masyarakat
              </a>

              {/* Contact */}
              <div className="ml-1 hidden items-center gap-3 xl:flex">
                <span className="h-9 w-px bg-black/10 dark:bg-white/15" />
                <div className="flex flex-col gap-0.5 text-xs leading-tight">
                  <a
                    href={`mailto:${site.email}`}
                    className="inline-flex items-center gap-1.5 text-ink-soft transition hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    <svg
                      className="size-3.5 text-primary-600 dark:text-primary-400"
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
                    {site.email}
                  </a>
                  <a
                    href={`tel:${site.phoneIntl}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-ink transition hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    <svg
                      className="size-3.5 text-primary-600 dark:text-primary-400"
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
                </div>
              </div>

              <ThemeToggle />

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                className="grid size-10 place-items-center rounded-lg text-ink transition hover:bg-black/5 dark:hover:bg-white/10 xl:hidden"
                aria-label="Buka menu"
              >
                <svg
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        site={site}
      />
    </>
  );
}
