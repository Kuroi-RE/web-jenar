import { SakipForm } from "@/components/admin/SakipForm";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function SakipAdminPage() {
  const { sakip } = await getSettings();
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Dokumen SAKIP
      </h1>
      <p className="mt-1 text-ink-soft">
        Kelola dokumen Sistem Akuntabilitas Kinerja Instansi Pemerintah (SAKIP).
      </p>
      <div className="mt-6">
        <SakipForm sakip={sakip} />
      </div>
    </div>
  );
}
