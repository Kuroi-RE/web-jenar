import { PengaturanForm } from "@/components/admin/PengaturanForm";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PengaturanPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Pengaturan Umum
      </h1>
      <p className="mt-1 text-ink-soft">
        Ubah identitas desa, kontak, tautan, media sosial, jam pelayanan, dan
        teks Tentang. Perubahan langsung tampil di seluruh situs.
      </p>

      <div className="mt-6">
        <PengaturanForm settings={settings} />
      </div>
    </div>
  );
}
