"use client";

import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative py-20 md:py-28 bg-cafe-brown overflow-hidden">
      {/* Noise overlay */}
      <div className="absolute inset-0 cafe-noise" />

      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-cafe-orange/20 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-cafe-olive/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: "3s" }} />

      <div className="relative z-10 text-center px-4">
        <h2 className="font-display text-4xl md:text-5xl lg:text-7xl text-cafe-cream font-light leading-tight mb-6">
          Ready for an
          <br />
          <em className="font-semibold not-italic">Unforgettable</em> Experience?
        </h2>
        <p className="text-cafe-cream/60 text-base md:text-lg max-w-lg mx-auto font-light mb-10">
          Whether you&apos;re ordering online or dining in — every moment at
          Savoria is crafted to delight.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() =>
              document
                .getElementById("menu")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group flex items-center gap-3 px-8 py-4 bg-cafe-cream text-cafe-charcoal rounded-full text-sm font-bold tracking-wider uppercase hover:bg-white transition-all duration-300 hover:shadow-xl hover:shadow-black/10"
          >
            Order Now
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() =>
              document
                .getElementById("reservation")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex items-center gap-3 px-8 py-4 bg-transparent text-cafe-cream border border-cafe-cream/30 rounded-full text-sm font-bold tracking-wider uppercase hover:bg-cafe-cream/10 hover:border-cafe-cream/50 transition-all duration-300"
          >
            Reserve a Table
          </button>
        </div>
      </div>

      {/* Marquee ticker */}
      <div className="mt-16 overflow-hidden">
        {/* Tambahkan 'flex' dan 'w-max' di div ini */}
        <div className="flex animate-marquee whitespace-nowrap w-max">
          {Array.from({ length: 1 }).map((_, i) => (
            <span
              key={i}
              className="inline-block text-cafe-cream/[0.06] font-display text-[80px] md:text-[120px] font-bold uppercase tracking-wider mx-8"
            >
              Savoria · Coffee · Cuisine · Lifestyle · Billiards · Savoria · Coffee · Cuisine · Lifestyle · Billiards{" "}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
