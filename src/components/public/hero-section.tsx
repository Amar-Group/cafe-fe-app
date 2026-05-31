"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";

// Menambahkan semua variasi gambar baru ke dalam array tanpa mengubah susunan lama
// Posisi slide di-mix (selang-seling) antara tema Cafe dan Billiard
const HERO_SLIDES = [
  {
    image: "/images/videos/kopi_putar.gif",
    title: "Melody",
    tagline: "Start your day with a perfect brew.",
  },
  {
    image: "/images/videos/hambur.gif", 
    title: "Mastery",
    tagline: "Where focus meets the perfect strike.",
  },
  {
    image: "/images/videos/kopi.gif",
    title: "Warmth",
    tagline: "A perfect cup for your perfect day.",
  },
  {
    image: "/images/videos/bola_masuk.gif",
    title: "Cozy",
    tagline: "Your perfect space to relax and unwind.",
  },
  {
    image: "/images/revisi/11.jpg",
    title: "Harmony",
    tagline: "Where nature and comfort blend.",
  },
  {
    image: "/images/revisi/16.jpg",
    title: "Precision",
    tagline: "Focus, aim, and strike your best shot.",
  },
  {
    image: "/images/revisi/7.jpg",
    title: "Twilight",
    tagline: "Sip under the gentle evening glow.",
  },
  {
    image: "/images/revisi/18.jpg",
    title: "Victory",
    tagline: "Eat, sleep, pool, and repeat.",
  },
  {
    image: "/images/revisi/7.jpg",
    title: "Twilight",
    tagline: "Sip under the gentle evening glow.",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // State untuk pause-on-hover
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Efek untuk auto-slide, bergantung pada state isHovered
  useEffect(() => {
    setLoaded(true);
    
    // Jika tidak sedang di-hover, jalankan interval
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
      }, 6000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered]); // Tambahkan isHovered sebagai dependency

  const slide = HERO_SLIDES[current];

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[600px] max-h-[1100px] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background GIF & Image Animations */}
      {HERO_SLIDES.map((s, i) => {
        // Cek apakah gambar adalah GIF agar optimasi bisa dimatikan secara kondisional
        const isGif = s.image.toLowerCase().endsWith('.gif');
        
        return (
          <div
            key={i}
            className={cn(
              "absolute inset-0 transition-opacity ease-in-out",
              i === current ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDuration: "2000ms" }}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              className="object-cover animate-ken-burns"
              priority={i === 0}
              unoptimized={isGif} // Hanya matikan optimasi untuk format GIF
              sizes="100vw"
            />
          </div>
        );
      })}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 cafe-gradient-hero" />

      {/* Noise Texture */}
      <div className="absolute inset-0 cafe-noise" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        
        {/* JAM OPERASIONAL */}
        <p
          className={cn(
            "text-cafe-sand/80 text-sm md:text-base tracking-[0.35em] uppercase font-body font-medium mb-4 transition-all duration-1000 delay-200",
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          Mon–Sun: 08:00 – 23:00
        </p>

        {/* Title */}
        <h1
          className={cn(
            "font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-cafe-cream tracking-wide leading-none mb-6 transition-all duration-1000 delay-300",
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          key={`title-${current}`}
        >
          {slide.title}
        </h1>

        {/* Tagline */}
        <p
          className={cn(
            "text-cafe-sand/70 text-base md:text-lg lg:text-xl font-body font-light max-w-lg mb-10 transition-all duration-1000 delay-500",
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
          key={`tag-${current}`}
        >
          {slide.tagline}
        </p>

        {/* CTA Buttons */}
        <div
          className={cn(
            "flex flex-col sm:flex-row items-center gap-4 transition-all duration-1000 delay-700",
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <Link href='/menu'
            className="group flex items-center gap-3 px-8 py-3.5 bg-cafe-orange text-cafe-cream rounded-full text-sm font-semibold tracking-wider uppercase hover:bg-cafe-brown transition-all duration-300 hover:shadow-lg hover:shadow-cafe-orange/20"
          >
            Explore Menu
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <Link href='/reservation'
            className="flex items-center gap-3 px-8 py-3.5 bg-transparent text-cafe-cream border border-cafe-cream/30 rounded-full text-sm font-semibold tracking-wider uppercase hover:bg-cafe-cream/10 hover:border-cafe-cream/50 transition-all duration-300"
          >
            Book a Table
          </Link>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-28 sm:bottom-20 flex items-center gap-3 max-w-full overflow-x-auto px-4 scrollbar-none">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current ? "true" : "false"}
              className={cn(
                "h-1 rounded-full transition-all duration-500 flex-shrink-0",
                i === current
                  ? "w-10 bg-cafe-orange"
                  : "w-4 bg-cafe-cream/30 hover:bg-cafe-cream/50"
              )}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-cafe-cream/40">
        <span className="text-[10px] tracking-[0.3em] uppercase font-body">
          Scroll
        </span>
        <ChevronDown size={16} className="animate-bounce" />
      </div>

      {/* Side Decoration */}
      <div className="absolute top-1/2 -translate-y-1/2 right-6 hidden lg:flex flex-col items-center gap-3 text-cafe-cream/30">
        <div className="w-px h-16 bg-cafe-cream/20" />
        <span
          className="text-[10px] tracking-[0.3em] uppercase font-body"
          style={{ writingMode: "vertical-rl" }}
        >
          Est. 2024
        </span>
        <div className="w-px h-16 bg-cafe-cream/20" />
      </div>
    </section>
  );
}