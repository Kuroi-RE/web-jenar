import { LayananDetailForm } from "@/components/admin/LayananDetailForm";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function LayananDetailAdminPage() {
  const { layananDetail } = await getSettings();
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Halaman Layanan Publik
      </h1>
      <p className="mt-1 text-ink-soft">
        Kelola isi halaman <code>/layanan</code>: SOP pelayanan, jenis pelayanan
        &amp; persyaratan, maklumat pelayanan, dan pengadaan barang &amp; jasa.
      </p>
      <div className="mt-6">
        <LayananDetailForm layananDetail={layananDetail} />
      </div>
    </div>
  );
}
