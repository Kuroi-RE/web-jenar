import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type SmartLinkProps = { href: string } & Omit<
  ComponentPropsWithoutRef<"a">,
  "href"
>;

/**
 * Merender <Link> (next/link) untuk rute internal (diawali "/") dan <a> biasa
 * untuk tautan eksternal (http), anchor ("#"), atau mailto/tel.
 */
export function SmartLink({ href, children, ...props }: SmartLinkProps) {
  const isInternal = href.startsWith("/");

  if (isInternal) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
