import { ProfilForm } from "@/components/admin/ProfilForm";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ProfilAdminPage() {
  const { profil } = await getSettings();
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">Profil</h1>
      <p className="mt-1 text-ink-soft">
        Kelola Visi &amp; Misi, Nilai Pelayanan, dan Tugas Pokok &amp; Fungsi.
      </p>
      <div className="mt-6">
        <ProfilForm profil={profil} />
      </div>
    </div>
  );
}
