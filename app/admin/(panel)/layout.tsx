import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return <AdminShell>{children}</AdminShell>;
}
