"use client";

import { useRef, useState } from "react";

let globalUid = 0;

type Slot<T> = { key: number; item: T };

/**
 * Daftar baris form yang dapat ditambah/dihapus secara dinamis.
 *
 * - `initialItems`: data awal tiap baris (dipakai sebagai `defaultValue`).
 * - `emptyItem`: nilai baris kosong saat menambah baris baru.
 * - `renderItem`: merender field untuk satu baris. **Gunakan `index`** untuk
 *   nama field (mis. `title_${index}`) agar server action membaca berurutan.
 *
 * Catatan: input di dalam baris bersifat *uncontrolled* (pakai `defaultValue`).
 * Karena setiap baris memiliki `key` stabil, nilai yang sudah diketik tetap
 * terjaga ketika baris lain ditamb/dihapus; hanya atribut `name` yang
 * di-reindeks mengikuti posisi baris.
 */
export function RepeatableRows<T>({
  initialItems,
  emptyItem,
  min = 0,
  max = 50,
  addLabel,
  renderItem,
}: {
  initialItems: T[];
  emptyItem: T;
  min?: number;
  max?: number;
  addLabel: string;
  renderItem: (args: {
    item: T;
    index: number;
    remove: () => void;
    canRemove: boolean;
  }) => React.ReactNode;
}) {
  const [slots, setSlots] = useState<Slot<T>[]>(() => {
    const base = initialItems.length > 0 ? initialItems : min > 0 ? [emptyItem] : [];
    return base.map((item) => ({ key: globalUid++, item }));
  });
  // Simpan referensi emptyItem stabil.
  const emptyRef = useRef(emptyItem);

  const add = () =>
    setSlots((s) =>
      s.length >= max ? s : [...s, { key: globalUid++, item: emptyRef.current }],
    );

  const remove = (key: number) =>
    setSlots((s) => (s.length <= min ? s : s.filter((x) => x.key !== key)));

  const canRemove = slots.length > min;

  return (
    <div className="space-y-4">
      {slots.map((slot, index) => (
        <div key={slot.key}>
          {renderItem({
            item: slot.item,
            index,
            remove: () => remove(slot.key),
            canRemove,
          })}
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        disabled={slots.length >= max}
        className="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3.5 py-2 text-sm font-semibold text-primary-800 transition hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-primary-900/50 dark:bg-primary-900/20 dark:text-primary-200 dark:hover:bg-primary-900/40"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        {addLabel}
      </button>
    </div>
  );
}

/** Tombol hapus baris standar (dipakai di dalam `renderItem`). */
export function RemoveRowButton({
  onClick,
  disabled,
  label = "Hapus",
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-semibold text-ink-soft transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/15 dark:hover:border-red-900/60"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
      </svg>
      {label}
    </button>
  );
}
