import { LayananForm } from "@/components/admin/LayananForm";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function LayananAdminPage() {
  const { layanan } = await getSettings();
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Layanan Unggulan
      </h1>
      <p className="mt-1 text-ink-soft">
        Kelola kartu layanan yang tampil di beranda.
      </p>
      <div className="mt-6">
        <LayananForm layanan={layanan} />
      </div>
    </div>
  );
}
