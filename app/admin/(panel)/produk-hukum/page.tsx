import { ProdukHukumForm } from "@/components/admin/ProdukHukumForm";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ProdukHukumAdminPage() {
  const { produkHukum } = await getSettings();
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Produk Hukum
      </h1>
      <p className="mt-1 text-ink-soft">
        Kelola daftar Peraturan Desa, Peraturan Kepala Desa, dan Keputusan.
      </p>
      <div className="mt-6">
        <ProdukHukumForm produkHukum={produkHukum} />
      </div>
    </div>
  );
}
