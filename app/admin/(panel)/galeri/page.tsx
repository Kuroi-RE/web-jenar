import { GaleriForm } from "@/components/admin/GaleriForm";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function GaleriAdminPage() {
  const { galeri } = await getSettings();
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">Galeri</h1>
      <p className="mt-1 text-ink-soft">Kelola foto dokumentasi kegiatan kecamatan.</p>
      <div className="mt-6">
        <GaleriForm galeri={galeri} />
      </div>
    </div>
  );
}
