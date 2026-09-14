"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SiteSettings, HeroSettings, ExternalLink } from "@/lib/store";

export function Hero({
  site,
  hero,
  externalLinks,
}: {
  site: SiteSettings;
  hero: HeroSettings;
  externalLinks: ExternalLink[];
}) {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const slides = hero.slides;
  const total = slides.length;

  const next = useCallback(
    () => setActive((a) => (a + 1) % total),
    [total]
  );
  const prev = () => setActive((a) => (a - 1 + total) % total);

  // Autoplay 6s, pause on hover.
  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) next();
    }, 6000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-primary-950 text-white lg:min-h-[80vh]"
    >
      {/* ==== Background image carousel ==== */}
      <div className="absolute inset-0 -z-10">
        {slides.map((slide, i) => (
          <div
            key={slide.img}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              active === i ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.img}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover motion-safe:animate-kenburns"
            />
          </div>
        ))}

        {/* Legibility overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-950/60 to-primary-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-transparent to-primary-950/20" />
        {/* Decorative dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ==== Overlay content ==== */}
      <div className="container-desa relative w-full py-20 lg:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-300 backdrop-blur">
            {hero.eyebrow}
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight drop-shadow-sm sm:text-5xl lg:text-6xl">
            {site.name}
          </h1>
          <p className="mt-2 text-lg font-medium text-accent-300">
            {hero.subtitle}
          </p>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-50/85 sm:text-lg">
            {hero.description}
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={site.links.aduan} className="btn-accent">
              <svg
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h8M8 14h5m-9 6 3.5-3H18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14Z"
                />
              </svg>
              Aduan Masyarakat
            </a>
            {externalLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-light"
              >
                {link.label}
              </a>
            ))}
            <a href="/profil/demografi" className="btn-ghost-light">
              Statistik
            </a>
          </div>
        </div>
      </div>

      {/* ==== Controls ==== */}
      <button
        onClick={prev}
        aria-label="Slide sebelumnya"
        className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/25 active:scale-95 sm:grid"
      >
        <svg
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m15 6-6 6 6 6" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Slide berikutnya"
        className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/25 active:scale-95 sm:grid"
      >
        <svg
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 sm:bottom-20">
        {slides.map((slide, i) => (
          <button
            key={slide.img}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${
              active === i
                ? "w-8 bg-accent-400"
                : "w-3 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Ke slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Bottom wave divider */}
      <div className="absolute inset-x-0 bottom-0">
        <svg
          className="block h-12 w-full text-surface sm:h-16"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,64 C240,100 480,20 720,48 C960,76 1200,100 1440,56 L1440,100 L0,100 Z" />
        </svg>
      </div>
    </section>
  );
}
