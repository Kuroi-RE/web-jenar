import { AkunForm } from "@/components/admin/AkunForm";
import { getCurrentUsername } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AkunPage() {
  const username = await getCurrentUsername();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Akun Admin
      </h1>
      <p className="mt-1 text-ink-soft">
        Ubah username dan kata sandi untuk masuk ke panel admin. Setelah
        disimpan, kredensial baru langsung berlaku untuk login berikutnya.
      </p>

      <div className="mt-6">
        <AkunForm username={username} />
      </div>
    </div>
  );
}
