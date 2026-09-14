import { HeroForm } from "@/components/admin/HeroForm";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HeroAdminPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Hero (Beranda)
      </h1>
      <p className="mt-1 text-ink-soft">
        Ubah teks dan slide gambar pada bagian atas halaman beranda.
      </p>

      <div className="mt-6">
        <HeroForm hero={settings.hero} villageName={settings.site.name} />
      </div>
    </div>
  );
}
