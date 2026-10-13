"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { RichImage, Theme } from "@/lib/content-types";

type GalleryGridProps = {
  theme?: Theme;
  images: RichImage[];
};

export default function GalleryGrid({ theme = "white", images }: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const hasMultiple = images.length > 1;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = activeIndex !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!isOpen) { dialog.close(); return; }
    dialog.showModal();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") {
        setActiveIndex((i) => (i === null ? i : (i + 1) % images.length));
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, images.length]);

  const active = activeIndex !== null ? images[activeIndex] : null;

  return (
    <section className={`theme-${theme} bg-background`}>
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, i) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActiveIndex(i)}
              className="group relative aspect-square overflow-hidden rounded-lg"
              aria-label={`Ver imagen ${i + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                unoptimized
                referrerPolicy="no-referrer"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      </div>

        <dialog
          ref={dialogRef}
          aria-label="Galería de Caribbean Guard"
          className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none items-center justify-center bg-black/90 p-4 open:flex"
          onCancel={() => setActiveIndex(null)}
          onClick={(event) => { if (event.target === event.currentTarget) setActiveIndex(null); }}
        >
          <button
            type="button"
            className="absolute top-4 right-4 z-10 h-12 w-12 rounded-full bg-black/50 text-3xl leading-none text-white"
            aria-label="Cerrar"
            onClick={() => setActiveIndex(null)}
          >
            &times;
          </button>

          {hasMultiple && (
            <button
              type="button"
              className="absolute left-4 z-10 h-12 w-12 rounded-full bg-black/50 text-4xl text-white"
              aria-label="Anterior"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
              }}
            >
              &#8249;
            </button>
          )}

          <div className="relative h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {active && <Image
              src={active.url}
              alt={active.alt}
              fill
              unoptimized
              referrerPolicy="no-referrer"
              className="object-contain"
            />}
          </div>

          {hasMultiple && (
            <button
              type="button"
              className="absolute right-4 z-10 h-12 w-12 rounded-full bg-black/50 text-4xl text-white"
              aria-label="Siguiente"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((i) => (i === null ? i : (i + 1) % images.length));
              }}
            >
              &#8250;
            </button>
          )}
        </dialog>
    </section>
  );
}
