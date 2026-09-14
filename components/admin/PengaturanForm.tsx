"use client";

import { useActionState, useState } from "react";
import {
  saveSettingsAction,
  type SettingsFormState,
} from "@/lib/admin/settings-actions";
import type { Settings } from "@/lib/store";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-black/10 bg-surface px-3.5 py-2.5 text-ink outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-white/15";
const labelClass = "block text-sm font-semibold text-ink";

function Field({
  name,
  label,
  defaultValue,
  type = "text",
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string;
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/5 bg-surface p-6 shadow-soft dark:border-white/10">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <div className="mt-4 space-y-5">{children}</div>
    </section>
  );
}

export function PengaturanForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState<
    SettingsFormState,
    FormData
  >(saveSettingsAction, {});

  const { site, jamPelayanan, tentang, externalLinks } = settings;

  const [extLinkRows, setExtLinkRows] = useState<
    { label: string; url: string }[]
  >(() =>
    externalLinks.length > 0
      ? externalLinks.map((l) => ({ label: l.label, url: l.url }))
      : [{ label: "", url: "" }],
  );

  const addExtLink = () =>
    setExtLinkRows((rows) => [...rows, { label: "", url: "" }]);

  const removeExtLink = (index: number) =>
    setExtLinkRows((rows) =>
      rows.length > 1 ? rows.filter((_, i) => i !== index) : rows,
    );

  return (
    <form action={formAction} className="space-y-6">
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
          Pengaturan berhasil disimpan.
        </p>
      )}

      <Section title="Identitas Desa">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="name" label="Nama Desa" defaultValue={site.name} />
          <Field
            name="legalName"
            label="Nama Resmi"
            defaultValue={site.legalName}
          />
        </div>
        <Field name="tagline" label="Tagline" defaultValue={site.tagline} />
        <Field name="region" label="Wilayah" defaultValue={site.region} />
        <Field name="slogan" label="Slogan" defaultValue={site.slogan} />
        <Field
          name="url"
          label="URL Situs"
          defaultValue={site.url}
          type="url"
        />
      </Section>

      <Section title="Kontak">
        <Field
          name="email"
          label="Email"
          defaultValue={site.email}
          type="email"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            name="phone"
            label="Telepon (tampilan)"
            defaultValue={site.phone}
          />
          <Field
            name="phoneIntl"
            label="Telepon (format internasional)"
            defaultValue={site.phoneIntl}
            placeholder="+6281..."
          />
        </div>
        <Field name="address" label="Alamat" defaultValue={site.address} />
      </Section>

      <Section title="Tautan Layanan Eksternal">
        <Field
          name="link_aduan"
          label="Tautan Pengaduan (tombol Aduan Masyarakat)"
          defaultValue={site.links.aduan}
          type="url"
        />

        <div className="border-t border-black/5 pt-4 dark:border-white/10">
          <p className="text-sm font-semibold text-ink">
            Tautan Layanan Lainnya
          </p>
          <p className="mt-0.5 text-xs text-ink-soft">
            Muncul di bar atas Navbar dan tombol Hero. Kosongkan URL atau hapus
            baris untuk menghilangkannya.
          </p>
          <div className="mt-3 space-y-3">
            {extLinkRows.map((link, i) => (
              <div
                key={i}
                className="rounded-xl border border-black/5 p-3 dark:border-white/10"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`ext_label_${i}`} className={labelClass}>
                      {`Nama ${i + 1}`}
                    </label>
                    <input
                      id={`ext_label_${i}`}
                      name={`ext_label_${i}`}
                      type="text"
                      value={link.label}
                      onChange={(e) =>
                        setExtLinkRows((rows) =>
                          rows.map((r, idx) =>
                            idx === i ? { ...r, label: e.target.value } : r,
                          ),
                        )
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor={`ext_url_${i}`} className={labelClass}>
                      URL
                    </label>
                    <input
                      id={`ext_url_${i}`}
                      name={`ext_url_${i}`}
                      type="url"
                      value={link.url}
                      placeholder="https://..."
                      onChange={(e) =>
                        setExtLinkRows((rows) =>
                          rows.map((r, idx) =>
                            idx === i ? { ...r, url: e.target.value } : r,
                          ),
                        )
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeExtLink(i)}
                    disabled={extLinkRows.length <= 1}
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
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addExtLink}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3.5 py-2 text-sm font-semibold text-primary-800 transition hover:bg-primary-100 dark:border-primary-900/50 dark:bg-primary-900/20 dark:text-primary-200 dark:hover:bg-primary-900/40"
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
            Tambah Tautan
          </button>
        </div>
      </Section>

      <Section title="Media Sosial">
        <Field
          name="social_facebook"
          label="Facebook"
          defaultValue={site.social.facebook}
        />
        <Field
          name="social_instagram"
          label="Instagram"
          defaultValue={site.social.instagram}
        />
        <Field
          name="social_youtube"
          label="YouTube"
          defaultValue={site.social.youtube}
        />
      </Section>

      <Section title="Jam Pelayanan">
        {jamPelayanan.map((row, i) => (
          <div
            key={i}
            className="grid gap-3 rounded-xl border border-black/5 p-4 dark:border-white/10 sm:grid-cols-3"
          >
            <Field
              name={`jam_day_${i}`}
              label="Hari"
              defaultValue={row.day}
            />
            <Field
              name={`jam_time_${i}`}
              label="Jam"
              defaultValue={row.time}
            />
            <Field
              name={`jam_rest_${i}`}
              label="Istirahat"
              defaultValue={row.rest ?? ""}
            />
          </div>
        ))}
      </Section>

      <Section title="Teks Tentang Kami">
        <div>
          <label htmlFor="tentang_p1" className={labelClass}>
            Paragraf 1
          </label>
          <textarea
            id="tentang_p1"
            name="tentang_p1"
            rows={3}
            defaultValue={tentang.paragraf1}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="tentang_p2" className={labelClass}>
            Paragraf 2
          </label>
          <textarea
            id="tentang_p2"
            name="tentang_p2"
            rows={3}
            defaultValue={tentang.paragraf2}
            className={inputClass}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {tentang.quickFacts.map((fact, i) => (
            <div
              key={i}
              className="rounded-xl border border-black/5 p-4 dark:border-white/10"
            >
              <Field
                name={`fact_value_${i}`}
                label="Jumlah"
                defaultValue={fact.value}
              />
              <div className="mt-3">
                <Field
                  name={`fact_label_${i}`}
                  label="Keterangan"
                  defaultValue={fact.label}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary shadow-card disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Simpan Pengaturan"}
        </button>
      </div>
    </form>
  );
}
