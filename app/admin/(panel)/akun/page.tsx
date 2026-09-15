import { AkunForm } from "@/components/admin/AkunForm";
import { ResetAkunForm } from "@/components/admin/ResetAkunForm";
import { requireAuth } from "@/lib/auth";
import { listAdmins } from "@/lib/credentials";

export const dynamic = "force-dynamic";

export default async function AkunPage() {
  const session = await requireAuth();

  // Daftar akun hanya diperlukan superadmin (untuk mengatur ulang akun lain).
  let others: { username: string; role: string }[] = [];
  if (session.role === "superadmin") {
    try {
      others = (await listAdmins())
        .filter((a) => a.username !== session.username)
        .map((a) => ({ username: a.username, role: a.role }));
    } catch {
      others = [];
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        Akun Admin
      </h1>
      <p className="mt-1 text-ink-soft">
        Ubah username dan kata sandi untuk masuk ke panel admin. Setelah
        disimpan, kredensial baru langsung berlaku untuk login berikutnya.
      </p>
      <p className="mt-2 text-sm text-ink-soft">
        Anda masuk sebagai{" "}
        <span className="font-semibold text-ink">{session.username}</span>{" "}
        <span
          className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
            session.role === "superadmin"
              ? "bg-accent-100 text-accent-900 dark:bg-accent-900/40 dark:text-accent-200"
              : "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
          }`}
        >
          {session.role}
        </span>
      </p>

      <div className="mt-6">
        <AkunForm username={session.username} />
      </div>

      {session.role === "superadmin" && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-ink">Kelola Akun Lain</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Sebagai <strong>superadmin</strong>, Anda dapat mengatur ulang kata
            sandi akun admin lain — misalnya bila operator lupa kata sandinya.
          </p>
          <div className="mt-4">
            <ResetAkunForm accounts={others} />
          </div>
        </div>
      )}
    </div>
  );
}
