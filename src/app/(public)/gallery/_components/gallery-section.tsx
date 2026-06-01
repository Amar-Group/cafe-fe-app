"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { X, ChevronLeft, ChevronRight, Plus } from "lucide-react";

const GALLERY_IMAGES = [
  // 6 Gambar asli bawaan
  { src: "/images/cafe/signature-drink.png", alt: "Signature caramel latte" },
  { src: "/images/cafe/dessert.png", alt: "Elegant dessert plating" },
  { src: "/images/cafe/pasta.png", alt: "Gourmet pasta dish" },
  
  // Penambahan gambar baru dari /images/revisi/ (Akan otomatis mengikuti struktur di atas)
  { src: "/images/revisi/1.jpg", alt: "Gallery moment 1" },
  { src: "/images/revisi/3.jpg", alt: "Gallery moment 3" },
  { src: "/images/revisi/4.jpg", alt: "Gallery moment 4" },
  { src: "/images/revisi/5.jpg", alt: "Gallery moment 5" },
  { src: "/images/revisi/6.jpg", alt: "Gallery moment 6" },
  { src: "/images/revisi/7.jpg", alt: "Gallery moment 7" },
  { src: "/images/revisi/8.jpg", alt: "Gallery moment 8" },
  { src: "/images/revisi/10.jpg", alt: "Gallery moment 10" },
  { src: "/images/revisi/11.jpg", alt: "Gallery moment 11" },
  { src: "/images/revisi/12.jpg", alt: "Gallery moment 12" },
];

// Pola struktur grid asli Anda (berulang setiap kelipatan 6 gambar)
const GRID_SPANS = [
  "col-span-2 row-span-2", // Gambar ke-1 (Besar Kotak)
  "col-span-1 row-span-1", // Gambar ke-2 (Kecil)
  "col-span-1 row-span-1", // Gambar ke-3 (Kecil)
  "col-span-1 row-span-1", // Gambar ke-4 (Kecil)
  "col-span-1 row-span-1", // Gambar ke-5 (Kecil)
  "col-span-2 row-span-1", // Gambar ke-6 (Lebar)
];

export function GallerySection() {
  const ref = useScrollReveal();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const INITIAL_COUNT = 6;
  const visibleImages = isExpanded ? GALLERY_IMAGES : GALLERY_IMAGES.slice(0, INITIAL_COUNT);

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
          {visibleImages.map((img, idx) => {
            // Menghitung span agar polanya berulang persis seperti 6 gambar pertama
            const spanClass = GRID_SPANS[idx % GRID_SPANS.length];
            
            // Menghitung delay 0.1s. Jika gambar dari tombol View More, delay dihitung dari 0 lagi agar tidak menunggu terlalu lama
            const delayValue = `${(idx >= INITIAL_COUNT ? idx - INITIAL_COUNT : idx) * 0.1}s`;

            return (
              <div
                key={idx}
                className={cn(
                  "relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300",
                  // Menambahkan fill-mode-both agar opacity 0 tertahan sebelum delay selesai
                  idx < INITIAL_COUNT ? "cafe-reveal" : "animate-in fade-in fill-mode-both duration-500",
                  spanClass
                )}
                style={{ 
                  animationDelay: delayValue,
                  transitionDelay: delayValue // Backup jika cafe-reveal menggunakan CSS Transition instead of Animation
                }}
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
            );
          })}
        </div>

        {/* Tombol View More */}
        {GALLERY_IMAGES.length > INITIAL_COUNT && (
          <div className="text-center mt-12 md:mt-16 cafe-reveal">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-cafe-brown/30 rounded-full text-sm font-semibold tracking-wider text-cafe-brown uppercase hover:bg-cafe-brown hover:text-white transition-all duration-300 group"
            >
              <span>{isExpanded ? "View Less" : "View More"}</span>
              <Plus 
                size={16} 
                className={cn(
                  "transition-transform duration-300", 
                  isExpanded ? "rotate-45" : "group-hover:rotate-90"
                )} 
              />
            </button>
          </div>
        )}
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