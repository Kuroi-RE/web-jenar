import { PerangkatForm } from "@/components/admin/PerangkatForm";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PerangkatAdminPage() {
  const { perangkat } = await getSettings();
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Perangkat Desa
      </h1>
      <p className="mt-1 text-ink-soft">
        Kelola susunan perangkat desa (beranda &amp; halaman struktur
        organisasi).
      </p>
      <div className="mt-6">
        <PerangkatForm perangkat={perangkat} />
      </div>
    </div>
  );
}
