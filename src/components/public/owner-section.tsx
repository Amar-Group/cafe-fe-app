"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function OwnerQuoteSection() {
  // Hook akan otomatis mengaktifkan animasi scroll reveal pada semua class .cafe-reveal
  const ref = useScrollReveal();

  return (
    <section
      id="owner-quote"
      ref={ref}
      className="relative py-24 md:py-32 bg-cafe-cream overflow-hidden"
    >
      {/* Background Decorative Blobs with Smooth Fading */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cafe-sand/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cafe-brown/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* KOLOM KIRI: Kata-kata Owner (Menggunakan Efek Staggered/Berurutan) */}
          <div className="cafe-stagger space-y-8 order-2 lg:order-1">
            
            {/* 1. Sub-heading Reveal */}
            <div className="cafe-reveal flex items-center gap-4">
              <div className="w-12 h-[1px] bg-cafe-orange" />
              <span className="text-cafe-orange text-xs tracking-[0.3em] uppercase font-semibold">
                The Vision
              </span>
            </div>

            {/* 2. Main Quote Reveal */}
            <div className="cafe-reveal relative group/quote">
              <Quote 
                size={90} 
                className="absolute -top-10 -left-10 text-cafe-sand/40 rotate-180 z-0 transition-transform duration-700 group-hover/quote:-translate-y-1 group-hover/quote:-translate-x-1" 
              />
              <h2 className="relative z-10 font-display text-3xl md:text-4xl lg:text-5xl text-cafe-charcoal font-light leading-tight tracking-wide">
                "Bagi kami, setiap cangkir bukan sekadar minuman. Ini adalah momen jeda, percikan koneksi, dan mahakarya yang kami sempurnakan setiap hari."
              </h2>
            </div>

            {/* 3. Author Name Reveal */}
            <div className="cafe-reveal pt-6 border-t border-cafe-sand/60">
              <h3 className="font-display text-2xl text-cafe-charcoal font-medium tracking-wide">
                Alexander Savoria
              </h3>
              <p className="text-cafe-charcoal/60 text-xs tracking-[0.25em] uppercase mt-1.5 font-medium">
                Founder & Head Roaster
              </p>
            </div>
          </div>

          {/* KOLOM KANAN: Foto Owner dengan Mikro-interaksi yang Halus */}
          <div className="cafe-reveal order-1 lg:order-2 relative group">
            
            {/* Bingkai aksen - Ikut bergeser halus saat foto utama di-hover */}
            <div className="absolute -inset-4 md:-inset-6 border-2 border-cafe-brown/15 rounded-3xl -z-10 translate-y-4 -translate-x-3 transition-transform duration-700 ease-out group-hover:translate-y-2 group-hover:translate-x-0" />
            
            {/* Container Foto Utama */}
            <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-3xl overflow-hidden shadow-xl shadow-cafe-charcoal/5 bg-cafe-sand/20">
              {/* Overlay gradasi halus agar terkesan sinematik */}
              <div className="absolute inset-0 bg-gradient-to-t from-cafe-charcoal/20 via-transparent to-transparent z-10 pointer-events-none transition-opacity duration-700 group-hover:opacity-40" />
              
              <Image
                src="/images/cafe/YUZU_ESPRESSO_TONIC.jpg"
                alt="Alexander Savoria - Founder"
                fill
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            
            {/* Badge Lingkaran Est. 2018 */}
            <div className="absolute -bottom-6 -left-6 bg-cafe-charcoal text-cafe-cream w-28 h-28 rounded-full hidden md:flex md:flex-col items-center justify-center p-4 text-center shadow-2xl z-20 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:bg-cafe-brown cursor-default">
              <span className="text-[10px] tracking-[0.2em] text-cafe-sand/70 uppercase mb-0.5">
                Est.
              </span>
              <span className="font-display text-2xl font-semibold text-cafe-orange group-hover:text-cafe-cream transition-colors duration-500">
                2018
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}