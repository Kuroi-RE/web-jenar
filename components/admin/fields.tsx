"use client";

export const inputClass =
  "mt-1.5 w-full rounded-lg border border-black/10 bg-surface px-3.5 py-2.5 text-ink outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-white/15";
export const labelClass = "block text-sm font-semibold text-ink";

export function Field({
  name,
  label,
  defaultValue,
  type = "text",
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string | number;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

export function Textarea({
  name,
  label,
  defaultValue,
  rows = 3,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className={inputClass}
      />
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/5 bg-surface p-6 shadow-soft dark:border-white/10">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
      <div className="mt-4 space-y-5">{children}</div>
    </section>
  );
}

export function FormStatus({
  state,
  successText,
}: {
  state: { error?: string; success?: boolean };
  successText: string;
}) {
  return (
    <>
      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300"
        >
          {state.error}
        </p>
      )}
      {state.success && (
        <p
          role="status"
          className="rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-medium text-primary-800 dark:border-primary-900/50 dark:bg-primary-900/20 dark:text-primary-200"
        >
          {successText}
        </p>
      )}
    </>
  );
}

export function SubmitBar({
  pending,
  label = "Simpan",
}: {
  pending: boolean;
  label?: string;
}) {
  return (
    <div className="sticky bottom-4 flex justify-end">
      <button
        type="submit"
        disabled={pending}
        className="btn-primary shadow-card disabled:opacity-60"
      >
        {pending ? "Menyimpan…" : label}
      </button>
    </div>
  );
}
