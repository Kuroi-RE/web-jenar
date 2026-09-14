"use client";

type Props = {
  slug: string;
  title: string;
  action: (formData: FormData) => Promise<void>;
};

export function DeleteBeritaButton({ slug, title, action }: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (
          !window.confirm(
            `Hapus berita "${title}"? Tindakan ini tidak dapat dibatalkan.`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
      >
        Hapus
      </button>
    </form>
  );
}
