"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { mobileGroups, simpleLinks } from "@/lib/content/nav";
import { SmartLink } from "./SmartLink";
import type { SiteSettings } from "@/lib/store";

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      className={`size-4 transition ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function MobileDrawer({
  open,
  onClose,
  site,
}: {
  open: boolean;
  onClose: () => void;
  site: SiteSettings;
}) {
  const [mounted, setMounted] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    // Mounted guard: portal & theme must only render client-side to avoid
    // hydration mismatch. This is the documented pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Kunci scroll body saat drawer terbuka.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!mounted) return null;

  // Portal ke <body> — menghindari containing-block dari nav ber-backdrop-blur.
  return createPortal(
    <div
      className={`fixed inset-0 z-[60] xl:hidden ${
        open ? "" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`absolute right-0 top-0 flex h-full w-80 max-w-[85%] flex-col bg-surface shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4 dark:border-white/10">
          <span className="font-bold text-ink">Menu</span>
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-lg text-ink hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Tutup menu"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <Link
            href="/"
            onClick={onClose}
            className="block rounded-lg px-3 py-2.5 font-medium text-ink hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-white/10 dark:hover:text-primary-300"
          >
            Beranda
          </Link>

          {mobileGroups.map((group) => {
            const isOpen = openGroup === group.key;
            return (
              <div
                key={group.key}
                className="border-b border-black/5 pb-1 dark:border-white/10"
              >
                <button
                  onClick={() => setOpenGroup(isOpen ? null : group.key)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 font-medium text-ink hover:bg-primary-50 dark:hover:bg-white/10"
                >
                  {group.label}
                  <ChevronDown open={isOpen} />
                </button>
                {isOpen && (
                  <div className="space-y-0.5 pl-3">
                    {group.items.map((item) => (
                      <SmartLink
                        key={item.label}
                        href={item.href}
                        onClick={onClose}
                        className="block rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-white/10 dark:hover:text-primary-300"
                      >
                        {item.label}
                      </SmartLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {simpleLinks.map((link) => (
            <SmartLink
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="block rounded-lg px-3 py-2.5 font-medium text-ink hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-white/10 dark:hover:text-primary-300"
            >
              {link.label}
            </SmartLink>
          ))}
        </nav>

        {/* Kontak + CTA */}
        <div className="space-y-3 border-t border-black/5 p-4 dark:border-white/10">
          <div className="space-y-1.5 text-sm">
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-2 text-ink-soft hover:text-primary-700 dark:hover:text-primary-300"
            >
              <svg
                className="size-4 text-primary-600 dark:text-primary-400"
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
              className="flex items-center gap-2 font-semibold text-ink hover:text-primary-700 dark:hover:text-primary-300"
            >
              <svg
                className="size-4 text-primary-600 dark:text-primary-400"
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
          <a href={site.links.aduan} className="btn-primary w-full">
            Aduan Masyarakat
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
