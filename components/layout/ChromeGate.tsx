"use client";

import { usePathname } from "next/navigation";

/**
 * Menyembunyikan chrome publik (Navbar/Footer) pada rute admin (`/admin/*`)
 * sehingga panel admin tampil penuh tanpa header/footer situs.
 */
export function ChromeGate({
  navbar,
  footer,
  children,
}: {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary-700 focus:px-4 focus:py-2 focus:text-white"
      >
        Lewati ke konten utama
      </a>
      {navbar}
      <main id="main-content">{children}</main>
      {footer}
    </>
  );
}
