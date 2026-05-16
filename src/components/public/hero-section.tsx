"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronDown, ArrowRight } from "lucide-react";

const HERO_SLIDES = [
  {
    image: "/images/cafe/hero.png",
    subtitle: "Welcome to",
    title: "Savoria",
    tagline: "Where Every Flavor Tells a Story",
  },
  {
    image: "/images/cafe/food-spread.png",
    subtitle: "Crafted with Love",
    title: "Modern Cuisine",
    tagline: "From Artisan Coffee to Gourmet Dining",
  },
  {
    image: "/images/cafe/interior.png",
    subtitle: "Your Space to",
    title: "Unwind",
    tagline: "Work, Meet, Dine — All in One Place",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLoaded(true);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const slide = HERO_SLIDES[current];

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[600px] max-h-[1100px] overflow-hidden"
    >
      {/* Background Images */}
      {HERO_SLIDES.map((s, i) => (
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
            sizes="100vw"
          />
        </div>
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 cafe-gradient-hero" />

      {/* Noise Texture */}
      <div className="absolute inset-0 cafe-noise" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        {/* Subtitle */}
        <p
          className={cn(
            "text-cafe-sand/80 text-sm md:text-base tracking-[0.35em] uppercase font-body font-medium mb-4 transition-all duration-1000 delay-200",
            loaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          )}
          key={`sub-${current}`}
        >
          {slide.subtitle}
        </p>

        {/* Title */}
        <h1
          className={cn(
            "font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-cafe-cream tracking-wide leading-none mb-6 transition-all duration-1000 delay-300",
            loaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          )}
          key={`title-${current}`}
        >
          {slide.title}
        </h1>

        {/* Tagline */}
        <p
          className={cn(
            "text-cafe-sand/70 text-base md:text-lg lg:text-xl font-body font-light max-w-lg mb-10 transition-all duration-1000 delay-500",
            loaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          )}
          key={`tag-${current}`}
        >
          {slide.tagline}
        </p>

        {/* CTA Buttons */}
        <div
          className={cn(
            "flex flex-col sm:flex-row items-center gap-4 transition-all duration-1000 delay-700",
            loaded
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          )}
        >
          <button
            onClick={() =>
              document
                .getElementById("menu")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group flex items-center gap-3 px-8 py-3.5 bg-cafe-orange text-cafe-cream rounded-full text-sm font-semibold tracking-wider uppercase hover:bg-cafe-brown transition-all duration-300 hover:shadow-lg hover:shadow-cafe-orange/20"
          >
            Explore Menu
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
          <button
            onClick={() =>
              document
                .getElementById("reservation")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex items-center gap-3 px-8 py-3.5 bg-transparent text-cafe-cream border border-cafe-cream/30 rounded-full text-sm font-semibold tracking-wider uppercase hover:bg-cafe-cream/10 hover:border-cafe-cream/50 transition-all duration-300"
          >
            Reserve a Table
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-28 sm:bottom-20 flex items-center gap-3">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
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
