"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const GALLERY_IMAGES = [
  { src: "/images/cafe/interior.png", alt: "Warm cafe interior with ambient lighting", span: "col-span-2 row-span-2" },
  { src: "/images/cafe/food-spread.png", alt: "Beautiful food spread on table", span: "col-span-1 row-span-1" },
  { src: "/images/cafe/signature-drink.png", alt: "Signature caramel latte", span: "col-span-1 row-span-1" },
  { src: "/images/cafe/dessert.png", alt: "Elegant dessert plating", span: "col-span-1 row-span-1" },
  { src: "/images/cafe/pasta.png", alt: "Gourmet pasta dish", span: "col-span-1 row-span-1" },
  { src: "/images/cafe/hero.png", alt: "Cafe atmosphere with patrons", span: "col-span-2 row-span-1" },
];

export function GallerySection() {
  const ref = useScrollReveal();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const prevImage = () =>
    setLightboxIdx((prev) =>
      prev !== null
        ? (prev - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
        : null
    );
  const nextImage = () =>
    setLightboxIdx((prev) =>
      prev !== null ? (prev + 1) % GALLERY_IMAGES.length : null
    );

  return (
    <section
      id="gallery"
      ref={ref}
      className="relative py-24 md:py-32 bg-cafe-warm-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 cafe-reveal">
          <span className="inline-block text-cafe-brown text-xs tracking-[0.4em] uppercase font-semibold mb-4">
            Visual Journey
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-cafe-charcoal font-light leading-tight mb-6">
            Captured
            <br />
            <em className="font-medium not-italic text-cafe-brown">
              Moments
            </em>
          </h2>
          <p className="text-cafe-charcoal/55 text-base md:text-lg max-w-xl mx-auto font-light">
            A glimpse into the Savoria experience — the food, the drinks, the
            atmosphere, the moments worth sharing.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[220px] cafe-stagger">
          {GALLERY_IMAGES.map((img, idx) => (
            <div
              key={idx}
              className={cn(
                "cafe-reveal relative rounded-2xl overflow-hidden cursor-pointer group",
                img.span
              )}
              onClick={() => openLightbox(idx)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-cafe-dark/0 group-hover:bg-cafe-dark/30 transition-colors duration-500" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-cafe-dark/95 backdrop-blur-xl flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
          >
            <X size={20} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
          >
            <ChevronRight size={24} />
          </button>

          <div
            className="relative w-[90vw] h-[70vh] md:w-[80vw] md:h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={GALLERY_IMAGES[lightboxIdx].src}
              alt={GALLERY_IMAGES[lightboxIdx].alt}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-light">
            {lightboxIdx + 1} / {GALLERY_IMAGES.length}
          </p>
        </div>
      )}
    </section>
  );
}
