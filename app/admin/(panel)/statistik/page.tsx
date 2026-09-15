import { StatistikForm } from "@/components/admin/StatistikForm";
import { getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function StatistikAdminPage() {
  const { statistik } = await getSettings();
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Statistik &amp; Peta
      </h1>
      <p className="mt-1 text-ink-soft">
        Kelola data kependudukan dan lokasi peta kecamatan.
      </p>
      <div className="mt-6">
        <StatistikForm statistik={statistik} />
      </div>
    </div>
  );
}
