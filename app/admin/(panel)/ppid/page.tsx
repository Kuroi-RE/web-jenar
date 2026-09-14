import { PpidForm } from "@/components/admin/PpidForm";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PpidAdminPage() {
  const { ppid } = await getSettings();
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">PPID</h1>
      <p className="mt-1 text-ink-soft">
        Kelola informasi Pejabat Pengelola Informasi dan Dokumentasi.
      </p>
      <div className="mt-6">
        <PpidForm ppid={ppid} />
      </div>
    </div>
  );
}
