import { ApbdesForm } from "@/components/admin/ApbdesForm";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ApbdesAdminPage() {
  const { apbdes } = await getSettings();
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">APBDes</h1>
      <p className="mt-1 text-ink-soft">
        Kelola ringkasan anggaran dan rincian sumber pendapatan desa.
      </p>
      <div className="mt-6">
        <ApbdesForm apbdes={apbdes} />
      </div>
    </div>
  );
}
